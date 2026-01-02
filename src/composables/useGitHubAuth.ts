import { computed, ref } from 'vue'

// GitHub OAuth 配置
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ''
const GITHUB_REPO_OWNER = 'aimerfeng'
const GITHUB_REPO_NAME = 'AimerFeng_blog'

interface GitHubUser {
  login: string
  avatar_url: string
  name: string
  html_url: string
}

// SSR 安全的 localStorage 访问
function getStoredToken(): string | null {
  if (typeof window === 'undefined')
    return null
  return localStorage.getItem('github_token')
}

function setStoredToken(token: string): void {
  if (typeof window !== 'undefined')
    localStorage.setItem('github_token', token)
}

function removeStoredToken(): void {
  if (typeof window !== 'undefined')
    localStorage.removeItem('github_token')
}

function getStoredState(): string | null {
  if (typeof window === 'undefined')
    return null
  return localStorage.getItem('oauth_state')
}

function setStoredState(state: string): void {
  if (typeof window !== 'undefined')
    localStorage.setItem('oauth_state', state)
}

function removeStoredState(): void {
  if (typeof window !== 'undefined')
    localStorage.removeItem('oauth_state')
}

const accessToken = ref<string | null>(null)
const user = ref<GitHubUser | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// 检查是否是仓库所有者
const isOwner = computed(() => user.value?.login === GITHUB_REPO_OWNER)
const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

export function useGitHubAuth() {
  // 初始化：如果有 token，获取用户信息
  async function init() {
    // 从 localStorage 恢复 token
    const storedToken = getStoredToken()
    if (storedToken) {
      accessToken.value = storedToken
    }

    if (accessToken.value && !user.value) {
      await fetchUser()
    }
  }

  // 开始 OAuth 登录流程
  function login() {
    if (typeof window === 'undefined')
      return

    const redirectUri = `${window.location.origin}/admin/callback`
    const scope = 'public_repo'
    const state = Math.random().toString(36).substring(7)
    setStoredState(state)

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`
    window.location.href = authUrl
  }

  // 处理 OAuth 回调
  async function handleCallback(code: string, state: string) {
    const savedState = getStoredState()
    if (state !== savedState) {
      error.value = '状态验证失败，请重试'
      return false
    }
    removeStoredState()

    isLoading.value = true
    error.value = null

    try {
      // 通过 Vercel Serverless Function 交换 token
      const response = await fetch('/api/github-oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error('Token 交换失败')
      }

      const data = await response.json()
      accessToken.value = data.access_token
      setStoredToken(data.access_token)

      await fetchUser()
      return true
    }
    catch (e: any) {
      error.value = e.message || '登录失败'
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  // 获取用户信息
  async function fetchUser() {
    if (!accessToken.value)
      return

    isLoading.value = true
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok) {
        throw new Error('获取用户信息失败')
      }

      user.value = await response.json()
    }
    catch (e: any) {
      error.value = e.message
      logout()
    }
    finally {
      isLoading.value = false
    }
  }

  // 登出
  function logout() {
    accessToken.value = null
    user.value = null
    removeStoredToken()
  }

  // GitHub API 请求辅助函数
  async function githubFetch(url: string, options: RequestInit = {}) {
    if (!accessToken.value)
      throw new Error('未登录')

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `请求失败: ${response.status}`)
    }

    return response.json()
  }

  // Fork 仓库
  async function forkRepo() {
    try {
      const result = await githubFetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/forks`,
        { method: 'POST' },
      )
      return result
    }
    catch (e: any) {
      // 如果已经 fork 过，获取现有的 fork
      if (e.message.includes('already exists')) {
        return await githubFetch(
          `https://api.github.com/repos/${user.value?.login}/${GITHUB_REPO_NAME}`,
        )
      }
      throw e
    }
  }

  // 检查是否已经 fork
  async function checkFork() {
    if (!user.value)
      return null
    try {
      return await githubFetch(
        `https://api.github.com/repos/${user.value.login}/${GITHUB_REPO_NAME}`,
      )
    }
    catch {
      return null
    }
  }

  // 创建或更新文件
  async function createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string,
    sha?: string,
  ) {
    const body: any = {
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch,
    }
    if (sha)
      body.sha = sha

    return await githubFetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { method: 'PUT', body: JSON.stringify(body) },
    )
  }

  // 创建分支
  async function createBranch(owner: string, repo: string, branchName: string, fromBranch = 'main') {
    // 获取源分支的 SHA
    const ref = await githubFetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`,
    )

    // 创建新分支
    return await githubFetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {
        method: 'POST',
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: ref.object.sha,
        }),
      },
    )
  }

  // 创建 Pull Request
  async function createPullRequest(
    title: string,
    body: string,
    head: string,
    base = 'main',
  ) {
    return await githubFetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/pulls`,
      {
        method: 'POST',
        body: JSON.stringify({
          title,
          body,
          head: `${user.value?.login}:${head}`,
          base,
        }),
      },
    )
  }

  return {
    accessToken,
    user,
    isLoading,
    error,
    isOwner,
    isAuthenticated,
    init,
    login,
    handleCallback,
    logout,
    githubFetch,
    forkRepo,
    checkFork,
    createOrUpdateFile,
    createBranch,
    createPullRequest,
    GITHUB_REPO_OWNER,
    GITHUB_REPO_NAME,
  }
}
