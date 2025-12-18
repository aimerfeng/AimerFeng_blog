---
title: LLM 应用开发实战 - 从 Prompt 工程到 RAG 系统
date: 2024-12-18
description: 深入学习大语言模型应用开发，涵盖 Prompt 工程、RAG 架构、向量数据库和生产部署
tags: [ai, llm, python]
---

# LLM 应用开发实战

大语言模型（LLM）正在改变软件开发的方式。本文将分享我在 LLM 应用开发中的实践经验，从基础的 Prompt 工程到复杂的 RAG 系统。

## Prompt 工程基础

### 1. 结构化 Prompt

好的 Prompt 应该清晰、具体、有结构：

```python
from openai import OpenAI

client = OpenAI()

def structured_prompt(task: str, context: str, requirements: list[str]) -> str:
    """构建结构化 Prompt"""
    requirements_text = "\n".join(f"- {r}" for r in requirements)
    
    prompt = f"""
# 任务
{task}

# 背景信息
{context}

# 要求
{requirements_text}

# 输出格式
请以 JSON 格式返回结果。
"""
    return prompt

# 使用示例
prompt = structured_prompt(
    task="分析用户评论的情感倾向",
    context="这是一个电商平台的商品评论",
    requirements=[
        "识别正面、负面、中性情感",
        "提取关键词",
        "给出置信度分数"
    ]
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}],
    response_format={"type": "json_object"}
)
```

### 2. Few-Shot Learning

通过示例引导模型输出：

```python
def few_shot_prompt(examples: list[dict], query: str) -> str:
    """构建 Few-Shot Prompt"""
    examples_text = ""
    for ex in examples:
        examples_text += f"""
输入: {ex['input']}
输出: {ex['output']}
---
"""
    
    return f"""
请根据以下示例，完成任务：

{examples_text}

现在请处理：
输入: {query}
输出:"""

# 示例：代码翻译
examples = [
    {
        "input": "Python: print('Hello')",
        "output": "JavaScript: console.log('Hello')"
    },
    {
        "input": "Python: len(arr)",
        "output": "JavaScript: arr.length"
    }
]

prompt = few_shot_prompt(examples, "Python: for i in range(10):")
```

### 3. Chain of Thought (CoT)

让模型展示推理过程：

```python
def cot_prompt(problem: str) -> str:
    """Chain of Thought Prompt"""
    return f"""
请解决以下问题，并展示你的思考过程：

问题：{problem}

请按以下步骤回答：
1. 首先，理解问题的关键点
2. 然后，分析可能的解决方案
3. 接着，选择最佳方案并解释原因
4. 最后，给出最终答案

让我们一步步思考：
"""

# 使用
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{
        "role": "user",
        "content": cot_prompt("如何设计一个高并发的消息队列系统？")
    }]
)
```

## RAG 系统开发

RAG（Retrieval-Augmented Generation）通过检索增强生成，让 LLM 能够访问外部知识。

### 架构概览

```
┌─────────────────────────────────────────────────────┐
│                    RAG Pipeline                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │ Document │───▶│ Chunking │───▶│ Embedding│      │
│  │  Loader  │    │          │    │          │      │
│  └──────────┘    └──────────┘    └────┬─────┘      │
│                                       │             │
│                                       ▼             │
│                               ┌──────────────┐      │
│                               │ Vector Store │      │
│                               └──────┬───────┘      │
│                                      │              │
│  ┌──────────┐    ┌──────────┐       │              │
│  │  Query   │───▶│ Retriever│◀──────┘              │
│  └──────────┘    └────┬─────┘                      │
│                       │                             │
│                       ▼                             │
│               ┌──────────────┐                      │
│               │   LLM + RAG  │                      │
│               │   Response   │                      │
│               └──────────────┘                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 完整实现

```python
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import DirectoryLoader, TextLoader

# 1. 加载文档
def load_documents(directory: str):
    """加载目录下的所有文档"""
    loader = DirectoryLoader(
        directory,
        glob="**/*.md",
        loader_cls=TextLoader
    )
    return loader.load()

# 2. 文档分块
def split_documents(documents, chunk_size=1000, chunk_overlap=200):
    """将文档分割成小块"""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", "。", "！", "？", " ", ""]
    )
    return splitter.split_documents(documents)

# 3. 创建向量存储
def create_vector_store(chunks, persist_directory="./chroma_db"):
    """创建并持久化向量存储"""
    embeddings = OpenAIEmbeddings()
    
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory
    )
    
    return vectorstore

# 4. 构建 RAG Chain
def create_rag_chain(vectorstore):
    """创建 RAG 问答链"""
    llm = ChatOpenAI(model="gpt-4", temperature=0)
    
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}
    )
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    
    return qa_chain

# 完整流程
def build_rag_system(docs_directory: str):
    """构建完整的 RAG 系统"""
    # 加载文档
    print("📚 加载文档...")
    documents = load_documents(docs_directory)
    
    # 分块
    print("✂️ 分割文档...")
    chunks = split_documents(documents)
    
    # 创建向量存储
    print("🔢 创建向量索引...")
    vectorstore = create_vector_store(chunks)
    
    # 创建 RAG Chain
    print("🔗 构建 RAG Chain...")
    qa_chain = create_rag_chain(vectorstore)
    
    print("✅ RAG 系统构建完成!")
    return qa_chain

# 使用
rag = build_rag_system("./knowledge_base")
result = rag.invoke({"query": "如何部署智能合约？"})
print(result["result"])
```

## 向量数据库选型

### 常用向量数据库对比

| 数据库 | 特点 | 适用场景 |
|--------|------|----------|
| Chroma | 轻量、易用 | 原型开发、小规模 |
| Pinecone | 托管服务、高性能 | 生产环境、大规模 |
| Milvus | 开源、功能丰富 | 自托管、企业级 |
| Weaviate | GraphQL API | 复杂查询需求 |
| Qdrant | Rust 实现、高性能 | 高性能需求 |

### Pinecone 集成示例

```python
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings

# 初始化 Pinecone
pc = Pinecone(api_key="your-api-key")

# 创建索引
index_name = "my-rag-index"
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1536,  # OpenAI embedding 维度
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

# 创建向量存储
embeddings = OpenAIEmbeddings()
vectorstore = PineconeVectorStore(
    index=pc.Index(index_name),
    embedding=embeddings,
    text_key="text"
)

# 添加文档
vectorstore.add_documents(chunks)

# 相似度搜索
results = vectorstore.similarity_search("智能合约安全", k=5)
```

## 流式输出

提升用户体验的关键：

```python
from openai import OpenAI

client = OpenAI()

def stream_response(prompt: str):
    """流式输出响应"""
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )
    
    for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content

# 使用
for text in stream_response("解释什么是区块链"):
    print(text, end="", flush=True)
```

### FastAPI 流式接口

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from openai import OpenAI

app = FastAPI()
client = OpenAI()

@app.post("/chat/stream")
async def chat_stream(message: str):
    async def generate():
        stream = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": message}],
            stream=True
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {chunk.choices[0].delta.content}\n\n"
        
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )
```

## 成本优化

### 1. Token 计算和预算控制

```python
import tiktoken

def count_tokens(text: str, model: str = "gpt-4") -> int:
    """计算文本的 token 数量"""
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

def estimate_cost(input_tokens: int, output_tokens: int, model: str = "gpt-4") -> float:
    """估算 API 调用成本"""
    # GPT-4 价格（示例，实际价格请查看官方）
    prices = {
        "gpt-4": {"input": 0.03, "output": 0.06},
        "gpt-3.5-turbo": {"input": 0.0015, "output": 0.002}
    }
    
    price = prices.get(model, prices["gpt-4"])
    cost = (input_tokens / 1000 * price["input"]) + \
           (output_tokens / 1000 * price["output"])
    
    return cost

# 使用
text = "这是一段测试文本..."
tokens = count_tokens(text)
print(f"Token 数量: {tokens}")
print(f"预估成本: ${estimate_cost(tokens, 500):.4f}")
```

### 2. 缓存策略

```python
import hashlib
import json
from functools import lru_cache
import redis

# 内存缓存
@lru_cache(maxsize=1000)
def cached_completion(prompt_hash: str) -> str:
    """基于 LRU 的内存缓存"""
    # 实际调用 API
    pass

# Redis 缓存
class LLMCache:
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis = redis.from_url(redis_url)
        self.ttl = 3600 * 24  # 24 小时
    
    def _hash_prompt(self, prompt: str, model: str) -> str:
        content = f"{model}:{prompt}"
        return hashlib.sha256(content.encode()).hexdigest()
    
    def get(self, prompt: str, model: str) -> str | None:
        key = self._hash_prompt(prompt, model)
        cached = self.redis.get(key)
        return cached.decode() if cached else None
    
    def set(self, prompt: str, model: str, response: str):
        key = self._hash_prompt(prompt, model)
        self.redis.setex(key, self.ttl, response)

# 使用
cache = LLMCache()

def cached_chat(prompt: str, model: str = "gpt-4") -> str:
    # 检查缓存
    cached = cache.get(prompt, model)
    if cached:
        return cached
    
    # 调用 API
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}]
    )
    result = response.choices[0].message.content
    
    # 存入缓存
    cache.set(prompt, model, result)
    
    return result
```

## 生产部署最佳实践

### 1. 错误处理和重试

```python
from tenacity import retry, stop_after_attempt, wait_exponential
from openai import RateLimitError, APIError

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    retry=lambda e: isinstance(e, (RateLimitError, APIError))
)
def robust_completion(prompt: str) -> str:
    """带重试机制的 API 调用"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

### 2. 监控和日志

```python
import logging
import time
from dataclasses import dataclass
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class LLMMetrics:
    timestamp: datetime
    model: str
    input_tokens: int
    output_tokens: int
    latency_ms: float
    success: bool
    error: str | None = None

class LLMMonitor:
    def __init__(self):
        self.metrics: list[LLMMetrics] = []
    
    def record(self, metric: LLMMetrics):
        self.metrics.append(metric)
        logger.info(f"LLM Call: model={metric.model}, "
                   f"tokens={metric.input_tokens}+{metric.output_tokens}, "
                   f"latency={metric.latency_ms:.0f}ms")
    
    def get_stats(self) -> dict:
        if not self.metrics:
            return {}
        
        total_tokens = sum(m.input_tokens + m.output_tokens for m in self.metrics)
        avg_latency = sum(m.latency_ms for m in self.metrics) / len(self.metrics)
        success_rate = sum(1 for m in self.metrics if m.success) / len(self.metrics)
        
        return {
            "total_calls": len(self.metrics),
            "total_tokens": total_tokens,
            "avg_latency_ms": avg_latency,
            "success_rate": success_rate
        }

monitor = LLMMonitor()

def monitored_completion(prompt: str, model: str = "gpt-4") -> str:
    start = time.time()
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        
        metric = LLMMetrics(
            timestamp=datetime.now(),
            model=model,
            input_tokens=response.usage.prompt_tokens,
            output_tokens=response.usage.completion_tokens,
            latency_ms=(time.time() - start) * 1000,
            success=True
        )
        monitor.record(metric)
        
        return response.choices[0].message.content
        
    except Exception as e:
        metric = LLMMetrics(
            timestamp=datetime.now(),
            model=model,
            input_tokens=0,
            output_tokens=0,
            latency_ms=(time.time() - start) * 1000,
            success=False,
            error=str(e)
        )
        monitor.record(metric)
        raise
```

## 总结

LLM 应用开发的关键要点：

- 📝 **Prompt 工程** - 结构化、Few-Shot、CoT
- 🔍 **RAG 系统** - 让 LLM 访问外部知识
- 💾 **向量数据库** - 选择适合的存储方案
- 🌊 **流式输出** - 提升用户体验
- 💰 **成本优化** - 缓存、Token 控制
- 🛡️ **生产就绪** - 错误处理、监控

希望这篇文章对你的 LLM 应用开发有所帮助！

---

<div class="mt-8 p-4 glass-card">
  <p class="text-sm op-75">
    🚀 如果你正在开发 LLM 应用，欢迎交流讨论！
  </p>
</div>
