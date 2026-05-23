import { Text } from '@gravity-ui/uikit';
import { redirect } from 'next/navigation';

import { auth } from '@/features/auth/authSetup';
import { ClassroomSelector } from '@/widgets/classroom-selector';
import { classroomApi } from '@backend/github/classroom';
import { settingsRepository } from '@backend/settings/repository';
import { userRepository } from '@backend/users/repository';

export default async function AdminClassroomsPage() {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
        redirect('/forbidden');
    }

    const [githubToken, selectedClassroomId] = await Promise.all([
        userRepository.findGithubToken(session.user.userId),
        settingsRepository.getClassroomId(),
    ]);

    let classrooms: Awaited<ReturnType<typeof classroomApi.listClassrooms>> =
        [];
    let errorMessage: string | null = null;

    if (!githubToken) {
        errorMessage =
            'GitHub токен не найден. Выйди и войди снова через GitHub.';
    } else {
        try {
            classrooms = await classroomApi.listClassrooms(githubToken);
        } catch (err) {
            errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Ошибка при загрузке классрумов';
        }
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px' }}>
            <Text variant="display-2" style={{ marginBottom: '8px' }}>
                Выбор классрума
            </Text>
            <Text
                color="secondary"
                variant="body-2"
                style={{ display: 'block', marginBottom: '32px' }}
            >
                Выбранный классрум используется по умолчанию во всём приложении.
            </Text>

            {errorMessage ? (
                <Text color="danger">{errorMessage}</Text>
            ) : (
                <ClassroomSelector
                    classrooms={classrooms}
                    selectedClassroomId={selectedClassroomId}
                />
            )}
        </div>
    );
}
