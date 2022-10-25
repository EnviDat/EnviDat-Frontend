<template>
  <v-card id="EditDropResourceFiles" class="pa-4" flat>
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ labels.title }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <BaseFileDropField @filesChanged="catchFilesChanged" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-body-1">{{ labels.subInstructions }}</div>
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-col class="shrink">
          <BaseRectangleButton
            :disabled="createButtonDisabled"
            :buttonText="labels.createButtonTextS"
            @clicked="createButtonClick"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary show a Drag'n'Drop widget to add files for resources
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-11 15:45:56
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseFileDropField from '@/components/BaseElements/BaseFileDropField.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

export default {
  name: 'EditDropResourceFiles',
  props: {
    genericProps: Object,
  },
  computed: {},
  methods: {
    checkCreateButtonDisabled() {
      this.createButtonDisabled = this.files?.length <= 0;
    },
    catchFilesChanged(files) {
      this.files = files;
      this.checkCreateButtonDisabled();
    },
    createButtonClick() {
      this.$emit('createResources', this.files);
    },
  },
  data: () => ({
    labels: {
      title: 'Create Resource from Files',
      instructions:
        'Drag and drop a file here to create a new resource and upload it. For files with a file size < 5 GB.',
      subInstructions: 'For files larger then 5GB contact the envidat team.',
      createButtonTextS: 'Create Resource',
      createButtonTextP: 'Create Resources',
    },
    files: [],
    createButtonDisabled: true,
  }),
  components: {
    BaseFileDropField,
    BaseRectangleButton,
  },
};
</script>

<style scoped></style>
