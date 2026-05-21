import {
    GITHUB_API,
    GitHubRateLimitError,
    githubHeaders,
} from '@backend/github/classroom';

export type GhCommit = {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    author: { login: string } | null;
    html_url: string;
};

export type GhCheckRun = {
    id: number;
    name: string;
    status: 'queued' | 'in_progress' | 'completed';
    conclusion:
        | 'success'
        | 'failure'
        | 'neutral'
        | 'cancelled'
        | 'skipped'
        | 'timed_out'
        | null;
    html_url: string;
};

export type GhCommitStatus = {
    state: 'pending' | 'success' | 'failure' | 'error';
    statuses: Array<{ state: string; description: string; target_url: string }>;
};

export type GhPullRequest = {
    number: number;
    state: string;
    html_url: string;
    head: { ref: string; sha: string };
    base: { ref: string };
};

export type GhPullRequestFile = {
    filename: string;
    status: 'added' | 'removed' | 'modified' | 'renamed';
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
};

export type GhPullRequestComment = {
    id: number;
    body: string;
    user: { login: string; id: number };
    created_at: string;
    updated_at: string;
    path?: string;
    line?: number;
    in_reply_to_id?: number;
    pull_request_review_id?: number;
};

export type GhIssueComment = {
    id: number;
    body: string;
    user: { login: string; id: number };
    created_at: string;
    updated_at: string;
};

async function ghFetch<T>(path: string, userToken?: string): Promise<T> {
    const res = await fetch(`${GITHUB_API}${path}`, {
        headers: githubHeaders(userToken),
        cache: 'no-store',
    });

    const remaining = Number(res.headers.get('x-ratelimit-remaining') ?? -1);
    const resetTs = Number(res.headers.get('x-ratelimit-reset') ?? 0);

    if (res.status === 429 || (res.status === 403 && remaining === 0)) {
        throw new GitHubRateLimitError(new Date(resetTs * 1000));
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub API ${path} → ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
}

async function ghPost<T>(
    path: string,
    body: unknown,
    userToken?: string,
): Promise<T> {
    const res = await fetch(`${GITHUB_API}${path}`, {
        method: 'POST',
        headers: {
            ...githubHeaders(userToken),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
    });

    const remaining = Number(res.headers.get('x-ratelimit-remaining') ?? -1);
    const resetTs = Number(res.headers.get('x-ratelimit-reset') ?? 0);

    if (res.status === 429 || (res.status === 403 && remaining === 0)) {
        throw new GitHubRateLimitError(new Date(resetTs * 1000));
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub API POST ${path} → ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
}

export const reposApi = {
    listCommits(
        owner: string,
        repo: string,
        branch?: string,
    ): Promise<GhCommit[]> {
        const q = branch
            ? `?sha=${encodeURIComponent(branch)}&per_page=100`
            : '?per_page=100';
        return ghFetch<GhCommit[]>(`/repos/${owner}/${repo}/commits${q}`);
    },

    getCheckRuns(
        owner: string,
        repo: string,
        sha: string,
    ): Promise<{ check_runs: GhCheckRun[] }> {
        return ghFetch(`/repos/${owner}/${repo}/commits/${sha}/check-runs`);
    },

    getCombinedStatus(
        owner: string,
        repo: string,
        sha: string,
    ): Promise<GhCommitStatus> {
        return ghFetch(`/repos/${owner}/${repo}/commits/${sha}/status`);
    },

    listPullRequests(owner: string, repo: string): Promise<GhPullRequest[]> {
        return ghFetch(`/repos/${owner}/${repo}/pulls?state=all&per_page=10`);
    },

    getPullRequest(
        owner: string,
        repo: string,
        prNumber: number,
    ): Promise<GhPullRequest> {
        return ghFetch(`/repos/${owner}/${repo}/pulls/${prNumber}`);
    },

    listPullRequestFiles(
        owner: string,
        repo: string,
        prNumber: number,
    ): Promise<GhPullRequestFile[]> {
        return ghFetch(
            `/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100`,
        );
    },

    listPullRequestReviewComments(
        owner: string,
        repo: string,
        prNumber: number,
    ): Promise<GhPullRequestComment[]> {
        return ghFetch(
            `/repos/${owner}/${repo}/pulls/${prNumber}/comments?per_page=100`,
        );
    },

    listIssueComments(
        owner: string,
        repo: string,
        prNumber: number,
    ): Promise<GhIssueComment[]> {
        return ghFetch(
            `/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=100`,
        );
    },

    createPullRequestReviewComment(
        owner: string,
        repo: string,
        prNumber: number,
        data: {
            body: string;
            commit_id: string;
            path: string;
            line: number;
            in_reply_to?: number;
        },
        userToken?: string,
    ): Promise<GhPullRequestComment> {
        if (data.in_reply_to) {
            return ghPost(
                `/repos/${owner}/${repo}/pulls/${prNumber}/comments`,
                { body: data.body, in_reply_to: data.in_reply_to },
                userToken,
            );
        }
        return ghPost(
            `/repos/${owner}/${repo}/pulls/${prNumber}/comments`,
            data,
            userToken,
        );
    },

    createIssueComment(
        owner: string,
        repo: string,
        prNumber: number,
        body: string,
        userToken?: string,
    ): Promise<GhIssueComment> {
        return ghPost(
            `/repos/${owner}/${repo}/issues/${prNumber}/comments`,
            { body },
            userToken,
        );
    },
};
