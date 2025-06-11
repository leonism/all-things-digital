import { ComputedRef, Ref } from 'vue';
import { Cloudinary } from '@cloudinary/url-gen';

// Type definitions for Cloudinary transformation options
export interface CloudinaryOptions {
  [key: string]: any; // allow any transformation options
}

// Return type for useCloudinary composable
export interface UseCloudinaryReturn {
  isPublicId: ComputedRef<boolean>;
  optimizedUrl: ComputedRef<string>;
  thumbnail: ComputedRef<(size?: number, options?: CloudinaryOptions) => string>;
  responsive: ComputedRef<(width: number, height?: number | null, options?: CloudinaryOptions) => string>;
  hero: ComputedRef<(width?: number, height?: number, options?: CloudinaryOptions) => string>;
  cld: Cloudinary;
}

// Main composable function declaration
export declare function useCloudinary(src: string | Ref<string>): UseCloudinaryReturn;