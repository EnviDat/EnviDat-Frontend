<template>
  <v-card id="MetadataCreationPublicationInfo" class="pt-8" elevation="0">
    <v-container fluid class="pa-4">
      <!-- Title box -->
      <v-row class="mb-0">
        <v-col class="text-h5 font-weight-bold" cols="8">
          {{ labels.title }}
        </v-col>
        <v-col cols="12" class="text-body-1">
          {{ labels.instructions }}
        </v-col>
      </v-row>

      <!-- Info Banner -->
      <v-row>
        <v-col class="mb-5 pt-0 pb-0">
          <v-alert type="info" closable :icon="false" class="rounded-lg">
            <v-alert-title>Information</v-alert-title>
            Lorem Ipsum
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" xl="6">
          <!-- prettier-ignore -->
          <v-row>

          <v-col cols="12">
            <EditPublicationInfo v-bind="editPublicationsProps" />
          </v-col>
          <v-col v-if="blindReviewEditingActive && publicationState !== PUBLICATION_STATE_PUBLISHED" cols="12">
            <EditReviewInfo v-bind="editReviewProps" />
          </v-col>
        </v-row>
        </v-col>

        <v-col cols="12" xl="6">
          <v-row>
            <v-col cols="12">
              <EditContactPerson
                v-bind="editContactPersonProps"
                @save="catchContactPersonChange"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="12">
              <EditOrganization v-bind="editOrganizationProps" />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row v-if="doiWorkflowActive">
            <v-col>
              <EditPublicationStatus
                v-bind="editPublicationStatusProps"
                @clicked="catchPublicationStateChange"
              />
            </v-col>
          </v-row>

          <v-row v-if="!doiWorkflowActive">
            <v-col>
              <NotFoundCard
                title="Publication Status editing is disabled"
                description="There seems to be a problem, make sure you read the message in the banner or go on the <a href='https://www.envidat.ch' target='_blank'>homepage</a> and check the news."
                actionDescription="Click to open the legacy UI for dataset publication. Use the blue button on the top right of the page."
                actionButtonText="Request Publication"
                :actionButtonCallback="openCKANLink"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
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
import { defineAsyncComponent } from 'vue';

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

import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
  BLIND_REVIEW_ON,
  PUBLICATION_STATE_PUBLISHED,
} from '@/factories/metadataConsts';

import EditOrganization from '@/modules/user/components/edit/EditOrganization.vue';
import EditContactPerson from '@/modules/user/components/edit/EditContactPerson.vue';

import EditPublicationInfo from '@/modules/user/components/edit/EditPublicationInfo.vue';

import EditPublicationStatus from '@/modules/user/components/edit/EditPublicationStatus.vue';
import EditReviewInfo from '@/modules/user/components/edit/EditReviewInfo.vue';

import {
  getArrayOfFullNames,
  getAuthorByEmail,
  getAuthorName,
} from '@/factories/authorFactory';

const NotFoundCard = defineAsyncComponent(
  () => import('@/components/Cards/NotFoundCard.vue'),
);

export default {
  name: 'MetadataEditingPublicationInfo',
  data: () => ({
    envidatDomain: process.env.VITE_API_ROOT,
    newDatasetInfo: {},
    PUBLICATION_STATE_PUBLISHED,
    labels: {
      title: 'Research Header Information',
      instructions:
        'The header is part of the main metadata information.' +
        'Together with the other information in the "Metadata" step, it represents the core information for your research dataset.',
    },
  }),
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
    existingAuthors: {
      type: Array,
      default: () => [],
    },
    contactEmail: {
      type: String,
      default: '',
    },
    contactFirstName: {
      type: String,
      default: '',
    },
    contactLastName: {
      type: String,
      default: '',
    },
    validationErrors: { type: Object, default: () => ({}) },
  },
  computed: {
    ...mapState(['config']),
    ...mapState(USER_NAMESPACE, ['doiLoading', 'doiSuccess', 'doiError']),

    fullNameUsers() {
      const localAuthors = [...this.existingAuthorsWrap];
      return getArrayOfFullNames(localAuthors);
    },

    preselectAuthorNames() {
      const author = getAuthorByEmail(
        this.contactEmail,
        this.existingAuthorsWrap,
      );
      if (author) {
        const fullName = getAuthorName(author);
        return fullName ? [fullName] : [];
      }

      return undefined;
    },
    existingAuthorsWrap() {
      if (this.$store) {
        return this.$store.getters['metadata/existingAuthors'];
      }

      return this.existingAuthors;
    },
    editContactPersonProps() {
      const headerObj = this.$store
        ? this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](
            'EDITMETADATA_HEADER_INFO',
          )
        : this.currentStep.genericProps;

      return {
        contactEmail: this.contactEmail || '',
        contactFirstName: this.contactFirstName,
        contactLastName: this.contactLastName,
        fullNameUsers: this.fullNameUsers || [],
        authors: this.existingAuthorsWrap,
        preselectAuthorNames: this.preselectAuthorNames || [],
        validationErrors: this.validationErrors || {},
        isContactPropertyReadOnly: () => false,
        contactPropertyHint: () => '',
      };
    },
    doiWorkflowActive() {
      if (this.$store) {
        return this.config?.userEditMetadataConfig?.doiWorkflowActive;
      }

      // storybook context
      return true;
    },
    blindReviewEditingActive() {
      if (this.$store) {
        return this.config?.userEditMetadataConfig?.blindReviewEditingActive;
      }

      // storybook context
      return true;
    },
    publicationsInfo() {
      if (this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](EDITMETADATA_PUBLICATION_INFO);
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
      };
    },
    fundingInfo() {
      if (this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](EDITMETADATA_FUNDING_INFO);
      }

      return this.currentStep.genericProps;
    },
    organizationsInfo() {
      if (this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](EDITMETADATA_ORGANIZATION);
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
    editReviewProps() {
      return {
        ...this.publicationsInfo,
        isBlindReview: this.publicationsInfo.version === BLIND_REVIEW_ON,
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
    catchContactPersonChange(updatedContact) {
      this.newDatasetInfo.contactEmail = updatedContact.contactEmail;
      this.newDatasetInfo.contactFirstName = updatedContact.contactFirstName;
      this.newDatasetInfo.contactLastName = updatedContact.contactLastName;
      this.$emit('save', this.newDatasetInfo);
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

  components: {
    EditReviewInfo,
    EditPublicationStatus,
    EditPublicationInfo,
    EditOrganization,
    NotFoundCard,
    EditContactPerson,
  },
};
</script>
