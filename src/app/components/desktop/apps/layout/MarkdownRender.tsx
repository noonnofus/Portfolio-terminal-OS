'use client';

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import AppDesktopHeader from "./AppDesktopHeader";
import { useSelector } from 'react-redux';
import { RootState } from "@/app/store/store";
import useIsTouchDevice from "@/lib/isTouchDevice";

export default function MarkdownRender({ markdownText, title }: { markdownText: string, title: string }) {
    const isTouchDevice = useIsTouchDevice();
    const isFullScreen = useSelector((state: RootState) => state.desktop.fullScreen);

    const containerWidth = isTouchDevice ? "100%" : (isFullScreen ? "100vw" : "75vw");
    const containerHeight = isTouchDevice ? "100%" : (isFullScreen ? "100vh" : "75vh");

    return (
        <>
            <div style={{
                width: containerWidth,
                backgroundColor: "white",
                borderRadius: "8px 8px 0 0",
            }}>
                <AppDesktopHeader title={title} />
            </div>

            <div style={{
                width: containerWidth,
                height: containerHeight,
                overflow: "auto",
                backgroundColor: "white",
                borderRadius: "0 0 8px 8px",
                position: "relative",
                zIndex: 10,
            }}>
                <ReactMarkdown
                    className="react-markdown p-5"
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        div: ({ node, ...props }) => (
                            <div style={{ position: 'relative', zIndex: 2 }} {...props} />
                        )
                    }}
                >
                    {markdownText}
                </ReactMarkdown>
            </div>
        </>
    );
}