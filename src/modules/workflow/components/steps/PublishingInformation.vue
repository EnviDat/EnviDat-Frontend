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
      <InfoBanner :show="showInfoBanner" :icon="mdiInformationOutline" @setInfoBanner="$emit('setInfoBanner', $event)">
        <p>
          This section defines how your dataset will appear upon publication. It includes contact details and official
          publication information such as the publisher, publication year, and DOI.
        </p>

        <p><strong>Tips:</strong></p>
        <ol>
          <li>
            - <strong>DOI (Digital Object Identifier)</strong>: The DOI is generated automatically and becomes active
            once the dataset is published. You can still copy and use it in advance (e.g., in a paper).
          </li>
          <li>- <strong>Publisher</strong>: EnviDat is set as the publisher by default and cannot be changed.</li>
          <li>
            - <strong>Contact Information</strong>: Add a valid contact person for future communication about the
            dataset. If the person is an EnviDat user, pick them from the list to auto-fill their details.
          </li>
        </ol>

        <p class="mt-2">
          These details are part of the final published metadata and will be publicly visible. Make sure they are
          accurate.
        </p>
      </InfoBanner>
    </v-row>

    <v-row>
      <v-col cols="12" xl="6">
        <v-row>
          <v-col cols="12" class="pa-0">
            <PublicationInfo v-bind="editPublicationsProps" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" xl="6" class="pa-0">
        <v-row>
          <v-col cols="12">
            <ContactPerson v-bind="editContactPersonProps" @save="catchContactPersonChange" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" xl="6" class="pa-0">
        <v-row>
          <v-col v-if="blindReviewEditingActive && publicationState !== PUBLICATION_STATE_PUBLISHED" cols="12">
            <ReviewInfo v-bind="editReviewProps" @save="catchReviewChange" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" class="pa-0">
        <v-row v-if="doiWorkflowActive">
          <v-col>
            <PublicationStatus
              :user-role="userRole"
              v-bind="editPublicationStatusProps"
              @clicked="catchPublicationStateChange"
            />
          </v-col>
        </v-row>

        <v-row v-else>
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

import { mdiInformationOutline } from '@mdi/js';
import ContactPerson from '@/modules/workflow/components/steps/ContactPerson.vue';
import PublicationInfo from '@/modules/workflow/components/steps/PublicationInfo.vue';
import PublicationStatus from '@/modules/workflow/components/steps/PublicationStatus.vue';
import ReviewInfo from '@/modules/workflow/components/steps/ReviewInfo.vue';
import NotFoundCard from '@/components/Cards/NotFoundCard.vue';
import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';

import { getUserPickerObjects, getAuthorByEmail } from '@/factories/authorFactory';

import { isReadOnlyField, getReadOnlyHint } from '@/modules/workflow/utils/useReadonly';

import { BLIND_REVIEW_ON, PUBLICATION_STATE_PUBLISHED } from '@/factories/metadataConsts';

import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import InfoBanner from '@/modules/workflow/components/steps/InformationBanner.vue';

export default {
  name: 'PublishingInformation',
  setup() {
    const workflowStore = useDatasetWorkflowStore();
    return { workflowStore };
  },

  data: () => ({
    mdiInformationOutline,
    envidatDomain: process.env.VITE_API_ROOT,
    newDatasetInfo: {},
    PUBLICATION_STATE_PUBLISHED,
    labels: {
      title: 'Publishing information',
      instructions: 'Please provide main contact infomation and publication details for your dataset.',
    },
  }),

  props: {
    publicationState: { type: String, default: undefined },
    visibilityState: { type: String, default: undefined },
    doi: { type: String, default: undefined },
    publisher: { type: String, default: undefined },
    publicationYear: { type: String, default: undefined },
    version: { type: String, default: undefined },
    datasetId: { type: String, default: undefined },

    contactEmail: { type: String, default: '' },
    contactFirstName: { type: String, default: '' },
    contactLastName: { type: String, default: '' },

    validationErrors: { type: Object, default: () => ({}) },
    existingAuthors: { type: Array, default: undefined },

    doiWorkflowActive: { type: Boolean, default: true },
    blindReviewEditingActive: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    doiError: { type: [String, Object], default: undefined },

    readOnlyFields: { type: Array, default: () => [] },
    readOnlyExplanation: { type: String, default: '' },
    showInfoBanner: { type: Boolean, default: true },
    userRole: { type: String, default: undefined },
  },

  emits: ['save'],

  computed: {
    existingAuthorsWrap() {
      if (this.existingAuthors) {
        return this.existingAuthors;
      }

      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/existingAuthors`];
      }

      return undefined;
    },

    userPickerObjects() {
      const localAuthors = [...this.existingAuthorsWrap];
      return getUserPickerObjects(localAuthors);
    },

    preselectAuthorEmails() {
      const author = getAuthorByEmail(this.contactEmail, this.existingAuthorsWrap);

      return author ? [author.email] : [];
    },

    publicationsInfo() {
      return {
        publicationState: this.publicationState,
        visibilityState: this.visibilityState,
        doi: this.doi,
        userRole: this.userRole,
        publisher: this.publisher,
        publicationYear: this.publicationYear,
        version: this.version,
        datasetId: this.datasetId,
        loading: this.loading,
      };
    },

    editContactPersonProps() {
      return {
        contactEmail: this.contactEmail || '',
        contactFirstName: this.contactFirstName,
        contactLastName: this.contactLastName,
        userPickerObjects: this.userPickerObjects || [],
        authors: this.existingAuthorsWrap,
        preselectAuthorEmails: this.preselectAuthorEmails || [],
        validationErrors: this.validationErrors || {},
        flat: true,
      };
    },

    editPublicationsProps() {
      return {
        ...this.publicationsInfo,
        readOnlyFields: this.isReadOnly('publicationsInfo'),
        readOnlyExplanation: this.readOnlyHint('publicationsInfo'),
        flat: true,
      };
    },

    editPublicationStatusProps() {
      const err = typeof this.doiError === 'string' ? this.doiError : this.doiError?.message;
      const errDetails = typeof this.doiError === 'object' ? this.doiError?.details : undefined;

      return {
        ...this.publicationsInfo,
        loading: this.workflowStore.isLoading('doi'),
        error: err,
        errorDetails: errDetails,
        flat: true,
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

    catchReviewChange(reviewInfos) {
      this.$emit('save', reviewInfos);
    },
    isReadOnly(fieldKey) {
      return isReadOnlyField(fieldKey);
    },
    readOnlyHint(fieldKey) {
      return getReadOnlyHint(fieldKey);
    },

    async catchPublicationStateChange(event) {
      const id = this.metadataId || this.datasetId;
      // this.doiErrorLocal = undefined;
      // this.doiMsgLocal = '';

      try {
        if (event === 'DOI_RESERVE') {
          await this.workflowStore.withLoading(() => this.workflowStore.backendStorageService.requestDoi(id), 'doi');
          // this.doiMsgLocal = 'DOI reserved successfully.';
        } else if (event === 'DOI_REQUEST') {
          await this.workflowStore.withLoading(
            () => this.workflowStore.backendStorageService.requestPublication(id),
            'doi',
          );
          // this.doiMsgLocal = 'Publication requested. An admin will review it.';
        } else if (event === 'DOI_PUBLISH') {
          await this.workflowStore.withLoading(
            () => this.workflowStore.backendStorageService.publishDataset(id),
            'doi',
          );
          // this.doiMsgLocal = 'Dataset published.';
        }
      } catch (e) {
        // this.doiErrorLocal = e?.message ?? 'Unexpected error';
        console.error(e);
      }
    },

    openCKANLink() {
      window.open(this.linkToDatasetCKAN, '_blank');
    },
  },

  components: { ReviewInfo, PublicationStatus, PublicationInfo, InfoBanner, NotFoundCard, ContactPerson },
};
</script>

<style lang="scss">
.loading {
  opacity: 0.2;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
.scrollToSave {
  position: absolute;
  right: 38px;
  z-index: 2;
  opacity: 1;
  top: 0;
  transition: 0.1s linear;
  animation: bounce 1s infinite ease-in-out;
  &:hover {
    cursor: pointer;
  }
  // .scroll-text {
  //   position: relative;
  //   transform: translateX(-50%);
  // }
}
</style>
