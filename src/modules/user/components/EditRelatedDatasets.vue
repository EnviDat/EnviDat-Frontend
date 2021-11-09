<template>

<v-card id="EditRelatedDatasets" class="pa-4">

  <v-container fluid
                class="pa-0 fill-height" >

    <v-row>
      <v-col >
        <div class="text-h5">{{ EDIT_METADATA_RELATED_DATASETS_TITLE }}</div>
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
          <MetadataRelatedDatasets :genericProps="datasetObject" />
        </GenericTextareaPreviewLayout>

      </v-col>
    </v-row>

 </v-container>
</v-card>

</template>


<script>
/**
 * EditRelatedDatasets.vue shows the Related Datasets textarea and Preview
 *
 * @summary shows the related datasets textarea and preview
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2021-11-08
 * Last modified  : 2021-11-08
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_RELATED_DATASETS,
  eventBus,
} from '@/factories/eventBus';

import { EDIT_METADATA_RELATED_DATASETS_TITLE } from '@/factories/metadataConsts';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout';
import MetadataRelatedDatasets from '@/modules/metadata/components/Metadata/MetadataRelatedDatasets';

export default {
  name: 'EditRelatedDatasets',
  props: {
    relatedDatasetsText: {
      type: String,
      default: '',
    },
  },
  computed: {
    genericTextAreaObject() {
      return {
        subtitlePreview: this.labels.subtitlePreview,
        labelTextarea: this.labels.labelTextarea,
        textareaContent: this.relatedDatasetsText,
        isVerticalLayout: true,
      };
    },
    datasetObject() {
      return {
        datasets: {
          text: this.relatedDatasetsText,
        },
      };
    },
  },
  methods: {
    catchChangedText(event) {
      this.setRelatedDatasetsText(event);
    },
    setRelatedDatasetsText(value) {

      const newDataset = {
        relatedDatasetsText: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_RELATED_DATASETS,
        data: newDataset,
      });
    },
  },
  data: () => ({
    EDIT_METADATA_RELATED_DATASETS_TITLE,
    labels: {
      labelTextarea: EDIT_METADATA_RELATED_DATASETS_TITLE,
      cardInstructions: 'Add references to other related datasets',
      subtitlePreview: 'Related Datasets Preview',
    },

  }),
  components: {
    MetadataRelatedDatasets,
    GenericTextareaPreviewLayout,
  },
};


</script>
