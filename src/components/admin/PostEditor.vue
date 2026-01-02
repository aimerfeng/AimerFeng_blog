<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useGitHubAuth } from '~/composables/useGitHubAuth'
import MarkdownEditor from './MarkdownEditor.vue'

const {
  user,
  isAuthenticated,
  isLoading: authLoading,
  error: authError,
  init,
  login,
  logout,
  forkRepo,
  checkFork,
  createBranch,
  createOrUpdateFile,
  createPullRequest,
  GITHUB_REPO_NAME,
} = useGitHubAuth()

// 文章表单数据
const title = ref('')
const slug = ref('')
const description = ref('')
const tags = ref('')
const content = ref('')

// 状态
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const submitSuccess = ref(false)
const prUrl = ref<string | null>(null)
const step = ref<'edit' | 'forking' | 'creating' | 'pr' | 'done'>('edit')

// 自动生成 slug
const autoSlug = computed(() => {
  return title.value
    .toLowerCase()
    .replace(/[^a-z0-9\u4E00-\u9FA5]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)
})

// 生成文章内容
function generatePostContent(): string {
  const date = new Date().toISOString().split('T')[0]
  const tagList = tags.value.split(',').map(t => t.trim()).filter(Boolean)

  return `---
title: ${title.value}
date: ${date}
lang: zh
description: ${description.value}
author: ${user.value?.name || user.value?.login}
author_github: ${user.value?.login}
${tagList.length ? `tags:\n${tagList.map(t => `  - ${t}`).join('\n')}` : ''}
---

${content.value}
`
}

// 提交文章
async function submitPost() {
  if (!title.value || !content.value) {
    submitError.value = '请填写标题和内容'
    return
  }

  if (!isAuthenticated.value) {
    submitError.value = '请先登录'
    return
  }

  isSubmitting.value = true
  submitError.value = null
  submitSuccess.value = false

  try {
    // Step 1: Fork 仓库（如果还没有）
    step.value = 'forking'
    let fork = await checkFork()
    if (!fork) {
      fork = await forkRepo()
      // 等待 fork 完成
      await new Promise(resolve => setTimeout(resolve, 3000))
    }

    // Step 2: 创建新分支
    step.value = 'creating'
    const branchName = `post/${slug.value || autoSlug.value}-${Date.now()}`

    try {
      await createBranch(user.value!.login, GITHUB_REPO_NAME, branchName)
    }
    catch (e: any) {
      // 分支可能已存在，继续
      if (!e.message.includes('Reference already exists')) {
        throw e
      }
    }

    // Step 3: 创建文章文件
    const fileName = `pages/posts/${slug.value || autoSlug.value}.md`
    const postContent = generatePostContent()

    await createOrUpdateFile(
      user.value!.login,
      GITHUB_REPO_NAME,
      fileName,
      postContent,
      `feat: 添加新文章 - ${title.value}`,
      branchName,
    )

    // Step 4: 创建 Pull Request
    step.value = 'pr'
    const pr = await createPullRequest(
      `📝 新文章: ${title.value}`,
      `## 新文章投稿

**标题**: ${title.value}
**作者**: @${user.value?.login}
**描述**: ${description.value || '无'}

---

感谢投稿！请等待博主审核。`,
      branchName,
    )

    prUrl.value = pr.html_url
    step.value = 'done'
    submitSuccess.value = true
  }
  catch (e: any) {
    console.error('Submit error:', e)
    submitError.value = e.message || '提交失败，请重试'
    step.value = 'edit'
  }
  finally {
    isSubmitting.value = false
  }
}

// 重置表单
function resetForm() {
  title.value = ''
  slug.value = ''
  description.value = ''
  tags.value = ''
  content.value = ''
  submitSuccess.value = false
  prUrl.value = null
  step.value = 'edit'
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="post-editor">
    <!-- 未登录状态 -->
    <div v-if="!isAuthenticated" class="login-prompt">
      <div class="login-card">
        <div class="i-carbon-edit text-4xl mb-4 op50" />
        <h2>投稿文章</h2>
        <p class="op70 mb-6">
          使用 GitHub 账号登录后，你可以在线编写文章并提交到博客。
          文章将以 Pull Request 形式提交，博主审核后发布。
        </p>
        <button
          class="login-btn"
          :disabled="authLoading"
          @click="login"
        >
          <span class="i-carbon-logo-github mr-2" />
          {{ authLoading ? '登录中...' : '使用 GitHub 登录' }}
        </button>
        <p v-if="authError" class="error-text mt-4">
          {{ authError }}
        </p>
      </div>
    </div>

    <!-- 已登录状态 -->
    <div v-else class="editor-container">
      <!-- 用户信息栏 -->
      <div class="user-bar">
        <div class="user-info">
          <img :src="user?.avatar_url" :alt="user?.login" class="avatar">
          <span>{{ user?.name || user?.login }}</span>
        </div>
        <button class="logout-btn" @click="logout">
          退出登录
        </button>
      </div>

      <!-- 提交成功 -->
      <div v-if="submitSuccess" class="success-card">
        <div class="i-carbon-checkmark-filled text-4xl text-green mb-4" />
        <h2>文章提交成功！</h2>
        <p class="op70 mb-4">
          你的文章已作为 Pull Request 提交，请等待博主审核。
        </p>
        <a
          v-if="prUrl"
          :href="prUrl"
          target="_blank"
          class="pr-link"
        >
          <span class="i-carbon-logo-github mr-2" />
          查看 Pull Request
        </a>
        <button class="new-post-btn mt-4" @click="resetForm">
          继续投稿
        </button>
      </div>

      <!-- 编辑表单 -->
      <form v-else class="editor-form" @submit.prevent="submitPost">
        <div class="form-group">
          <label for="title">文章标题 *</label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="输入文章标题"
            required
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="slug">URL 路径</label>
            <input
              id="slug"
              v-model="slug"
              type="text"
              :placeholder="autoSlug || 'auto-generated'"
            >
            <small class="op50">留空将自动生成</small>
          </div>

          <div class="form-group">
            <label for="tags">标签</label>
            <input
              id="tags"
              v-model="tags"
              type="text"
              placeholder="Web3, AI, Vue (逗号分隔)"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="description">文章描述</label>
          <input
            id="description"
            v-model="description"
            type="text"
            placeholder="简短描述文章内容"
          >
        </div>

        <div class="form-group">
          <label>文章内容 *</label>
          <MarkdownEditor
            v-model="content"
            placeholder="使用 Markdown 格式编写文章内容..."
          />
        </div>

        <div v-if="submitError" class="error-text mb-4">
          {{ submitError }}
        </div>

        <div class="form-actions">
          <div v-if="isSubmitting" class="submit-progress">
            <span class="i-carbon-circle-dash animate-spin mr-2" />
            <span v-if="step === 'forking'">正在准备仓库...</span>
            <span v-else-if="step === 'creating'">正在创建文章...</span>
            <span v-else-if="step === 'pr'">正在创建 Pull Request...</span>
            <span v-else>处理中...</span>
          </div>
          <button
            type="submit"
            class="submit-btn"
            :disabled="isSubmitting || !title || !content"
          >
            <span class="i-carbon-send mr-2" />
            提交文章
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.post-editor {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.login-prompt {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-card,
.success-card {
  text-align: center;
  padding: 40px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  max-width: 400px;
}

.login-card h2,
.success-card h2 {
  margin-bottom: 12px;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: #24292e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #1a1e22;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.user-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.logout-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  cursor: pointer;
  color: inherit;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: var(--glass-bg-hover);
}

.editor-form {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  background: var(--c-bg);
  color: inherit;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: var(--c-brand, #3b82f6);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.submit-progress {
  display: flex;
  align-items: center;
  color: var(--c-brand, #3b82f6);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: var(--c-brand, #3b82f6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
}

.submit-btn:hover:not(:disabled) {
  filter: brightness(1.1);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  color: #ef4444;
}

.pr-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: #24292e;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
}

.pr-link:hover {
  background: #1a1e22;
}

.new-post-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  cursor: pointer;
  color: inherit;
  transition: all 0.2s;
}

.new-post-btn:hover {
  background: var(--glass-bg-hover);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
