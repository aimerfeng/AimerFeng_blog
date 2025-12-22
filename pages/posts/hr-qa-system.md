---
title: HR QA System - 基于 AI 的智能人力资源问答系统
date: 2025-11-15
lang: zh-CN
duration: 8min
description: 使用 LangChain 和 FastAPI 构建智能 HR 问答系统，支持自然语言查询员工信息
---

[[toc]]

## 项目简介

HR QA System 是一个基于 AI 的智能人力资源问答系统，允许用户通过自然语言查询员工信息、考勤记录、薪资数据等 HR 相关信息。

**项目链接：**

- GitHub: [aimerfeng/hr-qa-system](https://github.com/aimerfeng/hr-qa-system)
- 在线演示: [hr-qa-system.vercel.app](https://hr-qa-system.vercel.app)
- Docker Hub: [aimerfeng/hr-qa-backend](https://hub.docker.com/r/aimerfeng/hr-qa-backend)

## 技术栈

### 后端

- **Python** - 主要开发语言
- **FastAPI** - 高性能 Web 框架
- **LangChain** - LLM 应用开发框架
- **SQLAlchemy** - ORM 数据库操作

### 前端

- **Vue 3** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### 部署

- **Vercel** - 前端部署
- **Docker** - 容器化部署
- **Docker Hub** - 镜像托管

## 核心功能

### 1. 自然语言查询

用户可以用自然语言提问，系统会智能理解并返回相关信息：

```
用户: "张三的入职时间是什么时候？"
系统: "张三于 2023 年 3 月 15 日入职，目前在技术部担任高级工程师。"
```

### 2. 多轮对话

支持上下文理解，可以进行连续对话：

```
用户: "技术部有多少人？"
系统: "技术部目前有 15 名员工。"

用户: "他们的平均薪资是多少？"
系统: "技术部员工的平均薪资为 ¥25,000/月。"
```

### 3. 数据安全

- 基于角色的访问控制
- 敏感信息脱敏处理
- 查询日志审计

## 架构设计

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   FastAPI   │────▶│  LangChain  │
│   (Vue 3)   │     │   Backend   │     │    Agent    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Database   │     │   LLM API   │
                    │  (SQLite)   │     │  (OpenAI)   │
                    └─────────────┘     └─────────────┘
```

## 快速开始

### 使用 Docker

```bash
# 拉取镜像
docker pull aimerfeng/hr-qa-backend

# 运行容器
docker run -p 8000:8000 aimerfeng/hr-qa-backend
```

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/aimerfeng/hr-qa-system.git
cd hr-qa-system

# 安装依赖
pip install -r requirements.txt

# 启动后端
uvicorn main:app --reload

# 启动前端
cd frontend
npm install
npm run dev
```

## 技术亮点

### LangChain Agent

使用 LangChain 的 Agent 功能，让 LLM 能够：

- 理解用户意图
- 选择合适的工具（数据库查询、计算等）
- 组织返回结果

### 提示词工程

精心设计的系统提示词，确保：

- 准确理解 HR 领域术语
- 返回结构化、易读的答案
- 处理模糊查询和边界情况

### 容器化部署

完整的 Docker 支持：

- 多阶段构建优化镜像大小
- 环境变量配置
- 健康检查

## 未来规划

- [ ] 支持更多数据源（Excel、API）
- [ ] 添加语音输入功能
- [ ] 集成企业微信/钉钉
- [ ] 支持自定义知识库

## 总结

HR QA System 展示了如何将 LLM 技术应用于企业场景，通过自然语言交互大大降低了 HR 数据查询的门槛。项目采用现代化的技术栈，具有良好的可扩展性和部署便利性。

如果你对这个项目感兴趣，欢迎 Star 和 Fork！
