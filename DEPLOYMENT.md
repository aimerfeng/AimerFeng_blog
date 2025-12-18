# 部署指南 (Deployment Guide)

本文档详细说明如何将 AimerFeng Blog 部署到 Vercel 平台，包括自动部署、自定义域名配置和环境变量设置。

## 📋 目录

- [Vercel 部署步骤](#vercel-部署步骤)
- [自定义域名配置](#自定义域名配置)
- [环境变量配置](#环境变量配置)
- [部署优化](#部署优化)
- [故障排除](#故障排除)

## 🚀 Vercel 部署步骤

### 方法一：GitHub 自动部署（推荐）

#### 1. 准备 GitHub 仓库

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: AimerFeng Blog"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/yourusername/aimerfeng-blog.git

# 推送到 GitHub
git push -u origin main
```

#### 2. 连接 Vercel

1. 访问 [Vercel 官网](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 `aimerfeng-blog` 仓库
5. 点击 "Import"

#### 3. 配置构建设置

Vercel 会自动检测项目类型，但你可以手动确认：

- **Framework Preset**: Vite
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

#### 4. 部署

点击 "Deploy" 按钮，Vercel 将自动：
- 安装依赖
- 构建项目
- 部署到 CDN
- 提供预览链接

### 方法二：Vercel CLI 部署

#### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

#### 3. 部署项目

```bash
# 在项目根目录执行
vercel

# 首次部署会询问配置
# 按提示选择或输入相应信息
```

#### 4. 生产部署

```bash
vercel --prod
```

## 🌐 自定义域名配置

### 1. 购买域名

推荐域名注册商：
- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Cloudflare](https://www.cloudflare.com)

建议域名：
- `aimerfeng.me`
- `ranran.dev`
- `yourname.blog`

### 2. 在 Vercel 中添加域名

1. 进入项目的 Vercel Dashboard
2. 点击 "Settings" 标签
3. 选择 "Domains" 选项
4. 点击 "Add" 按钮
5. 输入你的域名（如 `aimerfeng.me`）
6. 点击 "Add"

### 3. 配置 DNS 记录

#### 方法一：使用 Vercel DNS（推荐）

如果你的域名注册商支持，可以将 DNS 管理转移到 Vercel：

1. 在域名注册商处修改 Name Servers 为：
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

2. Vercel 会自动配置所需的 DNS 记录

#### 方法二：手动配置 DNS

在你的 DNS 提供商处添加以下记录：

```
# A 记录（根域名）
Type: A
Name: @
Value: 76.76.19.61

# CNAME 记录（www 子域名）
Type: CNAME
Name: www
Value: cname.vercel-dns.com

# 如果使用子域名
Type: CNAME
Name: blog
Value: cname.vercel-dns.com
```

### 4. 验证域名

DNS 配置生效后（通常需要几分钟到几小时），Vercel 会自动：
- 验证域名所有权
- 颁发 SSL 证书
- 启用 HTTPS

## ⚙️ 环境变量配置

### 1. 在 Vercel Dashboard 中设置

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加所需的环境变量

### 2. 常用环境变量

```bash
# 网站基本信息
VITE_SITE_NAME=AimerFeng Blog
VITE_SITE_DESCRIPTION=Web3 & AI 技术分享
VITE_SITE_URL=https://aimerfeng.me

# 社交媒体链接
VITE_TWITTER_URL=https://twitter.com/AimerFeng
VITE_GITHUB_URL=https://github.com/AimerFeng

# 分析工具（可选）
VITE_GA_ID=G-XXXXXXXXXX
VITE_UMAMI_ID=your-umami-id

# API 密钥（如果需要）
VITE_API_KEY=your-api-key
```

### 3. 在代码中使用环境变量

```typescript
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_SITE_NAME: string
  readonly VITE_SITE_DESCRIPTION: string
  readonly VITE_SITE_URL: string
  readonly VITE_TWITTER_URL: string
  readonly VITE_GITHUB_URL: string
}

// 在组件中使用
const siteName = import.meta.env.VITE_SITE_NAME
```

## 🔧 部署优化

### 1. 构建优化配置

**文件位置**: `vite.config.ts`

```typescript
export default defineConfig({
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          utils: ['@vueuse/core']
        }
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### 2. Vercel 配置优化

**文件位置**: `vercel.json`

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "functions": {
    "pages/api/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 3. 性能优化建议

- **图片优化**: 使用 WebP 格式，启用懒加载
- **字体优化**: 使用 `font-display: swap`
- **代码分割**: 按路由分割代码
- **预加载**: 预加载关键资源
- **CDN**: 利用 Vercel 的全球 CDN

## 📊 监控和分析

### 1. Vercel Analytics

在 Vercel Dashboard 中启用 Analytics：
1. 进入项目设置
2. 选择 "Analytics" 标签
3. 点击 "Enable Analytics"

### 2. Google Analytics

在 `index.html` 中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Umami Analytics（开源替代）

```html
<script async defer data-website-id="your-website-id" src="https://umami.is/script.js"></script>
```

## 🔄 自动部署工作流

### 1. GitHub Actions（可选）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 2. 分支部署策略

- `main` 分支 → 生产环境
- `develop` 分支 → 预览环境
- Pull Request → 预览部署

## 🛠️ 故障排除

### 常见问题及解决方案

#### 1. 构建失败

**错误**: `Build failed`

**解决方案**:
```bash
# 检查本地构建
pnpm build

# 检查依赖版本
pnpm audit

# 清理缓存
pnpm store prune
```

#### 2. 路由问题

**错误**: 页面刷新后 404

**解决方案**: 确保 `vercel.json` 中有正确的重写规则：
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### 3. 环境变量未生效

**解决方案**:
1. 确保变量名以 `VITE_` 开头
2. 重新部署项目
3. 检查变量值是否正确

#### 4. 域名配置问题

**解决方案**:
1. 检查 DNS 记录是否正确
2. 等待 DNS 传播（最多 48 小时）
3. 使用 DNS 检查工具验证

#### 5. SSL 证书问题

**解决方案**:
1. 确保域名已验证
2. 等待证书自动颁发
3. 联系 Vercel 支持

### 调试工具

```bash
# 检查 DNS 记录
nslookup aimerfeng.me

# 检查网站状态
curl -I https://aimerfeng.me

# 本地预览构建结果
pnpm preview
```

## 📞 获取帮助

- **Vercel 文档**: https://vercel.com/docs
- **Vercel 社区**: https://github.com/vercel/vercel/discussions
- **项目 Issues**: https://github.com/yourusername/aimerfeng-blog/issues

## 🎉 部署完成检查清单

- [ ] 网站可以正常访问
- [ ] 所有页面路由正常
- [ ] 深色/浅色主题切换正常
- [ ] 移动端响应式正常
- [ ] SEO 标签正确显示
- [ ] 自定义域名配置成功
- [ ] HTTPS 证书正常
- [ ] 分析工具正常工作

---

恭喜！你的 AimerFeng Blog 已成功部署到 Vercel。现在可以开始分享你的 Web3 和 AI 技术见解了！