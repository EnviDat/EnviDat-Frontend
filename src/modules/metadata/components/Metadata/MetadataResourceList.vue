<script setup lang="ts">
/**
 * MetadataResourceList.vue shows all the resources in a list with preview components.
 *
 * @summary lists the resources with previews
 * @author Dominik Haas-Artho
 *
 * Created at     : 2025-10-23 14:11:27
 * Last modified  : 2025-11-04 10:14:54
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { computed, defineAsyncComponent, defineProps, onMounted, ref, withDefaults, watch } from 'vue';
import { useTheme } from 'vuetify';

import { mdiArrowExpandAll, mdiChevronRightCircle, mdiFile, mdiShieldSearch } from '@mdi/js';

import BaseIconCountView from '@/components/BaseElements/BaseIconCountView.vue';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView.vue';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

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
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { eventBus, INJECT_GENERIC_COMPONENT } from '@/factories/eventBus';

const MetadataResourceListAsync = defineAsyncComponent(
  () =>
    // eslint-disable-next-line import/no-self-import
    import('@/modules/metadata/components/Metadata/MetadataResourceList.vue'),
);
const theme = useTheme();

const props = withDefaults(
  defineProps<{
    resources: Resource[];
    dates: ResearchDataDates[];
    resourcesConfig: object;
    maxHeight: number;
    isOnTop: boolean;
    dataLicenseId: string;
    dataLicenseTitle: string;
    dataLicenseUrl: string;
    loading: boolean;
    preSelectedResourceId: string;
    showFullscreenButton: boolean;
  }>(),
  {
    isOnTop: false,
    showFullscreenButton: true,
    preSelectedResourceId: undefined,
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

const availableResources = computed(() =>
  props.resources ? props.resources.filter((r) => !r.hideFromResourceList) : [],
);

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

const selectedIdIndex = computed(() => {
  return availableResources.value?.findIndex((r) => r.id === selectedId.value);
});

const resourceName = (resource: Resource) => {
  const name = resource?.name;
  return name?.length > 55 ? `${name.substring(0, 55)}...` : name;
};

const triggerFullscreen = () => {
  // define the new max length very long for the fullscreen component
  // to avoid showing the fullscreen button again and show all the text at once
  //  const maxTextLength = 50000;

  eventBus.emit(INJECT_GENERIC_COMPONENT, {
    asyncComponent: MetadataResourceListAsync,
    // props,
    props: {
      ...props,
      showFullscreenButton: false,
      preSelectedResourceId: selectedId.value,
      maxHeight: undefined,
    },
  });
};

onMounted(() => {
  if (props.preSelectedResourceId) {
    selectResource(props.preSelectedResourceId);
  } else {
    selectResource(availableResources.value[0]?.id);
  }
});

watch(
  () => [availableResources.value, props.preSelectedResourceId],
  () => {
    if (props.preSelectedResourceId) {
      selectResource(props.preSelectedResourceId);
      return;
    }
    if (!selectedId.value && availableResources.value?.length) {
      selectResource(availableResources.value[0].id);
    }
  },
  { immediate: true },
);

/*
const hasDescription = computed(() => selectedResource.value?.description?.length > 0);
const showPreview = computed(() => !selectedResource.value?.isProtected && previewComponent);

const injectComponent = ({ component: Component, config: object, injectAtStart = true }) => {
  injectedComponent.value = component;
  injectedComponentConfig.value = config;
  injectComponentAtStart.value = injectAtStart;
};

const catchOpenClick = (event, eventProperty) => {
  eventBus.emit(event, eventProperty);
};

onBeforeMount(() => eventBus.on(GCNET_INJECT_MICRO_CHARTS, injectComponent));

onBeforeUnmount(() => eventBus.off(GCNET_INJECT_MICRO_CHARTS, injectComponent));
*/
</script>

<template>
  <v-card id="MetadataResourceList" :class="{ ['pt-2']: isOnTop }">
    <v-card-title class="py-4">
      <v-row justify="end" no-gutters>
        <v-col class="text-h6 metadata_title flex-grow-1">
          {{ METADATA_RESOURCES_TITLE }}
        </v-col>

        <!--
        <v-col v-if="!loading && resources && resources.length > 0" class="flex-grow-0 resourcesIcons">
          <BaseIconCountView :count="resources.length" tooltip-text="Amount of Resources" :icon="mdiFile" />
        </v-col>
-->

        <v-col class="ml-2 flex-grow-0">
          <BaseIconButton
            v-if="showFullscreenButton"
            :icon="mdiArrowExpandAll"
            outlined
            outline-color="secondary"
            icon-color="black"
            @clicked="triggerFullscreen"
          />
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="dataLicenseTitle">
      <v-row no-gutters align="center">
        <v-col cols="5" class="pr-md-10">
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
            <v-col cols="4" class="pr-0 pr-sm-5">{{ dateObj[DATE_PROPERTY_DATE_TYPE] }}</v-col>

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
      :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}; align-content: start;`"
      class="pa-0"
    >
      <!--
      <v-row v-if="injectedComponent" no-gutters>
        <component :is="injectedComponent" :stationConfig="injectedComponentConfig" />
      </v-row>
-->

      <v-row no-gutters>
        <v-col class="flex-grow-1">
          <v-row no-gutters class="pa-4 pr-0 fill-height">
            <v-container fluid class="pa-0 fill-height">
              <v-card id="ResourceList" class="rounded fill-height w-100">
                <v-card-title>
                  <v-row no-gutters>
                    <v-col class="flex-grow-1">Resources</v-col>
                    <v-col class="flex-grow-0 resourcesIcons">
                      <BaseIconCountView :count="resources.length" tooltip-text="Amount of Resources" :icon="mdiFile" />
                    </v-col>
                  </v-row>
                </v-card-title>

                <v-card-text
                  :style="`maxHeight: ${props.maxHeight ? `${props.maxHeight}px` : '100%'};`"
                  class="scrolling pa-0 fill-height"
                >
                  <v-list density="compact" :selected="selectedIdIndex" active-color="primary">
                    <v-list-item
                      v-for="(resource, index) in availableResources"
                      :key="`${resource.id}_${index}`"
                      @click="selectResource(resource.id)"
                      :active="selectedId === resource.id"
                    >
                      {{ resourceName(resource) }}

                      <template #append>
                        <BaseIcon v-if="selectedId === resource.id" :icon="mdiChevronRightCircle" color="secondary" />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-container>
          </v-row>
        </v-col>

        <v-col cols="12" md="8" lg="9" class="pa-4">
          <ResourceListCard
            v-bind="selectedResource"
            :downloadActive="resourcesConfig?.downloadActive"
            cardColor="secondary"
            :previewComponent="previewComponent"
          />
        </v-col>
      </v-row>
    </v-container>

    <v-card-text v-if="!loading && (!resources || resources.length <= 0)" :style="`color: ${emptyTextColor}};`">
      {{ emptyText }}
    </v-card-text>
  </v-card>
</template>

<style scoped>
.scrolling {
  overflow-y: auto !important;
  overflow-x: hidden;
  scrollbar-width: thin;
}

.resourcesIcons {
  opacity: 0.5;
}
</style>
