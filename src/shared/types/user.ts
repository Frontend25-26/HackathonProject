export interface UserSchema {
    id: number;
    githubId: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
}
