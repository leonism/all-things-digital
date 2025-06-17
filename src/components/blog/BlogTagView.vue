<template>
  <section id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto" role="main">
    <h1 id="mainHeading"
      class="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mt-3 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 dark:from-indigo-400 dark:via-pink-400 dark:to-purple-500 animate-gradient-shift">
      Tag: #{{ tagName }}
    </h1>
    <div v-if=" allPosts.length " aria-label="Blog articles">
      <BlogArticleCard v-for=" post in allPosts " :key="post.slug" :imageSrc="post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'
        " :imageAlt="post.featuredImage?.alt || post.title" :title="post.title" :postLink="`/blog/${post.slug}`"
        :date="post.date" :excerpt="post.excerpt || post.description" :tags="post.tags"
        :authorImageSrc="post.author?.image || '/assets/img/avatar.png'"
        :authorImageAlt="post.author?.name || 'Author profile picture'" :authorLink="post.author?.link || '/about'"
        :authorName="post.author?.name || 'Unknown Author'" role="article" />
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No posts found with the tag "#{{ tagName }}".</p>
      <router-link to="/blog" class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block">Back to
        Blog List</router-link>
    </div>
    <div v-if=" !tagName " class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for=" tag in allTags " :key="String( tag )"
        class="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <router-link :to="`/blog/tag/${getTagSlug( tag )}`">
          #{{ tag }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Post } from '../../types/Post';
import { useRoute, useRouter } from 'vue-router';
import postsData from '../../blog-data.json';
import BlogArticleCard from '../home/BlogArticleCard.vue';
import { useListingSEO } from '@/composables/useSEO';
const posts = postsData as unknown as Post[];

const getTagSlug = ( name: string ): string =>
{
  return name.toLowerCase().replace( /\s+/g, '-' );
};

const route = useRoute();
const router = useRouter();
const tagName = ref(
  Array.isArray( route.params.tag ) ? route.params.tag[ 0 ] : route.params.tag,
);

const allPosts = ref<Post[]>( [] );

// SEO Meta Tags using composable
useListingSEO( {
  title: computed( () =>
  {
    return tagName.value ? `#${tagName.value} Posts` : 'Tag Archive';
  } ),
  description: computed( () =>
  {
    if ( tagName.value )
    {
      const count = allPosts.value.length;
      return `Discover ${count} posts tagged with #${tagName.value}. Explore related content and insights on ${tagName.value}.`;
    }
    return 'Browse posts by tags to find content that interests you.';
  } ),
  canonicalPath: computed( () =>
  {
    return tagName.value ? `/blog/tag/${getTagSlug( tagName.value )}` : '/blog';
  } ),
  keywords: computed( () =>
  {
    if ( tagName.value )
    {
      return [ tagName.value, 'posts', 'articles', 'blog', 'technology' ];
    }
    return [ 'tags', 'archive', 'blog', 'articles' ];
  } )
} );

onMounted( () =>
{
  const tag = route.params.tag;
  console.log( 'Current tag from route:', tag, typeof tag );

  const filtered = postsData.filter( ( post: ( typeof postsData )[ 0 ] ) =>
  {
    if ( !post.status || post.status === 'published' )
    {
      if ( post.tags )
      {
        const lowerCaseTags = post.tags.map( ( t: string ) => t.toLowerCase() );
        if (
          Array.isArray( tag )
            ? lowerCaseTags.includes( tag[ 0 ].toLowerCase() )
            : lowerCaseTags.includes( tag.toLowerCase() )
        )
        {
          console.log( 'Post included:', post );
          return true;
        }
      }
    }
    return false;
  } );
  console.log( 'Filtered posts for tag:', filtered );

  allPosts.value = filtered as unknown as Post[];
} );

const formatDate = ( dateString: string ): string =>
{
  if ( !dateString ) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
  try
  {
    const date = new Date( dateString );
    return date.toLocaleDateString( undefined, options );
  } catch ( e )
  {
    console.error( 'Error formatting date:', dateString, e );
    return dateString;
  }
};

const allTags = computed( () =>
{
  const tags = new Set<string>();
  postsData.forEach( ( post: ( typeof postsData )[ 0 ] ) =>
  {
    if ( post.tags )
    {
      post.tags.forEach( ( tag: string ) => tags.add( tag ) );
    }
  } );
  return Array.from( tags ).sort();
} );
</script>
