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
      <v-col class="shrink">
        <!-- prettier-ignore -->
        <BaseRectangleButton buttonText="Finish"
                             color='green'
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
  eventBus,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_FUNDING_INFO,
  METADATA_EDITING_FINISH_CLICK,
} from '@/factories/eventBus';

export default {
  name: 'MetadataCreationPublicationInfo',
  props: {
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
      if (this.publicationState) {
        return {
          possiblePublicationStates: this.possiblePublicationStates,
          publicationState: this.publicationState,
          visibilityState: this.visibilityState,
          doi: this.doi,
          publisher: this.publisher,
          publicationYear: this.publicationYear,
        }
      }

      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_PUBLICATION_INFO);
      }

      return {};
    },
    fundingInfo() {
      if (this.funders) {
        return this.funders;
      }

      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_FUNDING_INFO);
      }

      return {};
    },
    organizationsInfo() {
      if (this.organization) {
        return {
          organization: this.organization,
          allOrganizations: this.allOrganizations,
          userOrganizationsList: this.userOrganizationsList,
        }
      }

      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_ORGANIZATION);
      }

      return {};
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
      return this.$route.params.metadataid;
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
    envidatDomain: process.env.VITE_ENVIDAT_PROXY,
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
