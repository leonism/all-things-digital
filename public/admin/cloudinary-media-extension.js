// Cloudinary Media Library Extension for Decap CMS
class CloudinaryMappingMediaLibrary {
  constructor() {
    this.name = 'cloudinary-mapping';
    this.cloudinaryMapping = {};
    this.loadCloudinaryMapping();
  }

  async loadCloudinaryMapping() {
    const endpoints = [
      'http://localhost:3002/api/cloudinary-mapping',
      '/cloudinary-mapping.json',
      './cloudinary-mapping.json'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to fetch cloudinary mapping from ${endpoint}`);
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        this.cloudinaryMapping = await response.json();
        console.log(`✅ Successfully loaded cloudinary mapping from ${endpoint}`);
        console.log(`Found ${Object.keys(this.cloudinaryMapping).length} images`);
        return;
        
      } catch (error) {
        console.warn(`Error fetching from ${endpoint}:`, error.message);
        continue;
      }
    }
    
    console.error('All cloudinary mapping endpoints failed');
    console.log('💡 Make sure to run: node scripts/serve-cloudinary-mapping.js');
    this.cloudinaryMapping = {};
  }

  // Convert cloudinary mapping to media library format
  formatCloudinaryData() {
    const images = [];
    
    for (const [filename, data] of Object.entries(this.cloudinaryMapping)) {
      if (data && data.secure_url) {
        images.push({
          id: data.public_id || filename,
          name: filename,
          displayURL: data.secure_url,
          path: data.secure_url,
          size: data.bytes || 0,
          url: data.secure_url,
          urlType: 'upload'
        });
      }
    }
    
    return images;
  }

  // Create and show modal with images
  showImageModal(images, callback) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    `;

    const title = document.createElement('h2');
    title.textContent = `Cloudinary Images (${images.length})`;
    title.style.margin = '0';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
    `;
    closeBtn.onclick = () => document.body.removeChild(overlay);

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create image grid
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
      max-height: 60vh;
      overflow-y: auto;
    `;

    images.forEach(image => {
      const imageContainer = document.createElement('div');
      imageContainer.style.cssText = `
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        transition: border-color 0.2s;
        text-align: center;
        padding: 10px;
      `;
      imageContainer.onmouseover = () => imageContainer.style.borderColor = '#007cba';
      imageContainer.onmouseout = () => imageContainer.style.borderColor = 'transparent';
      imageContainer.onclick = () => {
        callback({ url: image.url });
        document.body.removeChild(overlay);
      };

      const img = document.createElement('img');
      img.src = image.displayURL;
      img.alt = image.name;
      img.style.cssText = `
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 5px;
      `;

      const name = document.createElement('div');
      name.textContent = image.name;
      name.style.cssText = `
        font-size: 12px;
        color: #666;
        word-break: break-word;
      `;

      imageContainer.appendChild(img);
      imageContainer.appendChild(name);
      grid.appendChild(imageContainer);
    });

    modal.appendChild(header);
    modal.appendChild(grid);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };
  }

  // Media library interface methods
  show({ callback }) {
    console.log('Cloudinary mapping media library show() called');
    
    if (Object.keys(this.cloudinaryMapping).length === 0) {
      console.warn('No cloudinary mapping data available');
      alert('No Cloudinary images available. Make sure the mapping server is running.');
      return;
    }

    const images = this.formatCloudinaryData();
    console.log(`Showing ${images.length} images from cloudinary mapping`);
    
    this.showImageModal(images, callback);
  }

  enableStandalone() {
    return false;
  }
}

// Initialize and register the media library
function initCloudinaryMappingLibrary() {
  try {
    console.log('Initializing Cloudinary mapping media library...');
    
    const cloudinaryMappingLib = new CloudinaryMappingMediaLibrary();
    
    // Wait for CMS to be available
    if (typeof window.CMS !== 'undefined') {
      window.CMS.registerMediaLibrary(cloudinaryMappingLib);
      console.log('✅ Cloudinary mapping media library registered');
    } else {
      console.log('CMS not yet available, waiting...');
      // Wait for CMS to load
      const checkCMS = setInterval(() => {
        if (typeof window.CMS !== 'undefined') {
          clearInterval(checkCMS);
          window.CMS.registerMediaLibrary(cloudinaryMappingLib);
          console.log('✅ Cloudinary mapping media library registered (delayed)');
        }
      }, 100);
    }
    
    // Also make it available globally for debugging
    window.cloudinaryMappingLib = cloudinaryMappingLib;
    
  } catch (error) {
    console.error('❌ Failed to register Cloudinary mapping media library:', error);
  }
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCloudinaryMappingLibrary);
} else {
  initCloudinaryMappingLibrary();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CloudinaryMappingMediaLibrary;
}