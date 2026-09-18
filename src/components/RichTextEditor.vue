<template>
  <div class="markdown-editor flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
    <!-- Quick formatting toolbar for mobile and desktop -->
    <div class="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto text-slate-600">
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 font-bold hover:bg-slate-200 rounded" 
        @click="insertMarkdown('**', '**', 'bold text')"
        title="Bold"
      >
        <i class="fas fa-bold text-xs"></i>
      </button>
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 italic hover:bg-slate-200 rounded" 
        @click="insertMarkdown('*', '*', 'italic text')"
        title="Italic"
      >
        <i class="fas fa-italic text-xs"></i>
      </button>
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 hover:bg-slate-200 rounded font-semibold text-xs" 
        @click="insertMarkdown('## ', '', 'Heading 2')"
        title="Heading"
      >
        H2
      </button>
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 hover:bg-slate-200 rounded font-semibold text-xs" 
        @click="insertMarkdown('### ', '', 'Heading 3')"
        title="Heading 3"
      >
        H3
      </button>
      <div class="w-px h-4 bg-slate-300 mx-1"></div>
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 hover:bg-slate-200 rounded" 
        @click="insertMarkdown('- ', '', 'List item')"
        title="Bullet List"
      >
        <i class="fas fa-list-ul text-xs"></i>
      </button>
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 hover:bg-slate-200 rounded" 
        @click="insertMarkdown('1. ', '', 'Numbered item')"
        title="Numbered List"
      >
        <i class="fas fa-list-ol text-xs"></i>
      </button>
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 hover:bg-slate-200 rounded" 
        @click="insertMarkdown('> ', '', 'Quote text')"
        title="Blockquote"
      >
        <i class="fas fa-quote-left text-xs"></i>
      </button>
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 hover:bg-slate-200 rounded font-mono text-xs" 
        @click="insertMarkdown('`', '`', 'code')"
        title="Inline Code"
      >
        &lt;/&gt;
      </button>
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 hover:bg-slate-200 rounded" 
        @click="insertMarkdown('```javascript\n', '\n```', '// code block')"
        title="Code Block"
      >
        <i class="fas fa-file-code text-xs"></i>
      </button>
      <button 
        type="button" 
        class="btn btn-ghost btn-xs h-7 px-2 hover:bg-slate-200 rounded" 
        @click="insertMarkdown('[', '](https://example.com)', 'Link Title')"
        title="Insert Link"
      >
        <i class="fas fa-link text-xs"></i>
      </button>
    </div>

    <!-- Codemirror Canvas -->
    <Codemirror
      v-model="content"
      :style="{ height: '320px', minHeight: '260px' }"
      :autofocus="false"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

export default {
  name: 'RichTextEditor',
  components: {
    Codemirror
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const content = ref(props.modelValue);
    
    const extensions = [
      markdown(),
      oneDark
    ];

    watch(() => props.modelValue, (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue;
      }
    });

    const handleChange = (value) => {
      emit('update:modelValue', value);
    };

    const insertMarkdown = (prefix, suffix, defaultText) => {
      const addition = `${prefix}${defaultText}${suffix}`;
      if (!content.value) {
        content.value = addition;
      } else {
        content.value = `${content.value}\n${addition}`;
      }
      emit('update:modelValue', content.value);
    };

    return {
      content,
      extensions,
      handleChange,
      insertMarkdown
    };
  }
};
</script>

<style>
.markdown-editor .cm-editor {
  height: 100%;
  border: none;
  font-size: 13px;
  line-height: 1.6;
}

.markdown-editor .cm-editor.cm-focused {
  outline: none;
}

.markdown-editor .cm-scroller {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  padding: 8px 0;
}
</style>
