<script setup lang="ts">
import { isDark } from '~/logics'

const username = 'aimerfeng'
const statsBaseUrl = 'https://github-readme-stats-4gttgrkur-aimerfengli-2226s-projects.vercel.app'
</script>

<template>
  <div class="github-contributions my-6">
    <!-- GitHub Contribution Graph (绿墙) -->
    <a
      :href="`https://github.com/${username}`"
      target="_blank"
      rel="noopener noreferrer"
      class="block"
    >
      <img
        :src="`https://ghchart.rshah.org/${isDark ? '4ade80' : '22863a'}/${username}`"
        :alt="`${username}'s GitHub Contribution Graph`"
        class="w-full rounded-lg hover:scale-102 transition-transform"
        loading="lazy"
      >
    </a>

    <!-- GitHub Stats -->
    <div class="mt-4 flex flex-wrap gap-3 justify-center">
      <a :href="`https://github.com/${username}`" target="_blank" rel="noopener noreferrer">
        <img
          :src="`${statsBaseUrl}/api?username=${username}&show_icons=true&count_private=true&include_all_commits=true&theme=${isDark ? 'dark' : 'default'}&hide_border=true&bg_color=${isDark ? '00000000' : 'ffffff00'}`"
          alt="GitHub Stats"
          class="h-36 hover:scale-102 transition-transform"
          loading="lazy"
        >
      </a>
      <a :href="`https://github.com/${username}`" target="_blank" rel="noopener noreferrer">
        <img
          :src="`${statsBaseUrl}/api/top-langs/?username=${username}&layout=compact&count_private=true&theme=${isDark ? 'dark' : 'default'}&hide_border=true&bg_color=${isDark ? '00000000' : 'ffffff00'}`"
          alt="Top Languages"
          class="h-36 hover:scale-102 transition-transform"
          loading="lazy"
        >
      </a>
    </div>
  </div>
</template>
