'use client';

import { useMemo, useState } from 'react';

import { buildFileTree } from '../FileTree/buildFileTree';
import { FileTreeView } from '../FileTree/FileTreeView';
import { ReviewDiff } from '../ReviewDiff/ReviewDiff';
import { repoDiff } from '../ReviewDiff/ReviewMockRepository';

import styles from './ReviewSubmissionClient.module.css';

export const ReviewSubmissionClient = () => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const tree = useMemo(() => buildFileTree(repoDiff), []);

    const selectedDiff = selectedFile ? repoDiff[selectedFile] : null;

    return (
        <div className={styles.main}>
            <div className={styles.fileTreeView}>
                <FileTreeView
                    tree={tree}
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                />
            </div>

            <div className={styles.reviewDiff}>
                {selectedDiff ? (
                    <ReviewDiff
                        oldFile={selectedDiff.oldContent}
                        newFile={selectedDiff.newContent}
                        fileName={selectedFile || ''}
                    />
                ) : (
                    <div>Select a file</div>
                )}
            </div>
        </div>
    );
};
