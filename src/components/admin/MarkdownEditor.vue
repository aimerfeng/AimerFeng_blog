<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const content = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const isPreview = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()

// 简单的 Markdown 预览渲染
function renderMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Line breaks
    .replace(/\n/g, '<br>')
}

// 插入文本辅助函数
function insertText(before: string, after = '') {
  const textarea = textareaRef.value
  if (!textarea)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = content.value.substring(start, end)

  const newText = content.value.substring(0, start)
    + before + selected + after
    + content.value.substring(end)

  content.value = newText

  // 恢复光标位置
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(
      start + before.length,
      start + before.length + selected.length,
    )
  }, 0)
}

// 工具栏操作
function insertBold() {
  insertText('**', '**')
}
function insertItalic() {
  insertText('*', '*')
}
function insertCode() {
  insertText('`', '`')
}
function insertCodeBlock() {
  insertText('```\n', '\n```')
}
function insertLink() {
  insertText('[', '](url)')
}
function insertImage() {
  insertText('![alt](', ')')
}
function insertH2() {
  insertText('## ')
}
function insertH3() {
  insertText('### ')
}
function insertList() {
  insertText('- ')
}

// 自动调整高度
watch(content, () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
})
</script>

<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-group">
        <button type="button" title="标题2" @click="insertH2">
          H2
        </button>
        <button type="button" title="标题3" @click="insertH3">
          H3
        </button>
        <button type="button" title="粗体" @click="insertBold">
          <span class="i-carbon-text-bold" />
        </button>
        <button type="button" title="斜体" @click="insertItalic">
          <span class="i-carbon-text-italic" />
        </button>
        <button type="button" title="行内代码" @click="insertCode">
          <span class="i-carbon-code" />
        </button>
        <button type="button" title="代码块" @click="insertCodeBlock">
          <span class="i-carbon-terminal" />
        </button>
        <button type="button" title="链接" @click="insertLink">
          <span class="i-carbon-link" />
        </button>
        <button type="button" title="图片" @click="insertImage">
          <span class="i-carbon-image" />
        </button>
        <button type="button" title="列表" @click="insertList">
          <span class="i-carbon-list" />
        </button>
      </div>
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ active: !isPreview }"
          @click="isPreview = false"
        >
          编辑
        </button>
        <button
          type="button"
          :class="{ active: isPreview }"
          @click="isPreview = true"
        >
          预览
        </button>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-content">
      <textarea
        v-show="!isPreview"
        ref="textareaRef"
        v-model="content"
        :placeholder="placeholder || '开始写作...'"
        class="editor-textarea"
      />
      <div
        v-show="isPreview"
        class="editor-preview prose"
        v-html="renderMarkdown(content)"
      />
    </div>
  </div>
</template>

<style scoped>
.markdown-editor {
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--glass-bg);
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--glass-border);
  background: var(--c-bg);
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-group {
  display: flex;
  gap: 4px;
}

.editor-toolbar button {
  padding: 6px 10px;
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  background: var(--glass-bg);
  cursor: pointer;
  font-size: 14px;
  color: inherit;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-toolbar button:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
}

.editor-toolbar button.active {
  background: var(--c-brand, #3b82f6);
  color: white;
  border-color: var(--c-brand, #3b82f6);
}

.editor-content {
  min-height: 400px;
}

.editor-textarea {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  border: none;
  resize: vertical;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: transparent;
  color: inherit;
}

.editor-textarea:focus {
  outline: none;
}

.editor-preview {
  padding: 16px;
  min-height: 400px;
  overflow-y: auto;
}

.editor-preview :deep(h1),
.editor-preview :deep(h2),
.editor-preview :deep(h3) {
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.editor-preview :deep(pre) {
  background: var(--c-bg);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
}

.editor-preview :deep(code) {
  background: var(--c-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.editor-preview :deep(img) {
  max-width: 100%;
  border-radius: 8px;
}
</style>
