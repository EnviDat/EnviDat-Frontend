<template>
  <v-container id="MetadataCreationPublicationInfo" fluid class="pa-0">
    <v-row>
      <v-col cols="6">
        <!-- prettier-ignore -->
        <v-row>
          <v-col cols="12">
            <EditFunding v-bind="editFundingProps" />
          </v-col>

        </v-row>
      </v-col>

      <v-col cols="6">

        <v-row>
          <v-col >

            <!--        <EditOrganizationTree v-bind="editOrganizationProps" />-->
            <!-- prettier-ignore -->
            <EditOrganization v-bind="editOrganizationProps" />
          </v-col >
        </v-row>

        <v-row >

          <v-col >

            <!-- TEMPORARY PLACEHOLDER START -->
            <v-card class="pa-4">
              <v-container fluid class="pa-0">
                <v-row>
                  <v-col cols="12">
                    <div class="text-h5">Publishing Dataset</div>
                  </v-col>
                </v-row>

                <v-row no-gutters align="center" class="pt-6">

                  <v-col class="pt-2 text-body-1"
                          v-html="publicationInstructions">

                  </v-col>
                </v-row>

              </v-container>
            </v-card>
            <!-- TEMPORARY PLACEHOLDER END -->

          </v-col >

        </v-row>


      </v-col>
    </v-row>

    <v-row justify="end" align="end">
      <v-col class="shrink">
        <!-- prettier-ignore -->
        <BaseRectangleButton buttonText="Close"
                             color='highlight'
                             @clicked="submitEdittedMetadata" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * MetadataCreationPublicationInfo.vue renders the GenericPlaceholder component with a screenshot image of the Metadata Keywords mockup used in the slot
 *
 *
 * @summary shows a screenshot placeholder of the editing the Related Info
 * @author Dominik Haas-Artho
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-10-07 13:12:25
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import EditOrganization from '@/modules/user/components/EditOrganization.vue';

import EditFunding from '@/modules/user/components/EditFunding.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import {
  eventBus,
  METADATA_EDITING_FINISH_CLICK,
} from '@/factories/eventBus';

export default {
  name: 'MetadataCreationPublicationInfo',
  props: {
    currentStep: Object,
    publicationState: {
      type: String,
      default: undefined,
    },
    visibilityState: {
      type: String,
      default: undefined,
    },
    doi: {
      type: String,
      default: undefined,
    },
    publisher: {
      type: String,
      default: undefined,
    },
    publicationYear: {
      type: String,
      default: undefined,
    },
    funders: {
      type: Array,
      default: undefined,
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
    publicationsInfo() {

      const stepData = this.currentStep.genericProps;

      if (stepData) {
        return {
          publicationState: stepData.publicationState,
          visibilityState: stepData.visibilityState,
          doi: stepData.doi,
          publisher: stepData.publisher,
          publicationYear: stepData.publicationYear,
        }
      }

      return {};
    },
    fundingInfo() {
      return this.currentStep.genericProps;
    },
    organizationsInfo() {
      return this.currentStep.genericProps;
    },
    editFundingProps() {
      return {
        ...this.fundingInfo,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    editOrganizationProps() {
      return {
        ...this.organizationsInfo,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    metadataId() {
      return this.$route?.params?.metadataid;
    },
  },
  methods: {
    submitEdittedMetadata() {
      eventBus.emit(METADATA_EDITING_FINISH_CLICK);
    },
  },
  data: () => ({
    publicationInstructions: `Your are in the dataset creation process. This <strong>dataset is only stored locally on your computer in this browser</strong>. Please fill out all the steps and save the dataset.
    Once the dataset is saved, the publication can be done in editing workflow.`,
  }),
  components: {
    EditFunding,
    EditOrganization,
    BaseRectangleButton,
  },
};
</script>
