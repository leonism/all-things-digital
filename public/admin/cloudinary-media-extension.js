/**
 * Cloudinary Media Library Extension for Decap CMS
 * 
 * This extension integrates the cloudinary-mapping.json file with Decap CMS
 * to make uploaded images available in the web admin media gallery.
 */

// Custom media library that reads from cloudinary-mapping.json
class CloudinaryMappingMediaLibrary {
  constructor() {
    this.name = 'cloudinary-mapping';
    this.cloudinaryMapping = null;
    this.loadCloudinaryMapping();
  }

  async loadCloudinaryMapping() {
    const endpoints = [
      'http://localhost:3002/api/cloudinary-mapping',
      'http://localhost:3002/cloudinary-mapping',
      '/src/data/cloudinary-mapping.json',
      '/data/cloudinary-mapping.json'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying to fetch cloudinary mapping from: ${endpoint}`);
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          console.warn(`Failed to fetch from ${endpoint}: ${response.status}`);
          continue;
        }
        
        this.cloudinaryMapping = await response.json();
        console.log(`Successfully loaded cloudinary mapping from ${endpoint}`);
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
  getMediaItems() {
    if (!this.cloudinaryMapping) {
      return [];
    }

    return Object.entries(this.cloudinaryMapping).map(([filename, data]) => {
      // Extract just the filename from the path
      const displayName = filename.split('/').pop();
      
      return {
        id: data.publicId,
        name: displayName,
        displayURL: data.secureUrl,
        path: filename,
        size: data.bytes,
        url: data.secureUrl,
        // Additional metadata
        width: data.width,
        height: data.height,
        format: data.format,
        // Cloudinary-specific data
        cloudinary: {
          publicId: data.originalPublicId,
          webpUrl: data.webpUrl,
          avifUrl: data.avifUrl,
          responsiveUrls: data.responsiveUrls,
          lastSync: data.lastSync
        }
      };
    });
  }

  // Media library interface methods
  show(options = {}) {
    return new Promise((resolve, reject) => {
      // Create a simple modal to display available images
      this.createMediaModal(resolve, reject, options);
    });
  }

  createMediaModal(resolve, reject, options) {
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
      width: 90%;
      max-width: 1000px;
      height: 80%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    header.innerHTML = `
      <h2 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Cloudinary Media Library</h2>
      <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
    `;

    // Create content area
    const content = document.createElement('div');
    content.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    `;

    // Create image grid
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    `;

    const mediaItems = this.getMediaItems();
    
    if (mediaItems.length === 0) {
      content.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <p>No images found in cloudinary-mapping.json</p>
          <p>Upload images using: <code>node scripts/upload-to-cloudinary.js</code></p>
        </div>
      `;
    } else {
      mediaItems.forEach(item => {
        const imageCard = document.createElement('div');
        imageCard.style.cssText = `
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s;
          background: #f9f9f9;
        `;
        
        imageCard.innerHTML = `
          <img src="${item.displayURL}" alt="${item.name}" style="
            width: 100%;
            height: 150px;
            object-fit: cover;
            display: block;
          ">
          <div style="padding: 12px;">
            <div style="font-weight: 500; margin-bottom: 4px; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${item.name}</div>
            <div style="font-size: 12px; color: #666;">${item.width} × ${item.height}</div>
            <div style="font-size: 12px; color: #666;">${(item.size / 1024).toFixed(1)} KB</div>
          </div>
        `;

        imageCard.addEventListener('click', () => {
          // Highlight selected image
          grid.querySelectorAll('div').forEach(card => {
            card.style.borderColor = 'transparent';
          });
          imageCard.style.borderColor = '#007acc';
          
          // Return the selected image
          resolve({
            url: item.url,
            path: item.path,
            name: item.name,
            size: item.size,
            // Include Cloudinary-specific data
            cloudinary: item.cloudinary
          });
          
          document.body.removeChild(overlay);
        });

        imageCard.addEventListener('mouseenter', () => {
          if (imageCard.style.borderColor !== 'rgb(0, 122, 204)') {
            imageCard.style.borderColor = '#ddd';
          }
        });

        imageCard.addEventListener('mouseleave', () => {
          if (imageCard.style.borderColor !== 'rgb(0, 122, 204)') {
            imageCard.style.borderColor = 'transparent';
          }
        });

        grid.appendChild(imageCard);
      });
      
      content.appendChild(grid);
    }

    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(content);
    overlay.appendChild(modal);

    // Close modal handlers
    const closeModal = () => {
      document.body.removeChild(overlay);
      reject(new Error('User cancelled'));
    };

    header.querySelector('#close-modal').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    // Add to DOM
    document.body.appendChild(overlay);
  }
}

// Register the custom media library when CMS is ready
if (window.CMS) {
  // Register immediately if CMS is already loaded
  registerCloudinaryMapping();
} else {
  // Wait for CMS to load
  window.addEventListener('load', () => {
    if (window.CMS) {
      registerCloudinaryMapping();
    }
  });
}

function registerCloudinaryMapping() {
  try {
    const cloudinaryMappingLib = new CloudinaryMappingMediaLibrary();
    
    // Register as an additional media library option
    if (window.CMS && window.CMS.registerMediaLibrary) {
      window.CMS.registerMediaLibrary(cloudinaryMappingLib);
      console.log('✅ Cloudinary mapping media library registered');
    }
    
    // Also make it available globally for debugging
    window.cloudinaryMappingLib = cloudinaryMappingLib;
    
  } catch (error) {
    console.error('❌ Failed to register Cloudinary mapping media library:', error);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CloudinaryMappingMediaLibrary;
}