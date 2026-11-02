# scholar-static

ScholarStatic is a lightning-fast academic portfolio template: a static HTML, Tailwind CSS and vanilla JavaScript site whose
content is JSON edited with a local Keystatic editor. This file is the canonical instruction file for AI coding agents
working on this repository.

## Product

- Purpose: a backend-free academic portfolio that anyone can copy ("Use this template") and fill in.
- Intended users: students and researchers who want an English and Japanese portfolio on Cloudflare Pages or GitHub Pages.
- Core user journey: copy the template, edit the content with Keystatic (`npm run editor`), preview it (`npm start`), deploy.
- Out of scope: backends, frontend frameworks, personal data of any real person (this repository is public).

## Technical context

- Stack: static HTML, compiled Tailwind CSS (`css/style.css`), vanilla JavaScript; Keystatic on Astro with the Cloudflare adapter in `editor/`.
- Runtime and package manager: Node (version in `.nvmrc`), npm.
- Architecture:
  - `index.html`: the page shell; every section is injected by JavaScript.
  - `js/main.js`: data loading, the `RENDERERS` table, the rendering engine, UI behaviours (menu, theme, language, modal, filters).
  - `css/`: Tailwind input and compiled output.
  - `editor/keystatic.config.tsx`: the content schema; `editor/public/data/{en,ja}/*.json`: the content.
  - `scripts/inject-seo.mjs`: a build step that writes the English SEO tags into the deployed `index.html`.
  - `assets/`: images and PDFs.
- Content is read at runtime from `editor/public/data/` on localhost and from `data/` when deployed (the build copies it).
- Constraints:
  - English and Japanese stay in step: a key added to the schema needs sample data in both languages.
  - UI text lives in `uiText`, never hard-coded, and the site keeps working with data that lacks newer keys.
  - Behaviour must not depend on the text of a title; use the layout `id`.
  - `ogUrl` in `seo.json` is the site's absolute URL: `og:url` and `og:image` need it.

## Downstream sites

Sites created from this template keep their own repositories. A change to code shared with the template (`index.html`, `js/`, `css/`,
`tailwind.config.js`, `editor/keystatic.config.tsx`) is made here first and then reflected downstream.

## Commands

- Install: `npm install --prefix editor` (editor only)
- Develop: `npm run editor` (http://localhost:4321/keystatic); `npm start` (preview on http://localhost:3000)
- Format, lint, type-check, test: none configured; check the rendered site instead
- Build: `npm run build` (output in `editor/dist`; it also runs `node scripts/inject-seo.mjs`)

## Definition of done

- The requested behaviour is complete, in English and Japanese.
- The rendered site is inspected at desktop and phone widths with the console free of errors.
- Data without newer keys still renders as before.
- Documentation matches what was delivered.
