import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

import { z } from 'zod'

import { registry } from './openapi'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

const MOCKS_DIR = join(process.cwd(), 'src/mocks')
const HTTP_METHODS: HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete']

function toOpenApiPath(fsPath: string | undefined): string {
    if (!fsPath) return ''
    return fsPath.replace(/\[(.+?)\]/g, '{$1}')
}

function extractPathParams(
    openApiPath: string,
): { name: string; schema: { type: string } }[] {
    return [...openApiPath.matchAll(/\{(\w+)\}/g)].map((m) => ({
        name: m[1],
        schema: { type: 'string' },
    }))
}

function scanDir(dir: string, urlPath: string = ''): void {
    let entries
    try {
        entries = readdirSync(dir, { withFileTypes: true })
    } catch {
        return
    }

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const segment = toOpenApiPath(entry.name)
            scanDir(join(dir, entry.name), `${urlPath}/${segment}`)
            continue
        }

        if (!entry.isFile() || !entry.name.endsWith('.json')) continue

        const methodName = entry.name.replace('.json', '').toLowerCase()
        const methods: HttpMethod[] =
            methodName === 'index' ? HTTP_METHODS : [methodName as HttpMethod]

        let raw: Record<string, unknown> = {}
        try {
            raw = JSON.parse(readFileSync(join(dir, entry.name), 'utf8'))
        } catch {
            continue
        }

        const {
            _status,
            _delay: _d,
            ...body
        } = raw as {
            _status?: number
            _delay?: number
            [key: string]: unknown
        }
        const status = _status ?? 200

        const pathParams = extractPathParams(urlPath)

        for (const method of methods) {
            registry.registerPath({
                method,
                path: urlPath || '/',
                tags: ['Mocks'],
                summary: `[MOCK] ${method.toUpperCase()} /api${urlPath}`,
                ...(pathParams.length > 0 && {
                    request: {
                        params: z.object(
                            Object.fromEntries(
                                pathParams.map(({ name }) => [
                                    name,
                                    z.string(),
                                ]),
                            ),
                        ),
                    },
                }),
                responses: {
                    [status]: {
                        description: 'Mock response',
                        content: {
                            'application/json': {
                                schema: z.object({}).openapi({ example: body }),
                            },
                        },
                    },
                },
            })
        }
    }
}

export function registerMockRoutes(): void {
    scanDir(MOCKS_DIR)
}
