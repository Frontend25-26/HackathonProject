import { fetchCurrentUser } from '@/entities/user/api';
import { UsersPage } from '@/widgets/adminUsersCard';
import { ErrorComponent } from '@/widgets/ErrorComponent';

export default async function AdminUsersPage() {
    let currentUserId: number;

    try {
        const me = await fetchCurrentUser();
        currentUserId = me.id;
    } catch {
        return (
            <ErrorComponent message="Не удалось загрузить данные пользователя. Пожалуйста, войдите в систему." />
        );
    }

    return <UsersPage currentUserId={currentUserId} />;
}
