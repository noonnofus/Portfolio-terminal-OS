import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRenderProps = {
    markdownText: string;
    className?: string;
    components?: Components;
};

export default function MarkdownRender({ markdownText, className, components }: MarkdownRenderProps) {
    return (
        <div className={className}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{markdownText}</ReactMarkdown>
        </div>
    );
}
