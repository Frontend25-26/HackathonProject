import { Role, User } from '@backend/generated/prisma';
import { prisma } from '@backend/lib/prisma';

class UserRepository {
    async findAll(): Promise<User[]> {
        return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async findByGithubId(githubId: number): Promise<User | null> {
        try {
            return prisma.user.findUnique({ where: { githubId } });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async create(data: {
        githubId: number;
        login: string;
        name?: string;
        email?: string;
        avatar?: string;
        role?: Role;
    }): Promise<User> {
        return prisma.user.create({ data });
    }

    async update(
        id: number,
        data: { name?: string; email?: string; avatar?: string; role?: Role },
    ): Promise<User> {
        return prisma.user.update({ where: { id }, data });
    }
}

export const userRepository = new UserRepository();
