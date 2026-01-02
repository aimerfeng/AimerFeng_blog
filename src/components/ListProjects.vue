<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps<{ projects: Record<string, any[]> }>()

function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\/]+/g, '-')
}

// 用于交错动画的状态
const isVisible = ref(false)

onMounted(() => {
  // 延迟触发动画，让页面有时间渲染
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <div class="max-w-300 mx-auto projects-container" :class="{ 'is-visible': isVisible }">
    <p text-center mt--6 mb5 op50 text-lg italic class="intro-text">
      AI 与 Web3 项目作品集
    </p>
    <div class="prose pb5 mx-auto mt10 text-center social-links">
      <div flex="~ gap-2 justify-center">
        <a
          href="https://github.com/aimerfeng"
          target="_blank"
          class="group btn-blue inline-block social-btn"
        >
          <div
            i-ph-github-logo-duotone
            group-hover="i-ph-github-logo-fill text-blue"
          />
          GitHub
        </a>
        <a
          href="https://x.com/aimer71976"
          target="_blank"
          class="group btn-cyan inline-block social-btn"
        >
          <div
            i-ri-twitter-x-fill
            group-hover="text-cyan"
          />
          X
        </a>
        <a
          href="https://www.zhihu.com/people/aimerfeng-18"
          target="_blank"
          class="group btn-purple inline-block social-btn"
        >
          <div
            i-simple-icons-zhihu
            group-hover="text-purple"
          />
          知乎
        </a>
      </div>
      <hr>
    </div>
    <div
      v-for="key, cidx in Object.keys(projects)" :key="key"
      class="category-section slide-enter"
      :style="{ '--enter-stage': cidx + 1 }"
    >
      <div
        :id="slug(key)"
        select-none relative h18 mt5 pointer-events-none slide-enter
        class="category-title"
        :style="{
          '--enter-stage': cidx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span text-5em color-transparent absolute left--1rem top-0rem font-bold leading-1em text-stroke-1.5 text-stroke-hex-aaa op35 dark:op20>{{ key }}</span>
      </div>
      <div
        class="project-grid py-2 max-w-500 w-max mx-auto"
        grid="~ cols-1 md:cols-2 gap-4 lg:cols-3"
      >
        <a
          v-for="item, idx in projects[key]"
          :key="idx"
          class="item relative flex items-center project-card"
          :class="{ 'card-visible': isVisible }"
          :style="{ '--card-delay': `${(cidx * 3 + idx) * 80}ms` }"
          :href="item.link"
          target="_blank"
          :title="item.name"
        >
          <!-- 悬浮光效 -->
          <div class="card-glow" />
          <!-- 图标容器 -->
          <div v-if="item.icon" class="icon-container pt-2 pr-5">
            <Slidev v-if="item.icon === 'slidev'" class="text-4xl opacity-50 icon-animate" />
            <VueUse v-else-if="item.icon === 'vueuse'" class="text-4xl opacity-50 icon-animate" />
            <VueReactivity v-else-if="item.icon === 'vue-reactivity'" class="text-4xl opacity-50 icon-animate" />
            <VueDemi v-else-if="item.icon === 'vue-demi'" class="text-4xl opacity-50 icon-animate" />
            <Unocss v-else-if="item.icon === 'unocss'" class="text-4xl opacity-50 icon-animate" />
            <Vitest v-else-if="item.icon === 'vitest'" class="text-4xl opacity-50 icon-animate" />
            <Elk v-else-if="item.icon === 'elk'" class="text-4xl opacity-50 icon-animate" />
            <AnthonyFu v-else-if="item.icon === 'af'" class="text-4xl opacity-50 icon-animate" />
            <div v-else class="text-3xl opacity-50 icon-animate" :class="item.icon || 'i-carbon-unknown'" />
          </div>
          <div class="flex-auto content-container">
            <div class="text-normal project-name">{{ item.name }}</div>
            <div class="desc text-sm opacity-50 font-normal project-desc" v-html="item.desc" />
          </div>
        </a>
      </div>
    </div>
    <div class="prose pb5 mx-auto mt10 text-center footer-section">
      <div block mt-5>
        <p op50 class="more-text">
          更多项目正在开发中...
        </p>
      </div>
      <hr>
      <SponsorButtons />
    </div>
  </div>
  <div>
    <div class="table-of-contents">
      <div class="table-of-contents-anchor">
        <div class="i-ri-menu-2-fill" />
      </div>
      <ul>
        <li v-for="key of Object.keys(projects)" :key="key">
          <a :href="`#${slug(key)}`">{{ key }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* 项目卡片基础样式 */
.project-grid a.item {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  font-size: 1.1rem;
  width: 350px;
  max-width: 100%;
  padding: 0.5rem 0.875rem 0.875rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition:
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* 卡片可见状态 */
.project-grid a.item.card-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-delay: var(--card-delay, 0ms);
}

/* 悬浮光效 */
.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
  pointer-events: none;
  z-index: 0;
}

html.dark .card-glow {
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 50%);
}

.project-grid a.item:hover .card-glow {
  opacity: 1;
  transform: scale(1);
}

/* 悬浮效果 */
.project-grid a.item:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

html.dark .project-grid a.item:hover {
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* 图标动画 */
.icon-container {
  position: relative;
  z-index: 1;
}

.icon-animate {
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease;
}

.project-grid a.item:hover .icon-animate {
  transform: scale(1.15) rotate(-5deg);
  opacity: 0.8;
}

/* 内容动画 */
.content-container {
  position: relative;
  z-index: 1;
}

.project-name {
  transition:
    color 0.3s ease,
    transform 0.3s ease;
}

.project-desc {
  transition: opacity 0.3s ease;
}

.project-grid a.item:hover .project-name {
  transform: translateX(4px);
}

.project-grid a.item:hover .project-desc {
  opacity: 0.7;
}

/* 社交链接动画 */
.social-btn {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 分类标题动画 */
.category-title span {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.category-section:hover .category-title span {
  opacity: 0.5 !important;
  transform: translateX(5px);
}

html.dark .category-section:hover .category-title span {
  opacity: 0.3 !important;
}

/* 介绍文字动画 */
.intro-text {
  animation: fadeInUp 0.8s ease-out;
}

.more-text {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 0.5;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.3;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .project-grid a.item {
    width: 100%;
  }

  .project-grid a.item:hover {
    transform: translateY(-2px) scale(1.01);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .project-grid a.item {
    opacity: 1;
    transform: none;
    transition:
      background 0.3s ease,
      border-color 0.3s ease;
  }

  .project-grid a.item:hover {
    transform: none;
  }

  .card-glow {
    display: none;
  }

  .icon-animate,
  .project-name,
  .project-desc,
  .social-btn,
  .category-title span {
    transition: none;
  }

  .intro-text,
  .more-text {
    animation: none;
  }
}

/* 性能优化 */
.project-grid a.item {
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

.card-glow {
  will-change: opacity, transform;
}

.icon-animate {
  will-change: transform;
}
</style>
