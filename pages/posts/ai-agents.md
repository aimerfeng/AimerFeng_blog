---
title: AI Agent 开发入门 - 构建你的第一个智能代理
date: 2024-12-17
description: 从零开始学习 AI Agent 开发，使用 Python 和 LangChain 构建能够自主完成任务的智能代理
tags: [ai, llm, python]
---

# AI Agent 开发入门

AI Agent（智能代理）是能够感知环境、做出决策并采取行动的 AI 系统。与传统的聊天机器人不同，Agent 可以使用工具、访问外部数据，并自主完成复杂任务。

## 什么是 AI Agent？

AI Agent 的核心特征：

- 🧠 **自主决策** - 根据目标自主规划和执行任务
- 🔧 **工具使用** - 能够调用 API、搜索网络、执行代码
- 💾 **记忆能力** - 保持对话上下文和长期记忆
- 🔄 **迭代改进** - 根据反馈调整策略

### Agent 架构

```
┌─────────────────────────────────────────┐
│              AI Agent                    │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │   LLM   │  │ Memory  │  │ Planner │ │
│  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │            │            │       │
│       └────────────┼────────────┘       │
│                    │                    │
│            ┌───────┴───────┐            │
│            │   Executor    │            │
│            └───────┬───────┘            │
│                    │                    │
│  ┌─────────┬───────┼───────┬─────────┐ │
│  │ Tool 1  │ Tool 2│ Tool 3│ Tool N  │ │
│  └─────────┴───────┴───────┴─────────┘ │
└─────────────────────────────────────────┘
```

## 环境准备

首先安装必要的依赖：

```bash
pip install langchain langchain-openai python-dotenv
```

配置环境变量：

```python
# .env
OPENAI_API_KEY=sk-your-api-key
```

## 基础 Agent 实现

### 1. 简单的 ReAct Agent

ReAct（Reasoning + Acting）是最常用的 Agent 模式：

```python
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool
from langchain import hub

# 初始化 LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

# 定义工具
def search_web(query: str) -> str:
    """模拟网络搜索"""
    return f"搜索结果: 关于 '{query}' 的最新信息..."

def calculate(expression: str) -> str:
    """计算数学表达式"""
    try:
        result = eval(expression)
        return f"计算结果: {result}"
    except Exception as e:
        return f"计算错误: {str(e)}"

tools = [
    Tool(
        name="Search",
        func=search_web,
        description="用于搜索网络获取最新信息"
    ),
    Tool(
        name="Calculator",
        func=calculate,
        description="用于计算数学表达式"
    )
]

# 获取 ReAct prompt 模板
prompt = hub.pull("hwchase17/react")

# 创建 Agent
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 运行 Agent
result = agent_executor.invoke({
    "input": "比特币现在的价格是多少？如果我有 0.5 个比特币，价值多少美元？"
})
print(result["output"])
```

### 2. 带记忆的 Agent

```python
from langchain.memory import ConversationBufferMemory
from langchain.agents import AgentExecutor, create_react_agent

# 创建记忆组件
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

# 创建带记忆的 Agent
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True
)

# 多轮对话
agent_executor.invoke({"input": "我叫然然，请记住我的名字"})
agent_executor.invoke({"input": "我叫什么名字？"})  # Agent 会记住
```

## 自定义工具开发

### 使用装饰器定义工具

```python
from langchain.tools import tool
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(description="搜索关键词")
    max_results: int = Field(default=5, description="最大结果数")

@tool("advanced_search", args_schema=SearchInput)
def advanced_search(query: str, max_results: int = 5) -> str:
    """
    高级搜索工具，支持限制结果数量。
    用于搜索网络获取信息。
    """
    # 实际实现中可以调用搜索 API
    results = [f"结果 {i+1}: 关于 {query} 的信息" for i in range(max_results)]
    return "\n".join(results)
```

### API 调用工具

```python
import requests
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """获取指定城市的天气信息"""
    # 示例 API 调用
    api_key = "your-api-key"
    url = f"https://api.weatherapi.com/v1/current.json?key={api_key}&q={city}"
    
    try:
        response = requests.get(url)
        data = response.json()
        return f"{city} 当前温度: {data['current']['temp_c']}°C"
    except Exception as e:
        return f"获取天气失败: {str(e)}"

@tool
def execute_code(code: str) -> str:
    """执行 Python 代码并返回结果"""
    try:
        # 注意：生产环境需要沙箱隔离
        exec_globals = {}
        exec(code, exec_globals)
        return str(exec_globals.get('result', '代码执行成功'))
    except Exception as e:
        return f"执行错误: {str(e)}"
```

## 高级 Agent 模式

### 1. 多 Agent 协作

```python
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

class ResearchAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4", temperature=0.7)
    
    def research(self, topic: str) -> str:
        messages = [
            SystemMessage(content="你是一个专业的研究员，擅长收集和整理信息。"),
            HumanMessage(content=f"请研究以下主题并提供详细报告: {topic}")
        ]
        return self.llm.invoke(messages).content

class WriterAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4", temperature=0.8)
    
    def write(self, research: str, style: str = "博客") -> str:
        messages = [
            SystemMessage(content=f"你是一个专业的{style}作者。"),
            HumanMessage(content=f"基于以下研究内容，撰写一篇文章:\n\n{research}")
        ]
        return self.llm.invoke(messages).content

class EditorAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4", temperature=0.3)
    
    def edit(self, content: str) -> str:
        messages = [
            SystemMessage(content="你是一个严格的编辑，负责校对和改进文章。"),
            HumanMessage(content=f"请校对并改进以下文章:\n\n{content}")
        ]
        return self.llm.invoke(messages).content

# 协作流程
def create_article(topic: str) -> str:
    researcher = ResearchAgent()
    writer = WriterAgent()
    editor = EditorAgent()
    
    # 1. 研究
    research = researcher.research(topic)
    print("📚 研究完成")
    
    # 2. 写作
    draft = writer.write(research)
    print("✍️ 初稿完成")
    
    # 3. 编辑
    final = editor.edit(draft)
    print("✅ 编辑完成")
    
    return final

# 使用
article = create_article("Web3 与 AI 的融合趋势")
```

### 2. 自我反思 Agent

```python
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

class ReflectiveAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4", temperature=0.7)
        self.max_iterations = 3
    
    def solve(self, problem: str) -> str:
        solution = self._initial_solution(problem)
        
        for i in range(self.max_iterations):
            critique = self._critique(problem, solution)
            
            if "满意" in critique or "正确" in critique:
                break
            
            solution = self._improve(problem, solution, critique)
            print(f"🔄 迭代 {i+1} 完成")
        
        return solution
    
    def _initial_solution(self, problem: str) -> str:
        messages = [
            SystemMessage(content="你是一个问题解决专家。"),
            HumanMessage(content=f"请解决以下问题:\n{problem}")
        ]
        return self.llm.invoke(messages).content
    
    def _critique(self, problem: str, solution: str) -> str:
        messages = [
            SystemMessage(content="你是一个严格的评审员。"),
            HumanMessage(content=f"""
问题: {problem}

解决方案: {solution}

请评估这个解决方案的质量，指出任何问题或改进空间。
如果解决方案已经很好，请说"满意"。
""")
        ]
        return self.llm.invoke(messages).content
    
    def _improve(self, problem: str, solution: str, critique: str) -> str:
        messages = [
            SystemMessage(content="你是一个问题解决专家。"),
            HumanMessage(content=f"""
问题: {problem}

当前解决方案: {solution}

评审意见: {critique}

请根据评审意见改进解决方案。
""")
        ]
        return self.llm.invoke(messages).content
```

## 实战：构建代码助手 Agent

```python
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import tool
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
import subprocess

@tool
def read_file(filepath: str) -> str:
    """读取文件内容"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"读取失败: {str(e)}"

@tool
def write_file(filepath: str, content: str) -> str:
    """写入文件内容"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return f"成功写入 {filepath}"
    except Exception as e:
        return f"写入失败: {str(e)}"

@tool
def run_python(code: str) -> str:
    """执行 Python 代码"""
    try:
        result = subprocess.run(
            ['python', '-c', code],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0:
            return result.stdout or "执行成功，无输出"
        return f"错误: {result.stderr}"
    except Exception as e:
        return f"执行失败: {str(e)}"

# 创建代码助手
tools = [read_file, write_file, run_python]

prompt = ChatPromptTemplate.from_messages([
    ("system", """你是一个专业的编程助手，可以帮助用户：
1. 阅读和分析代码
2. 编写和修改代码
3. 运行和测试代码

请一步步思考，确保代码正确后再执行。"""),
    MessagesPlaceholder(variable_name="chat_history", optional=True),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

llm = ChatOpenAI(model="gpt-4", temperature=0)
agent = create_openai_functions_agent(llm, tools, prompt)
code_assistant = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 使用示例
result = code_assistant.invoke({
    "input": "创建一个 Python 文件，实现斐波那契数列函数，然后测试它"
})
```

## 最佳实践

### 1. 错误处理

```python
from langchain.callbacks import get_openai_callback

def safe_agent_run(agent_executor, input_text: str):
    try:
        with get_openai_callback() as cb:
            result = agent_executor.invoke({"input": input_text})
            print(f"Token 使用: {cb.total_tokens}")
            return result
    except Exception as e:
        return {"output": f"Agent 执行失败: {str(e)}"}
```

### 2. 限制迭代次数

```python
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_iterations=10,  # 防止无限循环
    max_execution_time=60,  # 超时限制（秒）
    early_stopping_method="generate"
)
```

### 3. 日志和监控

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LoggingCallback:
    def on_tool_start(self, tool_name: str, input_str: str):
        logger.info(f"🔧 调用工具: {tool_name}")
        logger.info(f"   输入: {input_str[:100]}...")
    
    def on_tool_end(self, output: str):
        logger.info(f"   输出: {output[:100]}...")
```

## 总结

AI Agent 开发是一个快速发展的领域，核心要点：

- 🎯 明确 Agent 的目标和边界
- 🔧 设计好用的工具集
- 💾 合理管理记忆和上下文
- 🛡️ 做好错误处理和安全防护

下一篇文章，我们将深入探讨 LLM 应用开发的更多技巧！

---

<div class="mt-8 p-4 glass-card">
  <p class="text-sm op-75">
    🤖 本文代码已在 GitHub 开源，欢迎交流讨论！
  </p>
</div>
