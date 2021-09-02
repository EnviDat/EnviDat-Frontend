<template>

<v-card id="EditRelatedPublications" class="pa-4">

  <v-container fluid 
                class="pa-0 fill-height" >  

    <v-row>
      <v-col >
        <div class="text-h5">{{ EDIT_METADATA_RELATEDPUBLICATIONS_TITLE }}</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col >
        <div class="text-subtitle-1">{{ cardInstructions }}</div>
      </v-col>
    </v-row>


    <v-row>
      <v-col >

        <GenericTextareaPreviewLayout :genericProps="genericTextAreaObject"
                                          @changedText="catchChangedText($event)">
          <MetadataPublications :genericProps="publicationsObject" />
        </GenericTextareaPreviewLayout>

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

import { EDIT_METADATA_RELATEDPUBLICATIONS_TITLE } from '@/factories/metadataConsts';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications';

export default {
  name: 'EditRelatedPublications',
  props: {  
    genericProps: Object,
  },
  computed: {
    genericTextAreaObject() {
      return {
        subtitlePreview: this.genericProps.subtitlePreview,
        labelTextarea: this.genericProps.labelTextarea,
        textareaContent: this.genericProps.relatedPublicationsText,
        isVerticalLayout: true,
      };
    },
    publicationsObject() {
      return {
        publications: {
          text: this.genericProps.relatedPublicationsText,
        },
      };
    },
    cardInstructions() {
      return this.mixinMethods_getGenericProp('relatedPublicationsInstructions', 'Add references to related publications to dataset(s)');
    },
  },
  methods: {
    catchChangedText(event) {
      this.setRelatedPublicationsText(event);
    },
    setRelatedPublicationsText(value) {

      const newRelatedPublications = {
        ...this.genericProps,
        relatedPublicationsText: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_RELATED_PUBLICATIONS,
        data: newRelatedPublications,
      });
    },
  },
  data: () => ({
    EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
  }),
  components: {
    GenericTextareaPreviewLayout,
    MetadataPublications,
  },
};


</script>
