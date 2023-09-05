<template>
  <v-container id="MetadataCreationPublicationInfo" fluid class="pa-0">
    <v-row>
      <v-col cols="6">
        <!-- prettier-ignore -->
        <v-row>
          <v-col cols="12">
            <EditFunding v-bind="editFundingProps" />
          </v-col>

          <v-col cols="12">
            <EditPublicationInfo v-bind="editPublicationsProps" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">

        <v-row v-if="!isDatasetPublic">

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
                <v-col cols="1">
                  <v-icon color="secondary" style="animation: progress-circular-rotate 3s linear infinite" x-large>settings</v-icon>
                </v-col>

                <v-col class="text-h5" cols="11">
                  Coming Soon!
                </v-col>

                <v-col class="pt-2 text-body-1">
                  Publishing datasets is still under construction.
                  <br>
                  Please publish via this dataset the legacy website by clicking on the button below.
                </v-col>
              </v-row>

              <v-row no-gutters
                     class="pt-6" >

                <v-col class="pr-2 text-left">
                  <BaseRectangleButton buttonText="Publish Dataset"
                                       color="secondary"
                                       :url="linkToDatasetCKAN" />

                </v-col>

              </v-row>
            </v-container>
          </v-card>
          <!-- TEMPORARY PLACEHOLDER END -->

          </v-col >

        </v-row>

        <v-row>

          <v-col >

            <!--        <EditOrganizationTree v-bind="editOrganizationProps" />-->
            <!-- prettier-ignore -->
            <EditOrganization v-bind="editOrganizationProps" />

          </v-col >

        </v-row>
      </v-col>
    </v-row>

    <v-row justify="end" align="end">
      <v-col class="flex-grow-0">
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

import EditPublicationInfo from '@/modules/user/components/EditPublicationInfo.vue';
import EditFunding from '@/modules/user/components/EditFunding.vue';
// import EditOrganizationTree from '@/modules/user/components/EditOrganizationTree';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import {
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
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
    isCreationWorkflow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    publicationsInfo() {
      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_PUBLICATION_INFO);
      }

      const stepData = this.currentStep.genericProps;

      return {
        publicationState: stepData.publicationState,
        visibilityState: stepData.visibilityState,
        doi: stepData.doi,
        publisher: stepData.publisher,
        publicationYear: stepData.publicationYear,
      }
    },
    fundingInfo() {
      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_FUNDING_INFO);
      }

      return this.currentStep.genericProps;
    },
    organizationsInfo() {
      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_ORGANIZATION);
      }

      return this.currentStep.genericProps;
    },
    isDatasetPublic() {
      return this.publicationsInfo?.publicationState === 'published';
    },
    editPublicationsProps() {
      return {
        ...this.publicationsInfo,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
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
    linkToDatasetCKAN() {
      return `${this.envidatDomain}/dataset/${this.metadataId}`;
    },
  },
  methods: {
    submitEdittedMetadata() {
      eventBus.emit(METADATA_EDITING_FINISH_CLICK);
    },
  },
  data: () => ({
    envidatDomain: process.env.VITE_API_ROOT,
  }),
  components: {
    //  EditOrganizationTree,
    EditPublicationInfo,
    EditFunding,
    EditOrganization,
    BaseRectangleButton,
  },
};
</script>
