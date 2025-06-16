# Cloudinary Integration with Decap CMS

This guide explains how to use the integrated Cloudinary media library with the Decap CMS web admin interface.

## Overview

The integration allows you to:
- Upload images to Cloudinary using Node.js scripts
- Access uploaded images directly in the Decap CMS media gallery
- Use Cloudinary's optimized URLs and transformations
- Maintain a mapping between local paths and Cloudinary URLs

## Setup Requirements

### 1. Environment Variables

Create a `.env` file in the project root with your Cloudinary credentials:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Dependencies

Ensure you have the required dependencies installed:

```bash
npm install cloudinary @cloudinary/url-gen
```

## Usage Workflow

### Step 1: Upload Images to Cloudinary

Use the upload script to upload images from your local `src/assets/images` directory:

```bash
node scripts/upload-to-cloudinary.js
```

This script will:
- Upload all images from `src/assets/images/` to Cloudinary
- Generate optimized URLs and transformations
- Create/update `src/data/cloudinary-mapping.json` with the mapping data
- Preserve folder structure in Cloudinary

### Step 2: Start the Mapping Server

Start the local server that serves the cloudinary mapping data:

```bash
node scripts/serve-cloudinary-mapping.js
```

This server:
- Runs on port 3002 by default
- Serves the cloudinary-mapping.json file via HTTP
- Enables CORS for the admin interface
- Watches for file changes and reloads automatically

### Step 3: Access Images in Web Admin

1. Open the Decap CMS admin interface: `http://localhost:3000/admin/`
2. Navigate to any content type (blog posts, pages, etc.)
3. Click on an image field
4. In the media library, you'll see:
   - **Cloudinary Images**: Images uploaded via the script
   - **Local Images**: Traditional file uploads

## File Structure

```
project-root/
├── src/
│   ├── assets/images/          # Source images for upload
│   └── data/
│       └── cloudinary-mapping.json  # Generated mapping file
├── public/
│   └── admin/
│       ├── config.yml          # Decap CMS configuration
│       ├── index.html          # Admin interface
│       └── cloudinary-media-extension.js  # Custom extension
├── scripts/
│   ├── upload-to-cloudinary.js        # Upload script
│   └── serve-cloudinary-mapping.js    # Mapping server
└── docs/
    └── cloudinary-integration-guide.md  # This guide
```

## Configuration Files

### Decap CMS Configuration (`public/admin/config.yml`)

```yaml
media_library:
  name: cloudinary
  config:
    cloud_name: du61t1sey
    api_key: your_api_key_here
```

### Admin Interface (`public/admin/index.html`)

Includes:
- Decap CMS core scripts
- Cloudinary media library plugin
- Custom cloudinary mapping extension
- Initialization scripts

## Cloudinary Mapping Structure

The `cloudinary-mapping.json` file contains:

```json
{
  "blogs/featured-blog-comp.jpg": {
    "public_id": "blogs/featured-blog-comp",
    "version": 1234567890,
    "signature": "abc123...",
    "width": 1200,
    "height": 800,
    "format": "jpg",
    "resource_type": "image",
    "created_at": "2024-01-01T00:00:00Z",
    "tags": [],
    "bytes": 123456,
    "type": "upload",
    "etag": "def456...",
    "placeholder": false,
    "url": "https://res.cloudinary.com/du61t1sey/image/upload/v1234567890/blogs/featured-blog-comp.jpg",
    "secure_url": "https://res.cloudinary.com/du61t1sey/image/upload/v1234567890/blogs/featured-blog-comp.jpg",
    "responsive_urls": {
      "w_400": "https://res.cloudinary.com/du61t1sey/image/upload/w_400/v1234567890/blogs/featured-blog-comp.jpg",
      "w_800": "https://res.cloudinary.com/du61t1sey/image/upload/w_800/v1234567890/blogs/featured-blog-comp.jpg",
      "w_1200": "https://res.cloudinary.com/du61t1sey/image/upload/w_1200/v1234567890/blogs/featured-blog-comp.jpg"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Images not showing in admin**
   - Ensure the mapping server is running: `node scripts/serve-cloudinary-mapping.js`
   - Check browser console for fetch errors
   - Verify CORS settings

2. **Upload script fails**
   - Check `.env` file has correct Cloudinary credentials
   - Ensure images exist in `src/assets/images/`
   - Check network connectivity

3. **Mapping file not found**
   - Run the upload script first: `node scripts/upload-to-cloudinary.js`
   - Check file permissions
   - Verify file path: `src/data/cloudinary-mapping.json`

### Debug Commands

```bash
# Check mapping server health
curl http://localhost:3002/api/health

# View current mapping data
curl http://localhost:3002/api/cloudinary-mapping

# Test upload script
node scripts/upload-to-cloudinary.js --verbose
```

## Advanced Configuration

### Custom Port for Mapping Server

```bash
CLOUDINARY_MAPPING_PORT=3003 node scripts/serve-cloudinary-mapping.js
```

### Image Transformations

The upload script automatically generates responsive URLs:
- `w_400`: Small screens/thumbnails
- `w_800`: Medium screens
- `w_1200`: Large screens/desktop

Customize transformations in `upload-to-cloudinary.js`:

```javascript
const responsiveUrls = {
  w_300: cloudinary.url(public_id, { width: 300, crop: 'scale' }),
  w_600: cloudinary.url(public_id, { width: 600, crop: 'scale' }),
  w_900: cloudinary.url(public_id, { width: 900, crop: 'scale' }),
  w_1200: cloudinary.url(public_id, { width: 1200, crop: 'scale' })
};
```

### Security Considerations

- API keys in `config.yml` are publicly visible (this is normal for Cloudinary)
- API secret should only be in `.env` file (never commit to git)
- Use Cloudinary's upload presets for additional security
- Consider implementing signed uploads for production

## Integration Benefits

1. **Performance**: Cloudinary's global CDN and automatic optimization
2. **Responsive Images**: Automatic generation of multiple sizes
3. **Transformations**: On-the-fly image processing
4. **Storage**: Offload image storage from your hosting
5. **Workflow**: Seamless integration with existing CMS workflow

## Next Steps

- Set up automatic image optimization
- Configure upload presets in Cloudinary dashboard
- Implement automatic alt text generation
- Add image SEO optimization
- Set up webhook notifications for uploads

---

**Need Help?**

Check the console logs in both the terminal (mapping server) and browser (admin interface) for detailed error messages and debugging information.