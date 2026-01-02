<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGitHubAuth } from '~/composables/useGitHubAuth'

const router = useRouter()
const route = useRoute()
const { handleCallback } = useGitHubAuth()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  const error = route.query.error as string

  if (error) {
    status.value = 'error'
    errorMessage.value = route.query.error_description as string || '授权被拒绝'
    return
  }

  if (!code || !state) {
    status.value = 'error'
    errorMessage.value = '缺少必要参数'
    return
  }

  const success = await handleCallback(code, state)

  if (success) {
    status.value = 'success'
    // 延迟跳转，让用户看到成功状态
    setTimeout(() => {
      router.push('/admin')
    }, 1500)
  }
  else {
    status.value = 'error'
    errorMessage.value = '登录失败，请重试'
  }
})
</script>

<template>
  <div class="callback-page">
    <div class="callback-card">
      <!-- Loading -->
      <template v-if="status === 'loading'">
        <div class="i-carbon-circle-dash animate-spin text-4xl mb-4" />
        <h2>正在登录...</h2>
        <p class="op50">
          请稍候
        </p>
      </template>

      <!-- Success -->
      <template v-else-if="status === 'success'">
        <div class="i-carbon-checkmark-filled text-4xl text-green mb-4" />
        <h2>登录成功！</h2>
        <p class="op50">
          正在跳转...
        </p>
      </template>

      <!-- Error -->
      <template v-else>
        <div class="i-carbon-close-filled text-4xl text-red mb-4" />
        <h2>登录失败</h2>
        <p class="op50 mb-4">
          {{ errorMessage }}
        </p>
        <router-link to="/admin" class="retry-link">
          返回重试
        </router-link>
      </template>
    </div>
  </div>
</template>

<style scoped>
.callback-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.callback-card {
  text-align: center;
  padding: 40px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  max-width: 400px;
}

.callback-card h2 {
  margin-bottom: 8px;
}

.retry-link {
  display: inline-block;
  padding: 10px 20px;
  background: var(--c-brand, #3b82f6);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: filter 0.2s;
}

.retry-link:hover {
  filter: brightness(1.1);
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
