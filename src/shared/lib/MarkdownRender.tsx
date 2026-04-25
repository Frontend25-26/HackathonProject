'use client';
import { Text } from '@gravity-ui/uikit';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import styles from './MarkdownRender.module.css';

interface MarkdownRenderProps {
    content: string;
}

export const MarkdownRender: FC<MarkdownRenderProps> = ({ content }) => {
    return (
        <div className={styles['markdown-box']}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    table: ({ children }) => (
                        <div style={{ overflowX: 'auto' }}>
                            <table>{children}</table>
                        </div>
                    ),
                    h1: ({ children }) => (
                        <Text variant="display-2" as="h1">
                            {children}
                        </Text>
                    ),

                    h2: ({ children }) => (
                        <Text variant="header-2" as="h2">
                            {children}
                        </Text>
                    ),
                    h3: ({ children }) => (
                        <Text variant="subheader-3" as="h3">
                            {children}
                        </Text>
                    ),
                    ol: ({ node, children, ...props }) => {
                        const depth = node?.position?.start.column || 1;

                        const type =
                            depth % 3 === 1 ? '1' : depth % 3 === 2 ? 'a' : 'i';

                        return (
                            <ol type={type} {...props}>
                                {children}
                            </ol>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
