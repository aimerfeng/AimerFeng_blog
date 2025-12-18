<script setup lang='ts'>
import { formatDate } from '~/logics'

const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()

const base = 'https://antfu.me'
const tweetUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Reading @antfu7\'s ${base}${route.path}\n\nI think...`)}`)
const elkUrl = computed(() => `https://elk.zone/intent/post?text=${encodeURIComponent(`Reading @antfu@m.webtoo.ls\'s ${base}${route.path}\n\nI think...`)}`)
const blueskyUrl = computed(() => `https://bsky.app/intent/compose?text=${encodeURIComponent(`Reading @antfu.me ${base}${route.path}\n\nI think...`)}`)

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      const el = document.querySelector(decodeURIComponent(location.hash))
      if (el) {
        const rect = el.getBoundingClientRect()
        const y = window.scrollY + rect.top - 40
        window.scrollTo({
          top: y,
          behavior: 'smooth',
        })
        return true
      }
    }
  }

  const handleAnchors = (
    event: MouseEvent & { target: HTMLElement },
  ) => {
    const link = event.target.closest('a')

    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin)
        return

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }

  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })

  setTimeout(() => {
    if (!navigate())
      setTimeout(navigate, 1000)
  }, 1)
})

const ArtComponent = computed(() => {
  let art = frontmatter.art
  if (art === 'random')
    art = Math.random() > 0.5 ? 'plum' : 'dots'
  if (typeof window !== 'undefined') {
    if (art === 'plum')
      return defineAsyncComponent(() => import('./ArtPlum.vue'))
    else if (art === 'dots')
      return defineAsyncComponent(() => import('./ArtDots.vue'))
  }
  return undefined
})
</script>

<template>
  <ClientOnly v-if="ArtComponent">
    <component :is="ArtComponent" />
  </ClientOnly>
  <div
    v-if="frontmatter.display ?? frontmatter.title"
    class="prose m-auto mb-8"
    :lang="frontmatter.lang"
    :class="[frontmatter.wrapperClass]"
  >
    <h1 class="mb-0 slide-enter-50">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p
      v-if="frontmatter.date"
      class="opacity-50 !-mt-6 slide-enter-50"
    >
      {{ formatDate(frontmatter.date, false) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <div v-if="frontmatter.tags && frontmatter.tags.length > 0" class="!-mt-4 mb-2 slide-enter-50">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in frontmatter.tags"
          :key="tag"
          class="post-tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    <p v-if="frontmatter.place" class="mt--4!">
      <span op50>at </span>
      <a v-if="frontmatter.placeLink" :href="frontmatter.placeLink" target="_blank">
        {{ frontmatter.place }}
      </a>
      <span v-else font-bold>
        {{ frontmatter.place }}
      </span>
    </p>
    <p
      v-if="frontmatter.subtitle"
      class="opacity-50 !-mt-6 italic slide-enter"
    >
      {{ frontmatter.subtitle }}
    </p>
    <p
      v-if="frontmatter.draft"
      class="slide-enter" bg-orange-4:10 text-orange-4 border="l-3 orange-4" px4 py2
    >
      This is a draft post, the content may be incomplete. Please check back later.
    </p>
  </div>
  <article
    ref="content"
    :lang="frontmatter.lang"
    :class="[frontmatter.tocAlwaysOn ? 'toc-always-on' : '', frontmatter.class]"
  >
    <slot />
  </article>
  <div v-if="route.path !== '/'" class="prose m-auto mt-8 mb-8 slide-enter animate-delay-500 print:hidden">
    <template v-if="frontmatter.duration">
      <span font-mono op50>> </span>
      <span op50>comment on </span>
      <a :href="blueskyUrl" target="_blank" op50>bluesky</a>
      <span op25> / </span>
      <a :href="elkUrl" target="_blank" op50>mastodon</a>
      <span op25> / </span>
      <a :href="tweetUrl" target="_blank" op50>twitter</a>
    </template>
    <br>
    <span font-mono op50>> </span>
    <RouterLink
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono op50 hover:op75"
      v-text="'cd ..'"
    />
  </div>
</template>

<style scoped>
.post-tag {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  background: var(--glass-bg, rgba(125, 125, 125, 0.1));
  border: 1px solid var(--glass-border, rgba(125, 125, 125, 0.2));
  color: var(--c-text);
  backdrop-filter: blur(10px);
  font-weight: 500;
}

html.dark .post-tag {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
