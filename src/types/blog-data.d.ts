import type { PostData } from './Post';

declare module '*.json' {
  const value: PostData[];
  export default value;
}
