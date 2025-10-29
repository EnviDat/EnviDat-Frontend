<script setup lang="ts">
/**
 * MetadataResourceList.vue shows all the resources in a list with preview components.
 *
 * @summary lists the resources with previews
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-08-11 10:14:54
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { defineAsyncComponent, onMounted, watch, computed, ref, withDefaults, defineProps } from 'vue';
import { useTheme } from 'vuetify';

import { mdiFile, mdiShieldSearch } from '@mdi/js';
import BaseIconCountView from '@/components/BaseElements/BaseIconCountView.vue';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView.vue';

import {
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
  METADATA_RESOURCES_TITLE,
} from '@/factories/metadataConsts';

import { dataLicenses, WSL_DATA_LICENSE_ID } from '@/factories/dataLicense';
import { ResearchDataDates, Resource } from '@/types/modelTypes';
import { getPreviewComponentFromUrl } from '@/factories/strategyFactory.ts';
import ResourceListCard from '@/modules/metadata/components/ResourceListCard.vue';

const theme = useTheme();

const props = withDefaults(
  defineProps<{
    resources: Resource[];
    dates: ResearchDataDates[];
    resourcesConfig: object;
    maxHeight: number;
    compactList: boolean;
    isOnTop: boolean;
    dataLicenseId: string;
    dataLicenseTitle: string;
    dataLicenseUrl: string;
    loading: boolean;
    genericOpenButtonBottom: boolean;
  }>(),
  {
    maxHeight: 700,
    genericOpenButtonBottom: true,
  },
);

const emptyTextColor = 'red';
const emptyText = 'No resources found for this dataset.';

const selectedId = ref<string>();
/*
const { injectedComponent, injectedComponentConfig } = inject(GCNET_INJECT_MICRO_CHARTS, {
  injectedComponent: null,
  injectedComponentConfig: null,
});
*/

const previewComponent = computed(() => {
  const dynamicLoader = getPreviewComponentFromUrl(selectedResource.value?.url);
  return dynamicLoader ? defineAsyncComponent(dynamicLoader) : undefined;
});

const listLayout = computed(() => (props.compactList ? { sm: 6 } : { xl: 6 }));

const availableResources = computed(() =>
  props.resources ? props.resources.filter((r) => !r.hideFromResourceList) : [],
);

const setSmGrid = computed(() => (availableResources.value.length > 1 ? 6 : 12));

const dataLicenseUrlField = computed(() => {
  const licenseId = props.dataLicenseId;

  if (licenseId === WSL_DATA_LICENSE_ID) {
    const wslDataLicense = dataLicenses.filter((l) => l.id === WSL_DATA_LICENSE_ID)[0];

    return wslDataLicense.link;
  }

  return props.dataLicenseUrl;
});

const scrollbarColorFront = computed(() => theme?.themes.value?.light?.colors?.highlight || 'auto');
const scrollbarColorBack = computed(() => (theme ? '#F0F0F0' : 'auto'));

const selectResource = (resourceId: string) => {
  selectedId.value = resourceId;
};

const selectedResource = computed(() => {
  return availableResources.value?.find((r) => r.id === selectedId.value);
});

/*
const injectComponent = ({ component: Component, config: object, injectAtStart = true }) => {
  injectedComponent.value = component;
  injectedComponentConfig.value = config;
  injectComponentAtStart.value = injectAtStart;
};
*/

onMounted(() => {
  selectResource(availableResources.value[0]?.id);
});
/*
const catchOpenClick = (event, eventProperty) => {
  eventBus.emit(event, eventProperty);
};
*/

/*
onBeforeMount(() => eventBus.on(GCNET_INJECT_MICRO_CHARTS, injectComponent));

onBeforeUnmount(() => eventBus.off(GCNET_INJECT_MICRO_CHARTS, injectComponent));
*/
</script>

<template>
  <v-card id="MetadataResources" :class="{ ['pt-2']: this.isOnTop }">
    <v-card-title class="py-4">
      <v-row justify="end" no-gutters>
        <v-col class="text-h6 metadata_title flex-grow-1">
          {{ METADATA_RESOURCES_TITLE }}
        </v-col>

        <v-col v-if="!loading && resources && resources.length > 0" class="flex-grow-0 resourcesIcons">
          <BaseIconCountView :count="resources.length" tooltip-text="Amount of Resources" :icon="mdiFile" />
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="dataLicenseTitle">
      <v-row no-gutters align="center">
        <v-col cols="6" class="pr-md-10">
          <BaseIconLabelView
            icon-tooltip="Data License"
            :icon="mdiShieldSearch"
            icon-color="grey"
            :text="dataLicenseTitle"
            :url="dataLicenseUrlField"
          />
        </v-col>

        <v-col class="">
          <v-row no-gutters justify="end" v-for="(dateObj, index) in dates" :key="index">
            <v-col cols="12" sm="auto" class="pr-0 pr-sm-5">{{ dateObj[DATE_PROPERTY_DATE_TYPE] }}</v-col>

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

    <v-container
      v-if="!loading && availableResources && availableResources.length > 0"
      id="resourceList"
      fluid
      :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
      class="heightAndScroll pa-2 pt-0"
    >
      <!--
      <v-row v-if="injectedComponent" no-gutters>
        <component :is="injectedComponent" :stationConfig="injectedComponentConfig" />
      </v-row>
-->

      <v-row>
        <v-col cols="3" md="3" xl="2">
          <v-row no-gutters>
            <v-list>
              <!--
              :style="`max-height: ${props.maxHeight - 100}px; overflow: auto; scroll-behavior: smooth; scrollbar-width: thin;
              scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack};`"
-->
              <v-list-item
                v-for="(resource, index) in availableResources"
                :key="`${resource.id}_${index}`"
                @click="selectResource(resource.id)"
                :style="`background-color: ${selectedId === resource.id ? theme.themes.value.light.colors.highlight : 'transparent'};`"
              >
                {{ resource.name }}
              </v-list-item>
            </v-list>
          </v-row>
        </v-col>

        <v-col cols="9" md="9" xl="10" class="pt-0">
          <!--
          <ResourceDataViz :resource="resources ? resources[selectedId] : undefined" :flat="true" />
-->
          <v-row>
            <v-col cols="12">
              {{ selectedResource?.name }}
            </v-col>

            <v-col cols="12" sm="6">
              <ResourceListCard
                v-bind="selectedResource"
                :downloadActive="resourcesConfig?.downloadActive"
                cardColor="secondary"
              >
              </ResourceListCard>
            </v-col>

            <v-col cols="12" sm="6">
              <Suspense>
                <component :is="previewComponent" v-bind="selectedResource" />

                <template #fallback> Loading Preview... </template>
              </Suspense>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!--
      <v-row no-gutters>
        <v-col
          v-for="res in availableResources"
          :key="`${res.id}_${res.name}`"
          cols="12"
          v-bind="listLayout"
          class="pa-2"
        >
          <ResourceCard
            v-bind="res"
            :downloadActive="resourcesConfig?.downloadActive"
            :showGenericOpenButton="!!res.clickEvent"
            :genericOpenButtonBottom="genericOpenButtonBottom"
            cardColor="secondary"
            @openButtonClicked="catchOpenClick(res.clickEvent, res.openProperty)"
          />
        </v-col>
      </v-row>
-->

      <!--
      <v-row v-if="injectedComponent" no-gutters>
        <component :is="injectedComponent" :config="injectedComponentConfig" />
      </v-row>
-->
    </v-container>

    <v-card-text v-if="!loading && (!resources || resources.length <= 0)" :style="`color: ${emptyTextColor}};`">
      {{ emptyText }}
    </v-card-text>
  </v-card>
</template>

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
