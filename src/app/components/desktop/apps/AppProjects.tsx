import MarkdownRender from "./layout/MarkdownRender";

const md = `
<div>
    projects that you've been done so far.
</div>

`;

export default function AppProjects() {

    return (
        <>
            <MarkdownRender markdownText={md} title="Projects" />
        </>
    );
}