<script setup lang="ts">
import type { ResumeItem } from '../data/resumeData'

interface Props {
  title: string
  icon?: string
  items: ResumeItem[]
}

defineProps<Props>()
</script>

<template>
  <section class="resume-section">
    <h2 class="section-title">
      <span v-if="icon" :class="icon" class="title-icon" />
      {{ title }}
    </h2>
    <div class="section-content">
      <div v-for="(item, index) in items" :key="index" class="resume-item">
        <div class="item-header">
          <h3 class="item-title">
            {{ item.title }}
          </h3>
          <span v-if="item.period" class="item-period">{{ item.period }}</span>
        </div>
        <p v-if="item.subtitle" class="item-subtitle">
          {{ item.subtitle }}
        </p>
        <p v-if="item.description" class="item-description">
          {{ item.description }}
        </p>
        <ul v-if="item.highlights && item.highlights.length > 0" class="item-highlights">
          <li v-for="(highlight, hIndex) in item.highlights" :key="hIndex">
            {{ highlight }}
          </li>
        </ul>
        <div v-if="item.tags && item.tags.length > 0" class="item-tags">
          <span v-for="(tag, tIndex) in item.tags" :key="tIndex" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resume-section {
  margin-bottom: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--fg-deep);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(125, 125, 125, 0.3);
}

.title-icon {
  font-size: 1.25rem;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.resume-item {
  position: relative;
  padding-left: 1.5rem;
  border-left: 2px solid rgba(125, 125, 125, 0.3);
}

.resume-item::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 0.25rem;
  width: 10px;
  height: 10px;
  background: var(--fg-deep);
  border-radius: 50%;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.item-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--fg-deep);
  margin: 0;
}

.item-period {
  font-size: 0.875rem;
  color: var(--fg-deeper);
  font-weight: 500;
  white-space: nowrap;
}

.item-subtitle {
  font-size: 1rem;
  color: var(--fg);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.item-description {
  font-size: 0.9375rem;
  color: var(--fg);
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
}

.item-highlights {
  margin: 0 0 0.75rem 0;
  padding-left: 1.25rem;
  list-style: disc;
}

.item-highlights li {
  font-size: 0.9375rem;
  color: var(--fg);
  line-height: 1.6;
  margin-bottom: 0.25rem;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--fg-deep);
  background: rgba(136, 136, 136, 0.1);
  border: 1px solid rgba(125, 125, 125, 0.3);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tag:hover {
  background: rgba(136, 136, 136, 0.2);
  border-color: var(--fg-deep);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .resume-section {
    margin-bottom: 2.5rem;
  }

  .section-title {
    font-size: 1.375rem;
    margin-bottom: 1.25rem;
  }

  .resume-item {
    padding-left: 1.25rem;
  }

  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .item-title {
    font-size: 1.0625rem;
  }

  .item-period {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.25rem;
  }

  .resume-item {
    padding-left: 1rem;
  }

  .item-title {
    font-size: 1rem;
  }

  .item-description,
  .item-highlights li {
    font-size: 0.875rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.1875rem 0.625rem;
  }
}
</style>
