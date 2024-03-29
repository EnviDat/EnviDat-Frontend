<template>

<v-card id="EditRelatedPublicationsList"
        class="pa-0"
        :loading="loading">

  <v-container fluid
                class="pa-4 fill-height" >

    <template slot="progress">
      <v-progress-linear color="primary"
                         indeterminate />
    </template>

    <v-row>
      <v-col cols="6" class="text-h5">
        {{ EDIT_METADATA_RELATEDPUBLICATIONS_TITLE }}
      </v-col>

      <v-col v-if="message" >
        <BaseStatusLabelView statusIcon="check"
                             statusColor="success"
                             :statusText="message"
                             :expandedText="messageDetails" />
      </v-col>
      <v-col v-if="error"  >

        <BaseStatusLabelView statusIcon="error"
                             statusColor="error"
                             :statusText="error"
                             :expandedText="errorDetails" />
      </v-col>

    </v-row>

    <v-row>
      <v-col >
        <div class="text-subtitle-1"
              v-html="labels.cardInstructions">

        </div>
      </v-col>
    </v-row>

    <v-row no-gutters
           class="pt-4">
      <v-col >
        <BaseStatusLabelView status-icon="question_mark"
                             status-text="More Info"
                             expandedText="instructions for adding"
                             :show-expand-icon="true"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col >
        <EditAddPublication dense
                            @addClicked="catchAddPublication" />
      </v-col>
    </v-row>


 </v-container>
</v-card>

</template>


<script>
/**
 * EditRelatedPublicationsList.vue shows the Related Publications textarea and Preview,
 * main contact surname, and metadata header preview.
 *
 * @summary shows the related publications textarea and preview
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_RELATED_PUBLICATIONS,
  eventBus,
} from '@/factories/eventBus';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import { EDIT_METADATA_RELATEDPUBLICATIONS_TITLE } from '@/factories/metadataConsts';

import EditAddPublication from '@/modules/user/components/EditAddPublication.vue';
import { extractPIDMapFromText } from '@/factories/metaDataFactory';

export default {
  name: 'EditRelatedPublicationsList',
  props: {
    relatedPublicationsText: {
      type: String,
      default: '',
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
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  computed: {
    pIdMap() {
      return extractPIDMapFromText(this.text);
    },
    doiMap() {
      return extractPIDMapFromText(this.text);
    },
  },
  methods: {
    catchAddPublication({ pid, doi }) {

    },
    catchChangedText(value) {
      if (this.validateProperty(this.editingProperty, value)) {
        this.setRelatedPublicationsText(value);
      }
    },
    setRelatedPublicationsText(value) {

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_RELATED_PUBLICATIONS,
        data: { [this.editingProperty]: value },
      });
    },
  },
  data: () => ({
    editingProperty: 'relatedPublicationsText',
    EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
    labels: {
      labelTextarea: EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
      cardInstructions: 'Add DORA links to other publications, you can find them on <a href="https://www.dora.lib4ri.ch/wsl/" target="_blank">dora lib4ri</a> or directly enter DORA permanent IDs ex. wsl:29664). Click into the text arena for examples.',
      placeholder: 'Example entries: \n  * wsl:18753 \n' +
          ' * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:18753 ',
      subtitlePreview: 'Related Publications Preview',
    },
    publicationsMap: null,
  }),
  components: {
    EditAddPublication,
    BaseStatusLabelView,
  },
};


</script>
