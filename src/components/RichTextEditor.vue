<template>
  <div class="markdown-editor">
    <Codemirror
      v-model="content"
      :style="{ height: '400px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'

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
    const content = ref(props.modelValue)
    
    // Setup extensions
    const extensions = [
      markdown(),
      oneDark
    ]

    // Watch for external changes
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue
      }
    })

    const handleChange = (value) => {
      emit('update:modelValue', value)
    }

    return {
      content,
      extensions,
      handleChange
    }
  }
}
</script>

<style>
.markdown-editor {
  @apply w-full;
}

.markdown-editor .cm-editor {
  height: 100%;
  @apply rounded-lg border border-base-300;
}

.markdown-editor .cm-editor.cm-focused {
  outline: none;
  @apply border-primary;
}

.markdown-editor .cm-scroller {
  @apply font-mono;
}

/* Ensure proper text color in the editor */
.markdown-editor .cm-content {
  @apply text-base-content;
}

.markdown-editor .cm-line {
  @apply text-base-content;
}
</style>
