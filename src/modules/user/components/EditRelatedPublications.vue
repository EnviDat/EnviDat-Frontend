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
        <div class="text-subtitle-1">{{ labels.cardInstructions }}</div>
      </v-col>
    </v-row>


    <v-row>
      <v-col >

        <GenericTextareaPreviewLayout v-bind="genericTextAreaObject"
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
    relatedPublicationsText: {
      type: String,
      default: '',
    },
  },
  computed: {
    genericTextAreaObject() {
      return {
        subtitlePreview: this.labels.subtitlePreview,
        labelTextarea: this.labels.labelTextarea,
        textareaContent: this.relatedPublicationsText,
        isVerticalLayout: true,
      };
    },
    publicationsObject() {
      return {
        publications: {
          text: this.relatedPublicationsText,
        },
      };
    },
  },
  methods: {
    catchChangedText(event) {
      this.setRelatedPublicationsText(event);
    },
    setRelatedPublicationsText(value) {

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_RELATED_PUBLICATIONS,
        data: { relatedPublicationsText: value },
      });
    },
  },
  data: () => ({
    EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
    labels: {
      labelTextarea: EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
      cardInstructions: 'Add references to other related publications',
      subtitlePreview: 'Related Publications Preview',
    },

  }),
  components: {
    GenericTextareaPreviewLayout,
    MetadataPublications,
  },
};


</script>
