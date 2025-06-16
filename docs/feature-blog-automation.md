# Blog Data Automation Solution

## Problem Statement

When authors publish content through the Decap CMS admin interface, Markdown files are pushed to the GitHub repository, but the `blog-data.json` file that Vue.js uses to display posts is not automatically updated. This creates a disconnect between content creation and content display.

## Solution Overview

This solution implements multiple automated approaches to ensure `blog-data.json` is always up-to-date:

1. **GitHub Actions Workflow** - Automatic regeneration on content changes
2. **Local Webhook Server** - Development and testing support
3. **Enhanced Build Process** - Integrated data generation
4. **Testing Tools** - Validation and debugging utilities

## 🚀 Quick Start

### For Content Authors

1. **Publish content through Decap CMS** as usual
2. **Wait 1-2 minutes** for GitHub Actions to process the changes
3. **Verify your content appears** on the live site

That's it! The automation handles everything else.

### For Developers

```bash
# Test the blog data generation
npm run test-blog-data

# Generate blog data manually
npm run generate-blog-data

# Start local webhook server for development
npm run webhook:dev

# Trigger webhook manually
curl -X POST http://localhost:3001/webhook/regenerate
```

## 📁 Files Added/Modified

### New Files

- `.github/workflows/update-blog-data.yml` - Auto-update workflow
- `.github/workflows/build-and-deploy.yml` - Build and deploy workflow
- `scripts/webhook-handler.js` - Local webhook server
- `scripts/test-blog-data.js` - Testing and validation tool
- `docs/WEBHOOK_SETUP.md` - Detailed setup documentation
- `README_BLOG_AUTOMATION.md` - This file

### Modified Files

- `scripts/generate-blog-data.js` - Fixed output path
- `package.json` - Added new scripts

## 🔄 How It Works

### 1. GitHub Actions Workflow

**Trigger:** When Markdown files in `src/data/posts/`, `src/data/authors/`, or `src/data/categories/` are modified.

**Process:**
1. Checkout repository
2. Install dependencies
3. Process frontmatter
4. Generate blog data
5. Run build hooks
6. Generate RSS and sitemap
7. Commit changes back to repository

**Result:** `blog-data.json` is automatically updated and committed.

### 2. Local Development Workflow

**For immediate testing during development:**

```bash
# Start webhook server
npm run webhook:dev

# In another terminal, trigger regeneration
curl -X POST http://localhost:3001/webhook/regenerate

# Or test the generation process
npm run test-blog-data
```

### 3. Build Integration

**The blog data generation is integrated into the build process:**

```bash
# Full build (includes blog data generation)
npm run build

# Development with data processing
npm run dev
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run generate-blog-data` | Generate blog-data.json from Markdown files |
| `npm run test-blog-data` | Test and validate blog data generation |
| `npm run webhook` | Start webhook server (production) |
| `npm run webhook:dev` | Start webhook server (development) |
| `npm run process-frontmatter` | Process frontmatter for all posts |
| `npm run validate-frontmatter` | Validate frontmatter syntax |
| `npm run build-hooks` | Run all build hooks |

## 📊 Monitoring and Debugging

### Check GitHub Actions

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Look for "Update Blog Data" workflows
4. Check logs for any errors

### Test Locally

```bash
# Run comprehensive test
npm run test-blog-data

# Check current blog data
cat src/blog-data.json | head -20

# Validate Markdown files
npm run validate-frontmatter

# Test webhook server
curl http://localhost:3001/health
```

### Common Issues and Solutions

#### Issue: Blog data not updating after publish

**Solution:**
1. Check GitHub Actions logs
2. Verify workflow permissions
3. Test generation manually: `npm run generate-blog-data`

#### Issue: Webhook server not responding

**Solution:**
1. Check if port 3001 is available
2. Verify webhook secret
3. Test with: `curl http://localhost:3001/health`

#### Issue: Build errors

**Solution:**
1. Check Node.js version (requires 18+)
2. Verify dependencies: `npm ci`
3. Check Markdown syntax: `npm run validate-frontmatter`

## 🔧 Configuration

### Environment Variables

```bash
# Webhook server configuration
WEBHOOK_PORT=3001
WEBHOOK_SECRET=your-secure-secret

# GitHub Actions (automatically set)
GITHUB_TOKEN=automatically-provided
```

### Customization

**To modify the blog data generation:**

Edit `scripts/generate-blog-data.js`:

```javascript
// Configuration section
const POSTS_DIRECTORY = path.join(process.cwd(), 'src/data/posts');
const OUTPUT_FILE = path.join(process.cwd(), 'src/blog-data.json');
const DEFAULT_AUTHOR = {
  name: 'DGPond',
  image: '/assets/img/avatar.png',
  link: '/about'
};
```

**To modify workflow triggers:**

Edit `.github/workflows/update-blog-data.yml`:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'src/data/posts/**/*.md'
      - 'src/data/authors/**/*.md'
      - 'src/data/categories/**/*.md'
```

## 📈 Performance

### Typical Processing Times

- **Local generation:** 1-3 seconds
- **GitHub Actions:** 30-60 seconds
- **Webhook response:** 2-5 seconds

### Optimization Tips

1. **Use specific file paths** in GitHub Actions triggers
2. **Cache dependencies** in workflows
3. **Monitor workflow execution** times
4. **Optimize Markdown file sizes**

## 🔒 Security

### GitHub Actions

- Uses built-in `GITHUB_TOKEN` with repository scope
- Runs in isolated environment
- Only triggers on specified file changes

### Webhook Server

- Supports webhook secrets for authentication
- CORS headers for cross-origin requests
- Input validation and error handling

### Best Practices

1. **Set webhook secrets** in production
2. **Monitor workflow logs** regularly
3. **Validate input data** before processing
4. **Use HTTPS** for webhook endpoints

## 🚀 Deployment

### GitHub Pages

The solution works seamlessly with GitHub Pages:

1. **Content is published** via Decap CMS
2. **GitHub Actions regenerates** blog data
3. **Build workflow deploys** to GitHub Pages
4. **Site updates automatically**

### Other Hosting Platforms

For other platforms (Netlify, Vercel, etc.):

1. **Configure build command:** `npm run build`
2. **Set up webhooks** to trigger builds
3. **Monitor build logs** for issues

## 📚 Additional Resources

- [Detailed Webhook Setup](docs/WEBHOOK_SETUP.md)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vue.js Documentation](https://vuejs.org/)

## 🤝 Contributing

To improve this solution:

1. **Test thoroughly** with your content
2. **Monitor performance** and optimize
3. **Report issues** with detailed logs
4. **Suggest enhancements** based on usage

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Review GitHub Actions logs**
3. **Test individual scripts** manually
4. **Verify file permissions** and paths

---

**Status:** ✅ **Active and Working**

**Last Updated:** January 2025

**Compatibility:** Node.js 18+, Vue 3, Vite, GitHub Actions