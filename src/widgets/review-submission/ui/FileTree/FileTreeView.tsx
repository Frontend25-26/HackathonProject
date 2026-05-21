'use client';

import { FC, useState } from 'react';

import { TreeNode } from './buildFileTree';

interface Props {
    tree: TreeNode[];
    selectedFile: string | null;
    onSelectFile: (path: string) => void;
}

export const FileTreeView: FC<Props> = ({
    tree,
    selectedFile,
    onSelectFile,
}) => {
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
            <div style={{ marginLeft: 12 }}>
                <div
                    onClick={() => setOpen((o) => !o)}
                    style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                    }}
                >
                    <span>{open ? '▼' : '▶'}</span>
                    <span>📁</span>
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

    let status: 'added' | 'removed' | 'modified' = 'modified';

    if (added > 0 && removed === 0) {
        status = 'added';
    } else if (removed > 0 && added === 0) {
        status = 'removed';
    }

    const statusColor =
        status === 'added'
            ? '#16a34a'
            : status === 'removed'
              ? '#dc2626'
              : '#d97706';

    return (
        <div
            onClick={() => onSelectFile(node.path)}
            style={{
                marginLeft: 24,
                marginRight: 20,
                cursor: 'pointer',
                fontWeight: selectedFile === node.path ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                padding: '2px 0',
                userSelect: 'none',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    overflow: 'hidden',
                }}
            >
                <span
                    style={{
                        width: 12,
                        color: statusColor,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        flexShrink: 0,
                    }}
                >
                    {status === 'added'
                        ? '+'
                        : status === 'removed'
                          ? '-'
                          : '~'}
                </span>

                <span>📄</span>

                <span
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {node.name}
                </span>
            </div>

            <div
                style={{
                    fontSize: 12,
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                }}
            >
                {added > 0 && (
                    <span style={{ color: '#16a34a' }}>+{added}</span>
                )}

                {removed > 0 && (
                    <span style={{ color: '#dc2626' }}>-{removed}</span>
                )}
            </div>
        </div>
    );
};
