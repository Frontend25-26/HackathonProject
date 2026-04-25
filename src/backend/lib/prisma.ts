import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '@backend/generated/prisma';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const adapter = new PrismaMariaDb({
    host: process.env['MYSQL_HOST'],
    user: process.env['MYSQL_USER'],
    database: process.env['MYSQL_DATABASE'],
    password: process.env['MYSQL_PASSWORD'],
    port: process.env['MYSQL_PORT']
        ? parseInt(process.env['MYSQL_PORT'])
        : undefined,
    // MySQL 8 по умолчанию использует caching_sha2_password — без этой опции
    // драйвер не может получить RSA-ключ для безопасной передачи пароля.
    allowPublicKeyRetrieval: true,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
