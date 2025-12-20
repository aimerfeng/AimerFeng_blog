---
title: Google Gemini API 入门教程：从零开始构建 AI 应用
date: 2024-12-19
lang: zh
duration: 15min
description: 详细介绍如何使用 Google Gemini API 构建 AI 应用，包含完整代码示例
---

[[toc]]

## Gemini API 简介

Google Gemini 是 Google 最新的多模态大语言模型，支持文本、图像、音频等多种输入。相比 GPT-4，Gemini 在某些任务上表现更优，且 API 价格更具竞争力。

## 快速开始

### 1. 获取 API Key

访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 创建 API Key。

### 2. 安装 SDK

```bash
pip install google-generativeai
```

### 3. 基础使用

```python
import google.generativeai as genai

# 配置 API Key
genai.configure(api_key='YOUR_API_KEY')

# 创建模型实例
model = genai.GenerativeModel('gemini-pro')

# 生成内容
response = model.generate_content("解释什么是机器学习")
print(response.text)
```

## 进阶用法

### 多轮对话

```python
# 创建聊天会话
chat = model.start_chat(history=[])

# 发送消息
response = chat.send_message("你好，我想学习 Python")
print(response.text)

# 继续对话
response = chat.send_message("有什么好的学习资源推荐吗？")
print(response.text)
```

### 图像理解

```python
import PIL.Image

# 使用多模态模型
model = genai.GenerativeModel('gemini-pro-vision')

# 加载图片
image = PIL.Image.open('example.jpg')

# 分析图片
response = model.generate_content([
    "描述这张图片的内容",
    image
])
print(response.text)
```

### 流式输出

```python
# 流式生成
response = model.generate_content(
    "写一篇关于 AI 的文章",
    stream=True
)

for chunk in response:
    print(chunk.text, end='')
```

## 参数调优

```python
# 配置生成参数
generation_config = {
    "temperature": 0.7,      # 创造性程度
    "top_p": 0.9,           # 采样范围
    "top_k": 40,            # 候选词数量
    "max_output_tokens": 2048,  # 最大输出长度
}

model = genai.GenerativeModel(
    'gemini-pro',
    generation_config=generation_config
)
```

## 安全设置

```python
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# 配置安全过滤
safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}

response = model.generate_content(
    prompt,
    safety_settings=safety_settings
)
```

## 实战项目

我基于 Gemini API 开发了 [Prompt Optimizer](https://github.com/aimerfeng/gemini-)，可以自动优化 AI 提示词。核心代码：

```python
def optimize_prompt(original_prompt: str) -> str:
    """优化提示词"""
    system_prompt = """
    你是一个提示词优化专家。分析用户的提示词，
    找出问题并给出优化版本。
    """

    response = model.generate_content([
        system_prompt,
        f"请优化这个提示词：{original_prompt}"
    ])

    return response.text
```

## 总结

Gemini API 功能强大且易于使用，非常适合构建各类 AI 应用。建议从简单的文本生成开始，逐步探索多模态能力。

## 相关资源

- [Gemini API 官方文档](https://ai.google.dev/docs)
- [我的 Prompt Optimizer 项目](https://github.com/aimerfeng/gemini-)
