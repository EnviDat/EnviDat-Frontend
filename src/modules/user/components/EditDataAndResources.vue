<template>
  <v-container fluid class="pa-0" id="EditDataAndResources">
    <v-row>
      <v-col cols="6">
        <v-row v-if="selectedResource">
          <v-col>
            <!-- prettier-ignore -->
            <!-- <EditResource v-bind="selectedResource"
                               @closeClicked="catchEditResourceClose"
                               @saveResource="catchSaveResourceClose"
                               @triggerValidateField="validateField"
                               :validationErrors="validationErrors" /> -->

            <!-- TEMPORARY PLACEHOLDER START -->
            <v-card class="pa-4">
              <v-container fluid class="pa-0">
                <v-row>
                  <v-col cols="12">
                    <div class="text-h5">Edit Selected Resource</div>
                  </v-col>
                </v-row>

                <v-row no-gutters align="center" class="pt-6">
                  <v-col cols="1">
                    <v-icon style="animation: progress-circular-rotate 3s linear infinite" x-large>settings</v-icon>
                  </v-col>

                  <v-col class="text-h5" cols="11">
                    Coming Soon!
                  </v-col>

                  <v-col class="pt-2 text-body-1">
                    This section is still under construction.
                    <br>
                    Please edit resources by following the link below and logging in.
                  </v-col>
                </v-row>

                <v-row no-gutters class="pt-6">
                  <v-col class="pr-2 text-left">
                    <v-btn
                      large
                      color="secondary"
                      :href="linkEditResourceCKAN"
                      target="_blank"
                    >
                      Add Resources in CKAN
                    </v-btn>
                  </v-col>
                  <v-col class="pr-2 text-right">
                    <v-btn
                      large
                      color="error"
                      @click="catchEditResourceClose"
                    >
                      Close
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
            <!-- TEMPORARY PLACEHOLDER END -->
          </v-col>
        </v-row>

        <v-row v-if="!selectedResource">
          <v-col>
            <!-- <v-card class="pa-0">
              <EditDropResourceFiles @createResources="createResourceFromFiles" />

              <EditPasteResourceUrl @createResources="createResourceFromUrl" />
            </v-card> -->

            <!-- TEMPORARY PLACEHOLDER START -->
            <v-card class="pa-4">
              <v-container fluid class="pa-0">
                <v-row>
                  <v-col cols="12">
                    <div class="text-h5">Add New Resource</div>
                  </v-col>
                </v-row>

                <v-row no-gutters align="center" class="pt-6">
                  <v-col cols="1">
                    <v-icon style="animation: progress-circular-rotate 3s linear infinite" x-large>settings</v-icon>
                  </v-col>

                  <v-col class="text-h5" cols="11">
                    Coming Soon!
                  </v-col>

                  <v-col class="pt-2 text-body-1">
                    This section is still under construction.
                    <br>
                    Please edit resources by following the link below and logging in.
                  </v-col>
                </v-row>

                <v-row no-gutters class="pt-6">
                  <v-btn
                    large
                    color="secondary"
                    :href="linkAddNewResourcesCKAN"
                    target="_blank"
                  >
                    Edit Resource in CKAN
                  </v-btn>
                </v-row>
              </v-container>
            </v-card>
            <!-- TEMPORARY PLACEHOLDER END -->
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <EditMetadataResources v-bind="metadataResourcesGenericProps" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * EditDataAndResources.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources for a metadata entry
 * @author Dominik Haas-Artho & Sam Woodcock
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  CANCEL_EDITING_RESOURCE,
  SAVE_EDITING_RESOURCE,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_RESOURCES,
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
  eventBus,
} from '@/factories/eventBus';

import { initializeLocalResource } from '@/factories/metaDataFactory';
// eslint-disable-next-line import/no-cycle
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingFactory';
import { enhanceElementsWithStrategyEvents } from '@/factories/strategyFactory';

import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts';
import EditMetadataResources from '@/modules/user/components/EditMetadataResources';
// import EditDropResourceFiles from '@/modules/user/components/EditDropResourceFiles';
// import EditPasteResourceUrl from '@/modules/user/components/EditPasteResourceUrl';
// import EditResource from '@/modules/user/components/EditResource';

export default {
  name: 'EditDataAndResources',
  components: {
    EditMetadataResources,
    // EditDropResourceFiles,
    // EditPasteResourceUrl,
    // EditResource,
  },
  props: {
    resources: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    // Add editing button to resource card
    if (this.resources !== []) {
      enhanceElementsWithStrategyEvents(
        this.resources,
        SELECT_EDITING_RESOURCE_PROPERTY,
        true,
      );
    }
  },
  beforeDestroy() {},
  computed: {
    selectedName() {
      return this.selectedResource.name;
    },
    selectedDescription() {
      return this.selectedResource.name;
    },
    selectedUrl() {
      return this.selectedResource.name;
    },
    metadataResourcesGenericProps() {
      return {
        resources: this.resources,
        resourcesConfig: {
          downloadActive: false,
        },
      };
    },
    selectedResource() {
      let selectedRes = null;
      const res = this.resources;

      if (res?.length > 0) {
        const selected = res.filter((r) => r.isSelected);

        if (selected?.length > 0) {
          selectedRes = selected[0];
        }
      }

      return selectedRes;
    },
    /**
     * @returns {String} the metadataId from the route
     */
    metadataId() {
      return this.$route.params.metadataid;
    },
    linkAddNewResourcesCKAN() {
//      return `${this.envidatDomain}/dataset/resources/${this.metadataId}`;
      return `${this.envidatDomain}/dataset/${this.metadataId}`;
    },
    linkEditResourceCKAN() {
//      return `${this.envidatDomain}/dataset/${this.metadataId}/resource/${this.selectedResource.id}/edit`;
      return `${this.envidatDomain}/dataset/${this.metadataId}/resource/${this.selectedResource.id}`;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_RESOURCES);
    },
  },
  methods: {
    createResourceFromUrl(url) {
      // console.log(`createResourceFromUrl ${url}`);

      const metadataId = this.getMetadataId();

      this.initResource(metadataId, null, url);
    },
    createResourceFromFiles(files) {
      // console.log(`createResourceFromFiles ${files}`);
      const metadataId = this.getMetadataId();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        this.initResource(metadataId, file, null, i === files.length - 1);
      }
    },
    getMetadataId() {
      const metadataId =
        this.metadataId || `local_MetadataId_${this.localResCounter}`;
      this.localResCounter++;
      return metadataId;
    },
    initResource(metadataId, file, url, autoSelect = true) {
      const newRes = initializeLocalResource(metadataId, file, url);

      enhanceElementsWithStrategyEvents(
        [newRes],
        SELECT_EDITING_RESOURCE_PROPERTY,
        true,
      );

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_RESOURCES,
        data: newRes,
      });

      if (autoSelect) {
        this.$nextTick(() => {
          eventBus.$emit(SELECT_EDITING_RESOURCE, newRes.id);
        });
      }
    },
    catchEditResourceClose() {
      eventBus.$emit(CANCEL_EDITING_RESOURCE, this.selectedResource);
    },
    catchSaveResourceClose() {
      eventBus.$emit(SAVE_EDITING_RESOURCE, this.selectedResource);
    },
    openCKANEditPage() {},
    validateField(field) {
      isFieldValid(
        field.property,
        field.value,
        this.validations,
        this.validationErrors,
      );
    },
  },
  data: () => ({
    EDIT_METADATA_RESOURCES_TITLE,
    localResCounter: 0,
    validationErrors: {
      name: null,
      description: null,
      url: null,
    },
    envidatDomain: process.env.VUE_APP_ENVIDAT_PROXY,
  }),
};
</script>

<style scoped></style>
