import { CiStatus } from '@backend/generated/prisma';
import { classroomApi } from '@backend/github/classroom';
import { reposApi, GhCheckRun } from '@backend/github/repos';
import { prisma } from '@backend/lib/prisma';

function parseRepoFullName(fullName: string): { owner: string; name: string } {
    const [owner, name] = fullName.split('/');
    return { owner, name };
}

function extractRepoInfo(
    repoUrl: string,
): { owner: string; name: string } | null {
    const match = repoUrl.match(
        /github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/,
    );
    if (!match) return null;
    return { owner: match[1], name: match[2] };
}

function mapCheckRunsToCiStatus(runs: GhCheckRun[]): CiStatus {
    if (runs.length === 0) return 'UNKNOWN';
    const inProgress = runs.some(
        (r) => r.status === 'in_progress' || r.status === 'queued',
    );
    if (inProgress) return 'RUNNING';
    const allSuccess = runs.every(
        (r) => r.status === 'completed' && r.conclusion === 'success',
    );
    if (allSuccess) return 'SUCCESS';
    const hasFailed = runs.some(
        (r) =>
            r.status === 'completed' &&
            (r.conclusion === 'failure' ||
                r.conclusion === 'timed_out' ||
                r.conclusion === 'cancelled'),
    );
    if (hasFailed) return 'FAILURE';
    return 'PENDING';
}

async function logSync(params: {
    entityType: string;
    entityId?: number;
    action: string;
    success: boolean;
    errorMessage?: string;
    rateLimitRemaining?: number;
}) {
    await prisma.syncLog.create({ data: params }).catch(() => {});
}

export async function syncStudentRepos(assignmentId: number): Promise<void> {
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
    });

    if (!assignment?.classroomAssignmentId) {
        await logSync({
            entityType: 'assignment',
            entityId: assignmentId,
            action: 'sync_student_repos',
            success: false,
            errorMessage: 'Нет classroomAssignmentId',
        });
        return;
    }

    let accepted;
    let rateLimitRemaining: number | undefined;

    try {
        accepted = await classroomApi.listAcceptedAssignments(
            assignment.classroomAssignmentId,
        );
        rateLimitRemaining =
            (await classroomApi.getRateLimitRemaining()) ?? undefined;
    } catch (err) {
        await logSync({
            entityType: 'assignment',
            entityId: assignmentId,
            action: 'sync_student_repos',
            success: false,
            errorMessage: String(err),
        });
        return;
    }

    for (const acc of accepted) {
        const student = acc.students[0];
        if (!student) continue;

        const dbUser = await prisma.user.findUnique({
            where: { login: student.login },
        });

        if (!dbUser) continue;

        const { owner, name } = parseRepoFullName(acc.repository.full_name);

        await prisma.submission.upsert({
            where: {
                assignmentId_studentId: {
                    assignmentId,
                    studentId: dbUser.id,
                },
            },
            create: {
                assignmentId,
                studentId: dbUser.id,
                repoUrl: acc.repository.html_url,
                repoOwner: owner,
                repoName: name,
                ciStatus: 'UNKNOWN',
                status: 'PENDING',
            },
            update: {
                repoUrl: acc.repository.html_url,
                repoOwner: owner,
                repoName: name,
            },
        });
    }

    await logSync({
        entityType: 'assignment',
        entityId: assignmentId,
        action: 'sync_student_repos',
        success: true,
        rateLimitRemaining,
    });
}

export async function syncCommits(submissionId: number): Promise<void> {
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
    });

    if (!submission?.repoOwner || !submission?.repoName) {
        await logSync({
            entityType: 'submission',
            entityId: submissionId,
            action: 'sync_commits',
            success: false,
            errorMessage: 'Нет repoOwner/repoName',
        });
        return;
    }

    const { repoOwner: owner, repoName: repo } = submission;
    let commits;
    let rateLimitRemaining: number | undefined;

    try {
        commits = await reposApi.listCommits(owner, repo);
        rateLimitRemaining =
            (await classroomApi.getRateLimitRemaining()) ?? undefined;
    } catch (err) {
        await logSync({
            entityType: 'submission',
            entityId: submissionId,
            action: 'sync_commits',
            success: false,
            errorMessage: String(err),
        });
        return;
    }

    for (const c of commits) {
        let ciStatus: CiStatus = 'UNKNOWN';
        let ciDetailsUrl: string | undefined;

        try {
            const { check_runs } = await reposApi.getCheckRuns(
                owner,
                repo,
                c.sha,
            );
            ciStatus = mapCheckRunsToCiStatus(check_runs);
            const failedRun = check_runs.find(
                (r) => r.conclusion === 'failure',
            );
            const firstRun = check_runs[0];
            ciDetailsUrl = failedRun?.html_url ?? firstRun?.html_url;
        } catch {
            // CI может не быть настроен — оставляем UNKNOWN
        }

        await prisma.commit.upsert({
            where: { submissionId_sha: { submissionId, sha: c.sha } },
            create: {
                submissionId,
                sha: c.sha,
                message: c.commit.message,
                authorName: c.commit.author.name,
                authorLogin: c.author?.login ?? null,
                committedAt: new Date(c.commit.author.date),
                ciStatus,
                ciDetailsUrl: ciDetailsUrl ?? null,
            },
            update: {
                ciStatus,
                ciDetailsUrl: ciDetailsUrl ?? null,
            },
        });
    }

    // Обновляем ciStatus сабмишена по последнему коммиту
    const latestCommit = commits[0];
    if (latestCommit) {
        const dbCommit = await prisma.commit.findUnique({
            where: {
                submissionId_sha: { submissionId, sha: latestCommit.sha },
            },
        });
        if (dbCommit) {
            await prisma.submission.update({
                where: { id: submissionId },
                data: { ciStatus: dbCommit.ciStatus },
            });
        }
    }

    await logSync({
        entityType: 'submission',
        entityId: submissionId,
        action: 'sync_commits',
        success: true,
        rateLimitRemaining,
    });
}

export async function syncPRComments(submissionId: number): Promise<void> {
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
            review: { include: { threads: { include: { comments: true } } } },
        },
    });

    if (!submission?.repoOwner || !submission?.repoName) {
        await logSync({
            entityType: 'submission',
            entityId: submissionId,
            action: 'sync_pr_comments',
            success: false,
            errorMessage: 'Нет repoOwner/repoName',
        });
        return;
    }

    const { repoOwner: owner, repoName: repo } = submission;

    // Определяем номер PR: сначала из БД, потом ищем в GitHub
    let prNumber = submission.prNumber;
    let rateLimitRemaining: number | undefined;

    if (!prNumber) {
        try {
            const prs = await reposApi.listPullRequests(owner, repo);
            const openPr = prs.find((pr) => pr.state === 'open') ?? prs[0];
            if (openPr) {
                prNumber = openPr.number;
                await prisma.submission.update({
                    where: { id: submissionId },
                    data: { prNumber },
                });
            }
        } catch (err) {
            await logSync({
                entityType: 'submission',
                entityId: submissionId,
                action: 'sync_pr_comments',
                success: false,
                errorMessage: String(err),
            });
            return;
        }
    }

    if (!prNumber) {
        await logSync({
            entityType: 'submission',
            entityId: submissionId,
            action: 'sync_pr_comments',
            success: false,
            errorMessage: 'PR не найден в репозитории',
        });
        return;
    }

    let reviewComments;
    let issueComments;

    try {
        [reviewComments, issueComments] = await Promise.all([
            reposApi.listPullRequestReviewComments(owner, repo, prNumber),
            reposApi.listIssueComments(owner, repo, prNumber),
        ]);
        rateLimitRemaining =
            (await classroomApi.getRateLimitRemaining()) ?? undefined;
    } catch (err) {
        await logSync({
            entityType: 'submission',
            entityId: submissionId,
            action: 'sync_pr_comments',
            success: false,
            errorMessage: String(err),
        });
        return;
    }

    // Убедимся, что review существует (создаём системный review если нет)
    const review = submission.review;
    if (!review) {
        // Не создаём review автоматически — PR-комментарии появятся при первом открытии ментором
        await logSync({
            entityType: 'submission',
            entityId: submissionId,
            action: 'sync_pr_comments',
            success: true,
            rateLimitRemaining,
        });
        return;
    }

    const existingCommentIds = new Set(
        review.threads
            .flatMap((t) => t.comments.map((c) => c.githubCommentId))
            .filter(Boolean),
    );

    // Группируем inline-комментарии по тредам (по in_reply_to_id)
    const roots = reviewComments.filter((c) => !c.in_reply_to_id);
    const replies = reviewComments.filter((c) => c.in_reply_to_id);

    for (const root of roots) {
        if (!root.path || !root.line) continue;
        if (existingCommentIds.has(root.id)) continue;

        const dbUser = await prisma.user.findUnique({
            where: { login: root.user.login },
        });
        if (!dbUser) continue;

        const thread = await prisma.reviewThread.create({
            data: {
                reviewId: review.id,
                filePath: root.path,
                line: root.line,
                githubThreadId: root.pull_request_review_id ?? null,
            },
        });

        await prisma.reviewComment.create({
            data: {
                body: root.body,
                threadId: thread.id,
                authorId: dbUser.id,
                githubCommentId: root.id,
            },
        });

        // Ответы на этот коммент
        const threadReplies = replies.filter(
            (r) => r.in_reply_to_id === root.id,
        );
        for (const reply of threadReplies) {
            if (existingCommentIds.has(reply.id)) continue;
            const replyUser = await prisma.user.findUnique({
                where: { login: reply.user.login },
            });
            if (!replyUser) continue;
            await prisma.reviewComment.create({
                data: {
                    body: reply.body,
                    threadId: thread.id,
                    authorId: replyUser.id,
                    githubCommentId: reply.id,
                },
            });
        }
    }

    await logSync({
        entityType: 'submission',
        entityId: submissionId,
        action: 'sync_pr_comments',
        success: true,
        rateLimitRemaining,
    });
}

export async function syncSubmissionFromRepoUrl(
    repoUrl: string,
): Promise<void> {
    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) return;

    const submission = await prisma.submission.findFirst({
        where: { repoUrl },
    });
    if (!submission) return;

    await syncCommits(submission.id);
    await syncPRComments(submission.id);
}
