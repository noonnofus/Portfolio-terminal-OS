'use client';

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
export default function MarkdownRender({ markdownText }: { markdownText: string, title: string, appName: string }) {
    return (
        <>
            <div style={{
                overflow: "auto",
                backgroundColor: "white",
                borderRadius: "0 0 8px 8px",
                position: "relative",
                zIndex: 10,
                color: "black",
            }}>
                <ReactMarkdown
                    className="react-markdown p-5"
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        p: ({ node: _node, ...props }) => <p style={{ color: "black" }} {...props} />, // eslint-disable-line @typescript-eslint/no-unused-vars
                        h2: ({ node: _node, ...props }) => <h2 style={{ color: "black" }} {...props} />, // eslint-disable-line @typescript-eslint/no-unused-vars
                        li: ({ node: _node, ...props }) => <li style={{ color: "black" }} {...props} />, // eslint-disable-line @typescript-eslint/no-unused-vars
                        div: ({ node: _node, ...props }) => ( // eslint-disable-line @typescript-eslint/no-unused-vars
                            <div style={{ position: 'relative', zIndex: 2, color: "black" }} {...props} />
                        )
                    }}
                >
                    {markdownText}
                </ReactMarkdown>
            </div>
        </>
    );
}