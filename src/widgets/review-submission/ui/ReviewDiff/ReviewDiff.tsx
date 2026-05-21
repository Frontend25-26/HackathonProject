'use client';

import { generateDiffFile } from '@git-diff-view/file';
import { DiffView, DiffModeEnum } from '@git-diff-view/react';
import { FC, useMemo } from 'react';
import { useEffect, useState } from 'react';

import '@git-diff-view/react/styles/diff-view.css';
import styles from './ReviewDiff.module.css';

interface SubmissionClientProps {
    fileName: string;
    oldFile: string;
    newFile: string;
}

export function useGravityTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const el = document.body;

        const update = () => {
            setTheme(
                el.classList.contains('g-root_theme_dark') ? 'dark' : 'light',
            );
        };

        update();

        const observer = new MutationObserver(update);
        observer.observe(el, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    return theme;
}

export function getLanguage(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();

    const map: Record<string, string> = {
        ts: 'typescript',
        tsx: 'typescript',
        js: 'javascript',
        jsx: 'javascript',

        json: 'json',

        css: 'css',
        scss: 'scss',

        md: 'markdown',

        yml: 'yaml',
        yaml: 'yaml',

        py: 'python',

        go: 'go',
        java: 'java',
        kt: 'kotlin',
        rs: 'rust',
        sql: 'sql',

        html: 'html',
        htm: 'html',
    };

    return map[ext || ''] || 'plaintext';
}

export const ReviewDiff: FC<SubmissionClientProps> = ({
    fileName,
    oldFile,
    newFile,
}) => {
    const diffFile = useMemo(() => {
        const file = generateDiffFile(
            fileName,
            oldFile,
            fileName,
            newFile,
            getLanguage(fileName),
            getLanguage(fileName),
        );

        file.init();

        return file;
    }, [fileName, oldFile, newFile]);

    const theme = useGravityTheme();

    return (
        <DiffView
            diffFile={diffFile}
            diffViewMode={DiffModeEnum.Split}
            diffViewTheme={theme === 'dark' ? 'dark' : 'light'}
            diffViewHighlight={true}
            className={styles.diff}
        />
    );
};
