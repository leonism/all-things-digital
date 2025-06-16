# Webhook Setup for Automatic Blog Data Updates

This document explains how to set up automatic blog data regeneration when content is published through Decap CMS.

## Problem Solved

When authors publish content through the Decap CMS admin interface, the Markdown files are pushed to the GitHub repository, but the `blog-data.json` file that Vue.js uses to display posts is not automatically updated. This webhook system solves that problem by providing multiple ways to trigger blog data regeneration.

## Solutions Implemented

### 1. GitHub Actions Workflow (Automatic)

**File:** `.github/workflows/update-blog-data.yml`

This workflow automatically triggers when:
- Markdown files in `src/data/posts/` are modified
- Author or category files are updated
- Manual trigger via GitHub Actions UI

**What it does:**
- Processes frontmatter for new posts
- Regenerates `blog-data.json`
- Updates RSS feed and sitemap
- Commits changes back to the repository

**Setup:** No additional setup required - works automatically once files are in place.

### 2. Local Webhook Server (Development)

**File:** `scripts/webhook-handler.js`

A local webhook server that can be triggered manually or by external services.

**Usage:**
```bash
# Start the webhook server
npm run webhook

# Start with custom secret (development)
npm run webhook:dev

# Trigger regeneration
curl -X POST http://localhost:3001/webhook/regenerate

# Health check
curl http://localhost:3001/health
```

**Configuration:**
- Port: `3001` (configurable via `WEBHOOK_PORT` env var)
- Secret: Set via `WEBHOOK_SECRET` env var for security

### 3. Build Process Integration

The blog data generation is integrated into the build process:

```bash
# Full build (includes blog data generation)
npm run build

# Generate blog data only
npm run generate-blog-data

# Process frontmatter only
npm run process-frontmatter
```

## Decap CMS Integration

### Option A: GitHub Actions (Recommended)

No additional configuration needed. When authors publish content through Decap CMS:
1. Content is committed to GitHub
2. GitHub Actions detects the change
3. Blog data is automatically regenerated
4. Changes are committed back to the repository
5. Site rebuilds with updated content

### Option B: Webhook Integration

For immediate updates during development:

1. Start the webhook server:
   ```bash
   npm run webhook:dev
   ```

2. Configure Decap CMS to call the webhook (if supported by your hosting):
   ```yaml
   # In public/admin/config.yml
   backend:
     name: github
     repo: your-username/your-repo
     branch: main
     # Add webhook configuration if supported
     webhook_url: http://localhost:3001/webhook/regenerate
   ```

3. Manually trigger after publishing:
   ```bash
   curl -X POST http://localhost:3001/webhook/regenerate
   ```

## Security Considerations

### Webhook Secret

Always set a webhook secret in production:

```bash
# Set environment variable
export WEBHOOK_SECRET="your-secure-random-string"

# Or in .env file
WEBHOOK_SECRET=your-secure-random-string
```

### GitHub Actions

The GitHub Actions workflow uses the built-in `GITHUB_TOKEN` which has appropriate permissions for the repository.

## Monitoring and Debugging

### Check Workflow Status

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Look for "Update Blog Data" workflows
4. Check logs for any errors

### Webhook Server Logs

The webhook server provides detailed logging:

```bash
# Start with verbose logging
DEBUG=* npm run webhook:dev
```

### Manual Testing

```bash
# Test blog data generation
npm run generate-blog-data

# Test frontmatter processing
npm run process-frontmatter

# Test full build
npm run build
```

## Troubleshooting

### Common Issues

1. **Blog data not updating after publish**
   - Check GitHub Actions logs
   - Verify file paths in workflow
   - Ensure proper permissions

2. **Webhook server not responding**
   - Check if port 3001 is available
   - Verify webhook secret
   - Check firewall settings

3. **Build errors**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check for syntax errors in Markdown files

### Debug Commands

```bash
# Check current blog data
cat src/data/blog-data.json | jq .

# Validate Markdown files
npm run validate-frontmatter

# Dry run frontmatter processing
npm run process-frontmatter:dry-run

# Check webhook server health
curl http://localhost:3001/health
```

## File Structure

```
.
├── .github/workflows/
│   ├── update-blog-data.yml    # Auto-update workflow
│   └── build-and-deploy.yml    # Build and deploy workflow
├── scripts/
│   ├── webhook-handler.js      # Local webhook server
│   ├── generate-blog-data.js   # Blog data generator
│   └── process-frontmatter.js  # Frontmatter processor
├── src/data/
│   ├── posts/                  # Blog posts (Markdown)
│   ├── authors/                # Author profiles
│   ├── categories/             # Category definitions
│   └── blog-data.json          # Generated blog data
└── docs/
    └── WEBHOOK_SETUP.md        # This file
```

## Next Steps

1. **Test the setup:**
   - Create a test post through Decap CMS
   - Verify GitHub Actions triggers
   - Check that `blog-data.json` updates

2. **Monitor performance:**
   - Watch GitHub Actions execution times
   - Monitor webhook response times
   - Check for any failed builds

3. **Optimize if needed:**
   - Adjust workflow triggers
   - Optimize build scripts
   - Add caching strategies

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Test individual scripts manually
4. Check for recent changes to dependencies