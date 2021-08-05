<template>
  <v-card id="EditResource"
            class="pa-4">

    <v-container fluid
                  class="pa-0">

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
          <v-text-field :label="labels.resourceName"
                        outlined
                        required
                        v-model="resourceName" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field :label="labels.fileName"
                        outlined
                        readonly
                        v-model="fileName" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-textarea :label="labels.description"
                        outlined
                        auto-grow
                        v-model="description"
                        >
        </v-textarea>

        </v-col>
      </v-row>
      

      <!-- <v-row>
        <v-col cols="12"> 
          <div class="text-body-1">{{ labels.subInstructions }}</div>
        </v-col>
      </v-row> -->

      <v-row justify="end">
        <v-col class="shrink"> 
          <BaseRectangleButton :disabled="createButtonDisabled"
                                :buttonText="labels.createButtonText"
                                @clicked="createButtonClick" />
        </v-col>
      </v-row>


    </v-container>
  </v-card>  
</template>

<script>
/**
 * @summary Show all textfields for a resource
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-05 10:53:04
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_RESOURCES,
  eventBus,
} from '@/factories/eventBus';

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  name: 'EditResource',
  props: {  
    genericProps: Object,
  },
  computed: {
    description: {
      get() {
        return this.mixinMethods_getGenericProp('description', '');
      },
      set(value) {
        const newGenericProps = {
          ...this.genericProps,
          description: value,
        };

        this.notifyChange(newGenericProps);
      },
    },
  },
  methods: {
    checkCreateButtonDisabled() {
      this.createButtonDisabled = this.files?.length <= 0;
    },
    notifyChange(newGenericProps) {
      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_RESOURCES,
        data: newGenericProps,
      });
    },
    createButtonClick() {
      this.$emit('createResources', this.files);
    },
  },
  data: () => ({
    labels: {
      title: 'Edit Selected Resource',
      instructions: 'Drag and drop a file here to create a new resource and upload it. For files with a file size < 5 GB.',
      subInstructions: 'For files larger then 5GB contact the envidat team.',
      createButtonText: 'Save Resource',
      description: 'Resource description',
      resourceName: 'Name of the resource',
      fileName: 'Name of the file',
      url: 'Link',
    },
    files: [],
    createButtonDisabled: true,
  }),
  components: {
    BaseRectangleButton,
  },  
};
</script>

<style scoped>


</style>
