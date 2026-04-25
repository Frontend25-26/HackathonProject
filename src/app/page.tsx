import { signOut } from '@/features/auth/authSetup';

export default async function Home() {
    return (
        <div>
            {/*<a href="/login">Страница авторизации</a>*/}
            {/*<br />*/}
            <a href="/student">Страница студентов</a>
            <br />
            <a href="/mentor">Страница менторов</a>
            <br />
            <a href="/admin">Страница администраторов</a>
            <br />
            {/* Заглушка */}
            <form
                action={async () => {
                    'use server';
                    await signOut();
                }}
            >
                <button type="submit">Sign out</button>
            </form>
        </div>
    );
}
