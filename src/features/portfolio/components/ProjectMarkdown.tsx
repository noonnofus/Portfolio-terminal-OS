import MarkdownRender from "@/components/ui/MarkdownRender";
import { useMemo } from "react";
import type { Components } from "react-markdown";
import type { Language } from "@/lib/i18n/language";
import type { ProjectMediaBlock } from "@/features/portfolio/content/projectDetailContent";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";
import { ImagePreview, type OpenImageViewer } from "@/components/ui/ImageViewer";
import styles from "./ProjectContent.module.css";

const mediaLabels = {
    ko: { loading: "구조도를 불러오는 중입니다.", error: "구조도를 표시하지 못했습니다.", scroll: "다이어그램 가로 스크롤 영역", video: "브라우저가 비디오 재생을 지원하지 않습니다." },
    en: { loading: "Loading diagram.", error: "Unable to display diagram.", scroll: "Diagram horizontal scrolling area", video: "Your browser does not support video playback." },
};

export function ProjectMarkdown({ markdown, language, openImage, media }: {
    markdown: string;
    language: Language;
    openImage: OpenImageViewer;
    media?: ProjectMediaBlock;
}) {
    const labels = mediaLabels[language];

    const components = useMemo<Components>(() => ({
        p({ node, children }) {
            const containsImage = node?.children.some((child) => child.type === "element" && child.tagName === "img");
            return containsImage ? <div>{children}</div> : <p>{children}</p>;
        },
        img({ src, alt = "", title }) {
            if (typeof src !== "string") return null;
            const image = { src, alt, title: title ?? media?.title ?? alt, width: media?.width, height: media?.height, description: media?.processDescription };
            return <ImagePreview image={image} openImage={openImage} language={language} />;
        },
        pre({ node, children }) {
            const code = node?.children.find((child) => child.type === "element" && child.tagName === "code");
            if (code?.type === "element" && Array.isArray(code.properties.className) && code.properties.className.includes("language-mermaid")) {
                const chart = code.children.map((child) => child.type === "text" ? child.value : "").join("");
                return <ProjectArchitectureDiagram chart={chart} label={media?.alt ?? media?.title ?? labels.scroll} loadingLabel={media?.loading ?? labels.loading} errorLabel={media?.error ?? labels.error} wide={media?.wide} scrollable scrollLabel={media?.scrollLabel ?? labels.scroll} openImage={openImage} language={language} />;
            }
            return <pre>{children}</pre>;
        },
        a({ href, children }) {
            if (href?.startsWith("/videos/") && href.endsWith(".mp4")) {
                return <video aria-label={media?.title} className="aspect-video w-full" controls preload="metadata"><source src={href} type="video/mp4" />{media?.unsupported ?? labels.video}</video>;
            }
            return <a href={href}>{children}</a>;
        },
    }), [openImage, media, labels, language]);
    return <MarkdownRender markdownText={markdown} className={styles.caseMarkdown} components={components} />;
}
