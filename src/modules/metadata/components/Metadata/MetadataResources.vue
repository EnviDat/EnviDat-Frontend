<template>
  <v-card id="MetadataResources"
    :class="{ ['pt-2']: this.isOnTop }">

    <v-card-title class="pa-4 pb-2">
      <v-row justify="end"
        no-gutters>

        <v-col class="text-h6 metadata_title flex-grow-1">
          {{ METADATA_RESOURCES_TITLE }}
        </v-col>

        <v-col v-if="!showPlaceholder && resources && resources.length > 0"
          class="flex-grow-0 resourcesIcons">

          <base-icon-count-view :count="resources.length"
            tooltip-text="Amount of Resources"
            :icon="mdiFile"
          />

        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row no-gutters
        align="center">
        <v-col v-if="dataLicenseTitle"
               class="pr-2">
          <BaseIconLabelView icon-tooltip="Data License"
                             :icon="mdiShieldSearch"
                             icon-color="grey"
                             :text="dataLicenseTitle"
                             :url="dataLicenseUrlField"
                             />
        </v-col>

        <v-col>
          <v-row no-gutters
            justify="end"
            v-for="(dateObj, index) in dates"
            :key="index">

            <v-col>{{ dateObj[DATE_PROPERTY_DATE_TYPE] }}</v-col>

            <!--
            <v-col class="flex-grow-0 px-2">Start:</v-col>
-->
            <v-col align-self="end" class="">{{ dateObj[DATE_PROPERTY_START_DATE] }}</v-col>

            <!--
            <v-col class="flex-grow-0 px-2">End:</v-col>
-->
            <v-col align-self="end">{{ dateObj[DATE_PROPERTY_END_DATE] }}</v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>

    <v-container v-if="showPlaceholder"
      id="resourcePlaceholderList"
      fluid
      class="pa-2 pt-0">
      <v-row no-gutters>
        <v-col v-for="n in 2"
          :key="n"
          cols="12" sm="6"
          class="pa-2">

          <ResourceCardPlaceholder />
        </v-col>
      </v-row>
    </v-container>

    <v-container
      v-if="!showPlaceholder && availableResources && availableResources.length > 0"
      id="resourceList"
      fluid
      :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
      class="heightAndScroll pa-2 pt-0">

      <v-row
        v-if="injectedComponent && injectAtStart"
        no-gutters>
        <component
          :is="injectedComponent"
          :stationConfig="injectedComponentConfig" />
      </v-row>

      <v-row no-gutters>

        <v-col v-for="res in availableResources"
                :key="res.id"
                cols="12"
                :sm="availableResources.length > 1 ? 6 : 12"
                class="pa-2" >

          <ResourceCard v-bind="res"
                          :key="res.id"
                          :twoColumnLayout="twoColumnLayout"
                          :downloadActive="resourcesConfig?.downloadActive"
                          :showGenericOpenButton="!!res.openEvent"
                          :genericOpenButtonBottom="true"
                          :openButtonTooltip="res.openButtonTooltip"
                          :openButtonIcon="res.openButtonIcon"
                          cardColor="primary"
                          @openButtonClicked="catchOpenClick(res.openEvent, res.openProperty)" />
        </v-col>
      </v-row>

      <v-row
        v-if="injectedComponent && !injectAtStart"
        no-gutters>
        <component
          :is="injectedComponent"
          :config="injectedComponentConfig" />

      </v-row>
    </v-container>

    <v-card-text
      v-if="!showPlaceholder && (!resources || resources.length <= 0)"
      :style="`color: ${emptyTextColor}};`"
    >
      {{ emptyText }}
    </v-card-text>

  </v-card>
</template>

<script>
/**
 * MetadataResources.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-08-11 10:14:54
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconCountView from '@/components/BaseElements/BaseIconCountView.vue';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView.vue';
import ResourceCard from '@/modules/metadata/components/ResourceCard.vue';
import ResourceCardPlaceholder from '@/modules/metadata/components/ResourceCardPlaceholder.vue';

import {
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
  METADATA_RESOURCES_TITLE,
} from '@/factories/metadataConsts';

import { eventBus, GCNET_INJECT_MICRO_CHARTS } from '@/factories/eventBus';

import { dataLicenses, WSL_DATA_LICENSE_ID } from '@/factories/dataLicense';
import { mdiFile, mdiShieldSearch } from '@mdi/js';

export default {
  name: 'MetadataResources',
  components: {
    ResourceCard,
    ResourceCardPlaceholder,
    BaseIconCountView,
    BaseIconLabelView,
  },
  props: {
    doi: {
      type: String,
      default: undefined,
    },
    resources: {
      type: Array,
      default: undefined,
    },
    dates: {
      type: Array,
      default: undefined,
    },
    resourcesConfig: {
      type: Object,
      default: () => {},
    },
    twoColumnLayout: {
      type: Boolean,
      default: false,
    },
    isOnTop: {
      type: Boolean,
      default: false,
    },
    dataLicenseId: {
      type: String,
      default: undefined,
    },
    dataLicenseTitle: {
      type: String,
      default: undefined,
    },
    dataLicenseUrl: {
      type: String,
      default: undefined,
    },
    emptyTextColor: {
      type: String,
      default: 'red',
    },
    emptyText: {
      type: String,
      default: 'No resources found for this dataset.',
    },
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.injectedComponent = null;
    eventBus.on(GCNET_INJECT_MICRO_CHARTS, this.injectComponent);
  },
  beforeUnmount() {
    this.injectedComponent = null;
    eventBus.off(GCNET_INJECT_MICRO_CHARTS, this.injectComponent);
  },
  computed: {
    availableResources() {
      const res = this.resources;

      return res ? res.filter(r => !r.hideFromResourceList) : [];
    },
    dataLicenseUrlField() {
      const licenseId = this.dataLicenseId;

      if (licenseId === WSL_DATA_LICENSE_ID) {
        const wslDataLicense = dataLicenses.filter((l) => l.id === WSL_DATA_LICENSE_ID)[0];

        return wslDataLicense.link;
      }
      
      return this.dataLicenseUrl;
    },
    scrollbarColorFront() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.colors.highlight : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  methods: {
    injectComponent({ component, config, injectAtStart = true }) {
      this.injectedComponent = component;
      this.injectedComponentConfig = config;
      this.injectAtStart = injectAtStart;
    },
    catchOpenClick(event, eventProperty) {
      eventBus.emit(event, eventProperty);
    },
  },
  data: () => ({
    mdiFile,
    mdiShieldSearch,
    injectedComponent: null,
    injectAtStart: true,
    injectedComponentConfig: null,
    METADATA_RESOURCES_TITLE,
    DATE_PROPERTY_DATE_TYPE,
    DATE_PROPERTY_START_DATE,
    DATE_PROPERTY_END_DATE,
  }),
};
</script>

<style scoped>
.heightAndScroll {
  max-height: 750px;
  overflow-y: auto !important;
  scrollbar-width: thin;
}

.resourcesIcons {
  opacity: 0.5;
}
</style>
