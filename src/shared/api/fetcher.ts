/**
 * Универсальный хелпер для запросов к внутреннему API.
 *
 * На сервере автоматически:
 *  - подставляет origin из заголовков текущего запроса
 *  - пробрасывает cookies (включая сессионную cookie NextAuth)
 *
 * На клиенте использует относительный путь и `credentials: 'same-origin'`,
 * браузер сам передаёт cookies.
 *
 * Пример:
 *   const me = await apiFetch<User>('/api/me');
 *   const created = await apiFetch<Course>('/api/courses', {
 *       method: 'POST',
 *       body: { title: 'New course' },
 *   });
 */

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly data: unknown,
    ) {
        super(`API ${status} ${statusText}`);
        this.name = 'ApiError';
    }
}

type QueryValue = string | number | boolean | null | undefined;

export type ApiFetchOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
    query?: Record<string, QueryValue | QueryValue[]>;
};

const isServer = typeof window === 'undefined';

async function getServerContext(): Promise<{ origin: string; cookie: string }> {
    try {
        const { headers, cookies } = await import('next/headers');
        const [h, c] = await Promise.all([headers(), cookies()]);
        const host = h.get('host') ?? '';
        const proto =
            h.get('x-forwarded-proto') ??
            (host.startsWith('localhost') || host.startsWith('127.')
                ? 'http'
                : 'https');
        return {
            origin: host ? `${proto}://${host}` : '',
            cookie: c.toString(),
        };
    } catch {
        return {
            origin: process.env.NEXT_PUBLIC_APP_URL ?? '',
            cookie: '',
        };
    }
}

function appendQuery(url: string, query?: ApiFetchOptions['query']): string {
    if (!query) return url;
    const search = new URLSearchParams();
    for (const [key, raw] of Object.entries(query)) {
        const values = Array.isArray(raw) ? raw : [raw];
        for (const v of values) {
            if (v === undefined || v === null) continue;
            search.append(key, String(v));
        }
    }
    const qs = search.toString();
    if (!qs) return url;
    return url + (url.includes('?') ? '&' : '?') + qs;
}

function isPlainBody(body: unknown): body is BodyInit {
    return (
        typeof body === 'string' ||
        body instanceof FormData ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof URLSearchParams ||
        body instanceof ReadableStream
    );
}

async function parseResponse(response: Response): Promise<unknown> {
    if (response.status === 204) return undefined;
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
        return response.json();
    }
    const text = await response.text();
    return text || undefined;
}

export async function apiFetch<T = unknown>(
    path: string,
    options: ApiFetchOptions = {},
): Promise<T> {
    const { body, query, headers: optHeaders, ...init } = options;

    const isAbsolute = /^https?:\/\//i.test(path);
    const normalizedPath =
        isAbsolute || path.startsWith('/') ? path : `/${path}`;

    const headers = new Headers(optHeaders);
    let url = normalizedPath;

    if (isServer && !isAbsolute) {
        const ctx = await getServerContext();
        url = `${ctx.origin}${normalizedPath}`;
        if (ctx.cookie && !headers.has('cookie')) {
            headers.set('cookie', ctx.cookie);
        }
    }

    url = appendQuery(url, query);

    let preparedBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
        if (isPlainBody(body)) {
            preparedBody = body;
        } else {
            preparedBody = JSON.stringify(body);
            if (!headers.has('content-type')) {
                headers.set('content-type', 'application/json');
            }
        }
    }

    const response = await fetch(url, {
        ...init,
        headers,
        body: preparedBody,
        credentials: init.credentials ?? 'same-origin',
    });

    const data = await parseResponse(response);

    if (!response.ok) {
        throw new ApiError(response.status, response.statusText, data);
    }

    return data as T;
}
