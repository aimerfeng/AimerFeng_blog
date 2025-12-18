# Web3 打赏功能使用指南

## 概述

这个 Web3 打赏功能允许访客通过钱包直接向你的地址发送加密货币打赏。

**支持的区块链：**
- ✅ Ethereum (ETH) - 通过 MetaMask
- ✅ Polygon (MATIC) - 通过 MetaMask  
- ✅ Solana (SOL) - 通过 Phantom

**你的钱包地址：**
- Ethereum: `0x859b52373fb6a83bb9e622492bC19D566f5Eb2fe`
- Polygon: `0x859b52373fb6a83bb9e622492bC19D566f5Eb2fe`
- Solana: `58meNUBkVnCpqh2Tosk3YSFUNBd57AsTqeXp8YnLoiuK`

## 组件说明

### 1. Web3Tip.vue - 完整打赏组件
完整的打赏界面，包含钱包连接、金额选择和交易发送功能。

**Props:**
- `recipientAddress`: 接收打赏的钱包地址（默认: 你的地址）
- `showLabel`: 是否显示标题（默认: true）
- `size`: 组件大小 'small' | 'medium' | 'large'（默认: 'medium'）

### 2. TipButton.vue - 打赏按钮
一个简洁的按钮，点击后弹出完整的打赏界面。

**Props:**
- `recipientAddress`: 接收打赏的钱包地址
- `compact`: 是否使用紧凑模式（圆形按钮）

## 使用方法

### 在文章中使用

在 Markdown 文件中添加打赏按钮：

```markdown
---
title: 我的文章标题
date: 2024-01-01
---

文章内容...

<TipButton />

<!-- 或使用紧凑模式 -->
<TipButton compact />
```

### 在 Vue 组件中使用

```vue
<script setup>
import Web3Tip from '@/components/Web3Tip.vue'
import TipButton from '@/components/TipButton.vue'
</script>

<template>
  <!-- 完整组件 -->
  <Web3Tip 
    recipient-address="0x你的钱包地址"
    size="medium"
  />

  <!-- 或使用按钮 -->
  <TipButton 
    recipient-address="0x你的钱包地址"
  />
</template>
```

### 在项目页面使用

在 `pages/projects.md` 中：

```markdown
## 我的项目

项目描述...

<div class="flex gap-4">
  <a href="https://github.com/..." target="_blank">GitHub</a>
  <TipButton compact />
</div>
```

## 配置你的钱包地址

钱包地址已经配置在 `src/components/Web3Tip.vue` 中：

```typescript
const WALLET_ADDRESSES = {
  ethereum: '0x859b52373fb6a83bb9e622492bC19D566f5Eb2fe',
  polygon: '0x859b52373fb6a83bb9e622492bC19D566f5Eb2fe',
  solana: '58meNUBkVnCpqh2Tosk3YSFUNBd57AsTqeXp8YnLoiuK',
}
```

如需修改，请在 `Web3Tip.vue` 的第 11-15 行更新地址。

## 功能特性

✅ **MetaMask 集成** - 自动检测并连接 MetaMask 钱包
✅ **多种金额** - 预设金额快速选择或自定义输入
✅ **实时反馈** - 交易状态实时显示
✅ **交易追踪** - 成功后可在 Etherscan 查看交易详情
✅ **玻璃质感** - 与博客主题完美融合
✅ **响应式设计** - 支持移动端和桌面端
✅ **暗黑模式** - 自动适配主题

## 支持的网络

当前已支持：
- ✅ **Ethereum 主网** - 使用 MetaMask
- ✅ **Polygon 主网** - 使用 MetaMask（自动添加网络）
- ✅ **Solana 主网** - 使用 Phantom 钱包

用户可以在界面上轻松切换不同的区块链网络。

## 安全提示

⚠️ **重要安全建议：**

1. **永远不要在代码中硬编码私钥**
2. **接收地址是公开的，这是安全的**
3. **用户的私钥永远不会离开他们的 MetaMask 钱包**
4. **所有交易都需要用户在 MetaMask 中确认**
5. **建议在测试网（如 Sepolia）先测试功能**

## 测试流程

1. 安装 MetaMask 浏览器扩展
2. 切换到测试网络（如 Sepolia）
3. 从水龙头获取测试 ETH
4. 测试打赏功能
5. 确认一切正常后再部署到主网

## 常见问题

### Q: 用户没有安装钱包怎么办？
A: 组件会自动检测并显示安装提示，并提供下载链接：
- Ethereum/Polygon: 引导安装 MetaMask
- Solana: 引导安装 Phantom

### Q: 如何支持其他代币（如 USDT）？
A: 需要添加 ERC-20 代币转账逻辑，这需要额外的智能合约交互代码。

### Q: 交易失败了怎么办？
A: 组件会显示错误信息。常见原因：
- Gas 费不足
- 用户取消交易
- 网络拥堵

### Q: 如何自定义样式？
A: 组件使用了 CSS 变量，你可以通过修改 `glass.css` 中的变量来自定义外观。

## 下一步

建议创建以下内容来介绍这个功能：

1. **博客文章 1**: "为博客添加 Web3 打赏功能"
2. **博客文章 2**: "MetaMask 集成开发指南"
3. **博客文章 3**: "Web3 支付的未来"
4. **项目展示**: 将这个打赏系统作为一个独立项目展示

## 技术栈

- Vue 3 Composition API
- TypeScript
- MetaMask Web3 Provider (Ethereum/Polygon)
- Phantom Wallet Provider (Solana)
- @solana/web3.js (Solana 交互)

## 安装依赖

如果要使用 Solana 功能，需要安装：

```bash
npm install @solana/web3.js
# 或
pnpm add @solana/web3.js
```

Ethereum 和 Polygon 不需要额外依赖，直接使用 MetaMask 的 Web3 Provider。

## 许可证

与博客主项目保持一致：CC BY-NC-SA 4.0
