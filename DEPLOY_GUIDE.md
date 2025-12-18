# 部署指南

## 第一步：添加文件到 Git

在 PowerShell 或 CMD 中，进入 aimerfeng-blog 目录，然后执行：

```powershell
# 1. 添加新功能文件
git add src/components/LoadingAnimation.vue
git add src/components/ClickEffect.vue
git add src/composables/useLoadingState.ts
git add src/composables/useClickEffect.ts
git add src/styles/click-effect.css

# 2. 添加测试文件
git add test/setup.ts
git add test/README.md
git add vitest.config.ts
git add src/components/LoadingAnimation.performance.test.ts
git add src/components/ClickEffect.performance.test.ts

# 3. 添加文档
git add ACCESSIBILITY_IMPLEMENTATION_SUMMARY.md
git add ACCESSIBILITY_VERIFICATION.md
git add INTEGRATION_VERIFICATION.md
git add PERFORMANCE_OPTIMIZATION.md

# 4. 添加修改的文件
git add src/App.vue
git add package.json
git add pnpm-lock.yaml
git add vite.config.ts

# 5. 添加其他所有修改
git add .
```

## 第二步：提交更改

```powershell
git commit -m "feat: 添加开场加载动画和鼠标点击效果

- 实现 LoadingAnimation 组件（开场加载动画）
- 实现 ClickEffect 组件（鼠标点击效果）
- 添加 useLoadingState 和 useClickEffect composables
- 集成到 App.vue 主应用
- 添加性能测试（22个测试全部通过）
- 添加无障碍功能支持
- 优化性能（GPU加速、will-change提示）
- 支持深色/浅色主题
- 支持响应式设计
- 添加完整的文档"
```

## 第三步：推送到 GitHub

```powershell
git push origin main
```

如果遇到权限问题，可能需要先配置 Git：

```powershell
# 配置用户名和邮箱（如果还没配置）
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

## 第四步：等待 Vercel 自动部署

1. 推送成功后，访问 https://vercel.com/dashboard
2. 找到你的项目
3. 查看部署状态（通常需要 2-5 分钟）
4. 部署完成后，点击 "Visit" 查看网站

## 验证功能

部署成功后，访问你的网站应该能看到：

1. **开场加载动画**：
   - 刷新页面时会显示加载动画
   - 动画会在页面加载完成后淡出
   - 至少显示 1 秒钟

2. **鼠标点击效果**：
   - 点击页面任意位置会有视觉反馈
   - 效果会自动消失
   - 支持触摸设备

3. **主题适配**：
   - 切换深色/浅色主题，动画颜色会相应改变

## 如果没有看到效果

1. **清除浏览器缓存**：
   - Chrome: Ctrl + Shift + Delete
   - 或使用无痕模式：Ctrl + Shift + N

2. **检查 Vercel 部署日志**：
   - 在 Vercel Dashboard 中查看构建日志
   - 确认没有错误

3. **本地测试**：
   ```powershell
   npm run dev
   ```
   在本地 http://localhost:3333 查看效果

## 常见问题

### Q: 推送时提示 "Permission denied"
A: 需要配置 GitHub 认证，可以使用 GitHub Desktop 或配置 SSH key

### Q: Vercel 构建失败
A: 检查 Vercel 的构建日志，通常是依赖问题，可以尝试：
```powershell
npm install
npm run build
```
确保本地构建成功

### Q: 看不到加载动画
A: 
1. 确保清除了浏览器缓存
2. 检查浏览器控制台是否有错误
3. 尝试硬刷新：Ctrl + F5
