import { ref } from 'vue';

function useCloudinary() {
  const imageUrl = ref('');
  const cloudName = 'du61t1sey'; // Replace with your actual cloud name
  const getImageUrl = async (publicId) => {
    // Replace with your actual Cloudinary API call
    imageUrl.value = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  };

  // Generate optimized avatar with face detection and cropping
  const getAvatarUrl = (imageSrc, size = 48) => {
    if (!imageSrc) return '';

    // If it's already a Cloudinary URL, extract the public ID and transform
    if (imageSrc.includes('cloudinary.com')) {
      const publicIdMatch = imageSrc.match(
        /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/,
      );
      if (publicIdMatch) {
        const publicId = publicIdMatch[1];
        return `https://res.cloudinary.com/${cloudName}/image/upload/c_thumb,g_face,h_${size},w_${size},r_max,f_auto,q_auto/${publicId}`;
      }
    }

    // For non-Cloudinary URLs, return original (or implement fetch and upload logic)
    return imageSrc;
  };

  // Generate responsive image with custom transformations
  const getResponsiveUrl = (
    imageSrc,
    width = 400,
    height = 250,
    options = {},
  ) => {
    if (!imageSrc) return '';

    const {
      crop = 'fill',
      gravity = 'auto',
      quality = 'auto',
      format = 'auto',
    } = options;

    // If it's already a Cloudinary URL, extract the public ID and transform
    if (imageSrc.includes('cloudinary.com')) {
      const publicIdMatch = imageSrc.match(
        /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/,
      );
      if (publicIdMatch) {
        const publicId = publicIdMatch[1];
        return `https://res.cloudinary.com/${cloudName}/image/upload/c_${crop},g_${gravity},h_${height},w_${width},f_${format},q_${quality}/${publicId}`;
      }
    }

    // For non-Cloudinary URLs, return original (or implement fetch and upload logic)
    return imageSrc;
  };

  return {
    imageUrl,
    getImageUrl,
    getAvatarUrl,
    getResponsiveUrl,
  };
}

export { useCloudinary };
export default useCloudinary;
