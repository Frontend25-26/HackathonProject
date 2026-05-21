import { Role } from '@backend/generated/prisma';

export const GITHUB_API = 'https://api.github.com';

const RATE_LIMIT_PAUSE_THRESHOLD = 50;

export function githubHeaders(userToken?: string): Record<string, string> {
    const token = userToken ?? process.env.GITHUB_TOKEN;
    return {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export class GitHubRateLimitError extends Error {
    constructor(public resetAt: Date) {
        super(`GitHub rate limit exceeded, resets at ${resetAt.toISOString()}`);
    }
}

async function githubFetch<T>(path: string, userToken?: string): Promise<T> {
    const res = await fetch(`${GITHUB_API}${path}`, {
        headers: githubHeaders(userToken),
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
        headers: githubHeaders(),
        cache: 'no-store',
    });
    return res.status;
}

async function githubFetchRateLimit(): Promise<number | null> {
    const res = await fetch(`${GITHUB_API}/rate_limit`, {
        headers: githubHeaders(),
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
    organization: {
        login: string;
        avatar_url: string;
    };
};

export const classroomApi = {
    listClassrooms(): Promise<GhClassroom[]> {
        return githubFetch('/classrooms');
    },

    getClassroom(classroomId: number): Promise<GhClassroom> {
        return githubFetch(`/classrooms/${classroomId}`);
    },

    listAssignments(classroomId: number): Promise<GhClassroomAssignment[]> {
        return githubFetch(`/classrooms/${classroomId}/assignments`);
    },

    getAssignment(assignmentId: number): Promise<GhClassroomAssignment> {
        return githubFetch(`/assignments/${assignmentId}`);
    },

    listAcceptedAssignments(
        assignmentId: number,
    ): Promise<GhAcceptedAssignment[]> {
        return githubFetch(`/assignments/${assignmentId}/accepted_assignments`);
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
 * Требует GITHUB_TOKEN с правами `read:org` (для проверки membership).
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
