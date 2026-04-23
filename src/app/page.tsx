import { Session } from 'next-auth'

import { auth, signIn, signOut } from '@/features/auth/authSetup'
import { userRepository } from '@backend/users/repository'

export default async function Home() {
    const session = (await auth()) as Session

    let meData = null
    if (session?.user?.userId) {
        meData = await userRepository.findById(session.user.userId)
        console.log(`[auth] logged in as githubId: ${session.user.githubId}`)
        console.log('[auth] /api/me data:', meData)
    }

    return (
        <main className="main">
            {session?.user ? (
                <div>
                    <p>
                        {JSON.stringify(session.user)}
                        {session.user.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={session.user.image}
                                height={40}
                                width={40}
                                alt="user-icon"
                            />
                        )}
                    </p>
                    <p>{session.user.role ?? '—'}</p>
                    <pre>{JSON.stringify(meData, null, 2)}</pre>
                    <form
                        action={async () => {
                            'use server'
                            await signOut({
                                redirectTo: "/login",
                            })
                        }}
                    >
                        <button type="submit">Sign out</button>
                    </form>
                </div>
            ) : (
                <form
                    action={async () => {
                        'use server'
                        await signIn('github')
                    }}
                >
                    <button type="submit">Sign in with GitHub</button>
                </form>
            )}
        </main>
    )
}
