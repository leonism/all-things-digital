<template>
  <div class="flex items-center space-x-2">
    <img :src="author.avatar" alt="Avatar" class="w-8 h-8 rounded-full">
    <span class="text-gray-600">{{ author.name }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'AvatarAuthor',
  props: {
    author: {
      type: Object as PropType<{ name: string; avatar: string }>,
      required: true,
    },
  },
});
</script>
