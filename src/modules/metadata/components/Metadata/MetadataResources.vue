<template>
  <v-card id="MetadataResources"
          :class="{ ['pt-2']: this.isOnTop }" >
    
    <v-card-title >
      <v-row justify="end"
              no-gutters>

        <v-col class="title metadata_title grow">
          {{ METADATA_RESOURCES_TITLE }}
        </v-col>

        <v-col v-if="!showPlaceholder && resources && resources.length > 0"
                class="shrink resourcesIcons pt-2" >
          <base-icon-count-view :count="resources.length"
                                :icon-string="fileIcon" />
        </v-col>
      </v-row>
    </v-card-title>


    <v-container v-if="showPlaceholder"
                  id="resourcePlaceholderList"
                  fluid
                  class="pa-2 pt-0" >
      <v-row no-gutters >
        <v-col v-for="n in 2"
                :key="n"
                cols="12" sm="6"
                class="pa-2" >

          <ResourceCardPlaceholder />
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="!showPlaceholder && availableResources && availableResources.length > 0"
                  id="resourceList"
                  fluid
                  :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
                  class="heightAndScroll pa-2 pt-0" >

      <v-row v-if="injectedComponent && injectAtStart"
              no-gutters >
        <component :is="injectedComponent" 
                    :config="injectedComponentConfig" />
      </v-row>

      <v-row no-gutters >

        <v-col v-for="res in availableResources"
                :key="res.id"
                cols="12"
                :sm="availableResources.length > 1 ? 6 : 12"
                class="pa-2" >

          <ResourceCard v-bind="res"
                          :doiIcon="doiIcon"
                          :fileSizeIcon="fileSizeIcon"
                          :dateCreatedIcon="dateCreatedIcon"
                          :lastModifiedIcon="lastModifiedIcon"
                          :twoColumnLayout="twoColumnLayout"
                          :downloadActive="resourcesConfig.downloadActive"
                          :showGenericOpenButton="res.openEvent ? true : false"
                          :openButtonTooltip="res.openButtonTooltip"
                          :openButtonIcon="res.openButtonIcon"
                          @openButtonClicked="catchOpenClick(res.openEvent, res.openProperty)" />
        </v-col>
      </v-row>

      <v-row v-if="injectedComponent && !injectAtStart"
              no-gutters >
        <component :is="injectedComponent" 
                    :config="injectedComponentConfig" />
      </v-row>

    </v-container>

    <v-card-text v-if="!showPlaceholder && (!resources || resources.length <= 0)"
                  style="color: red;" >
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
 * Last modified  : 2020-11-04 11:12:21
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import BaseIconCountView from '@/components/BaseElements/BaseIconCountView';
import { METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts';

import {
  eventBus,
  GCNET_INJECT_MICRO_CHARTS,
  INJECT_RESOURCE_STRATEGY,
} from '@/factories/eventBus';

import ResourceCard from '../ResourceCard';
import ResourceCardPlaceholder from '../ResourceCardPlaceholder';

export default {
  name: 'MetadataResources',
  components: {
    ResourceCard,
    ResourceCardPlaceholder,
    BaseIconCountView,
  },
  props: {
    genericProps: Object,
    showPlaceholder: Boolean,
  },
  created() {
    this.injectedComponent = null;
    eventBus.$on(GCNET_INJECT_MICRO_CHARTS, this.injectComponent);

    this.strategyEvent = null;
    this.strategyProperty = null;
    eventBus.$on(INJECT_RESOURCE_STRATEGY, this.injectStrategy);
  },
  beforeDestroy() {
    this.injectedComponent = null;
    eventBus.$off(GCNET_INJECT_MICRO_CHARTS, this.injectComponent);

    this.strategyEvent = null;
    this.strategyProperty = null;
    eventBus.$on(INJECT_RESOURCE_STRATEGY, this.injectStrategy);
  },  
  computed: {
    doi() {
      return this.mixinMethods_getGenericProp('doi');
    },
    resources() {
      return this.mixinMethods_getGenericProp('resources');
    },
    availableResources() {
      const res = this.resources;
      return res ? res.filter(r => !r.hideFromResourceList) : [];
    },    
    resourcesConfig() {
      return this.mixinMethods_getGenericProp('resourcesConfig', {});
    },
    twoColumnLayout() {
      return this.mixinMethods_getGenericProp('twoColumnLayout');
    },
    isOnTop() {
      return this.mixinMethods_getGenericProp('isOnTop');
    },
    doiIcon() {
      return this.mixinMethods_getGenericProp('doiIcon');
    },
    fileSizeIcon() {
      return this.mixinMethods_getGenericProp('fileSizeIcon');
    },
    fileIcon() {
      return this.mixinMethods_getGenericProp('fileIcon');
    },
    dateCreatedIcon() {
      return this.mixinMethods_getGenericProp('dateCreatedIcon');
    },
    lastModifiedIcon() {
      return this.mixinMethods_getGenericProp('lastModifiedIcon');
    },
    scrollbarColorFront() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.highlight : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  methods: {
    readMore() {
      this.showAllResources = !this.showAllResources;
    },
    injectComponent(injectedComponent, injectedComponentConfig, injectAtStart = true) {
      this.injectedComponent = injectedComponent;
      this.injectedComponentConfig = injectedComponentConfig;
      this.injectAtStart = injectAtStart;
    },    
    injectStrategy(strategyEvent, strategyProperty) {
      this.strategyEvent = strategyEvent;
      this.strategyProperty = strategyProperty;
    },
    catchOpenClick(event, eventProperty) {
      eventBus.$emit(event, eventProperty);
    },
  },
  data: () => ({
    injectedComponent: null,
    injectAtStart: true,
    injectedComponentConfig: null,
    strategyEvent: null,
    strategyProperty: null,
    showAllResources: false,
    emptyText: 'No resources found for this dataset',
    METADATA_RESOURCES_TITLE,
  }),
};
</script>

<style scoped>

  .heightAndScroll {
    max-height: 750px;
    overflow-y: auto !important;
    scrollbar-width: thin;
  }

</style>
