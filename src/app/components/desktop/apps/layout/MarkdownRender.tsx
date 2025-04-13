'use client';

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import AppDesktopHeader from "./AppDesktopHeader";
import useIsTouchDevice from "@/lib/isTouchDevice";
import { useState } from "react";

export default function MarkdownRender({ markdownText, title, appName }: { markdownText: string, title: string, appName: string }) {
    const [isFullScreen, setIsFullScreen] = useState<boolean>(true);
    const isTouchDevice = useIsTouchDevice();

    const containerWidth = isTouchDevice ? "100%" : (isFullScreen ? "100vw" : "75vw");
    const containerHeight = isTouchDevice ? "100%" : (isFullScreen ? "100vh" : "75vh");

    return (
        <>
            <div style={{
                width: containerWidth,
                backgroundColor: "white",
                borderRadius: "8px 8px 0 0",
            }}>
                <AppDesktopHeader
                    appName={appName}
                    title={title}
                    isFullScreen={isFullScreen}
                    setIsFullScreen={setIsFullScreen} />
            </div>

            <div style={{
                width: containerWidth,
                height: containerHeight,
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
                        p: ({ node, ...props }) => <p style={{ color: "black" }} {...props} />,
                        h2: ({ node, ...props }) => <h2 style={{ color: "black" }} {...props} />,
                        li: ({ node, ...props }) => <li style={{ color: "black" }} {...props} />,
                        div: ({ node, ...props }) => (
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