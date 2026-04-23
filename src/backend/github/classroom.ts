import { Role } from '@backend/generated/prisma';

const GITHUB_API = 'https://api.github.com';

function githubHeaders() {
    const token = process.env.GITHUB_TOKEN;
    return {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

async function githubFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${GITHUB_API}${path}`, {
        headers: githubHeaders(),
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub API ${path} → ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
}

async function githubFetchStatus(path: string): Promise<number> {
    const res = await fetch(`${GITHUB_API}${path}`, {
        headers: githubHeaders(),
        next: { revalidate: 60 },
    });
    return res.status;
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
