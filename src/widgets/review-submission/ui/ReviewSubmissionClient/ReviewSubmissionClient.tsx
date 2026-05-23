'use client';

import { FC, useMemo, useState } from 'react';

import { buildFileTree } from '../FileTree/buildFileTree';
import { FileTree } from '../FileTree/FileTree';
import { ReviewDiff } from '../ReviewDiff/ReviewDiff';

import styles from './ReviewSubmissionClient.module.css';

import type { RepoDiff } from '../ReviewDiff/ReviewMockRepository';

export const getChangePatch = (fileName: string, patch: string) => {
    return `
diff --git a/${fileName} b/${fileName}
--- a/${fileName}
+++ b/${fileName}
${patch}
`;
};

const getCreatePatch = (fileName: string, patch: string) => {
    return `
diff --git a/${fileName} b/${fileName}
new file mode 100644
--- /dev/null
+++ b/${fileName}
${patch}
`;
};

const getDeletePatch = (fileName: string, patch: string) => {
    return `
diff --git a/${fileName} b/${fileName}
deleted file mode 100644
--- a/${fileName}
+++ /dev/null
${patch}
`;
};

interface ReviewSubmissionProps {
    fileChanges: RepoDiff;
}

export const ReviewSubmissionClient: FC<ReviewSubmissionProps> = ({
    fileChanges,
}) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const tree = useMemo(() => buildFileTree(fileChanges), [fileChanges]);

    const selectedDiff = selectedFile ? fileChanges[selectedFile] : null;

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
                    <ReviewDiff
                        fileName={selectedFile || ''}
                        patch={fullPatch!}
                    />
                ) : (
                    <div>Select a file</div>
                )}
            </div>
        </div>
    );
};
