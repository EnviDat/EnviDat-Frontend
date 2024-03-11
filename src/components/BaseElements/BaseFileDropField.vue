<template>
  <v-card
    id="BaseFileDropField"
    class="pa-4"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <v-container fluid class="pa-0">
      <v-row justify="center" no-gutters>
        <v-col cols="12" class="text-body-2">
          <v-icon :icon="mdiUpload" /> {{ labels.instructions }}
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12">
          {{ labels.subInstructions }}
        </v-col>
      </v-row>

      <v-row justify="center" no-gutters>
        <v-col cols="12">
          <v-file-input
            v-model="files"
            multiple
            counter
            show-size
            clearable
            clear-icon="close"
            :label="labels.pickerLabel"
            prepend-icon="attach_file"
            @change="onChange"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip v-if="index < 2" small label color="highlight">
                {{ text }}
              </v-chip>

              <span
                v-else-if="index === 2"
                class="text-overline grey--text text--darken-3 mx-2"
              >
                +{{ files.length - 2 }} File(s)
              </span>
            </template>
          </v-file-input>
        </v-col>
      </v-row>

      <v-row justify="center" no-gutters>
        <v-col cols="12" class="text-caption">
          {{ labels.pickerSubInstructions }}
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Card for Drag'n'Drop files or pick them via file picker
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 13:23:01
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

 import { mdiUpload } from '@mdi/js';

export default {
  name: 'BaseFileDropField',
  props: {
    dragColor: {
      type: String,
      default: 'highlight',
    },
  },
  computed: {
  },
  methods: {
    onChange() {
      this.$emit('filesChanged', this.files);
    },
    dragover(event) {
      event.preventDefault();

      if (!event.currentTarget.classList.contains(this.dragColor)) {
        event.currentTarget.classList.add(this.dragColor);
      }
    },
    dragleave(event) {
      event.currentTarget.classList.remove(this.dragColor);
    },
    drop(event) {
      event.preventDefault();

      this.files = [...event.dataTransfer.files];

      event.currentTarget.classList.remove(this.dragColor);
      this.onChange();
    },
  },
  data: () => ({
    mdiUpload,
    labels: {
      instructions: 'Drag and drop a file here',
      subInstructions: 'Or use the file picker to select files',
      pickerLabel: 'Click here to pick a file',
      pickerSubInstructions:
        'Hold SHIFT or CTRL / CMD to select multiple files.',
    },
    descriptionRules: [v => !!v || 'Description is required'],
    files: [],
  }),
  components: {},
};
</script>

<style scoped>
.preview >>> fieldset {
  border-width: thick;
  border-color: #e7e7e7;
}
</style>
