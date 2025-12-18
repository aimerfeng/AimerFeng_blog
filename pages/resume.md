---
title: Resume - AimerFeng
display: Resume
description: Professional experience and skills
wrapperClass: 'resume-page'
---

<script setup>
import { resumeData } from '../src/data/resumeData'
import ResumeSection from '../src/components/ResumeSection.vue'

function getSocialIcon(platform) {
  const icons = {
    'GitHub': 'i-carbon-logo-github',
    'Twitter': 'i-carbon-logo-twitter',
    'LinkedIn': 'i-carbon-logo-linkedin',
    'Website': 'i-carbon-link',
  }
  return icons[platform] || 'i-carbon-link'
}
</script>

<div class="resume-container">
  <!-- Personal Header -->
  <header class="resume-header">
    <h1 class="name">{{ resumeData.personal.name }}</h1>
    <p class="title">{{ resumeData.personal.title }}</p>
    <div class="contact-info">
      <span class="contact-item">
        <span class="i-carbon-email" />
        <a :href="`mailto:${resumeData.personal.email}`">{{ resumeData.personal.email }}</a>
      </span>
      <span class="contact-item">
        <span class="i-carbon-location" />
        {{ resumeData.personal.location }}
      </span>
    </div>
    <div class="social-links">
      <a
        v-for="link in resumeData.personal.links"
        :key="link.platform"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link"
      >
        <span :class="getSocialIcon(link.platform)" />
        {{ link.platform }}
      </a>
    </div>
  </header>

  <!-- Summary -->
  <section class="summary-section">
    <p class="summary-text">{{ resumeData.summary }}</p>
  </section>

  <!-- Experience -->
  <ResumeSection
    title="Experience"
    icon="i-carbon-portfolio"
    :items="resumeData.experience"
  />

  <!-- Education -->
  <ResumeSection
    title="Education"
    icon="i-carbon-education"
    :items="resumeData.education"
  />

  <!-- Skills -->
  <section class="resume-section skills-section">
    <h2 class="section-title">
      <span class="i-carbon-skill-level title-icon" />
      Skills
    </h2>
    <div class="skills-grid">
      <div
        v-for="skillGroup in resumeData.skills"
        :key="skillGroup.category"
        class="skill-group"
      >
        <h3 class="skill-category">{{ skillGroup.category }}</h3>
        <div class="skill-items">
          <span
            v-for="skill in skillGroup.items"
            :key="skill"
            class="skill-tag"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- Projects -->
  <ResumeSection
    title="Notable Projects"
    icon="i-carbon-application"
    :items="resumeData.projects"
  />
</div>

<style scoped>
.resume-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.resume-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid rgba(125, 125, 125, 0.3);
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--fg-deep);
  margin: 0 0 0.5rem 0;
}

.title {
  font-size: 1.25rem;
  color: var(--fg);
  margin: 0 0 1.5rem 0;
  font-weight: 400;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: var(--fg);
}

.contact-item a {
  color: var(--fg-deep);
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-item a:hover {
  color: var(--fg-deeper);
  text-decoration: underline;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9375rem;
  color: var(--fg-deep);
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  color: var(--fg-deeper);
  transform: translateY(-2px);
}

.summary-section {
  margin-bottom: 3rem;
}

.summary-text {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--fg);
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.skills-section {
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.skill-group {
  padding: 1rem;
  background: rgba(136, 136, 136, 0.05);
  border: 1px solid rgba(125, 125, 125, 0.3);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.skill-group:hover {
  background: rgba(136, 136, 136, 0.1);
  border-color: var(--fg-deep);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.skill-category {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--fg-deep);
  margin: 0 0 0.75rem 0;
}

.skill-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--fg);
  background: var(--c-bg);
  border: 1px solid rgba(125, 125, 125, 0.3);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.skill-tag:hover {
  color: var(--fg-deep);
  border-color: var(--fg-deep);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .resume-container {
    padding: 1.5rem 1rem;
  }

  .resume-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
  }

  .name {
    font-size: 2rem;
  }

  .title {
    font-size: 1.125rem;
  }

  .contact-info {
    flex-direction: column;
    gap: 0.75rem;
  }

  .social-links {
    gap: 1rem;
  }

  .summary-text {
    font-size: 1rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .name {
    font-size: 1.75rem;
  }

  .title {
    font-size: 1rem;
  }

  .contact-item,
  .social-link {
    font-size: 0.875rem;
  }

  .summary-text {
    font-size: 0.9375rem;
  }
}
</style>
