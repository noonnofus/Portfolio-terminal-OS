'use client';

import MarkdownRender from "./layout/MarkdownRender";

const md = `
## **About site**

This is Kevin Portfolio site.

<br />

## **Source Code**

Available on github:

[https://github.com/BCITKevin/Portfolio-terminal-OS](https://github.com/BCITKevin/Portfolio-terminal-OS) <ExternalLinkIcon />

<br />

## **Tech Stack & Libraries**

- typescript
- reactJS
- nextJS
- vercel
- xtermjs
- chakra-ui
- framer-motion

<br />

## **Icons**

[Flaticon](https://www.flaticon.com/) by [mattbadal](https://www.flaticon.com/authors/mattbadal), [Freepik](https://www.flaticon.com/authors/freepik), [Ilham Fitrotul Hayat](https://www.flaticon.com/authors/ilham-fitrotul-hayat), 

<br />

## **Background**

[4kwallpapers](https://4kwallpapers.com/abstract/macos-sonoma-11573.html)


`

export default function AppAboutSite() {

    return (
        <>
            <MarkdownRender markdownText={md} title="About site" />
        </>
    );
}