'use client';

import {
    Folder,
    FolderOpen,
    File,
    FileMinus,
    FilePlus,
} from '@gravity-ui/icons';
import { FC, useState } from 'react';

import { TreeNode } from './buildFileTree';
import styles from './FileTree.module.css';

interface Props {
    tree: TreeNode[];
    selectedFile: string | null;
    onSelectFile: (path: string) => void;
}

export const FileTree: FC<Props> = ({ tree, selectedFile, onSelectFile }) => {
    return (
        <div>
            {tree.map((node) => (
                <TreeItem
                    key={node.path}
                    node={node}
                    selectedFile={selectedFile}
                    onSelectFile={onSelectFile}
                />
            ))}
        </div>
    );
};

interface TreeItemProps {
    node: TreeNode;
    selectedFile: string | null;
    onSelectFile: (path: string) => void;
}

const TreeItem: FC<TreeItemProps> = ({ node, selectedFile, onSelectFile }) => {
    const [open, setOpen] = useState(true);

    if (node.type === 'folder') {
        return (
            <div className={styles.folderMargin}>
                <div
                    onClick={() => setOpen((o) => !o)}
                    className={styles.folder}
                >
                    <span>{open ? '▼' : '▶'}</span>
                    {open ? <FolderOpen /> : <Folder />}
                    <span>{node.name}</span>
                </div>

                {open &&
                    node.children?.map((child) => (
                        <TreeItem
                            key={child.path}
                            node={child}
                            selectedFile={selectedFile}
                            onSelectFile={onSelectFile}
                        />
                    ))}
            </div>
        );
    }

    const added = node.addedLines || 0;
    const removed = node.removedLines || 0;

    const status = node.status || 'modified';

    const statusClassname =
        status === 'added'
            ? styles.add
            : status === 'deleted'
              ? styles.delete
              : styles.modify;

    return (
        <div
            onClick={() => onSelectFile(node.path)}
            className={
                selectedFile === node.path
                    ? `${styles.file} ${styles.bold}`
                    : styles.file
            }
        >
            <div className={styles.fileBox}>
                <span className={`${styles.fileType} ${statusClassname}`}>
                    {status === 'added'
                        ? '+'
                        : status === 'deleted'
                          ? '-'
                          : '~'}
                </span>

                {status === 'added' ? (
                    <FilePlus />
                ) : status === 'deleted' ? (
                    <FileMinus />
                ) : (
                    <File />
                )}

                <span className={styles.fileName}>{node.name}</span>
            </div>

            <div className={styles.changedLines}>
                {added > 0 && <span className={styles.add}>+{added}</span>}

                {removed > 0 && (
                    <span className={styles.delete}>-{removed}</span>
                )}
            </div>
        </div>
    );
};
