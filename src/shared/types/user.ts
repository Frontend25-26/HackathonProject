export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN';

export interface User {
    id: number;
    githubId: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
