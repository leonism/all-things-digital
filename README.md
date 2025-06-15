# 👋 All Things Digital - A Tailwind Theme

## Table of Contents

- [Build Status](#-build-status)
- [Video](#-video)
- [Descriptions](#-descriptions)
- [Mock-up & Visualization](#-mock-up--visualization)
- [Features](#-features)
- [Advanced Search System](#-advanced-search-system)
- [Cloudinary Integration](#-cloudinary-integration)
- [Decap CMS Integration](#-decap-cms-integration)
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

## 🔍 Advanced Search System

The application features a comprehensive search system that provides instant, intelligent search capabilities across all blog content with Algolia-like performance and user experience.

### 🎯 Core Search Features

#### **Instant Search**

- Real-time search results as you type
- Debounced input for optimal performance
- Sub-100ms search response times
- No page refreshes or loading states

#### **Intelligent Scoring Algorithm**

Our search uses a sophisticated scoring system that prioritizes results based on:

- **Title matches** (highest priority - 100 points for exact start match, 80 for partial)
- **Exact tag matches** (90 points)
- **Category matches** (70 points)
- **Content/excerpt matches** (40 points)
- **Author matches** (30 points)
- **Fuzzy similarity matching** using Levenshtein distance algorithm

#### **Advanced Text Processing**

- **Fuzzy matching** with configurable similarity threshold (60% default)
- **Smart highlighting** of matching terms in results
- **Intelligent snippet extraction** showing relevant content context
- **Case-insensitive search** with special character handling

### 🎨 User Interface Features

#### **Enhanced Search Modal**

- Beautiful, responsive modal design with backdrop blur
- Keyboard navigation support (↑/↓ arrows, Enter, ESC, Tab)
- Mobile-optimized interface with touch-friendly controls
- Real-time search statistics display
- Recent searches history with localStorage persistence

#### **Search Results Display**

- **Highlighted matching text** with customizable styling
- **Categorized results** with grouping options
- **Rich result cards** showing title, excerpt, category, tags, and author
- **Search statistics** showing total results and search time
- **Category filtering** for refined search results

#### **Smart Suggestions**

- **Dynamic suggestions** based on available content
- **Category suggestions** from existing blog categories
- **Tag suggestions** from all available tags
- **Author suggestions** from content creators
- **Recent searches** for quick access to previous queries

### 🔧 Technical Implementation

#### **Search Composable (`useSearch.js`)**

The search functionality is built using Vue 3 Composition API with the following capabilities:

```javascript
// Core search features
const {
  searchQuery, // Reactive search input
  searchResults, // Filtered and scored results
  isSearching, // Loading state
  searchStats, // Performance metrics
  groupedResults, // Results grouped by category
  searchSuggestions, // Dynamic suggestions
  recentSearches, // Search history

  // Methods
  performSearch, // Execute search with scoring
  clearSearch, // Reset search state
  navigateResults, // Keyboard navigation
  selectResult, // Select highlighted result
  addToRecentSearches, // Manage search history
} = useSearch();
```

#### **Search Components**

- **`EnhancedSearchModal.vue`** - Main search interface with modal overlay
- **`SearchInput.vue`** - Reusable search input component
- **`SearchModal.vue`** - Basic search modal implementation
- **`SearchResultItem.vue`** - Individual result card component
- **`SearchStats.vue`** - Search statistics and filtering
- **`SearchSuggestions.vue`** - Dynamic suggestion display

### ⚡ Performance Optimizations

#### **Efficient Algorithms**

- **Levenshtein distance** calculation for fuzzy matching
- **Optimized scoring** with early termination for irrelevant content
- **Result limiting** (50 results max) to prevent UI lag
- **Debounced search** to reduce unnecessary computations

#### **Memory Management**

- **Computed properties** for reactive result grouping
- **Efficient filtering** without data duplication
- **localStorage integration** for persistent recent searches
- **Minimal DOM updates** with Vue's reactivity system

### 🎛️ Configuration Options

```javascript
const searchConfig = {
  minQueryLength: 1, // Minimum characters to trigger search
  maxResults: 50, // Maximum results to display
  fuzzyThreshold: 0.6, // Similarity threshold (0-1)
  highlightPreTag: '<mark class="bg-yellow-200">', // Highlight styling
  highlightPostTag: '</mark>',
};
```

### 📱 Responsive Design

- **Mobile-first approach** with touch-optimized controls
- **Adaptive modal sizing** for different screen sizes
- **Keyboard shortcuts** for desktop users
- **Accessible design** with proper ARIA labels and roles
- **Dark mode support** with automatic theme detection

### 🔍 Search Capabilities

The search system can find content across:

- **Blog post titles** with exact and partial matching
- **Post categories** for topic-based filtering
- **Tags and keywords** for detailed content discovery
- **Author names** for creator-based searches
- **Post excerpts and descriptions** for content-based queries
- **Full content** (when available) for comprehensive search

### 🚀 Usage Examples

#### **Basic Search Integration**

```vue
<template>
  <EnhancedSearchModal
    v-model:show="showSearch"
    @result-selected="handleResultSelection"
  />
</template>

<script setup>
import { ref } from 'vue';
import EnhancedSearchModal from '@/components/search/EnhancedSearchModal.vue';

const showSearch = ref(false);

function handleResultSelection(result) {
  // Navigate to selected post
  router.push(`/blog/${result.slug}`);
}
</script>
```

#### **Custom Search Implementation**

```vue
<script setup>
import { useSearch } from '@/composables/useSearch';

const { searchQuery, searchResults, searchStats, performSearch } = useSearch();

// Trigger search
performSearch('vue.js');

// Access results
console.log(
  `Found ${searchStats.value.total} results in ${searchStats.value.time}ms`,
);
</script>
```

### 🎯 Future Enhancements

- **Search analytics** and usage tracking
- **Advanced filters** (date range, reading time, etc.)
- **Search result caching** for improved performance
- **Typo tolerance** and auto-correction
- **Search shortcuts** and saved searches
- **Full-text search** integration with external services

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
  src: '/assets/img/featured-blog.jpg'
```

**After:**

```yaml
featuredImage:
  src: 'blog/featured-blog'
```

### Usage in Components

The integration provides Vue composables for easy image optimization:

```vue
<template>
  <img :src="optimizedImageUrl" alt="Optimized image" />
</template>

<script setup>
import { useCloudinary } from '@/composables/useCloudinary';

const props = defineProps(['imageSrc']);
const imageCloudinary = useCloudinary(computed(() => props.imageSrc));

const optimizedImageUrl = computed(() => {
  return imageCloudinary.responsive(800, 600, {
    c: 'fill',
    g: 'auto',
  });
});
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

## 📝 Decap CMS Integration

This project includes comprehensive Decap CMS integration for content management, allowing you to create, edit, and manage blog posts through a user-friendly admin interface. The integration supports both Netlify and Cloudflare Pages deployments with different authentication strategies.

### 🌟 Key Features

- **Git-based Workflow**: All content changes are committed directly to your repository
- **Rich Text Editor**: WYSIWYG editor with markdown support
- **Media Management**: Upload and manage images through the CMS interface
- **Preview Mode**: Live preview of content before publishing
- **Multi-format Support**: Supports markdown files with frontmatter
- **Responsive Admin Interface**: Works seamlessly on desktop and mobile devices
- **Version Control**: Full version history through Git integration

### 🚀 Quick Setup

#### Prerequisites

1. **Git Repository**: Your project must be in a Git repository (GitHub, GitLab, or Bitbucket)
2. **Node.js**: Ensure you have Node.js installed for running build scripts
3. **Deployment Platform**: Either Netlify or Cloudflare Pages account

#### 1. Install Decap CMS

```bash
npm install decap-cms-app gray-matter
```

2. Create Admin Interface
   The admin interface files are already included in this project:

- public/admin/index.html - Admin interface entry point
- public/admin/config.yml - CMS configuration file 3. Update Build Scripts
  Ensure your package.json includes the blog data generation:

3. Update Build Scripts
   Ensure your package.json includes the blog data generation:

```json
{
  "scripts": {
    "build": "npm run generate:blog-data && vite build",
    "generate:blog-data": "node scripts/generate-blog-data.js"
  }
}
```

### 🌐 Deployment Options Option A: Netlify Deployment

Advantages:

- Built-in Netlify Identity for authentication
- Seamless integration with Git providers
- Automatic SSL and custom domains
- Built-in form handling
  Setup Steps:

1. Configure CMS for Netlify
   Update public/admin/config.yml :

```yaml
backend:
  name: git-gateway
  branch: main # or master

media_folder: 'src/assets/img/uploads'
public_folder: '/assets/img/uploads'

# Enable Netlify Identity
identity:
  url: https://your-site.netlify.app/.netlify/identity

collections:
  - name: 'blog'
    label: 'Blog Posts'
    folder: 'src/data/posts'
    create: true
    slug: '{{slug}}'
    fields:
      - { label: 'Title', name: 'title', widget: 'string' }
      - { label: 'SEO Title', name: 'seoTitle', widget: 'string' }
      - { label: 'Slug', name: 'slug', widget: 'string' }
      - { label: 'Publish Date', name: 'date', widget: 'datetime' }
      - { label: 'Last Modified', name: 'lastModified', widget: 'datetime' }
      - label: 'Author'
        name: 'author'
        widget: 'object'
        fields:
          - { label: 'Name', name: 'name', widget: 'string' }
          - { label: 'Role', name: 'role', widget: 'string' }
          - { label: 'Image', name: 'image', widget: 'image' }
      - {
          label: 'Category',
          name: 'category',
          widget: 'select',
          options: ['Technology', 'Lifestyle', 'Travel', 'Health', 'Finance'],
        }
      - { label: 'Tags', name: 'tags', widget: 'list' }
      - label: 'Featured Image'
        name: 'featuredImage'
        widget: 'object'
        fields:
          - { label: 'Source', name: 'src', widget: 'image' }
          - { label: 'Alt Text', name: 'alt', widget: 'string' }
          - {
              label: 'Caption',
              name: 'caption',
              widget: 'string',
              required: false,
            }
      - { label: 'Excerpt', name: 'excerpt', widget: 'text' }
      - { label: 'Reading Time', name: 'readingTime', widget: 'string' }
      - {
          label: 'Status',
          name: 'status',
          widget: 'select',
          options: ['draft', 'published'],
        }
      - {
          label: 'Featured',
          name: 'featured',
          widget: 'boolean',
          default: false,
        }
      - {
          label: 'Priority',
          name: 'priority',
          widget: 'select',
          options: ['low', 'medium', 'high'],
        }
      - { label: 'Body', name: 'body', widget: 'markdown' }
```

2. Enable Netlify Identity

- Go to your Netlify site dashboard
- Navigate to Identity tab
- Click Enable Identity
- Under Registration preferences , select "Invite only" or "Open"
- Under External providers , enable GitHub, Google, or other providers as needed

3. Configure Git Gateway

- In Netlify Identity settings, go to Services
- Enable Git Gateway
- This allows the CMS to commit directly to your repository

4. Deploy and Access

- Deploy your site to Netlify
- Access the CMS at: https://your-site.netlify.app/admin/
- Create your first user account through Netlify Identity Option B: Cloudflare Pages Deployment
  Advantages:

- Free tier with generous limits
- Excellent global CDN performance
- Direct Git integration
- No vendor lock-in
  Setup Steps:

1. Configure CMS for Cloudflare Pages
   Update `public/admin/config.yml` :

```yaml
backend:
  name: github # or gitlab/bitbucket
  repo: your-username/your-repo-name
  branch: main # or master
  base_url: https://api.github.com
  auth_endpoint: auth

media_folder: 'src/assets/img/uploads'
public_folder: '/assets/img/uploads'

# Same collections configuration as above
collections:
  # ... same as Netlify configuration
```

2. Create GitHub OAuth App

- Go to GitHub Settings → Developer settings → OAuth Apps
- Click New OAuth App
- Fill in the details:
  - Application name : Your site name
  - Homepage URL : https://your-site.pages.dev
  - Authorization callback URL : https://your-site.pages.dev/admin/
- Note the Client ID and Client Secret

3. Configure Cloudflare Pages Environment Variables

- Go to your Cloudflare Pages dashboard
- Navigate to your project → Settings → Environment variables
- Add the following variables:
  - GITHUB_CLIENT_ID : Your GitHub OAuth app client ID
  - GITHUB_CLIENT_SECRET : Your GitHub OAuth app client secret

4. Set Build Configuration

- Build command : npm run build
- Build output directory : dist
- Node.js version : 18 or 20

5. Deploy and Access

- Deploy your site to Cloudflare Pages
- Access the CMS at: https://your-site.pages.dev/admin/
- Authenticate using your GitHub account

### 📁 Content Structure

The CMS manages content in the following structure:

```text
src/data/posts/
├── post-1.md
├── post-2.md
└── ...

src/assets/img/uploads/
├── featured-image-1.jpg
├── author-avatar.png
└── ...
```

Trae

26 context(s) used

Great question! If you're deploying to Cloudflare Pages instead of Netlify, there are some important differences and additional steps for Decap CMS integration:

## Key Differences for Cloudflare Pages

### 1. Authentication Provider

Since Cloudflare Pages doesn't have a built-in identity service like Netlify Identity, you'll need to use an external Git provider for authentication:

Update your public/admin/config.yml :

```
backend:
  name: github # or gitlab/bitbucket
  repo: your-username/your-repo-name
  branch: main # or master
  base_url: https://api.github.com # for 
  GitHub
  auth_endpoint: auth

media_folder: "src/assets/img/uploads"
public_folder: "/assets/img/uploads"

# ... rest of your collections config
```

### 2. OAuth App Setup

You'll need to create an OAuth app with your Git provider:

For GitHub:

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - Application name : Your site name
   - Homepage URL : https://your-site.pages.dev
   - Authorization callback URL : https://your-site.pages.dev/admin/
3. Note the Client ID and Client Secret

### 3. Cloudflare Pages Environment Variables

Add these environment variables in your Cloudflare Pages dashboard:

```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_s
ecret
```

### 4. Build Configuration

Update your Cloudflare Pages build settings:

Build command:

```
npm run build
```

Build output directory:

```
dist
```

Environment variables:

- Node.js version: 18 or 20

### 5. Additional Steps A. Install Decap CMS

````
npm install decap-cms-app
``` B. Update your build script in package.json :
````

{
  "scripts": {
    "build": "npm run 
    generate:blog-data && vite build",
    "generate:blog-data": "node scripts/
    generate-blog-data.js"
  }
}

```C. Create a serverless function for OAuth (optional)
If you want more control, you can create a Cloudflare Worker for OAuth handling, but the direct Git provider method above is simpler.

### 6. Deploy Process
1. Push your code to your Git repository
2. Connect your repository to Cloudflare Pages
3. Set the build configuration as mentioned above
4. Add the environment variables
5. Deploy!
### 7. Access the CMS
Once deployed, access your CMS at:

```

https://your-site.pages.dev/admin/

```
## Advantages of Cloudflare Pages + Decap CMS
- Free tier : Generous limits
- Global CDN : Excellent performance
- Git-based workflow : Direct integration with your repository
- No vendor lock-in : Standard Git workflow
## Important Notes
- Make sure your repository is public or you have proper access permissions
- The OAuth app callback URL must match your Cloudflare Pages domain exactly
- Test the authentication flow after deployment
The main difference is the authentication setup - everything else in the Decap CMS integration remains the same!

Gerry Leo Nugroho

Copy

Delete

update README.md with your latest progress on the decap cms integration, with ways on how to implement them, both on netlify and cloudflare pages

Workspace

Trae

26 context(s) used

Workspace

package.json 1-41

package.json 40-64

main.css 1-47

tailwind.config.js 1-17

README.md 456-475

... More ( 20 +)

I need to view the current README.md file to understand its structure and then update it with comprehensive information about Decap CMS integration for both Netlify and Cloudflare Pages deployments.

README.md :( 2 - 200 )

I need to see the rest of the README.md file to understand the complete structure and find the best place to add the Decap CMS integration section.

README.md :( 201 - 496 )

I'll update the README.md file to include comprehensive documentation about Decap CMS integration for both Netlify and Cloudflare Pages deployments. I'll add this as a new major section after the Cloudinary Integration section.

```

# 👋 All Things Digital - A Tailwind 
Theme

## Table of Contents

- [Build Status](#-build-status)
- [Video](#-video)
- [Descriptions](#-descriptions)
- [Mock-up & Visualization]
(#-mock-up--visualization)
- [Features](#-features)
- [Advanced Search System]
(#-advanced-search-system)
- [Cloudinary Integration]
(#-cloudinary-integration)
- [Decap CMS Integration]
(#-decap-cms-integration)
- [Todos](#-todos)
- [How To](#-how-to)
- [Credits](#-credits)
- [Versions](#-versions)
- [Splash Screen](#-splash-screen)
- [License](#-license)

// ... existing content ...

## 📝 Decap CMS Integration

This project includes comprehensive 
Decap CMS integration for content 
management, allowing you to create, 
edit, and manage blog posts through a 
user-friendly admin interface. The 
integration supports both Netlify and 
Cloudflare Pages deployments with 
different authentication strategies.

### 🌟 Key Features

- **Git-based Workflow**: All content 
changes are committed directly to your 
repository
- **Rich Text Editor**: WYSIWYG editor 
with markdown support
- **Media Management**: Upload and 
manage images through the CMS interface
- **Preview Mode**: Live preview of 
content before publishing
- **Multi-format Support**: Supports 
markdown files with frontmatter
- **Responsive Admin Interface**: Works 
seamlessly on desktop and mobile devices
- **Version Control**: Full version 
history through Git integration

### 🚀 Quick Setup

#### Prerequisites

1. **Git Repository**: Your project must 
be in a Git repository (GitHub, GitLab, 
or Bitbucket)
2. **Node.js**: Ensure you have Node.js 
installed for running build scripts
3. **Deployment Platform**: Either 
Netlify or Cloudflare Pages account

#### 1. Install Decap CMS

````bash
npm install decap-cms-app gray-matter
``` 2. Create Admin Interface
The admin interface files are already included in this project:

- public/admin/index.html - Admin interface entry point
- public/admin/config.yml - CMS configuration file 3. Update Build Scripts
Ensure your package.json includes the blog data generation:

````

{
  "scripts": {
    "build": "npm run 
    generate:blog-data && vite build",
    "generate:blog-data": "node scripts/
    generate-blog-data.js"
  }
}

```
### 🌐 Deployment Options Option A: Netlify Deployment
Advantages:

- Built-in Netlify Identity for authentication
- Seamless integration with Git providers
- Automatic SSL and custom domains
- Built-in form handling
Setup Steps:

1. Configure CMS for Netlify
Update public/admin/config.yml :

```

backend:
  name: git-gateway
  branch: main # or master

media_folder: "src/assets/img/uploads"
public_folder: "/assets/img/uploads"

# Enable Netlify Identity
identity:
  url: https://your-site.netlify.app/.
  netlify/identity

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "src/data/posts"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", 
      widget: "string" }
      - { label: "SEO Title", name: 
      "seoTitle", widget: "string" }
      - { label: "Slug", name: "slug", 
      widget: "string" }
      - { label: "Publish Date", name: 
      "date", widget: "datetime" }
      - { label: "Last Modified", name: 
      "lastModified", widget: 
      "datetime" }
      - label: "Author"
        name: "author"
        widget: "object"
        fields:
          - { label: "Name", name: 
          "name", widget: "string" }
          - { label: "Role", name: 
          "role", widget: "string" }
          - { label: "Image", name: 
          "image", widget: "image" }
      - { label: "Category", name: 
      "category", widget: "select", 
      options: ["Technology", 
      "Lifestyle", "Travel", "Health", 
      "Finance"] }
      - { label: "Tags", name: "tags", 
      widget: "list" }
      - label: "Featured Image"
        name: "featuredImage"
        widget: "object"
        fields:
          - { label: "Source", name: 
          "src", widget: "image" }
          - { label: "Alt Text", name: 
          "alt", widget: "string" }
          - { label: "Caption", name: 
          "caption", widget: "string", 
          required: false }
      - { label: "Excerpt", name: 
      "excerpt", widget: "text" }
      - { label: "Reading Time", name: 
      "readingTime", widget: "string" }
      - { label: "Status", name: 
      "status", widget: "select", 
      options: ["draft", "published"] }
      - { label: "Featured", name: 
      "featured", widget: "boolean", 
      default: false }
      - { label: "Priority", name: 
      "priority", widget: "select", 
      options: ["low", "medium", 
      "high"] }
      - { label: "Body", name: "body", 
      widget: "markdown" }

```
2. Enable Netlify Identity
- Go to your Netlify site dashboard
- Navigate to Identity tab
- Click Enable Identity
- Under Registration preferences , select "Invite only" or "Open"
- Under External providers , enable GitHub, Google, or other providers as needed
3. Configure Git Gateway
- In Netlify Identity settings, go to Services
- Enable Git Gateway
- This allows the CMS to commit directly to your repository
4. Deploy and Access
- Deploy your site to Netlify
- Access the CMS at: https://your-site.netlify.app/admin/
- Create your first user account through Netlify Identity Option B: Cloudflare Pages Deployment
Advantages:

- Free tier with generous limits
- Excellent global CDN performance
- Direct Git integration
- No vendor lock-in
Setup Steps:

1. Configure CMS for Cloudflare Pages
Update public/admin/config.yml :

```

backend:
  name: github # or gitlab/bitbucket
  repo: your-username/your-repo-name
  branch: main # or master
  base_url: https://api.github.com
  auth_endpoint: auth

media_folder: "src/assets/img/uploads"
public_folder: "/assets/img/uploads"

# Same collections configuration as above
collections:
  # ... same as Netlify configuration

````
2. Create GitHub OAuth App
- Go to GitHub Settings → Developer settings → OAuth Apps
- Click New OAuth App
- Fill in the details:
  - Application name : Your site name
  - Homepage URL : https://your-site.pages.dev
  - Authorization callback URL : https://your-site.pages.dev/admin/
- Note the Client ID and Client Secret
3. Configure Cloudflare Pages Environment Variables
- Go to your Cloudflare Pages dashboard
- Navigate to your project → Settings → Environment variables
- Add the following variables:
  - GITHUB_CLIENT_ID : Your GitHub OAuth app client ID
  - GITHUB_CLIENT_SECRET : Your GitHub OAuth app client secret
4. Set Build Configuration
- Build command : npm run build
- Build output directory : dist
- Node.js version : 18 or 20
5. Deploy and Access
- Deploy your site to Cloudflare Pages
- Access the CMS at: https://your-site.pages.dev/admin/
- Authenticate using your GitHub account
### 📁 Content Structure
The CMS manages content in the following structure:

```text
src/data/posts/
├── post-1.md
├── post-2.md
└── ...

src/assets/img/uploads/
├── featured-image-1.jpg
├── author-avatar.png
└── ...
````

### 🔄 Content Workflow

1. Create Content : Use the CMS admin interface to create new blog posts
2. Edit Content : Modify existing posts through the rich text editor
3. Preview : Use the preview feature to see how content will look
4. Publish : Save changes to commit directly to your Git repository
5. Deploy : Your hosting platform automatically rebuilds and deploys

### 🛠️ Advanced Configuration Custom Collections

Add additional content types by extending the collections in config.yml :

```yaml
collections:
  - name: 'pages'
    label: 'Pages'
    folder: 'src/data/pages'
    create: true
    fields:
      - { label: 'Title', name: 'title', widget: 'string' }
      - { label: 'Body', name: 'body', widget: 'markdown' }

  - name: 'settings'
    label: 'Site Settings'
    files:
      - label: 'Site Configuration'
        name: 'site'
        file: 'src/data/site.json'
        fields:
          - { label: 'Site Title', name: 'title', widget: 'string' }
          - { label: 'Description', name: 'description', widget: 'text' }
          - { label: 'URL', name: 'url', widget: 'string' }
```

#### Media Library Configuration

Configure media handling for different deployment scenarios:

```yaml
# For Cloudinary integration
media_library:
  name: cloudinary
  config:
    cloud_name: your_cloud_name
    api_key: your_api_key

# For local media management
media_folder: 'src/assets/img/uploads'
public_folder: '/assets/img/uploads'
```

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
