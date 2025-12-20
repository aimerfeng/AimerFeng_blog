---
title: 开源项目：Gemini Prompt Optimizer - 智能提示词优化工具
date: 2024-12-21
lang: zh
duration: 8min
description: 介绍我开发的 Gemini Prompt Optimizer 项目，一个基于 Gemini API 的智能提示词优化工具
---

[[toc]]

## 项目背景

在使用大语言模型（LLM）的过程中，提示词（Prompt）的质量直接决定了输出结果的好坏。一个好的提示词可以让 AI 输出更准确、更有价值的内容，而一个模糊或结构不清的提示词往往会导致不理想的结果。

为了解决这个问题，我开发了 [Gemini Prompt Optimizer](https://github.com/aimerfeng/gemini-)，一个基于 Google Gemini API 的智能提示词优化工具。

## 核心功能

### 1. 智能分析

工具会自动分析你的提示词，识别以下问题：

- 语义模糊的表达
- 缺失的上下文信息
- 结构不清晰的指令
- 可能导致歧义的措辞

### 2. 自动优化

基于分析结果，工具会：

- 重构提示词结构
- 添加必要的约束条件
- 优化表达方式
- 提供多个优化版本供选择

### 3. 对比展示

优化前后的提示词会并排展示，让你清楚地看到：

- 具体做了哪些改动
- 为什么要这样改
- 预期的效果提升

## 技术实现

项目使用 Python 开发，核心技术栈包括：

```python
# 核心依赖
google-generativeai  # Gemini API
rich                 # 终端美化输出
click               # CLI 框架
```

### 架构设计

```
gemini-prompt-optimizer/
├── src/
│   ├── analyzer.py      # 提示词分析模块
│   ├── optimizer.py     # 优化策略实现
│   ├── templates/       # 优化模板
│   └── utils/           # 工具函数
├── examples/            # 示例提示词
└── tests/              # 测试用例
```

## 使用示例

```bash
# 安装
pip install gemini-prompt-optimizer

# 优化提示词
gpo optimize "帮我写一篇文章"

# 输出优化后的提示词
# 原始: 帮我写一篇文章
# 优化: 请以专业技术博主的身份，撰写一篇关于[主题]的技术文章。
#       要求：1. 字数约2000字 2. 包含代码示例 3. 面向中级开发者
```

## 项目地址

- GitHub: [https://github.com/aimerfeng/gemini-](https://github.com/aimerfeng/gemini-)

欢迎 Star 和贡献代码！
