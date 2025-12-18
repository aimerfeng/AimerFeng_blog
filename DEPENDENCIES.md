# 项目依赖说明

## Web3 打赏功能依赖

为了使用完整的多链打赏功能，需要安装以下依赖：

### Solana 支持

```bash
pnpm add @solana/web3.js
```

或使用 npm:

```bash
npm install @solana/web3.js
```

### 说明

- **Ethereum 和 Polygon**: 不需要额外依赖，直接使用 MetaMask 的 window.ethereum API
- **Solana**: 需要 `@solana/web3.js` 库来构建和发送交易

## 安装所有依赖

在项目根目录运行：

```bash
pnpm install
```

这将安装 package.json 中定义的所有依赖。

## 钱包要求

用户需要安装以下浏览器扩展之一：

- **MetaMask** (用于 Ethereum 和 Polygon)
  - 下载: https://metamask.io
  
- **Phantom** (用于 Solana)
  - 下载: https://phantom.app

## 开发环境

确保你的开发环境满足以下要求：

- Node.js >= 16
- pnpm >= 7 (推荐) 或 npm >= 8
- 现代浏览器（Chrome, Firefox, Edge, Brave）

## 测试网络

建议先在测试网络测试功能：

### Ethereum 测试网
- Sepolia: https://sepolia.etherscan.io
- 水龙头: https://sepoliafaucet.com

### Polygon 测试网
- Mumbai: https://mumbai.polygonscan.com
- 水龙头: https://faucet.polygon.technology

### Solana 测试网
- Devnet: https://explorer.solana.com/?cluster=devnet
- 水龙头: https://solfaucet.com

## 构建和部署

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 故障排除

### 问题：找不到 @solana/web3.js 模块

**解决方案：**
```bash
pnpm add @solana/web3.js
```

### 问题：MetaMask 未检测到

**解决方案：**
1. 确保已安装 MetaMask 扩展
2. 刷新页面
3. 检查浏览器控制台是否有错误

### 问题：Phantom 未检测到

**解决方案：**
1. 确保已安装 Phantom 扩展
2. 刷新页面
3. 确保 Phantom 已解锁

### 问题：交易失败

**可能原因：**
- Gas 费不足
- 网络拥堵
- 用户取消交易
- 钱包余额不足

## 更多信息

- Vue 3 文档: https://vuejs.org
- MetaMask 文档: https://docs.metamask.io
- Phantom 文档: https://docs.phantom.app
- Solana Web3.js: https://solana-labs.github.io/solana-web3.js
