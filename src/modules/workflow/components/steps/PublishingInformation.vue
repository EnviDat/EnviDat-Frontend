<template>
  <v-container id="MetadataCreationPublicationInfo" fluid class="pa-4">
    <!-- Title box -->
    <v-row class="mb-0">
      <v-col class="text-h5 font-weight-bold" cols="12">
        {{ labels.title }}
      </v-col>
      <!-- <v-col cols="12" class="text-body-1">
        {{ labels.instructions }}
      </v-col> -->
    </v-row>

    <!-- Info Banner -->
    <v-row>
      <v-col class="mb-5 pt-0 pb-0">
        <v-alert
          type="info"
          closable
          :icon="false"
          class="rounded-lg info-banner"
        >
          <v-alert-title class="mb-2">Information</v-alert-title>

          <p>
            This section defines how your dataset will appear upon publication.
            It includes contact details and official publication information
            such as the publisher, publication year, and DOI.
          </p>

          <p><strong>Tips:</strong></p>
          <ol>
            <li>
              - <strong>DOI (Digital Object Identifier)</strong>: The DOI is
              generated automatically and becomes active once the dataset is
              published. You can still copy and use it in advance (e.g., in a
              paper).
            </li>
            <li>
              - <strong>Publisher</strong>: EnviDat is set as the publisher by
              default and cannot be changed.
            </li>
            <li>
              - <strong>Contact Information</strong>: Add a valid contact person
              for future communication about the dataset. If the person is an
              EnviDat user, pick them from the list to auto-fill their details.
            </li>
          </ol>

          <p class="mt-2">
            These details are part of the final published metadata and will be
            publicly visible. Make sure they are accurate.
          </p>
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
      <!-- <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <EditOrganization v-bind="editOrganizationProps" />
          </v-col>
        </v-row>
      </v-col> -->

      <!-- <v-col cols="12">
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
        </v-col> -->
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
import { defineAsyncComponent } from 'vue';

import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import {
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_STATE,
  eventBus,
} from '@/factories/eventBus';

import {
  BLIND_REVIEW_ON,
  PUBLICATION_STATE_PUBLISHED,
} from '@/factories/metadataConsts';

// import EditOrganization from '@/modules/user/components/edit/EditOrganization.vue';
import EditContactPerson from '@/modules/user/components/edit/EditContactPerson.vue';

import EditPublicationInfo from '@/modules/user/components/edit/EditPublicationInfo.vue';

// import EditPublicationStatus from '@/modules/user/components/edit/EditPublicationStatus.vue';
import EditReviewInfo from '@/modules/user/components/edit/EditReviewInfo.vue';

import {
  getArrayOfFullNames,
  getAuthorByEmail,
  getAuthorName,
} from '@/factories/authorFactory';

// const NotFoundCard = defineAsyncComponent(
//   () => import('@/components/Cards/NotFoundCard.vue'),
// );

export default {
  name: 'PublishingInformation',
  data: () => ({
    envidatDomain: process.env.VITE_API_ROOT,
    newDatasetInfo: {},
    PUBLICATION_STATE_PUBLISHED,
    labels: {
      title: 'Publishing information',
      instructions:
        'Please provide main contact infomation and publication details for your dataset.',
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
  emits: ['save'],
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
      // const headerObj = this.$store
      //   ? this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](
      //       'EDITMETADATA_HEADER_INFO',
      //     )
      //   : this.currentStep.genericProps;

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
      // ACTIVATE this part when the store is available with the backend
      // if (this.$store) {
      //   return this.$store.getters[
      //     `${USER_NAMESPACE}/getMetadataEditingObject`
      //   ](EDITMETADATA_PUBLICATION_INFO);
      // }

      // storybook context
      // const stepData = this.currentStep.genericProps;

      return {
        publicationState: 'Draft',
        // visibilityState: ' stepData.visibilityState',
        // doi: stepData.doi,
        doi: '10.10000/envidat.999',
        userRole: 'stepData.userRole',
        // publisher: stepData.publisher,
        publisher: 'Envidat',
        // publicationYear: stepData.publicationYear,
        publicationYear: '2025',
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
    // EditPublicationStatus,
    EditPublicationInfo,
    // EditOrganization,
    // NotFoundCard,
    EditContactPerson,
  },
};
</script>
