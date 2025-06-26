<template>
    <v-card
      id="EditPublicationStatus"
      class="pa-0"
      max-width="100%"
      :loading="loadingColor"
      :flat
    >
      <v-container fluid class="pa-4">

      <v-row>
        <v-col cols="6" class="text-h5">
          {{ labels.cardTitle }}
        </v-col>

        <v-col v-if="message">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error">
          <BaseStatusLabelView
            status="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col>

        <v-col cols="12">
          <div class="text-body-1" v-html="labels.instructions"></div>
        </v-col>
      </v-row>

      <v-row class="mt-10"
             no-gutters>
        <v-col
          v-for="(state, index) in pStatesAndArrows"
          :key="`${index}_pState`"
          :id="`activeStateIndex_${activeStateIndex}`"
        >
          <v-row no-gutters justify="center">
            <BaseShinyBadge
              v-if="
                state === PUBLICATION_STATE_PUBLISHED &&
                  activeStateIndex === index
              "
              :text="getStateText(state)"
            />

            <v-chip
              v-if="
                (!!getStateText(state) &&
                  state !== PUBLICATION_STATE_PUBLISHED) ||
                  (state === PUBLICATION_STATE_PUBLISHED &&
                    activeStateIndex !== index)
              "
              density="compact"
              :disabled="activeStateIndex > index"
              :color="activeStateIndex === index ? 'secondary' : ''"
              :variant="activeStateIndex === index ? 'flat' : 'tonal'"
            >
              {{ getStateText(state) }}
            </v-chip>

            <BaseIcon v-if="!getStateText(state)" :icon="mdiArrowRight" :color="'grey'" />

          </v-row>

          <v-row
            v-if="currentStateInfos?.positionIndex === index"
            no-gutters
            class="py-2"
            justify="center"
          >
            <BaseIcon :icon="mdiArrowUp" :color="'grey'"  class='mr-1' />
          </v-row>

          <v-row
            v-if="
              currentStateInfos?.positionIndex === index &&
                currentStateInfos?.buttonText
            "
            no-gutters
            justify="center"
          >

            <BaseRectangleButton
              id="interactiveButton"
              :buttonText="currentStateInfos.buttonText"
              :icon="currentStateInfos.buttonIcon"
              iconColor="white"
              :loading="loading"
              :url="
                publicationState === PUBLICATION_STATE_PUBLISHED
                  ? doiUrl
                  : undefined
              "
              :disabled="!currentStateInfos.buttonEvent || !isUserAllowedToEdit"
              tooltipPosition="bottom"
              :tooltipText="`Click to ${currentStateInfos.infoText}`"
              :elevation="5"
              @clicked="publicationState === PUBLICATION_STATE_PUBLISHED
                  ? undefined
                  : $emit('clicked', currentStateInfos.buttonEvent)"
            />

          </v-row>

          <v-row
            v-if="currentStateInfos.positionIndex === index"
            class="pt-2"
            no-gutters
            justify="center"
            style="text-align: center;"
          >
            {{ currentStateInfos.infoText }}
          </v-row>

<!--
          <v-row v-if="currentStateInfos.positionIndex === index"
                 no-gutters
                 class="py-2"
                 justify="center">
            <v-icon :icon="mdiArrowUp" />
          </v-row>
-->


          <v-row v-if="currentStateInfos.positionIndex === index && !isUserAllowedToEdit"
                 class="pt-2 readOnlyHint"
                 no-gutters
                 justify="center">
            {{ readOnlyUserRoleInfo }}
          </v-row>

        </v-col>
      </v-row>

      <v-alert type="warning" :text="labels.instructions2" class="text-body-1 mt-10">

        <v-row class="text-body-2 mt-5 px-2">
          <v-col
            v-for="(field, index) of metadataPublishedReadOnlyFields"
            cols="6"
            md="3"
            class="pa-1"
            :key="`${index}_${field}`"
          >
            {{ getReadableLabel(field) }}
          </v-col>
        </v-row>

        <v-row class="text-body-1 pt-4">
          <v-col cols="12" v-html="labels.instructions3"> </v-col>
        </v-row>

      </v-alert>

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
import {mdiArrowUp, mdiArrowRight, mdiEarth, mdiFingerprint, mdiNewspaper, mdiOpenInNew} from '@mdi/js';

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import BaseShinyBadge from '@/components/BaseElements/BaseShinyBadge.vue';

import { possiblePublicationStates } from '@/factories/metaDataFactory';
import {
  metadataPublishedReadOnlyFields,
  readablePublishedReadOnlyFields,
} from '@/factories/mappingFactory';
import {
  DOI_PUBLISH,
  DOI_REQUEST,
  DOI_RESERVE,
} from '@/modules/user/store/doiMutationsConsts';
import {
  USER_ROLE_ADMIN,
  USER_ROLE_EDITOR,
  USER_ROLE_MEMBER,
  USER_ROLE_SYSTEM_ADMIN,
} from '@/factories/userEditingValidations';

import {
  PUBLICATION_STATE_DRAFT,
  PUBLICATION_STATE_PENDING,
  PUBLICATION_STATE_PUBLISHED,
  PUBLICATION_STATE_RESERVED,
} from '@/factories/metadataConsts';


export default {
  name: 'EditPublicationStatus',
  props: {
    publicationState: {
      type: String,
      default: PUBLICATION_STATE_DRAFT,
    },
    doi: {
      type: String,
      default: undefined,
    },
    userRole: {
      type: String,
      default: USER_ROLE_MEMBER,
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
    flat: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['config']),
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    pStatesAndArrows() {
      const pStateWithDiv = [];
      if (!this.possiblePublicationStates) {
        return pStateWithDiv;
      }

      for (let i = 0; i < this.possiblePublicationStates.length; i++) {
        const pState = this.possiblePublicationStates[i] || PUBLICATION_STATE_DRAFT;
        pStateWithDiv.push(pState);
        pStateWithDiv.push('mdiArrowRight');
      }

      pStateWithDiv.splice(pStateWithDiv.length - 1, 1);

      return pStateWithDiv;
    },
    activeStateIndex() {
      return this.pStatesAndArrows.findIndex(v => v === this.publicationState);
    },
    currentStateInfos() {
      return this.stateTextMap.get(this.publicationState || PUBLICATION_STATE_DRAFT);
    },
    doiUrl() {
      return this.doi ? `https://www.doi.org/${this.doi}` : undefined;
    },
    isUserAllowedToEdit() {
      return (
        this.userRole === USER_ROLE_EDITOR ||
        this.userRole === USER_ROLE_ADMIN ||
        this.userRole === USER_ROLE_SYSTEM_ADMIN
      );
    },
    stateTextMap() {
      if (this.userRole === USER_ROLE_SYSTEM_ADMIN) {
        // for system admin add the state for publication so the button event is there
        // and a dataset can be published
        return new Map([...this.stateTextMapEditor, ...this.stateTextMapAdmin]);
      }

      return this.stateTextMapEditor;
    },
    readOnlyUserRoleInfo() {
      return this.isUserAllowedToEdit ? '' : this.readOnlyExplanation;
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
    mdiArrowUp,
    mdiArrowRight,
    possiblePublicationStates,
    stateTextMapEditor: new Map([
      [
        PUBLICATION_STATE_DRAFT,
        {
          chipText: 'Draft',
          infoText: 'Reserve DOI for Dataset',
          buttonIcon: mdiFingerprint,
          buttonText: 'Reserve',
          buttonEvent: DOI_RESERVE,
          positionIndex: 2,
        },
      ],
      [
        PUBLICATION_STATE_RESERVED,
        {
          chipText: 'Reserved DOI',
          infoText: 'Request Dataset Publication',
          buttonIcon: mdiNewspaper,
          buttonText: 'Request',
          buttonEvent: DOI_REQUEST,
          positionIndex: 4,
        },
      ],
      [
        PUBLICATION_STATE_PENDING,
        {
          chipText: 'Publication Pending',
          infoText: 'Wait for the admin to review & approve the publication',
          buttonIcon: mdiEarth,
          buttonText: 'Publish Dataset',
          positionIndex: 6,
        },
      ],
      [
        PUBLICATION_STATE_PUBLISHED,
        {
          chipText: 'Published',
          infoText: 'Open the DOI in a new Tab',
          buttonIcon: mdiOpenInNew,
          buttonText: 'Open DOI',
          buttonEvent: 'openDoi',
          positionIndex: 6,
        },
      ],
    ]),
    stateTextMapAdmin: new Map([
      [
        PUBLICATION_STATE_PENDING,
        {
          chipText: 'Publication Pending',
          infoText:
          'Please make sure you reviewed the dataset before publishing it!',
          buttonIcon: mdiEarth,
          buttonText: 'Publish Dataset',
          buttonEvent: DOI_PUBLISH,
          positionIndex: 6,
        },
      ],
    ]),
    labels: {
      cardTitle: 'Dataset Publication Status',
      instructions: `Ready to start publishing? <br/>Click the <strong>'Reserve' button</strong>, this will add a DOI to this datasets (you could already use it in your paper). <br/>  Be aware the DOI is not active yet and this dataset is still private!
          <br/><br/>Have you finished uploading your research data and entered all the metadata as best as possible?<br/> <br/> Yes, then click on <strong>'Request' publication</strong>, the EnviDat Team will review the dataset and once approved the DOI will be published at DataCite.
          And your dataset and the DOI are publicly available.`,
      instructions2:
        'Please be aware once the dataset is published the following metadata information can NOT be changed anymore.',
      instructions3:
        'You can still upload newer versions of your research data, please use a <strong>clear name and desription</strong> to indicate the latest version of the data.',
    },
    metadataPublishedReadOnlyFields,
    readablePublishedReadOnlyFields,
    readOnlyExplanation:
      'Only dataset owners and admins can change the publication status',
    PUBLICATION_STATE_PUBLISHED,
  }),
  components: {
    BaseRectangleButton,
    BaseStatusLabelView,
    BaseShinyBadge,
    BaseIcon,
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
