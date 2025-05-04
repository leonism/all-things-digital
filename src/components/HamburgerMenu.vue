<!-- src/components/HamburgerMenu.vue -->
<script setup>
import { ref } from "vue";

const isOpen = ref(false);
</script>

<template>
  <div
    :class="['hamburger', { open: isOpen }]"
    @click="isOpen = !isOpen">
    <span class="hamburger-top"></span>
    <span class="hamburger-middle"></span>
    <span class="hamburger-bottom"></span>
  </div>
</template>

<style scoped>
.hamburger {
  cursor: pointer;
  width: 24px;
  height: 24px;
  position: relative;
}

.hamburger-top,
.hamburger-middle,
.hamburger-bottom {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 2px;
  background: hsl(279, 48%, 54%);
  transition: all 0.5s;
}

.hamburger-middle {
  transform: translateY(7px);
}

.hamburger-bottom {
  transform: translateY(14px);
}

.open .hamburger-top {
  transform: rotate(45deg) translateY(6px) translateX(6px);
}

.open .hamburger-middle {
  display: none;
}

.open .hamburger-bottom {
  transform: rotate(-45deg) translateY(6px) translateX(-6px);
}
</style>
