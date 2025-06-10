# 👋 All Things Digital - A Tailwind Theme

## Table of Contents

- [Build Status](#-build-status)
- [Video](#-video)
- [Descriptions](#-descriptions)
- [Mock-up & Visualization](#-mock-up--visualization)
- [Features](#-features)
- [Cloudinary Integration](#-cloudinary-integration)
- [Todos](#-todos)
- [How To](#-how-to)
- [Credits](#-credits)
- [Versions](#-versions)
- [Splash Screen](#-splash-screen)
- [License](#-license)

## ✅ Build Status

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://docs.github.com/en/pages/getting-started-with-github-pages)
[![Netlify Status](https://api.netlify.com/api/v1/badges/747bd292-bddb-48a9-a63e-08c1ff154ffc/deploy-status)](https://app.netlify.com/sites/all-things-digital/deploys)
[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange?logo=cloudflare)](https://developers.cloudflare.com/pages/get-started/)

## 🎥 Video

https://user-images.githubusercontent.com/8904/207529944-a7fdb698-551c-4a3b-8561-7d85b1c9aaf9.mp4

## 🎊 Descriptions

Introducing our newest CSS theme: `All Things Digital`, a simple, minimalistic and responsive multiple-page layout, built on top of the latest Tailwind (4.1.6) technology. `All Things Digital` shipped with Dark Mode and Mobile First Focus! This theme is designed to provide a sleek and modern look for your website or blogs, with a focus on accessibility and easy customization.

The dark mode feature allows users to switch to a darker color scheme for a more comfortable viewing experience, particularly at night or in low light environments. And with a mobile first focus, this theme is optimized for mobile devices, ensuring that your website looks great on any screen size.

Tailwind CSS is a utility-first CSS framework, which means that it provides a set of low-level utility classes that make it easy to style your website without writing complex CSS code. This allows you to quickly and easily customize the look and feel of your website to match your brand and aesthetic.

In addition to the sleek dark mode and mobile first focus, our Tailwind CSS theme also includes powerful plugins for typography and forms. The typography plugin allows you to easily add beautiful and highly customizable headings, paragraphs, and other text elements to your website. And the forms plugin makes it easy to create clean and user-friendly forms for gathering information from your visitors.

Together, these plugins provide a complete solution for styling your website's content and gathering information from your users. They're built to work seamlessly with the rest of the theme, so you can easily create a professional and cohesive look for your website.

Whether you're a seasoned web developer or a beginner, this theme is sure to provide a professional and modern look for your website. Try it out today!

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/leonism/all-things-digital?file=README.md)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/s/github.com/leonism/all-things-digital/)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/leonism/All-things-digital)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/leonism/All-things-digital)

## 📷 Mock-up & Visualization

![Alt text](/all-things-digital.png?raw=true)

## 🚀 Features

- ✅ **Responsive mobile-friendly design**
- ✅ **Using the latest Tailwind 3.2.4**
- ✅ **Tested on various devices with different viewports**
- ✅ **Dark Mode**
- ✅ **Contact Form**
- ✅ **Utilize Tailwind Plugins (Typography & Form)**
- ✅ **Cloudinary Integration for Optimized Image Delivery**
- ✅ **Automatic Image Optimization (WebP/AVIF, Quality, Compression)**
- ✅ **Responsive Image Generation with CDN Delivery**
- ✅ **Vue Composables for Seamless Image Management**

## ☁️ Cloudinary Integration

This project includes a comprehensive Cloudinary integration for optimized image delivery, automatic format conversion, and responsive image generation. The integration provides significant performance improvements through CDN delivery and intelligent image optimization.

### Key Features

- **Automatic Optimization**: Auto-converts to WebP/AVIF when supported
- **Intelligent Quality**: Smart quality adjustment based on content
- **Responsive Images**: Multiple sizes for different devices and viewports
- **CDN Delivery**: Global content delivery network for faster loading
- **Vue Integration**: Seamless integration with Vue components through composables
- **Fallback Support**: Automatic fallback to original URLs when needed

### Prerequisites

1. **Cloudinary Account**: Sign up for a free account at [cloudinary.com](https://cloudinary.com)
2. **Node.js**: Ensure you have Node.js installed for running the upload script

### Quick Setup

#### 1. Configure Environment Variables

Create a `.env` file in your project root:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 2. Upload Images to Cloudinary

Run the upload script to migrate your existing images:

```bash
node scripts/upload-to-cloudinary.js
```

This script will:
- Upload all images from `src/assets/img/` to Cloudinary
- Generate optimized public IDs based on file paths
- Create a mapping file at `src/data/cloudinary-mapping.json`
- Organize images in folders (e.g., `blog/`, `icons/`)

#### 3. Update Your Content

Update your Markdown files and blog data to use Cloudinary public IDs:

**Before:**
```yaml
featuredImage:
  src: "/assets/img/featured-blog.jpg"
```

**After:**
```yaml
featuredImage:
  src: "blog/featured-blog"
```

### Usage in Components

The integration provides Vue composables for easy image optimization:

```vue
<template>
  <img :src="optimizedImageUrl" alt="Optimized image" />
</template>

<script setup>
import { useCloudinary } from '@/composables/useCloudinary'

const props = defineProps(['imageSrc'])
const imageCloudinary = useCloudinary(computed(() => props.imageSrc))

const optimizedImageUrl = computed(() => {
  return imageCloudinary.responsive(800, 600, {
    c: 'fill',
    g: 'auto'
  })
})
</script>
```

### Available Utilities

The integration includes several utility functions in `src/utils/cloudinary.js`:

- `getOptimizedImageUrl()`: Basic optimization with auto format/quality
- `getResponsiveImageUrl()`: Responsive images with specific dimensions
- `getThumbnailUrl()`: Small thumbnails for avatars
- `getHeroImageUrl()`: Large hero images for headers
- `getResponsiveSrcSet()`: Multiple sizes for responsive images

### Performance Benefits

- **CDN Delivery**: Global content delivery network for faster loading
- **Format Optimization**: Automatic WebP/AVIF conversion when supported
- **Quality Adjustment**: Intelligent quality optimization
- **Bandwidth Reduction**: Significantly reduced bandwidth usage
- **Lazy Loading**: Built-in lazy loading support
- **Aggressive Caching**: Optimized caching for faster subsequent loads

### Transformation Options

- **Smart Cropping**: Automatic cropping with face detection
- **Responsive Sizing**: Maintain aspect ratio or fill dimensions
- **Visual Effects**: Blur, sharpen, brightness, contrast adjustments
- **Overlays**: Text, image, or logo overlays
- **Custom Transformations**: Extensive transformation API support

### Migration Checklist

- [ ] Set up Cloudinary account and get credentials
- [ ] Configure environment variables in `.env` file
- [ ] Run the upload script to migrate images
- [ ] Update Markdown frontmatter to use public IDs
- [ ] Update `blog-data.json` with new image references
- [ ] Test image loading across different pages
- [ ] Verify responsive behavior on various devices
- [ ] Check mobile performance and loading times
- [ ] Update any remaining hardcoded image paths

### Troubleshooting

**Common Issues:**
1. **Images not loading**: Verify public IDs match uploaded images
2. **Upload failures**: Check environment variables are correct
3. **Build errors**: Ensure all imports are properly configured

**Debugging:**
Enable debug mode by adding to your `.env`:
```env
CLOUDINARY_DEBUG=true
```

**Fallback Behavior:**
The system automatically falls back to original URLs if Cloudinary is unavailable or public IDs are not found.

### Best Practices

1. **Naming Convention**: Use descriptive public IDs (e.g., `blog/post-title-hero`)
2. **Folder Organization**: Group images by type (`blog/`, `icons/`, `avatars/`)
3. **Alt Text**: Always provide meaningful alt text for accessibility
4. **Responsive Images**: Use appropriate sizes for different viewports
5. **Lazy Loading**: Enable lazy loading for better performance

For detailed documentation, refer to the [Cloudinary documentation](https://cloudinary.com/documentation) and check the generated `cloudinary-mapping.json` file for image mappings.

## 😏 Todos

- ❎ **More Pages Design**
- ❎ **Multi-language i18n**

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

### 3. Watch and build Tailwind CSS

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

## 💻 Splash Screen

![Alt text](/all-things-digital-splash.png?raw=true)

## 🖊️ License

Distributed under the MIT License - December 2022
