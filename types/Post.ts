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
  excerpt: string;
  contentHtml: string;
  image?: string;
  toc?: any;
}

export interface PostData {
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
  excerpt: string;
  contentHtml: string;
  image?: string;
  toc?: any;
}
