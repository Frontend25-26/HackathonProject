import { NextRequest } from 'next/server';

import { reposApi } from '@backend/github/repos';
import { requireAuth } from '@backend/lib/auth';
import { prisma } from '@backend/lib/prisma';
import { reviewCommentRepository } from '@backend/review-comments/repository';
import { CreateReviewCommentSchema } from '@backend/review-comments/schema';
import { userRepository } from '@backend/users/repository';

async function pushCommentToGithub(params: {
    threadId: number;
    body: string;
    authorId: number;
    inReplyToGithubId?: number | null;
}): Promise<number | null> {
    const thread = await prisma.reviewThread.findUnique({
        where: { id: params.threadId },
        select: {
            filePath: true,
            line: true,
            githubThreadId: true,
            review: {
                select: {
                    submission: {
                        select: {
                            repoOwner: true,
                            repoName: true,
                            prNumber: true,
                        },
                    },
                },
            },
        },
    });

    const submission = thread?.review?.submission;
    if (
        !submission?.repoOwner ||
        !submission?.repoName ||
        !submission?.prNumber ||
        !thread?.filePath
    ) {
        return null;
    }

    const userToken = await userRepository.findGithubToken(params.authorId);
    const token = userToken ?? undefined;

    try {
        const latestCommit = await prisma.commit.findFirst({
            where: {
                submission: {
                    repoOwner: submission.repoOwner,
                    repoName: submission.repoName,
                },
            },
            orderBy: { committedAt: 'desc' },
            select: { sha: true },
        });

        const ghComment = await reposApi.createPullRequestReviewComment(
            submission.repoOwner,
            submission.repoName,
            submission.prNumber,
            {
                body: params.body,
                commit_id: latestCommit?.sha ?? '',
                path: thread.filePath,
                line: thread.line,
                in_reply_to: params.inReplyToGithubId ?? undefined,
            },
            token,
        );
        return ghComment.id;
    } catch (err) {
        console.error('[GitHub] Не удалось опубликовать комментарий:', err);
        return null;
    }
}

export const GET = async (request: NextRequest): Promise<Response> => {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { searchParams } = request.nextUrl;
    const threadId = searchParams.get('threadId');
    const threadIdsParam = searchParams.get('threadIds');
    const threadIds = threadIdsParam
        ? threadIdsParam.split(',').map(Number).filter(Boolean)
        : undefined;

    const comments = await reviewCommentRepository.findAll(
        threadIds?.length
            ? { threadIds }
            : threadId
              ? { threadId: Number(threadId) }
              : undefined,
    );

    return Response.json(comments);
};

export const POST = async (request: NextRequest): Promise<Response> => {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const body: unknown = await request.json();
    const parsed = CreateReviewCommentSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 });
    }

    const thread = await prisma.reviewThread.findUnique({
        where: { id: parsed.data.threadId },
        select: {
            githubThreadId: true,
            comments: {
                orderBy: { createdAt: 'asc' },
                take: 1,
                select: { githubCommentId: true },
            },
            review: {
                select: {
                    submission: {
                        select: { studentId: true },
                    },
                },
            },
        },
    });

    if (!thread) {
        return Response.json({ error: 'Тред не найден' }, { status: 404 });
    }

    const canWrite =
        auth.user.role === 'MENTOR' ||
        auth.user.role === 'ADMIN' ||
        (auth.user.role === 'STUDENT' &&
            thread.review.submission.studentId === auth.user.id);

    if (!canWrite) {
        return Response.json(
            { error: 'Вы не можете писать комментарии в этом треде' },
            { status: 403 },
        );
    }

    // Публикуем в GitHub (fire-and-forget с сохранением ID)
    const rootGithubId = thread.comments[0]?.githubCommentId ?? null;
    const githubCommentId = await pushCommentToGithub({
        threadId: parsed.data.threadId,
        body: parsed.data.body,
        authorId: auth.user.id,
        inReplyToGithubId: rootGithubId,
    });

    const comment = await reviewCommentRepository.create({
        body: parsed.data.body,
        threadId: parsed.data.threadId,
        authorId: auth.user.id,
        githubCommentId,
    });

    return Response.json(comment, { status: 201 });
};
