<template>

<v-card id="EditRelatedPublications" class="pa-4">

  <v-container fluid 
                class="pa-0 fill-height" >  

    <v-row>

        <v-col :cols="columns">  
          <div class="text-h5">{{ cardTitle }}</div>
        </v-col>

    </v-row>


    <v-row>

        <v-col :cols="columns">  
          <div class="text-subtitle-1">{{ cardInstructions }}</div>
        </v-col>

    </v-row>


    <v-row>

      <v-col :cols="columns">     
        <generic-textarea-preview-layout :genericProps="genericProps" >
          <metadata-publications :genericProps="genericProps" />
        </generic-textarea-preview-layout>
      </v-col>

    </v-row>


 </v-container>
</v-card>  

</template>


<script>
/**
 * EditRelatedpublications.vue shows the Related Publications textarea and Preview, 
 * main contact surname, and metadata header preview.
 *
 * @summary shows the related publications textarea and preview
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2019-08-19
 * Last modified  : 2021-08-19
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_RELATED_PUBLICATIONS,
  eventBus,
} from '@/factories/eventBus';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications';

export default {
  name: 'EditRelatedPublications',
  data: () => ({
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    columns: {
      get() {
        return this.mixinMethods_getGenericProp('columns', '');
      },
      set(value) {
        this.setRelatedPublications('columns', value);
      },
    },
    cardTitle: {
      get() {
        return this.mixinMethods_getGenericProp('columns', 'Related Publications');
      },
      set(value) {
        this.setRelatedPublications('columns', value);
      },
    },
    cardInstructions: {
      get() {
        return this.mixinMethods_getGenericProp('columns', 'Add references to related publications to dataset(s)');
      },
      set(value) {
        this.setRelatedPublications('columns', value);
      },
    },
  },
  methods: {
    setRelatedPublications(property, value) {
      const newRelatedPublications = {
          ...this.genericProps,
          [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_RELATED_PUBLICATIONS,
          data: newRelatedPublications,
        });
    },
  },
  components: {
    GenericTextareaPreviewLayout,
    MetadataPublications,
  },
};


</script>
