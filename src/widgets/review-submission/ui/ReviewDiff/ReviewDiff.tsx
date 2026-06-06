'use client';

import { html, type Diff2HtmlConfig } from 'diff2html';
import hljs from 'highlight.js';
import { FC, useEffect, useRef } from 'react';

import { Theme, useTheme } from '@/features/theme';

import 'diff2html/bundles/css/diff2html.min.css';
import 'highlight.js/styles/github.css';

interface SubmissionClientProps {
    patch: string;
}

export const ReviewDiff: FC<SubmissionClientProps> = ({ patch }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const container = containerRef.current;

        if (!container || !patch) {
            return;
        }

        const configuration: Diff2HtmlConfig = {
            drawFileList: false,
            matching: 'lines',
            outputFormat: 'side-by-side',
        };

        container.innerHTML = html(patch, configuration);

        container
            .querySelectorAll('pre code')
            .forEach((block) => hljs.highlightElement(block as HTMLElement));
    }, [patch]);

    if (!patch) {
        return <p>Diff файла не может быть отображен</p>;
    }

    return (
        <div
            ref={containerRef}
            className={
                theme === Theme.DARK ? 'd2h-dark-color-scheme' : undefined
            }
        />
    );
};
