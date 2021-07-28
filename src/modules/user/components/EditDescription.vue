<template>
<v-card id="EditDescription">

  <v-container fluid>

    <v-row>
      <v-col cols="12"> 
        <div class="text-h5">{{ cardTitle }}</div>
      </v-col>

    </v-row>  

    <v-row>

      <v-col cols="12"> 
        <div class="text-body-1">{{ cardInstructions }}</div>
      </v-col>

    </v-row>


    <v-row>

      <v-col cols="6">     
        <v-textarea :label="labelDescription"
                      outlined
                      :rules="descriptionRules"
                      required
                      auto-grow
                      v-model="bodyObject.body.text"
                      @input="notifyChange"
                      >
        </v-textarea>
      </v-col>

      <v-col cols="6">     
        <MetadataBody :genericProps="bodyObject"
                        :showPlaceholder="showPreviewPlaceholder"
                        />

      </v-col>


    </v-row>
    

  </v-container>
</v-card>  

</template>

<script>
/**
 * @summary shows the description and description preview of a metadata entry
 * @author Rebecca Kurup Buchholz
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-07-28 13:17:05

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_MAIN_DESCRIPTION,
  eventBus,
} from '@/factories/eventBus';

import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody';


export default {
  name: 'EditDescription',
  props: {  
    cardTitle: { 
      type: String, 
      default: 'Metadata Description',
    },  
    cardInstructions: { 
      type: String, 
      default: 'Please enter a description for the research data.',
    },
    labelDescription: { 
      type: String, 
      default: 'Description',
    },
    genericProps: {
      type: Object,
      default() {
        return {
          body: {
            text: '',
          },
        };
      },
    },
  },
  computed: {
    bodyObject() {
      return this.genericProps;
    },
  },
  methods: {
    notifyChange() {
      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_DESCRIPTION,
        data: this.genericProps,
      });
    },
  },
  data: () => ({
    previewTitle: 'Preview Description',
    showPreviewPlaceholder: false,
    descriptionRules: [v => !!v || 'Description is required'],
  }),
  components: {
    MetadataBody,
  },  
};
</script>

<style scoped>

.preview >>> fieldset {border-width: thick; border-color: #E7E7E7 }

</style>
