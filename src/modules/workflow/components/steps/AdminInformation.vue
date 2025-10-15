<template>
  <v-container id="AdminInformation"
               fluid
               class="pa-4">
    <v-row>
      <v-col cols="12">
        <CustomFields
          :custom-fields="props.customFields"
        />
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col class="text-h5">
            Dataset in Projects
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <BaseDatasetPicker
              :projects="props.existingProjects"
              :preSelected="props.datasetProject"
              instructions="Pick Project which the dataset is assigned to"
              @pickedProject="catchProjectChange"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
/**
 * @summary shows admin components for the dataset workflow
 * @author Dominik Haas-Artho
 * Created at     : 2021-07-05
 * Last modified  : 2021-09-01 17:52:29
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import CustomFields from '@/modules/workflow/components/steps/CustomFields.vue';
import BaseDatasetPicker from '@/components/BaseElements/BaseDatasetPicker.vue';

const props = defineProps({
  customFields: {
    type: Array,
    default: () => [],
  },
  existingProjects: {
    type: Array,
    default: () => [],
  },
  datasetProject: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  messageDetails: {
    type: String,
    default: null,
  },
  error: {
    type: String,
    default: '',
  },
  errorDetails: {
    type: String,
    default: null,
  },
});

const catchProjectChange = () => {

}

</script>

<style scoped></style>
