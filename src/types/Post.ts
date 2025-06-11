export interface Post {
  slug: string;
  title: string;
  seoTitle: string;
  date: string;
  lastModified: string;
  author: {
    name: string;
    role: string;
    image: string;
    link?: string;
  };
  category: string;
  tags: string[];
  featuredImage: {
    src: string;
    alt: string;
    caption: string;
  };
  content: string;
  excerpt?: string;
  description?: string;
  status?: string;
  contentHtml: string;
  toc?: any;
}
