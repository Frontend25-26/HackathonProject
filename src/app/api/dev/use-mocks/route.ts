/**
 * Dev endpoint для обработки mock запросов
 *
 * Используется middleware в режиме USE_MOCKS=true
 * Примеры:
 *  - /api/dev/use-mocks?route=/me&method=GET
 *  - /api/dev/use-mocks?route=/users&method=GET
 *  - /api/dev/use-mocks?route=/reviews/1&method=PATCH
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

import { NextRequest } from 'next/server';

import { requireAdmin, requireAuth, requireMentor } from '@backend/lib/auth';

const MOCKS_DIR = join(process.cwd(), 'src/mocks');

async function resolveDir(
    segments: string[],
    dir: string,
): Promise<string | null> {
    if (segments.length === 0) return dir;

    const [head, ...tail] = segments;
    let entries: import('fs').Dirent[];
    try {
        entries = await readdir(dir, { withFileTypes: true });
    } catch {
        return null;
    }

    const dirs = entries.filter((e) => e.isDirectory());

    if (dirs.some((e) => e.name === head)) {
        const result = await resolveDir(tail, join(dir, head));
        if (result) return result;
    }

    for (const e of dirs.filter((e) => /^\[.+\]$/.test(e.name))) {
        const result = await resolveDir(tail, join(dir, e.name));
        if (result) return result;
    }

    return null;
}

function resolveAuthLevel(
    path: string[],
): 'public' | 'protected' | 'mentor' | 'admin' {
    const [first] = path;

    if (first === 'users' || first === 'github') return 'admin';
    if (
        first === 'reviews' ||
        first === 'review-threads' ||
        first === 'review-comments'
    )
        return 'mentor';
    if (
        first === 'me' ||
        first === 'courses' ||
        first === 'assignments' ||
        first === 'enrollments' ||
        first === 'submissions'
    )
        return 'protected';

    return 'public';
}

async function handler(request: NextRequest) {
    const route = request.headers.get('x-mock-route');
    const method = request.headers.get('x-mock-method') || request.method;

    if (!route) {
        return Response.json(
            { error: 'route param required' },
            { status: 400 },
        );
    }

    const path = route.startsWith('/')
        ? route.slice(1).split('/')
        : route.split('/');
    const authLevel = resolveAuthLevel(path);

    // Проверяем авторизацию
    if (authLevel === 'admin') {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;
    } else if (authLevel === 'mentor') {
        const auth = await requireMentor(request);
        if (!auth.ok) return auth.response;
    } else if (authLevel === 'protected') {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
    }

    const dir = await resolveDir(path, MOCKS_DIR);

    if (dir) {
        for (const name of [`${method}.json`, 'index.json']) {
            try {
                const {
                    _status: status = 200,
                    _delay = 0,
                    ...body
                } = JSON.parse(await readFile(join(dir, name), 'utf8'));

                if (_delay) await new Promise((r) => setTimeout(r, _delay));

                return Response.json(body, { status });
            } catch (_) {
                // ignore
            }
        }
    }

    return Response.json({ error: 'mock not found', route }, { status: 404 });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
