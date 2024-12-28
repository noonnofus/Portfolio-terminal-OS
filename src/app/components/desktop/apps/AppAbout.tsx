import MarkdownRender from "./layout/MarkdownRender";

const md = `
## **About me**
Kevin, Vancouver, BC, CA
Origin: South Korea

<br />

## **What I do**
Student at BCIT (Full-Stack Web Dev)

<br />

## **Tech stacks I worked on**
- Web stacks: HTML5, CSS3, Javascript
- Frameworks: React, Nextjs, Vite
- Typescript
- Nodejs
- C#
- MySQL
- PostgreSQL
- MongoDB

<br />

## **Other skills**
- Git
- Object-Oriented Programming
- Agile
- UX/UI

`

export default function AppAbout() {

    return (
        <>
            <MarkdownRender markdownText={md} title="About Kevin" />
        </>
    );
}