import { parse } from 'diff2html';

import { FileStatus, RepoDiff } from '@/shared/types';
import { getChangePatch } from '@/shared/utils/helpers/gitPatch';

type FileType = 'FILE' | 'FOLDER';

export interface TreeNode {
    name: string;
    path: string;
    type: FileType;

    status?: FileStatus;

    addedLines?: number;
    removedLines?: number;

    children?: TreeNode[];
}

export function buildFileTree(repo: RepoDiff): TreeNode[] {
    const root: TreeNode = {
        name: '',
        path: '',
        type: 'FOLDER',
        children: [],
    };

    Object.values(repo).forEach((file) => {
        const status = file.status;
        let added = 0;
        let removed = 0;
        if (file.patch) {
            const patch = getChangePatch(file.filename, file.patch);
            const fileInfo = parse(patch)[0];
            added = fileInfo.addedLines;
            removed = fileInfo.deletedLines;
        }

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
                    type: isFile ? 'FILE' : 'FOLDER',

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
