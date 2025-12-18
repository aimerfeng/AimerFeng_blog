# 博客文章编写指南 (Blog Writing Guide)

本指南详细说明如何为 AimerFeng Blog 编写和发布高质量的技术文章，包括 Frontmatter 配置、标签规范和 Markdown 语法。

## 📋 目录

- [文章结构](#文章结构)
- [Frontmatter 格式](#frontmatter-格式)
- [标签使用规范](#标签使用规范)
- [Markdown 语法](#markdown-语法)
- [代码块语法](#代码块语法)
- [图片和媒体](#图片和媒体)
- [SEO 优化](#seo-优化)
- [发布流程](#发布流程)

## 📝 文章结构

### 1. 文件命名规范

```
pages/posts/文章名称.md
```

**命名建议**:
- 使用英文小写字母和连字符
- 避免使用特殊字符和空格
- 体现文章主题

**示例**:
```
web3-introduction.md
smart-contract-development.md
ai-agent-tutorial.md
llm-application-guide.md
```

### 2. 文章模板

```markdown
---
title: 文章标题
date: 2024-01-01
description: 文章简短描述，用于 SEO 和社交分享
image: /images/article-cover.jpg
tags: [web3, blockchain, tutorial]
draft: false
lang: zh
---

# 文章标题

## 简介

简要介绍文章内容和目标读者...

## 主要内容

### 小节标题

详细内容...

## 总结

总结要点...

## 参考资料

- [链接1](https://example.com)
- [链接2](https://example.com)
```

## 🏷️ Frontmatter 格式

### 必填字段

```yaml
---
title: "文章标题"           # 必填，文章标题
date: "2024-01-01"         # 必填，发布日期 (YYYY-MM-DD)
description: "文章描述"     # 必填，用于 SEO 和预览
tags: [web3, blockchain]   # 必填，文章标签数组
---
```

### 可选字段

```yaml
---
# 基本信息
title: "深入理解以太坊智能合约"
date: "2024-01-15"
description: "从零开始学习以太坊智能合约开发，包括 Solidity 语法、部署和测试"

# 分类和标签
tags: [web3, ethereum, solidity, smart-contract]
category: "tutorial"

# 媒体资源
image: "/images/ethereum-smart-contracts.jpg"
video: "https://youtube.com/watch?v=example"

# 发布控制
draft: false              # true 表示草稿，不会发布
featured: true            # 是否为精选文章
sticky: false             # 是否置顶

# 语言和本地化
lang: "zh"                # zh | en
redirect: "/old-url"      # 重定向旧链接

# SEO 优化
keywords: ["以太坊", "智能合约", "Solidity", "区块链开发"]
author: "AimerFeng"
canonical: "https://aimerfeng.me/posts/ethereum-smart-contracts"

# 社交分享
twitter_card: "summary_large_image"
og_type: "article"

# 阅读信息
reading_time: 15          # 预估阅读时间（分钟）
word_count: 3000          # 字数统计

# 更新信息
updated: "2024-01-20"     # 最后更新日期
version: "1.1"            # 版本号
---
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题，显示在页面和列表中 |
| `date` | string | ✅ | 发布日期，格式：YYYY-MM-DD |
| `description` | string | ✅ | 文章描述，用于 SEO 和社交分享 |
| `tags` | array | ✅ | 标签数组，用于分类和过滤 |
| `image` | string | ❌ | 封面图片路径 |
| `draft` | boolean | ❌ | 是否为草稿，默认 false |
| `lang` | string | ❌ | 语言代码，默认 zh |
| `featured` | boolean | ❌ | 是否为精选文章 |
| `author` | string | ❌ | 作者名称 |
| `reading_time` | number | ❌ | 预估阅读时间（分钟） |

## 🏷️ 标签使用规范

### Web3 相关标签

```yaml
# 区块链基础
tags: [web3, blockchain, cryptocurrency, defi, nft]

# 以太坊生态
tags: [ethereum, solidity, smart-contract, evm, gas]

# 其他区块链
tags: [bitcoin, polygon, arbitrum, optimism, layer2]

# 开发工具
tags: [hardhat, truffle, remix, metamask, web3js, ethersjs]

# DeFi 协议
tags: [uniswap, aave, compound, makerdao, curve]
```

### AI 相关标签

```yaml
# AI 基础
tags: [ai, machine-learning, deep-learning, neural-network]

# 大语言模型
tags: [llm, gpt, chatgpt, openai, anthropic, claude]

# 框架和工具
tags: [tensorflow, pytorch, huggingface, langchain, llamaindex]

# 应用领域
tags: [nlp, computer-vision, reinforcement-learning, robotics]

# 开发相关
tags: [python, jupyter, api, model-training, fine-tuning]
```

### 通用技术标签

```yaml
# 编程语言
tags: [javascript, typescript, python, rust, go, solidity]

# 前端技术
tags: [vue, react, nextjs, nuxt, vite, webpack]

# 后端技术
tags: [nodejs, express, fastapi, django, postgresql, mongodb]

# 工具和平台
tags: [git, docker, kubernetes, aws, vercel, github]
```

### 内容类型标签

```yaml
# 文章类型
tags: [tutorial, guide, review, news, opinion, case-study]

# 难度级别
tags: [beginner, intermediate, advanced, expert]

# 内容长度
tags: [quick-tip, deep-dive, series, reference]
```

## 📖 Markdown 语法

### 1. 标题层级

```markdown
# 一级标题 (H1) - 仅用于文章标题
## 二级标题 (H2) - 主要章节
### 三级标题 (H3) - 子章节
#### 四级标题 (H4) - 详细分点
```

### 2. 文本格式

```markdown
**粗体文本**
*斜体文本*
~~删除线~~
`行内代码`
[链接文本](https://example.com)
![图片描述](./images/example.jpg)
```

### 3. 列表

```markdown
# 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2

# 有序列表
1. 第一步
2. 第二步
3. 第三步

# 任务列表
- [x] 已完成任务
- [ ] 待完成任务
```

### 4. 引用和提示

```markdown
> 这是一个引用块
> 可以包含多行内容

> **💡 提示**: 这是一个有用的提示
> 
> **⚠️ 警告**: 这是一个警告信息
> 
> **❌ 错误**: 这是一个错误提示
```

### 5. 表格

```markdown
| 列标题1 | 列标题2 | 列标题3 |
|---------|---------|---------|
| 内容1   | 内容2   | 内容3   |
| 内容4   | 内容5   | 内容6   |

# 对齐方式
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容   |   内容   |   内容 |
```

## 💻 代码块语法

### 1. 行内代码

```markdown
使用 `const` 关键字声明常量
调用 `web3.eth.getBalance()` 方法
```

### 2. 代码块

````markdown
```javascript
// JavaScript 代码示例
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');

async function getBalance(address) {
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, 'ether');
}
```
````

### 3. 支持的语言

```markdown
# 区块链相关
```solidity
```javascript
```typescript
```python
```rust
```go

# 前端技术
```vue
```html
```css
```scss
```json

# 后端技术
```python
```nodejs
```sql
```yaml
```bash

# 配置文件
```toml
```ini
```dockerfile
```
```

### 4. 代码块增强功能

````markdown
```javascript {1,3-5}
// 高亮第1行和第3-5行
const contract = new web3.eth.Contract(abi, address);
const result = await contract.methods.getValue().call();
console.log('Result:', result);
const tx = await contract.methods.setValue(100).send({from: account});
console.log('Transaction:', tx.transactionHash);
```

```solidity
// 文件名显示
// filename: MyContract.sol
pragma solidity ^0.8.0;

contract MyContract {
    uint256 public value;
    
    function setValue(uint256 _value) public {
        value = _value;
    }
}
```
````

### 5. 代码示例最佳实践

```markdown
# 完整示例
```javascript
// 连接到以太坊网络
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');

// 智能合约 ABI
const contractABI = [
  {
    "inputs": [],
    "name": "getValue",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// 合约地址
const contractAddress = '0x...';

// 创建合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 调用合约方法
async function getValue() {
  try {
    const result = await contract.methods.getValue().call();
    console.log('当前值:', result);
    return result;
  } catch (error) {
    console.error('调用失败:', error);
  }
}

// 执行函数
getValue();
```
```

## 🖼️ 图片和媒体

### 1. 图片使用

```markdown
# 基本语法
![图片描述](./images/example.jpg)

# 带链接的图片
[![图片描述](./images/example.jpg)](https://example.com)

# 指定尺寸（HTML 语法）
<img src="./images/example.jpg" alt="图片描述" width="500" height="300">
```

### 2. 图片存储

```
public/
├── images/
│   ├── posts/           # 文章配图
│   │   ├── web3-intro/
│   │   └── ai-agents/
│   ├── covers/          # 文章封面
│   └── icons/           # 图标资源
```

### 3. 图片优化建议

- **格式**: 优先使用 WebP，备选 PNG/JPG
- **尺寸**: 文章配图建议 800px 宽度
- **压缩**: 使用工具压缩图片大小
- **命名**: 使用描述性文件名

### 4. 视频嵌入

```markdown
# YouTube 视频
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>

# Bilibili 视频
<iframe src="//player.bilibili.com/player.html?bvid=BV_ID" width="560" height="315" frameborder="0" allowfullscreen></iframe>
```

## 🔍 SEO 优化

### 1. 标题优化

```markdown
# 好的标题示例
- "以太坊智能合约开发完整指南"
- "从零开始构建 AI Agent：实战教程"
- "DeFi 协议安全审计：最佳实践"

# 避免的标题
- "我的想法"
- "技术分享"
- "学习笔记"
```

### 2. 描述优化

```yaml
# 好的描述
description: "详细介绍以太坊智能合约开发流程，包括 Solidity 语法、开发环境搭建、合约部署和测试方法，适合区块链开发初学者"

# 避免的描述
description: "智能合约相关内容"
```

### 3. 关键词策略

```yaml
# 主关键词 + 长尾关键词
keywords: ["以太坊", "智能合约", "Solidity开发", "区块链教程", "Web3开发"]

# 避免关键词堆砌
keywords: ["以太坊", "以太坊开发", "以太坊智能合约", "以太坊教程"]
```

## 📤 发布流程

### 1. 文章创建

```bash
# 创建新文章文件
touch pages/posts/new-article.md

# 使用模板
cp pages/posts/_template.md pages/posts/new-article.md
```

### 2. 本地预览

```bash
# 启动开发服务器
pnpm dev

# 访问文章页面
http://localhost:3333/posts/new-article
```

### 3. 内容检查

- [ ] Frontmatter 格式正确
- [ ] 标签符合规范
- [ ] 图片链接有效
- [ ] 代码块语法正确
- [ ] 链接可以正常访问
- [ ] 移动端显示正常

### 4. 发布部署

```bash
# 提交到 Git
git add .
git commit -m "Add new article: 文章标题"
git push origin main

# 自动部署到 Vercel
# 等待构建完成
```

## 📊 文章分析

### 1. 阅读时间计算

```javascript
// 大约每分钟阅读 200-250 个中文字符
const readingTime = Math.ceil(wordCount / 225);
```

### 2. 文章质量检查

- **长度**: 建议 1500+ 字符
- **结构**: 清晰的标题层级
- **代码**: 完整可运行的示例
- **图片**: 相关且高质量的配图
- **链接**: 权威可靠的参考资料

## 💡 写作技巧

### 1. 开头吸引读者

```markdown
# 好的开头
在区块链世界中，智能合约就像是不可篡改的数字协议。今天我们将从零开始，学习如何开发你的第一个以太坊智能合约。

# 避免的开头
今天我想分享一下智能合约的相关知识。
```

### 2. 使用具体示例

```markdown
# 具体示例
以下是一个简单的 ERC-20 代币合约：

```solidity
contract MyToken {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}
```

# 避免抽象描述
智能合约可以实现代币转账功能。
```

### 3. 提供实用价值

- 解决实际问题
- 提供可操作的步骤
- 分享经验教训
- 给出最佳实践建议

## 🆘 常见问题

### Q: 如何处理代码块中的特殊字符？
A: 使用 HTML 实体编码或反引号转义

### Q: 图片加载失败怎么办？
A: 检查路径是否正确，确保图片存在于 `public` 目录

### Q: 如何添加数学公式？
A: 可以使用 LaTeX 语法或 MathJax

### Q: 文章更新后如何处理？
A: 更新 `updated` 字段，保留原始 `date`

---

遵循这个指南，你就能创作出高质量的技术文章，为 Web3 和 AI 社区贡献有价值的内容！