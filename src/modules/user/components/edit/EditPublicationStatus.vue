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

<!--
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
-->
        </v-row>

        <v-row>
          <v-col v-for="(state, index) in pStatesAndArrows"
                 :key="`${index}_pState`"
                  :id="`activeStateIndex_${activeStateIndex}`">

            <v-row no-gutters
                   justify="center">
              <v-chip v-if="getStateText(state)"
                      small
                      :disabled="activeStateIndex > index"
                      :color="activeStateIndex === index ? 'secondary' : '' "
              >
                {{ getStateText(state) }}
              </v-chip>

              <v-icon v-else
                      class="px-2">
                {{ state }}
              </v-icon>
            </v-row>

            <v-row v-if="currentStateInfos.positionIndex === index"
                   no-gutters
                   class="py-2"
                   justify="center">
              <v-icon>arrow_upward</v-icon>
            </v-row>

            <v-row v-if="currentStateInfos.positionIndex === index"
                   no-gutters
                   justify="center">

              <v-col v-if="currentStateInfos.buttonText"
                      cols="12">

                <BaseRectangleButton :button-text="currentStateInfos.buttonText"
                                     :material-icon-name="currentStateInfos.buttonIcon"
                                     icon-color="white"
                                     is-small
                                     :loading="loading"
                                     :disabled="mixinMethods_isFieldReadOnly('publicationStatus')"
                                     @clicked="$emit('clicked', currentStateInfos.buttonEvent)" />

              </v-col>

              <v-col class="pt-2"
                      cols="12">
                {{ currentStateInfos.infoText }}
              </v-col>

              <v-col v-if="mixinMethods_isFieldReadOnly('publicationStatus')"
                     class="pt-2 readOnlyHint"
                     cols="12">
                {{ mixinMethods_readOnlyHint('publicationStatus') }}
              </v-col>

            </v-row>

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
  import { possiblePublicationStates } from '@/factories/metaDataFactory';


  export default {
    name: 'EditPublicationStatus',
    props: {
      publicationState: {
        type: String,
        default: 'draft',
      },
      loading: {
        type: Boolean,
        default: false,
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
      pStatesAndArrows() {
        const pStateWithDiv = [];
        if (!this.possiblePublicationStates) {
          return pStateWithDiv;
        }

        for (let i = 0; i < this.possiblePublicationStates.length; i++) {
          const pState = this.possiblePublicationStates[i] || 'draft';
          pStateWithDiv.push(pState);
          pStateWithDiv.push('arrow_forward');
        }

        pStateWithDiv.splice(pStateWithDiv.length - 1, 1);

        return pStateWithDiv;
      },
      activeStateIndex() {
        return this.pStatesAndArrows.findIndex(v => v === this.publicationState);
      },
      currentStateInfos() {
        return this.stateTextMap.get(this.publicationState);
      },
    },
    methods: {
      getStateText(state) {
        return this.stateTextMap.get(state)?.chipText || '';
      },
    },
    data: () => ({
      possiblePublicationStates,
      stateTextMap: new Map([
        ['draft', {
          chipText: 'Draft',
          infoText: 'Reserve DOI for Dataset',
          buttonIcon: 'fingerprint',
          buttonText: 'Reserve',
          buttonEvent: 'reserveDoi',
          positionIndex: 2,
        }],
        ['reserved', {
          chipText: 'Reserved DOI',
          infoText: 'Request Dataset Publication',
          buttonIcon: 'newspaper',
          buttonText: 'Request',
          buttonEvent: 'requestPublication',
          positionIndex: 4,
        }],
        ['pub_pending', {
          chipText: 'Publication Pending',
          infoText: 'Wait for the admin to review & approve the publication',
/*
          buttonIcon: 'newspaper',
          buttonText: 'Request',
          buttonEvent: 'requestPublication',
*/
          positionIndex: 6,
        }],
        ['published', {
          chipText: 'Published',
          infoText: 'Open the DOI entry at DataCite',
          buttonIcon: 'public',
          buttonText: 'Show DOI',
          buttonEvent: 'openDoi',
          positionIndex: 6,
        }],
      ]),
      labels: {
        cardTitle: 'Dataset Publication Status',
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

  .readOnlyHint {
    font-size: 12px;
    line-height: 12px;
    word-break: break-word;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  }
</style>
