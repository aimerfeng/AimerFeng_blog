---
title: Projects - AimerFeng
display: Projects
description: AI 与 Web3 项目作品集
wrapperClass: 'text-center'
art: dots
projects:
  AI & 智能应用:
    - name: 'NeuralFS'
      link: 'https://github.com/aimerfeng/NeuralFS'
      desc: 'AI 驱动的沉浸式文件系统外壳，将"基于路径的存储"转变为"基于意图的检索"，支持语义搜索、智能标签、逻辑链条关联'
      icon: 'i-carbon-folder-shared'
    - name: 'AgentLink'
      link: 'https://github.com/aimerfeng/AgentLink'
      desc: '企业级 AI 变现 SaaS 平台，支持 Google A2A 协议多智能体编排、Prompt 加密保护、区块链所有权认证'
      icon: 'i-carbon-bot'
    - name: 'HR QA System'
      link: 'https://github.com/aimerfeng/hr-qa-system'
      desc: '智能 HR 问答系统，语义匹配 + LLM 双通道架构，支持多模型对比、知识库管理'
      icon: 'i-carbon-chat-bot'
    - name: 'AI Assistant Agent'
      link: 'https://github.com/aimerfeng/hr-weather-qs'
      desc: '基于 OpenAI SDK 的智能代理系统，提供天气查询和职业规划功能，支持流式输出和多 AI 提供商'
      icon: 'i-carbon-ibm-watson-assistant'

  Web3 & 区块链:
    - name: 'AI Smart Wallet'
      link: 'https://github.com/aimerfeng/AI-Smart-Wallet'
      desc: '下一代智能合约钱包，AI 意图解析 + ZK 隐私策略 + 社交恢复，支持自然语言交易'
      icon: 'i-carbon-wallet'
    - name: 'Vue Web3 Tip'
      link: 'https://github.com/aimerfeng/vue-web3-tip'
      desc: 'Vue 3 Web3 打赏组件，支持 Ethereum/Polygon/Solana 多链，MetaMask 和 Phantom 钱包集成'
      icon: 'i-carbon-gift'

  移动端 & 桌面应用:
    - name: 'Premium Todo'
      link: 'https://github.com/aimerfeng/todolist'
      desc: '数字子弹笔记本 Android 应用，真实墨水物理模拟、智能符号识别、OpenGL ES 3.0 渲染'
      icon: 'i-carbon-pen'
    - name: 'AutoCamera'
      link: 'https://github.com/aimerfeng/The-Sixth-Request-for-Assistance-Project'
      desc: 'Blazor WebAssembly 自动拍照应用，支持定时拍照、照片管理、前后摄像头切换'
      icon: 'i-carbon-camera'

  个人网站:
    - name: 'AimerFeng Blog'
      link: 'https://aimer-feng-blog.vercel.app/'
      desc: '个人技术博客，Vue 3 + Vite + UnoCSS，玻璃质感设计，支持 Web3 打赏'
      icon: 'i-carbon-blog'
    - name: 'AimerFeng CV'
      link: 'https://aimerfeng.github.io/aimerfeng-cv/'
      desc: '个人简历网站，响应式设计，支持暗色模式和 PDF 打印'
      icon: 'i-carbon-document'
---

<!-- @layout-full-width -->
<ListProjects :projects="frontmatter.projects" />
