<div align="center">
  <h1>All Things Digital</h1>
  <h2>
    A modern, sleek and responsive, TailwindCSS, Vue.js & Vite.js Based Theme
  </h2>

  ![Node.js](https://img.shields.io/badge/Node.js-20.5.7-339933?logo=node.js&logoColor=white)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![Vue+Vite](https://img.shields.io/badge/Modern_Stack-Vue.js_3_+_Vite-42B883?logo=vue.js&logoColor=white)](https://vitejs.dev/)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript&logoColor=white)
  ![ts-node](https://img.shields.io/badge/ts--node-10.9.1-3178C6?logo=typescript&logoColor=white)

  <!-- Additional new badges below -->
  [![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare_Pages-F38020?style=flat&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
  [![Vercel](https://img.shields.io/badge/Preview-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
  [![Dark Mode](https://img.shields.io/badge/Dark_Mode-Enabled-000000?style=flat)](#)
  ![A modern, sleek and responsive, TailwindCSS, Vue.js & Vite.js Based Theme](/docs/all-things-digital-splash.png?raw=true)
</div>

## Table of Contents

- [Quick Deploy](#-quick-deploy)
- [Video](#-video)
- [Descriptions](#-descriptions)
- [Mock-up & Visualization](#-mock-up-visualization)
- [Features](#-features)
- [How To](#-how-to)
- [Credits](#-credits)
- [Versions](#-versions)
- [License](#-license)

## ✅ Quick Deploy

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/leonism/all-things-digital?file=README.md)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/s/github.com/leonism/all-things-digital/)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/leonism/All-things-digital)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/leonism/All-things-digital)

## 🎥 Video

https://user-images.githubusercontent.com/8904/207529944-a7fdb698-551c-4a3b-8561-7d85b1c9aaf9.mp4

## 🎊 Descriptions

### Elevate Your Digital Presence with All Things Digital

Introducing **All Things Digital**, a cutting-edge, minimalistic, and responsive multi-page layout theme, engineered for the modern web. Built atop the blazing-fast **Vue.js** framework, and powered by **Vite.js** for an unparalleled development experience, this theme is more than just a fresh coat of paint. It's a complete ecosystem designed for peak performance and effortless content management. We've embraced a **mobile-first** philosophy and integrated a stunning **Dark Mode** to ensure a comfortable and visually appealing experience for all your users, day or night.

### Streamlined Content and Powerful Search

**All Things Digital** goes beyond aesthetics, offering a robust foundation for your content strategy. We've integrated **Decap CMS**, allowing for intuitive content creation and management directly through **Markdown**, simplifying your workflow. Say goodbye to cumbersome image optimization – our seamless **Cloudinary API integration** handles all your media assets, delivering them efficiently across all devices. Plus, with a **built-in Algolia advanced search** feature, your users can find exactly what they're looking for in an instant, enhancing their overall experience and keeping them engaged with your site.

### Unmatched Flexibility and Customization

Leveraging the power of **Tailwind CSS (4.1.6)**, **All Things Digital** provides unparalleled flexibility for customization without ever writing complex CSS. This utility-first framework, combined with specialized plugins for typography and forms, empowers you to effortlessly craft a unique look and feel that perfectly aligns with your brand. Whether you're a seasoned developer or just starting, this theme provides a professional, modern, and highly customizable solution for building an exceptional digital presence. Explore **All Things Digital** today and transform your website!

## 📷 Mock-up & Visualization

![Alt text](/docs/all-things-digital.png?raw=true)

## 🚀 Features

- ✅ **Using the latest Vue.js, Vite.js and Tailwind CSS**
- ✅ **Utilize Tailwind Plugins (Typography, Form & Dark Mode)**
- ✅ **Cloudinary Integration for Optimized Image Delivery**
- ✅ **Decap CMS Integration for Optimized Content Management**
- ✅ **Automatic Image Optimization (WebP/AVIF Quality, Compression)**
- ✅ **Responsive Image Generation with CDN Delivery**
- ✅ **Vue Composables for Seamless Image Management**
- ✅ **Responsive, tested on various devices with different viewports**
- ✅ **Contact Form**

## 🤓 How To

### 1. Install dependencies

Install all required packages for development:

```bash
npm install
```

### 2. Start the development server

This project uses Vite for fast development and hot module replacement. To start the Vite dev server, run:

```bash
npm run dev
```

This will serve your project locally and watch for changes in your source files.

### 3. Watch and build the Project

To continuously compile your Tailwind CSS as you work, open a separate terminal and run:

```bash
npm run watch
```

This command uses Tailwind CLI to watch ./src/main.css and output the compiled CSS to ./dist/style.css whenever you make changes.

### 4. Build for production

When you're ready to build your site for production, run:

```bash
npm run build
```

This will generate an optimized build of your site using Vite.

### 5. Preview the production build

To locally preview your production build (after running npm run build):

```bash
npm run preview
```

### 6. Serve the built site with Live Server

If you want to serve the static `dist/` folder using Live Server (helpful for static hosting or testing):

```bash
npm start
```

### 7. Compress CSS for production

To generate a minified CSS file for production, run:

```bash
npm run compress
```

**Customization**: You can edit the scripts in `package.json` and the `tailwind.config.js` file to change input/output locations or tweak build commands as needed for your workflow.

Summary of scripts:

- `dev` : Start Vite development server.
- `build` : Build the site for production.
- `preview` : Preview the production build locally.
- `watch` : Watch and compile Tailwind CSS during development.
- `compress` : Minify Tailwind CSS for production.
- `start` : Serve the dist folder with Live Server.
- `standardize-frontmatter` : Standardize frontmatter field order across all posts.
- `process-frontmatter` : Process and enhance frontmatter in markdown files.
- `generate-blog-data` : Generate blog data JSON from markdown files.

## 🔗 Credits

- [Tailwind Framework](https://tailwindcss.com/docs/installation/)
- [Figma Design](https://www.figma.com/community/file/1185498137271900053)
- [Hero Icons](https://heroicons.com/)
- [VS Code Editor](https://code.visualstudio.com/)
- [Jeff Sum](https://jeffsum.com/)

## 🧬 Versions

- [all-things-digital @ github pages](https://leonism.github.io/all-things-digital/dist/index.html)
- [all-things-digital @ vercel](https://all-things-digital.vercel.app/)
- [all-things-digital @ netlify](https://all-things-digital.netlify.app/)
- [all-things-digital @ cloudflare](https://all-things-digital.pages.dev)
- [all-things-digital @ render](https://all-things-digital.onrender.com)

## 🖊️ License

Distributed under the MIT License - December 2022
