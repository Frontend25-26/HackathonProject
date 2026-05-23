'use client';

import {
    Diff2HtmlUI,
    Diff2HtmlUIConfig,
} from 'diff2html/lib/ui/js/diff2html-ui';
import { FC, useEffect, useRef } from 'react';
import 'diff2html/bundles/css/diff2html.min.css';

interface SubmissionClientProps {
    fileName: string;
    patch: string;
}

export const ReviewDiff: FC<SubmissionClientProps> = ({ fileName, patch }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const configuration: Diff2HtmlUIConfig = {
            drawFileList: false,
            matching: 'lines',
            highlight: true,
            outputFormat: 'side-by-side',
        };

        containerRef.current.innerHTML = '';

        const diff2htmlUi = new Diff2HtmlUI(
            containerRef.current,
            patch,
            configuration,
        );

        diff2htmlUi.draw();
        diff2htmlUi.highlightCode();
    }, [patch]);

    return <div ref={containerRef} />;
};
