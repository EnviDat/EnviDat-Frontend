<template>
  <v-card
    id="EditPublicationStatus"
    class="pa-0"
    max-width="100%"
    :loading="loading"
  >
    <v-container fluid class="pa-4">
      <template slot="progress">
        <v-progress-linear color="primary" indeterminate />
      </template>

      <v-row>
        <v-col cols="6" class="text-h5">
          {{ labels.cardTitle }}
        </v-col>

        <v-col v-if="message">
          <BaseStatusLabelView
            statusIcon="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error">
          <BaseStatusLabelView
            statusIcon="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <BaseRectangleButton button-text="Request Publication"
                                material-icon-name="newspaper"
                                icon-color="white"
                                @clicked="$emit('requestPublication')" />
        </v-col>

        <v-col cols="6">
          <MetadataStateChip :state="publicationState" />
        </v-col>

      </v-row>

    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Shows Publication State
 * @author Dominik Haas-Artho
 * Created        : 2023-01-18
 * Last modified  : 2023-01-18 16:53:36
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mapState } from 'vuex';

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import MetadataStateChip from '@/components/Chips/MetadataStateChip.vue';


export default {
  name: 'EditPublicationStatus',
  props: {
    possiblePublicationStates: {
      type: Array,
      default: () => [],
    },
    publicationState: {
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
  computed: {
    ...mapState(['config']),
    isDraft() {
      return this.publicationState === 'draft';
    },
    isUnpublished() {
      return this.publicationState === 'unpublished';
    },
    isPublished() {
      return this.publicationState === 'published';
    },
  },
  methods: {

  },
  data: () => ({
    labels: {
      cardTitle: 'Publication Status',
    },
  }),
  components: {
    BaseRectangleButton,
    BaseStatusLabelView,
    MetadataStateChip,
  },
};
</script>

<style scoped></style>
