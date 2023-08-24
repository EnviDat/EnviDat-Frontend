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
          <v-col v-for="(state, index) in pStatesWithDividers"
                 :key="`${index}_pState`"
                 :cols="index % 2 === 0 ? 2 : undefined"
                 class="flex-grow-0">

            <v-chip v-if="index % 2 === 0"
                    small
                    :disabled="activeStateIndex > index"
                    :color="activeStateIndex === index ? 'primary' : '' "
            >
              {{ getStateText(state) }}
            </v-chip>

            <v-icon v-else
                    class="px-2">
              {{ state }}
            </v-icon>

            <div v-if="activeStateIndex + 2 === index"
                  style="display: inline-block;">

              <v-row no-gutters
                     class="py-2"
                     justify="center">
                <v-icon>arrow_upward</v-icon>
              </v-row>

              <v-row no-gutters>
                <BaseRectangleButton button-text="Request Publication"
                                     material-icon-name="newspaper"
                                     icon-color="white"
                                     is-small
                                     @clicked="$emit('requestPublication')" />
              </v-row>
            </div>
          </v-col>

        </v-row>

      </v-container>
    </v-card>
  </template>

  <script>
  /* eslint-disable vue/no-unused-components */
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
        default: () => [
          '',
          'reserved',
          'pub_pending',
          'published',
        ],
      },
      publicationState: {
        type: String,
        default: 'reserved',
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
      pStatesWithDividers() {
        const pStateWithDiv = [];
        if (!this.possiblePublicationStates) {
          return pStateWithDiv;
        }

        for (let i = 0; i < this.possiblePublicationStates.length; i++) {
          const pState = this.possiblePublicationStates[i];
          pStateWithDiv.push(pState);
          pStateWithDiv.push('arrow_forward');
        }

        pStateWithDiv.splice(pStateWithDiv.length - 1, 1);

        return pStateWithDiv;
      },
      activeStateIndex() {
        return this.pStatesWithDividers.findIndex(v => v === this.publicationState);
      },
    },
    methods: {
      getStateText(state) {
        return this.stateTextMap.get(state);
      },
    },
    data: () => ({
      stateTextMap: new Map([
        ['', 'Draft'],
        ['reserved', 'Reserved DOI'],
        ['pub_pending', 'Publication Pending'],
        ['published', 'Published'],
      ]),
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

<style scoped>
  .statesGrid {
    display: grid;
    grid-template-columns: 2fr 0.5fr 2fr 0.5fr 2fr 0.5fr 2fr;
  }
</style>
