import { classroomApi } from '@backend/github/classroom';
import { requireAdmin } from '@backend/lib/auth';
import { settingsRepository } from '@backend/settings/repository';
import { userRepository } from '@backend/users/repository';

export const GET = async (): Promise<Response> => {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const classroomId = await settingsRepository.getClassroomId();
    if (!classroomId) {
        return Response.json(
            {
                error: 'No classroom selected. Choose one on /admin/classrooms.',
            },
            { status: 400 },
        );
    }

    const githubToken = await userRepository.findGithubToken(auth.user.id);
    if (!githubToken) {
        return Response.json(
            { error: 'GitHub token not found. Re-login to refresh it.' },
            { status: 401 },
        );
    }

    try {
        const assignments = await classroomApi.listAssignments(
            classroomId,
            githubToken,
        );
        return Response.json(assignments);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'GitHub API error';
        return Response.json({ error: message }, { status: 502 });
    }
};
