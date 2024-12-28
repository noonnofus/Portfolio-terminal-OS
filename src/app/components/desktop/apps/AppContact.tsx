import MarkdownRender from "./layout/MarkdownRender";

const md = `
**Email**

[kevinvancouver@gmail.com](mailto:kevinvancouver@gmail.com)

<br />

**GitHub**

[BCITKevin](https://github.com/BCITKevin)

<br />

**LinkedIn**

[Kevin Kim](https://www.linkedin.com/in/kevin-hyun-ho-so-b190b8297/)

`;

export default function AppContact() {

    return (
        <>
            <MarkdownRender markdownText={md} title="Contacts" />
        </>
    );
}