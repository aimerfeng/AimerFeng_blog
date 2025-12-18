# 自定义指南 (Customization Guide)

本文档详细说明如何自定义 AimerFeng Blog 的各个方面，包括个人信息、主题颜色、内容配置等。

## 📋 目录

- [个人信息修改](#个人信息修改)
- [颜色主题定制](#颜色主题定制)
- [内容配置](#内容配置)
- [可配置文件清单](#可配置文件清单)
- [玻璃效果调整](#玻璃效果调整)

## 👤 个人信息修改

### 1. 基本信息配置

**文件位置**: `pages/index.md`

```markdown
---
title: 你的名字
description: 你的个人描述
---

# 你好，我是 [你的名字] 👋

这里是你的个人介绍...
```

### 2. 社交链接配置

**文件位置**: `src/components/Footer.vue`

```vue
<template>
  <div class="social-links">
    <a href="https://twitter.com/你的用户名" target="_blank">
      <div i-ri-twitter-fill />
    </a>
    <a href="https://github.com/你的用户名" target="_blank">
      <div i-ri-github-fill />
    </a>
    <!-- 添加更多社交链接 -->
  </div>
</template>
```

### 3. 导航栏配置

**文件位置**: `src/components/NavBar.vue`

修改导航链接：
```vue
<template>
  <nav>
    <RouterLink to="/">首页</RouterLink>
    <RouterLink to="/posts">文章</RouterLink>
    <RouterLink to="/projects">项目</RouterLink>
    <!-- 添加自定义导航项 -->
  </nav>
</template>
```

### 4. Logo 自定义

**文件位置**: `src/components/Logo.vue`

```vue
<template>
  <div class="logo">
    <!-- 替换为你的 Logo -->
    <img src="/your-logo.svg" alt="Your Name" />
    <!-- 或使用文字 Logo -->
    <span class="logo-text">你的名字</span>
  </div>
</template>
```

## 🎨 颜色主题定制

### 1. 主题色彩配置

**文件位置**: `src/styles/main.css`

```css
:root {
  /* 主色调 */
  --c-primary: #3b82f6;
  --c-primary-light: #60a5fa;
  --c-primary-dark: #1d4ed8;
  
  /* 背景色 */
  --c-bg: #ffffff;
  --c-bg-soft: #f8fafc;
  
  /* 文字颜色 */
  --c-text: #1f2937;
  --c-text-light: #6b7280;
}

html.dark {
  --c-bg: #0f172a;
  --c-bg-soft: #1e293b;
  --c-text: #f1f5f9;
  --c-text-light: #94a3b8;
}
```

### 2. 玻璃效果颜色

**文件位置**: `src/styles/glass.css`

```css
:root {
  /* 玻璃背景 */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  /* 渐变背景 */
  --gradient-1: #667eea;
  --gradient-2: #764ba2;
  --gradient-3: #f093fb;
  --gradient-4: #f5576c;
}

html.dark {
  --glass-bg: rgba(0, 0, 0, 0.2);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### 3. 自定义渐变背景

**文件位置**: `src/components/GlassBackground.vue`

```vue
<style scoped>
.glass-background {
  background: linear-gradient(
    45deg,
    var(--gradient-1) 0%,
    var(--gradient-2) 25%,
    var(--gradient-3) 50%,
    var(--gradient-4) 75%,
    var(--gradient-1) 100%
  );
  /* 调整动画速度 */
  animation: gradient-shift 60s ease infinite;
}
</style>
```

## 📝 内容配置

### 1. 首页内容

**文件位置**: `pages/index.md`

```markdown
---
title: 你的名字
description: 你的个人描述
---

# 你好，我是 [你的名字] 👋

## 关于我

这里写你的个人介绍...

## 技术栈

- **前端**: Vue.js, React, TypeScript
- **后端**: Node.js, Python, Go
- **区块链**: Ethereum, Solidity, Web3.js
- **AI/ML**: TensorFlow, PyTorch, OpenAI

## 联系方式

- 📧 Email: your-email@example.com
- 🐦 Twitter: [@yourusername](https://twitter.com/yourusername)
- 💼 LinkedIn: [你的名字](https://linkedin.com/in/yourusername)
```

### 2. 项目展示页

**文件位置**: `pages/projects.md`

```markdown
---
title: 我的项目
description: 展示我的开源项目和作品
---

# 项目展示

## Web3 项目

### 项目名称
- **描述**: 项目简介
- **技术栈**: Solidity, React, Web3.js
- **链接**: [GitHub](https://github.com/yourusername/project)

## AI 项目

### 项目名称
- **描述**: 项目简介
- **技术栈**: Python, TensorFlow, FastAPI
- **链接**: [GitHub](https://github.com/yourusername/ai-project)
```

### 3. 添加新页面

1. 在 `pages/` 目录下创建新的 `.md` 文件
2. 添加到导航栏 (`src/components/NavBar.vue`)
3. 配置路由 (自动生成，无需手动配置)

## 📁 可配置文件清单

### 核心配置文件

| 文件路径 | 用途 | 修改内容 |
|---------|------|----------|
| `package.json` | 项目信息 | name, description, author |
| `pages/index.md` | 首页内容 | 个人介绍、技术栈 |
| `pages/projects.md` | 项目展示 | 项目列表和描述 |
| `vercel.json` | 部署配置 | 构建命令、输出目录 |

### 样式配置文件

| 文件路径 | 用途 | 修改内容 |
|---------|------|----------|
| `src/styles/main.css` | 主样式 | 颜色变量、字体 |
| `src/styles/glass.css` | 玻璃效果 | 透明度、模糊度 |
| `unocss.config.ts` | CSS 框架配置 | 自定义工具类 |

### 组件配置文件

| 文件路径 | 用途 | 修改内容 |
|---------|------|----------|
| `src/components/Logo.vue` | Logo 组件 | Logo 图片或文字 |
| `src/components/NavBar.vue` | 导航栏 | 导航链接 |
| `src/components/Footer.vue` | 页脚 | 社交链接、版权信息 |
| `src/components/GlassBackground.vue` | 背景组件 | 渐变颜色、动画 |

### 内容配置文件

| 文件路径 | 用途 | 修改内容 |
|---------|------|----------|
| `pages/posts/*.md` | 博客文章 | 文章内容和元数据 |
| `public/` | 静态资源 | 图片、图标、favicon |

## 🔧 玻璃效果调整

### 1. 调整模糊程度

**文件位置**: `src/styles/glass.css`

```css
.glass-card {
  backdrop-filter: blur(10px); /* 调整数值 */
  -webkit-backdrop-filter: blur(10px);
}
```

### 2. 调整透明度

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1); /* 调整最后一个数值 */
}
```

### 3. 调整边框效果

```css
.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.2); /* 调整透明度 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* 调整阴影 */
}
```

### 4. 自定义玻璃卡片

**文件位置**: `src/components/GlassCard.vue`

```vue
<template>
  <div 
    class="glass-card"
    :style="{
      '--blur': `${blur}px`,
      '--opacity': opacity,
      '--border-radius': borderRadius
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  blur?: number        // 模糊程度，默认 10
  opacity?: number     // 背景透明度，默认 0.1
  borderRadius?: string // 圆角，默认 '1rem'
}

withDefaults(defineProps<Props>(), {
  blur: 10,
  opacity: 0.1,
  borderRadius: '1rem'
})
</script>
```

## 🎯 高级自定义

### 1. 添加新的标签类型

**文件位置**: `src/components/ListPosts.vue`

```typescript
const tagOptions = [
  { value: 'all', label: '全部' },
  { value: 'web3', label: 'Web3' },
  { value: 'ai', label: 'AI' },
  { value: 'blockchain', label: '区块链' },
  // 添加新标签
  { value: 'tutorial', label: '教程' },
  { value: 'review', label: '评测' }
]
```

### 2. 自定义代码高亮主题

**文件位置**: `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [
    // ...
    {
      name: 'shiki',
      theme: 'github-dark', // 更换主题
      langs: ['javascript', 'typescript', 'solidity', 'python'] // 添加语言
    }
  ]
})
```

### 3. 添加自定义字体

**文件位置**: `src/styles/main.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
  font-family: var(--font-family);
}
```

## 💡 提示和技巧

1. **预览更改**: 使用 `pnpm dev` 实时预览修改效果
2. **备份配置**: 修改前备份重要配置文件
3. **渐进式修改**: 一次只修改一个方面，避免出错
4. **测试响应式**: 在不同设备尺寸下测试效果
5. **性能优化**: 避免过度使用动画和特效

## 🆘 常见问题

### Q: 如何更改网站图标？
A: 替换 `public/favicon.ico` 和相关图标文件

### Q: 如何添加 Google Analytics？
A: 在 `index.html` 中添加 GA 代码，或使用 Vue 插件

### Q: 如何自定义 404 页面？
A: 修改 `pages/[...404].md` 文件

### Q: 如何添加评论系统？
A: 可以集成 Giscus、Disqus 等第三方评论系统

---

如有其他自定义需求，请参考源码或提交 Issue。