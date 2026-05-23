import { createSign } from 'crypto';

import { Role } from '@backend/generated/prisma';

export const GITHUB_API = 'https://api.github.com';

const RATE_LIMIT_PAUSE_THRESHOLD = 50;

function createAppJWT(appId: string, privateKey: string): string {
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(
        JSON.stringify({ alg: 'RS256', typ: 'JWT' }),
    ).toString('base64url');
    const payload = Buffer.from(
        JSON.stringify({ iat: now - 60, exp: now + 600, iss: appId }),
    ).toString('base64url');
    const data = `${header}.${payload}`;
    const sign = createSign('RSA-SHA256');
    sign.update(data);
    return `${data}.${sign.sign(privateKey).toString('base64url')}`;
}

let _cachedToken: { value: string; expiresAt: number } | null = null;

async function getServiceToken(): Promise<string> {
    const now = Date.now();
    if (_cachedToken && _cachedToken.expiresAt - now > 60_000) {
        return _cachedToken.value;
    }

    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n',
    );
    const installationId = process.env.GITHUB_INSTALLATION_ID;

    if (!appId || !privateKey || !installationId) {
        throw new Error(
            'GitHub App credentials not configured (GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_INSTALLATION_ID)',
        );
    }

    const jwt = createAppJWT(appId, privateKey);
    const res = await fetch(
        `${GITHUB_API}/app/installations/${installationId}/access_tokens`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                Authorization: `Bearer ${jwt}`,
            },
        },
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Failed to get GitHub App installation token: ${res.status}: ${text}`,
        );
    }

    const data = (await res.json()) as { token: string; expires_at: string };
    _cachedToken = {
        value: data.token,
        expiresAt: new Date(data.expires_at).getTime(),
    };
    return _cachedToken.value;
}

export async function githubHeaders(
    userToken?: string,
): Promise<Record<string, string>> {
    const token = userToken ?? (await getServiceToken());
    return {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${token}`,
    };
}

export class GitHubRateLimitError extends Error {
    constructor(public resetAt: Date) {
        super(`GitHub rate limit exceeded, resets at ${resetAt.toISOString()}`);
    }
}

async function githubFetch<T>(path: string, userToken?: string): Promise<T> {
    const res = await fetch(`${GITHUB_API}${path}`, {
        headers: await githubHeaders(userToken),
        cache: 'no-store',
    });

    const remaining = Number(res.headers.get('x-ratelimit-remaining') ?? -1);
    const resetTs = Number(res.headers.get('x-ratelimit-reset') ?? 0);

    if (res.status === 429 || (res.status === 403 && remaining === 0)) {
        throw new GitHubRateLimitError(new Date(resetTs * 1000));
    }

    if (remaining >= 0 && remaining < RATE_LIMIT_PAUSE_THRESHOLD) {
        console.warn(
            `[GitHub] Rate limit low: ${remaining} remaining, resets at ${new Date(resetTs * 1000).toISOString()}`,
        );
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub API ${path} → ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
}

async function githubFetchStatus(path: string): Promise<number> {
    const res = await fetch(`${GITHUB_API}${path}`, {
        headers: await githubHeaders(),
        cache: 'no-store',
    });
    return res.status;
}

async function githubFetchRateLimit(): Promise<number | null> {
    const res = await fetch(`${GITHUB_API}/rate_limit`, {
        headers: await githubHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { rate: { remaining: number } };
    return data.rate.remaining;
}

export type GhClassroomAssignment = {
    id: number;
    title: string;
    type: string;
    invite_link: string;
    deadline: string | null;
    classroom: {
        id: number;
        name: string;
        url: string;
    };
    accepted: number;
    submissions_count: number;
    passing: number;
    failing: number;
};

export type GhAcceptedAssignment = {
    id: number;
    submitted: boolean;
    passing: boolean;
    commit_count: number;
    grade: string;
    students: Array<{ login: string; id: number }>;
    repository: {
        id: number;
        full_name: string;
        html_url: string;
        default_branch: string;
    };
    assignment: {
        id: number;
        title: string;
    };
};

export type GhClassroom = {
    id: number;
    name: string;
    archived: boolean;
    url: string;
    organization?: {
        login: string;
        avatar_url: string;
    };
};

export const classroomApi = {
    listClassrooms(userToken?: string): Promise<GhClassroom[]> {
        return githubFetch('/classrooms', userToken);
    },

    getClassroom(
        classroomId: number,
        userToken?: string,
    ): Promise<GhClassroom> {
        return githubFetch(`/classrooms/${classroomId}`, userToken);
    },

    listAssignments(
        classroomId: number,
        userToken?: string,
    ): Promise<GhClassroomAssignment[]> {
        return githubFetch(`/classrooms/${classroomId}/assignments`, userToken);
    },

    getAssignment(
        assignmentId: number,
        userToken?: string,
    ): Promise<GhClassroomAssignment> {
        return githubFetch(`/assignments/${assignmentId}`, userToken);
    },

    listAcceptedAssignments(
        assignmentId: number,
        userToken?: string,
    ): Promise<GhAcceptedAssignment[]> {
        return githubFetch(
            `/assignments/${assignmentId}/accepted_assignments`,
            userToken,
        );
    },

    getRateLimitRemaining(): Promise<number | null> {
        return githubFetchRateLimit();
    },
};

/**
 * Определить роль пользователя по его принадлежности к GitHub Teams в организации.
 *
 * Маппинг (проверяется в порядке убывания приоритета):
 * - `admins` team → ADMIN
 * - `mentors` team → MENTOR
 * - остальное → STUDENT
 *
 * @param login GitHub username
 * @returns Role: ADMIN | MENTOR | STUDENT
 */
export async function resolveRoleFromGitHubTeams(login: string): Promise<Role> {
    const org = process.env.GITHUB_ORG;

    if (!org) {
        console.warn('GITHUB_ORG не установлена — по умолчанию STUDENT');
        return 'STUDENT';
    }

    const teamSlugs: Array<[string, Role]> = [
        ['admins', 'ADMIN'],
        ['mentors', 'MENTOR'],
    ];

    for (const [slug, role] of teamSlugs) {
        const status = await githubFetchStatus(
            `/orgs/${org}/teams/${slug}/memberships/${login}`,
        );
        if (status === 200) {
            return role;
        }
    }

    return 'STUDENT';
}
