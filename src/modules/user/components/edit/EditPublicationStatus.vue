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

          <v-col cols="12">
            <div class="text-body-1">{{ labels.instructions }}</div>
          </v-col>
        </v-row>

        <v-row no-gutters
               class="pt-4">

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

            <v-row v-if="currentStateInfos.positionIndex === index && currentStateInfos.buttonText"
                   no-gutters
                   justify="center">
              <BaseRectangleButton id='interactiveButton'
                                   :button-text="currentStateInfos.buttonText"
                                   :material-icon-name="currentStateInfos.buttonIcon"
                                   icon-color="white"
                                   is-small
                                   :loading="loading"
                                   :url="doiUrl"
                                   :disabled="mixinMethods_isFieldReadOnly('publicationStatus')"
                                   @clicked="$emit('clicked', currentStateInfos.buttonEvent)" />

            </v-row>

            <v-row v-if="currentStateInfos.positionIndex === index"
                   class="pt-2"
                   no-gutters
                   justify="center">
              {{ currentStateInfos.infoText }}
            </v-row>

            <v-row v-if="currentStateInfos.positionIndex === index
                          && mixinMethods_isFieldReadOnly('publicationStatus')"
                   class="pt-2 readOnlyHint"
                   no-gutters
                   justify="center">
              {{ mixinMethods_readOnlyHint('publicationStatus') }}
            </v-row>

          </v-col>

        </v-row>

        <v-row class="text-body-1 highlight">
          <v-col cols="12" v-html="labels.instructions2">
          </v-col>
        </v-row>

        <v-row class="text-body-2 pt-4 px-3">

          <v-col v-for="(field, index) of metadataPublishedReadOnlyFields"
                 cols="6"
                 md="3"
                 class="pa-1"
                  :key="`${index}_${field}`">
            {{ getReadableLabel(field) }}
          </v-col>
        </v-row>

        <v-row class="text-body-1 pt-4">
          <v-col cols="12" v-html="labels.instructions3">
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
  import { possiblePublicationStates } from '@/factories/metaDataFactory';
  import { metadataPublishedReadOnlyFields, readablePublishedReadOnlyFields } from '@/factories/mappingFactory';
  import { DOI_REQUEST, DOI_RESERVE } from '@/modules/user/store/doiMutationsConsts';


  export default {
    name: 'EditPublicationStatus',
    props: {
      publicationState: {
        type: String,
        default: 'draft',
      },
      doi: {
        type: String,
        default: undefined,
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
        return this.stateTextMap.get(this.publicationState || 'draft');
      },
      doiUrl() {
        return this.doi ? `https://www.doi.org/${this.doi}` : undefined;
      },
    },
    methods: {
      getStateText(state) {
        return this.stateTextMap.get(state)?.chipText || '';
      },
      getReadableLabel(field) {
        return this.readablePublishedReadOnlyFields[field];
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
          buttonEvent: DOI_RESERVE,
          positionIndex: 2,
        }],
        ['reserved', {
          chipText: 'Reserved DOI',
          infoText: 'Request Dataset Publication',
          buttonIcon: 'newspaper',
          buttonText: 'Request',
          buttonEvent: DOI_REQUEST,
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
          infoText: 'Open the DOI in a new Tab',
          buttonIcon: 'public',
          buttonText: 'Open DOI',
          buttonEvent: 'openDoi',
          positionIndex: 6,
        }],
      ]),
      labels: {
        cardTitle: 'Dataset Publication Status',
        instructions: `Have you finished uploading data & resouces and entered all the metadata as best as possible?
          Start publishing your dataset with reserving a DOI, when that's done.
          Request publication, it will be reviewd by admins and once approved it will be restigered at DataCite.`,
        instructions2: 'Please be aware once the <strong>dataset is published</strong> the following metadata information <strong>can NOT be changed anymore</strong>.',
        instructions3: 'You can still upload newer versions of your research data, please use a <strong>clear name and desription</strong> to indicate the latest data.',
      },
      metadataPublishedReadOnlyFields,
      readablePublishedReadOnlyFields,
    }),
    components: {
      BaseRectangleButton,
      BaseStatusLabelView,
    },
  };
  </script>

<style scoped>
  .readOnlyHint {
    font-size: 12px;
    line-height: 12px;
    word-break: break-word;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  }
</style>
