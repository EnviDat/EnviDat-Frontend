<template>
  <v-card id="EditDescription"
            class="pa-4">

    <v-container fluid
                  class="pa-0">

      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ labels.cardTitle }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <div class="text-body-1">{{ labels.descriptionInstructions }}</div>
        </v-col>
        <v-col cols="6">
          <div class="text-subtitle-1">{{ labels.subtitlePreview }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col >

          <GenericTextareaPreviewLayout :genericProps="genericTextAreaObject"
                                          @changedText="catchChangedText($event)">
            <MetadataBody :genericProps="descriptionObject" />
          </GenericTextareaPreviewLayout>

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
 * Last modified  : 2021-08-03 15:22:03

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_MAIN_DESCRIPTION,
  eventBus,
} from '@/factories/eventBus';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout';
import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody';


export default {
  name: 'EditDescription',
  props: {
    description: {
      type: String,
      default: '',
    },
  },
  computed: {
    genericTextAreaObject() {
      return {
        labelTextarea: this.labels.labelTextarea,
        textareaContent: this.description,
        isVerticalLayout: false,
        prependIcon: 'description',
      };
    },
    descriptionObject() {
      return {
        body: {
          text: this.description,
        },
      };
    },
  },
  methods: {
    catchChangedText(event) {
      this.setDescriptionText(event);
    },
    setDescriptionText(value) {

      const newDescription = {
        description: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_DESCRIPTION,
        data: newDescription,
      });
    },
  },
  data: () => ({
    labels: {
      cardTitle: 'Metadata Description',
      labelTextarea: 'Metadata Description',
      descriptionInstructions: 'Please enter a description for the research data.',
      subtitlePreview: 'Description Preview',
    },
  }),
  components: {
    MetadataBody,
    GenericTextareaPreviewLayout,
  },
};
</script>

<style scoped>

.preview >>> fieldset {border-width: thick; border-color: #E7E7E7 }

</style>
