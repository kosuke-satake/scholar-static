# ScholarStatic

A lightweight, blazing-fast academic portfolio powered by raw HTML/JS/CSS, fully manageable via a local Keystatic CMS.

## Features

- **No Backend:** The production website relies solely on static HTML, Javascript, CSS, and JSON. It requires no databases or Node.js servers to run.
- **Local CMS:** A powerful, user-friendly editor (Keystatic) allows you to update your profile, biography, projects, and publications effortlessly.
- **Multilingual Support:** Seamlessly switch between English and Japanese content.
- **Dark Mode:** Built-in dark mode based on Tailwind CSS.
- **Fully Responsive:** Beautifully designed to work on desktop, tablet, and mobile screens.

## Getting Started

### Prerequisites

Ensure you have Node.js installed. We recommend using `nvm` (Node Version Manager). This project is pinned to Node `v24.14.1`.

```bash
nvm use
npm install
```

### 1. Previewing the Live Site

To view the portfolio exactly as it will appear in production, run the local web server:

```bash
npm start
```
Your site will be available at `http://localhost:3000`.

### 2. Editing Content (The CMS)

To add new publications, edit your biography, or replace images, launch the local Keystatic CMS:

```bash
npm run editor
```
Open `http://localhost:4321/keystatic` in your browser. Any changes you save here will instantly update the JSON files located in `editor/public/data/`. 

### 3. Deploying

Because this project is entirely static, you can deploy it anywhere for free (GitHub Pages, Netlify, Cloudflare Pages, Vercel). 
You only need to upload the root directory. The `editor/` folder is only needed locally on your machine to manage content.

*Note: The `editor/public/data` directory MUST be deployed alongside your site, as `js/main.js` fetches its data from there.*

## Project Structure

- `index.html`: The main structural shell of the portfolio.
- `js/main.js`: The rendering engine that fetches JSON data and builds the page dynamically.
- `css/style.css`: The compiled Tailwind CSS file.
- `assets/`: Where your images (profile pictures, thumbnails) and demo slides are stored.
- `editor/`: The Astro + Keystatic local CMS application.
- `editor/public/data/`: Where the raw JSON content files are safely stored and managed by Keystatic.