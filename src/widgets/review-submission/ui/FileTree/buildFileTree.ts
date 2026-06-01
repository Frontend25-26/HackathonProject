import { parse } from 'diff2html';
import { DiffFile } from 'diff2html/lib/types';

import { RepoDiff } from '@/shared/types/file-diff';
import { getChangePatch } from '@/shared/utils/helpers/gitPatch';

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

export function buildFileTree(repo: RepoDiff): TreeNode[] {
    const root: TreeNode = {
        name: '',
        path: '',
        type: 'folder',
        children: [],
    };

    const getStatus = (fileInfo: DiffFile): DiffStatus => {
        if (fileInfo.addedLines > 0 && fileInfo.deletedLines == 0) {
            return 'added';
        }
        if (fileInfo.addedLines == 0 && fileInfo.deletedLines > 0) {
            return 'deleted';
        }

        return 'modified';
    };

    Object.values(repo).forEach((file) => {
        const patch = getChangePatch(file.filename, file.patch);

        const fileInfo = parse(patch)[0];

        const status = getStatus(fileInfo);

        const added = fileInfo.addedLines;
        const removed = fileInfo.deletedLines;

        const parts = file.filename.split('/');

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
    });

    return root.children || [];
}
