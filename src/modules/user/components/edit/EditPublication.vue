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

        <v-row>
          <v-col >
            <EditOrganization v-bind="editOrganizationProps" />
          </v-col >
        </v-row>

        <v-row v-if="doiWorkflowActive">
          <v-col >
            <EditPublicationStatus v-bind="editPublicationStatusProps"
                                   @clicked="catchPublicationStateChange"/>
          </v-col >
        </v-row>

        <v-row v-if="!doiWorkflowActive">
          <v-col>

            <NotFoundCard title="Publication Status editing is disabled"
                          description="There seems to be a problem, make sure you read the message in the banner or go on the <a href='https://www.envidat.ch' target='_blank'>homepage</a> and check the news."
                          actionDescription="Click to open the legacy UI for dataset publication. Use the blue button on the top right of the page."
                          actionButtonText="Request Publication"
                          :actionButtonCallback="openCKANLink"
                          />

          </v-col>
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
 * CreatePublicationInfo.vue renders the GenericPlaceholder component with a screenshot image of the Metadata Keywords mockup used in the slot
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

import { mapState } from 'vuex';
import {defineAsyncComponent} from 'vue';

import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import {
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_PUBLICATION_STATE,
  eventBus,
  METADATA_EDITING_FINISH_CLICK,
} from '@/factories/eventBus';

import EditOrganization from '@/modules/user/components/edit/EditOrganization.vue';
import EditPublicationInfo from '@/modules/user/components/edit/EditPublicationInfo.vue';
import EditFunding from '@/modules/user/components/EditFunding.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import EditPublicationStatus from '@/modules/user/components/edit/EditPublicationStatus.vue';

const NotFoundCard = defineAsyncComponent(() =>
  import('@/components/Cards/NotFoundCard.vue'),
);


export default {
  name: 'MetadataEditingPublicationInfo',
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
    userRole: {
      type: String,
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
    ...mapState([
      'config',
    ]),
    ...mapState(USER_NAMESPACE, [
      'doiLoading',
      'doiSuccess',
      'doiError',
    ]),
    doiWorkflowActive() {
      if (this.$store) {
        return this.config?.userEditMetadataConfig?.doiWorkflowActive;
      }

      // storybook context
      return true;
    },
    publicationsInfo() {
      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_PUBLICATION_INFO);
      }

      // storybook context
      const stepData = this.currentStep.genericProps;

      return {
        publicationState: stepData.publicationState,
        visibilityState: stepData.visibilityState,
        doi: stepData.doi,
        userRole: stepData.userRole,
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
    editPublicationStatusProps() {
      return {
        ...this.publicationsInfo,
        loading: this.$store ? this.doiLoading : undefined,
        error: this.$store ? this.doiError?.message : undefined,
        errorDetails: this.$store ? this.doiError?.details : undefined,
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
    catchPublicationStateChange(event) {
      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_PUBLICATION_STATE,
        data: {
          event,
          metadataId: this.metadataId,
        },
      });
    },
    openCKANLink() {
      window.open(this.linkToDatasetCKAN, '_blank');
    },
  },
  data: () => ({
    envidatDomain: process.env.VITE_API_ROOT,
  }),
  components: {
    EditPublicationStatus,
    EditPublicationInfo,
    EditFunding,
    EditOrganization,
    BaseRectangleButton,
    NotFoundCard,
  },
};
</script>
