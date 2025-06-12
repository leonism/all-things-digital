import { ref } from 'vue';

function useCloudinary() {
  const imageUrl = ref('');

  const getImageUrl = async (publicId) => {
    // Replace with your actual Cloudinary API call
    imageUrl.value = `https://res.cloudinary.com/your-cloudinary-cloud-name/image/upload/${publicId}`;
  };

  return {
    imageUrl,
    getImageUrl,
  };
}

export { useCloudinary };
export default useCloudinary;
