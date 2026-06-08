'use client';

import { FC, useMemo, useState } from 'react';

import {
    getCreatePatch,
    getChangePatch,
    getDeletePatch,
} from '@/shared/utils/helpers/gitPatch';

import { buildFileTree } from '../FileTree/buildFileTree';
import { FileTree } from '../FileTree/FileTree';
import { ReviewDiff } from '../ReviewDiff/ReviewDiff';

import styles from './ReviewSubmissionClient.module.css';

import type { FileChange, RepoDiff } from '@/shared/types';

interface ReviewSubmissionProps {
    fileChanges: FileChange[];
}

export const ReviewSubmissionClient: FC<ReviewSubmissionProps> = ({
    fileChanges,
}) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const fileMapper = useMemo<RepoDiff>(() => {
        const mapper: RepoDiff = {};

        fileChanges.forEach((fileChange) => {
            mapper[fileChange.filename] = {
                status: fileChange.status,
                filename: fileChange.filename,
                patch: fileChange.patch,
            };
        });

        return mapper;
    }, [fileChanges]);

    const tree = useMemo(() => buildFileTree(fileMapper), [fileMapper]);

    const selectedDiff = selectedFile ? fileMapper[selectedFile] : null;
    let fullPatch: string | null = null;
    if (selectedDiff) {
        if (selectedDiff.status === 'added') {
            fullPatch = getCreatePatch(selectedFile!, selectedDiff.patch);
        } else if (selectedDiff.status === 'modified') {
            fullPatch = getChangePatch(selectedFile!, selectedDiff.patch);
        } else {
            fullPatch = getDeletePatch(selectedFile!, selectedDiff.patch);
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.fileTreeView}>
                <FileTree
                    tree={tree}
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                />
            </div>

            <div className={styles.reviewDiff}>
                {selectedDiff ? (
                    <ReviewDiff patch={fullPatch!} />
                ) : (
                    <div>Выберите файл</div>
                )}
            </div>
        </div>
    );
};
