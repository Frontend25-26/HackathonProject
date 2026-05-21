import { diffLines } from 'diff';

import { RepoDiff } from '../ReviewDiff/ReviewMockRepository';

export type DiffStatus = 'added' | 'modified' | 'deleted';

export interface TreeNode {
    name: string;
    path: string;
    type: 'file' | 'folder';

    status?: DiffStatus;

    addedLines?: number;
    removedLines?: number;

    children?: TreeNode[];
}

export function getDiffStats(oldText: string, newText: string) {
    const changes = diffLines(oldText, newText);

    let added = 0;
    let removed = 0;

    for (const part of changes) {
        const lineCount = part.count || 0;

        if (part.added) {
            added += lineCount;
        }

        if (part.removed) {
            removed += lineCount;
        }
    }

    return { added, removed };
}

export function buildFileTree(repo: RepoDiff): TreeNode[] {
    const root: TreeNode = {
        name: '',
        path: '',
        type: 'folder',
        children: [],
    };

    const getStatus = (
        oldContent?: string,
        newContent?: string,
    ): DiffStatus => {
        if (!oldContent && newContent) {
            return 'added';
        }

        if (oldContent && !newContent) {
            return 'deleted';
        }

        return 'modified';
    };

    for (const fullPath in repo) {
        const file = repo[fullPath];

        const oldContent = file.oldContent || '';
        const newContent = file.newContent || '';

        const status = getStatus(file.oldContent, file.newContent);

        const { added, removed } = getDiffStats(oldContent, newContent);

        const parts = fullPath.split('/');

        let current = root;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;

            const path = parts.slice(0, index + 1).join('/');

            if (!current.children) {
                current.children = [];
            }

            let node = current.children.find((n) => n.name === part);

            if (!node) {
                node = {
                    name: part,
                    path,
                    type: isFile ? 'file' : 'folder',

                    ...(isFile
                        ? {
                              status,
                              addedLines: added,
                              removedLines: removed,
                          }
                        : {
                              children: [],
                          }),
                };

                current.children.push(node);
            }

            current = node;
        });
    }

    return root.children || [];
}
