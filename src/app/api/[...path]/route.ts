import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

import { NextRequest } from 'next/server';

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

    // Точный роут
    if (dirs.some((e) => e.name === head)) {
        const result = await resolveDir(tail, join(dir, head));
        if (result) return result;
    }

    // Динамический роут
    for (const e of dirs.filter((e) => /^\[.+\]$/.test(e.name))) {
        const result = await resolveDir(tail, join(dir, e.name));
        if (result) return result;
    }

    return null;
}

async function handler(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    if (process.env.USE_MOCKS !== 'true') {
        return Response.json({ error: 'not found' }, { status: 404 });
    }

    const { path } = await params;
    const dir = await resolveDir(path, MOCKS_DIR);

    if (dir) {
        for (const name of [`${req.method}.json`, 'index.json']) {
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

    return Response.json(
        { error: 'mock not found', path: req.url },
        { status: 404 },
    );
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
