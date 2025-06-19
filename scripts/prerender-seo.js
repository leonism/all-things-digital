#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://all-things-digital.pages.dev';
const POSTS_DIR = path.join(__dirname, '../src/data/posts');
const DIST_DIR = path.join(__dirname, '../dist');
const BLOG_DIST_DIR = path.join(DIST_DIR, 'blog');

/**
 * Generate SEO-optimized HTML for blog posts
 */
function generateBlogPostHTML(post, content) {
  const {
    title,
    seoTitle,
    excerpt,
    author,
    datePublished,
    dateModified,
    featuredImage,
    category,
    tags,
    slug,
    canonicalUrl,
    seo,
  } = post;

  const pageTitle = seoTitle || title;
  const pageDescription = seo?.description || excerpt;
  const pageUrl = `${SITE_URL}/blog/${slug}`;
  const imageUrl = featuredImage?.src || `${SITE_URL}/assets/img/og-image.jpg`;
  const publishedDate = new Date(datePublished).toISOString();
  const modifiedDate = dateModified
    ? new Date(dateModified).toISOString()
    : publishedDate;

  // Generate structured data for the article
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: pageDescription,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: author?.name || 'All Things Digital',
      url: author?.link ? `${SITE_URL}${author.link}` : SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'All Things Digital',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/img/logo.png`,
      },
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    articleSection: category,
    keywords: tags?.join(', ') || '',
  };

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-WNR3LJBQ');</script>
    <!-- End Google Tag Manager -->
    
    <meta charset="UTF-8" />
    <link rel="icon" href="/assets/img/icons/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta Tags -->
    <title>${pageTitle}</title>
    <meta name="title" content="${pageTitle}" />
    <meta name="description" content="${pageDescription}" />
    <meta name="keywords" content="${tags?.join(', ') || ''}" />
    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />
    <meta name="author" content="${author?.name || 'All Things Digital'}" />

    <!-- Article Meta Tags -->
    <meta name="article:published_time" content="${publishedDate}" />
    <meta name="article:modified_time" content="${modifiedDate}" />
    <meta name="article:author" content="${author?.name || 'All Things Digital'}" />
    <meta name="article:section" content="${category}" />
    ${tags?.map((tag) => `<meta name="article:tag" content="${tag}" />`).join('\n    ') || ''}

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${pageDescription}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:site_name" content="All Things Digital" />
    <meta property="og:locale" content="en_US" />
    <meta property="article:published_time" content="${publishedDate}" />
    <meta property="article:modified_time" content="${modifiedDate}" />
    <meta property="article:author" content="${author?.name || 'All Things Digital'}" />
    <meta property="article:section" content="${category}" />
    ${tags?.map((tag) => `<meta property="article:tag" content="${tag}" />`).join('\n    ') || ''}

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${pageUrl}" />
    <meta property="twitter:title" content="${pageTitle}" />
    <meta property="twitter:description" content="${pageDescription}" />
    <meta property="twitter:image" content="${imageUrl}" />

    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl || pageUrl}" />

    <!-- Additional SEO Meta Tags -->
    <meta name="theme-color" content="#1f2937" />
    <meta name="msapplication-TileColor" content="#1f2937" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>

    <!-- Preload critical resources -->
    <link rel="preload" href="/main.js" as="script" />
    <link rel="preload" href="/assets/styles/main.css" as="style" />
  </head>
  <body class="bg-gray-100 dark:bg-main">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WNR3LJBQ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    
    <!-- SEO Content for Crawlers -->
    <noscript>
      <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1>${title}</h1>
        <p><strong>Published:</strong> ${new Date(datePublished).toLocaleDateString()}</p>
        <p><strong>Author:</strong> ${author?.name || 'All Things Digital'}</p>
        <p><strong>Category:</strong> ${category}</p>
        ${featuredImage?.src ? `<img src="${featuredImage.src}" alt="${featuredImage.alt || title}" style="max-width: 100%; height: auto;" />` : ''}
        <p>${pageDescription}</p>
        <div>${content}</div>
      </div>
    </noscript>

    <div id="app"></div>
    <script type="module" src="/main.js"></script>
  </body>
</html>`;
}

/**
 * Process all blog posts and generate prerendered HTML
 */
async function prerenderBlogPosts() {
  try {
    console.log('🚀 Starting blog post prerendering...');

    // Ensure blog directory exists
    if (!fs.existsSync(BLOG_DIST_DIR)) {
      fs.mkdirSync(BLOG_DIST_DIR, { recursive: true });
    }

    // Read all markdown files
    const files = fs
      .readdirSync(POSTS_DIR)
      .filter((file) => file.endsWith('.md'));

    console.log(`📝 Found ${files.length} blog posts to prerender`);

    for (const file of files) {
      const filePath = path.join(POSTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);

      // Skip unpublished posts
      if (frontmatter.status !== 'published') {
        console.log(`⏭️  Skipping unpublished post: ${frontmatter.slug}`);
        continue;
      }

      // Generate HTML
      const html = generateBlogPostHTML(frontmatter, content);

      // Create directory for the post
      const postDir = path.join(BLOG_DIST_DIR, frontmatter.slug);
      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }

      // Write HTML file
      const htmlPath = path.join(postDir, 'index.html');
      fs.writeFileSync(htmlPath, html);

      console.log(`✅ Generated: /blog/${frontmatter.slug}/`);
    }

    console.log('🎉 Blog post prerendering completed!');
  } catch (error) {
    console.error('❌ Error during prerendering:', error);
    process.exit(1);
  }
}

// Run the prerendering
if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderBlogPosts();
}

export { prerenderBlogPosts };
