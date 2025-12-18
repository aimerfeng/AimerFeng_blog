# 部署脚本 - 自动化 Git 提交和推送

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  博客部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在正确的目录
if (-not (Test-Path "package.json")) {
    Write-Host "错误: 请在 aimerfeng-blog 目录下运行此脚本" -ForegroundColor Red
    exit 1
}

Write-Host "步骤 1/4: 添加文件到 Git..." -ForegroundColor Yellow

# 添加新功能文件
git add src/components/LoadingAnimation.vue
git add src/components/ClickEffect.vue
git add src/composables/useLoadingState.ts
git add src/composables/useClickEffect.ts
git add src/styles/click-effect.css

# 添加测试文件
git add test/setup.ts
git add test/README.md
git add vitest.config.ts
git add src/components/LoadingAnimation.performance.test.ts
git add src/components/ClickEffect.performance.test.ts

# 添加文档
git add ACCESSIBILITY_IMPLEMENTATION_SUMMARY.md
git add ACCESSIBILITY_VERIFICATION.md
git add INTEGRATION_VERIFICATION.md
git add PERFORMANCE_OPTIMIZATION.md

# 添加修改的文件
git add src/App.vue
git add package.json
git add pnpm-lock.yaml
git add vite.config.ts

# 添加部署指南
git add DEPLOY_GUIDE.md
git add deploy.ps1

Write-Host "✓ 文件已添加" -ForegroundColor Green
Write-Host ""

Write-Host "步骤 2/4: 提交更改..." -ForegroundColor Yellow

git commit -m "feat: add loading animation and click effects"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 提交成功" -ForegroundColor Green
} else {
    Write-Host "✗ 提交失败" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "步骤 3/4: 推送到 GitHub..." -ForegroundColor Yellow

git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 推送成功" -ForegroundColor Green
} else {
    Write-Host "✗ 推送失败" -ForegroundColor Red
    Write-Host "可能需要配置 Git 认证" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

Write-Host "步骤 4/4: 等待 Vercel 部署..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "接下来的步骤：" -ForegroundColor Cyan
Write-Host "1. 访问 https://vercel.com/dashboard 查看部署状态" -ForegroundColor White
Write-Host "2. 等待 2-5 分钟让 Vercel 完成构建" -ForegroundColor White
Write-Host "3. 部署完成后访问你的网站查看效果" -ForegroundColor White
Write-Host "4. 如果看不到效果，清除浏览器缓存（Ctrl + Shift + Delete）" -ForegroundColor White
Write-Host ""
