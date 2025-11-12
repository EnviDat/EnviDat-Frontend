<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { useTheme } from 'vuetify';
import {
  createJSONEditor,
  Content,
  JSONEditorPropsOptional,
  SelectionType,
  JSONEditorContext,
} from 'vanilla-jsoneditor';

interface Props {
  title: string;
  instructions?: string;
  jsonContent?: object;
  textContent?: string;
  maxHeight?: number;
  editorOptions?: JSONEditorPropsOptional;
  allowedSelection?: SelectionType;
}

const {
  title,
  instructions = '',
  maxHeight = 500,
  textContent,
  jsonContent,
  editorOptions = {},
  // default allowed selection is value only meaning on the values
  // of a given json object can be changed not keys
  allowedSelection = SelectionType.value,
} = defineProps<Props>();

const emit = defineEmits<{
  (e: 'changeContent', content: unknown): void;
}>();

const theme = useTheme();
const editorDomRef = useTemplateRef('editorRef');
const jsonEditor = ref();
const editorSelection = ref();
const editorValidationErrors = ref({});

const jsonEditorOnChange = (updatedContent, previousContent, status) => {
  editorValidationErrors.value.input = undefined;

  const {
    contentErrors,
    // patchResult,
  } = status;

  if (contentErrors) {
    const { parseError, validationErrors } = contentErrors;

    if (parseError) {
      editorValidationErrors.value.input = parseError.toString();
    }

    if (validationErrors) {
      editorValidationErrors.value.input = validationErrors.toString();
    }

    return false;
  }

  let acceptChange = false;

  if (editorSelection.value) {
    if (editorSelection.value.type === allowedSelection) {
      acceptChange = true;
      editorSelection.value = undefined;
    } else {
      acceptChange = false;
      editorValidationErrors.value.input = `Only editing of json "${allowedSelection}" elements is allowed`;

      // revert to the previous state
      jsonEditor.value.update({ json: previousContent.json });
    }
  } else {
    // accept changes from indirect user changes, like the click on redo / undo
    acceptChange = true;
  }

  if (acceptChange) {
    const contentAsString = updatedContent.text ? updatedContent.text : JSON.stringify(updatedContent.json);
    emit('changeContent', contentAsString);

    return true;
  }

  return false;
};

// use default options and merge with options from the props
const mergedEditorOptions = {
  mode: 'tree',
  indentation: 2,
  navigationBar: false,
  mainMenuBar: true,
  statusBar: true,
  onSelect: (selection) => {
    editorSelection.value = selection;
  },
  onChange: (updatedContent, previousContent, status) => {
    // content is an object { json: unknown } | { text: string }
    jsonEditorOnChange(updatedContent, previousContent, status);
  },
  onError: (err) => {
    editorValidationErrors.value.input = err.message;

    console.error(err);
    // emit('editorError', err);
  },
  ...editorOptions,
} as JSONEditorContext;

const content = computed<Content>(() => (textContent ? { text: textContent } : { json: jsonContent }));

const initEditor = () => {
  const editorProps = {
    target: editorDomRef.value,
    props: {
      content: content.value,
      ...mergedEditorOptions,
    },
  } as any;

  try {
    jsonEditor.value = createJSONEditor(editorProps);
  } catch (err) {
    console.error(err);
    editorValidationErrors.value.input = err;
    // emit('editorError', err);
  }
};

const scrollbarColorFront = computed(() => (theme.themes.value ? theme.themes.value.light.colors.highlight : 'auto'));
const scrollbarColorBack = computed(() => (theme.themes.value ? '#F0F0F0' : 'auto'));

onMounted(() => {
  initEditor();
});
</script>

<template>
  <v-card flat>
    <v-card-title>
      {{ title }}
    </v-card-title>

    <v-card-text
      class="editorScroll"
      :style="`max-height: ${maxHeight}px; scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack};`"
    >
      <v-row>
        <v-col>
          {{ instructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="columns">
            <div class="column">
              <div style="border-radius: 10px" class="jsoneditor-vue" id="jsoneditor-vue" ref="editorRef"></div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row v-show="editorValidationErrors.input">
        <v-col>
          <v-alert type="error">
            {{ editorValidationErrors.input }}
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.editorScroll {
  overflow: auto auto;
  scrollbar-width: thin;
}
</style>

<style>
.editorScroll .jse-menu {
  background-color: #35a89d !important;
}
</style>
