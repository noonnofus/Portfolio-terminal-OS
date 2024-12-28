'use client';

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import AppDesktopHeader from "./AppDesktopHeader";

export default function MarkdownRender({ markdownText, title }: { markdownText: string, title: string }) {
    return (
        <div style={{
            width: "75vw",
            height: "75vh",
            overflow: "auto",
            backgroundColor: "white",
            borderRadius: "8px",
        }}>
            <AppDesktopHeader title={title} />
            <ReactMarkdown
                className="react-markdown p-5"
                rehypePlugins={[rehypeRaw]}
            >
                {markdownText}
            </ReactMarkdown>
        </div>
    );
}