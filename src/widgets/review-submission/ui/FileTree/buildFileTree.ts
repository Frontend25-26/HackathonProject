import { diffLines } from 'diff';
import { parse } from 'diff2html';
import { DiffFile } from 'diff2html/lib/types';

import { getChangePatch } from '@/widgets/review-submission/ui/ReviewSubmissionClient/ReviewSubmissionClient';

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

    for (const fullPath in repo) {
        const file = repo[fullPath];

        const patch = getChangePatch(fullPath, file.patch);

        const fileInfo = parse(patch)[0];

        const status = getStatus(fileInfo);

        const added = fileInfo.addedLines;
        const removed = fileInfo.deletedLines;

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
