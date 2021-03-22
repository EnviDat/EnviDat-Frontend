<template>
    <filter-map-widget-layout :title="title"
                              :highlightedText="highlightedText"
                              :pinnedAmount="pinnedIds.length"
                              :hasPins="hasPins"
                              :hasMultiPins="hasMultiPins"
                              :hasPolygons="hasPolygons"
                              :topLayout="topLayout"
                              :pinText="pinText"
                              :multiPinText="multiPinText"
                              :polygonText="polygonText" >

      <template v-slot:clearPins>
        <base-icon-button materialIconName="close"
                          iconColor="red"
                          :color="topLayout ? 'transparent' : 'primary'"
                          :outlined="!topLayout && pinnedIds.length > 0 "
                          :isSmall="mdScreen || topLayout"
                          :disabled="pinnedIds.length <= 0"
                          :tooltipText="clearButtonTooltipText"
                          @clicked="catchClearClicked()" />
      </template>

      <template v-slot:focus>
        <base-icon-button materialIconName="remove_red_eye"
                          iconColor="black"
                          color="highlight"
                          :isSmall="mdScreen"
                          outlined
                          :tooltipText="focusText"
                          @clicked="catchFocusClicked()" />
      </template>

      <template v-slot:pinEnabled>
        <base-icon-button :count="pinNumber"
                          :customIcon="pinIcon"
                          color="secondary"
                          :fillColor="pinEnabled ? $vuetify.theme.themes.light.primary : 'transparent'"
                          :isSmall="mdScreen"
                          outlined
                          :tooltipText="pinText"
                          @clicked="catchPinClicked()" />
      </template>

      <template v-slot:multiPinEnabled>
        <base-icon-button :count="multiPinNumber"
                          :customIcon="multiPinIcon"
                          color="secondary"
                          :fillColor="multiPinEnabled ? $vuetify.theme.themes.light.primary : 'transparent'"
                          outlined
                          :isSmall="mdScreen"
                          :tooltipText="multiPinText"
                          @clicked="catchMultipinClicked()" />
      </template>

      <template v-slot:polygonEnabled>
        <base-icon-button :count="polygonNumber"
                          materialIconName="layers"
                          iconColor="black"
                          color="secondary"
                          :fillColor="polygonEnabled ? $vuetify.theme.themes.light.primary : 'transparent'"
                          :isSmall="mdScreen"
                          outlined
                          :tooltipText="polygonText"
                          @clicked="catchPolygonClicked()" />
      </template>

    </filter-map-widget-layout>
</template>

<script>
/**
 * FilterMapWidget.vue shows the buttons and configurations for the FilterMapView.vue
 *
 * @summary view buttons with buttons to show / hide markers on the map
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2019-11-22 14:13:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import FilterMapWidgetLayout from '@/components/Filtering/FilterMapWidgetLayout';

export default {
  name: 'FilterMapWidget',
  props: {
    title: {
      type: String,
      default: 'Cartographic Filtering',
    },
    pinnedIds: Array,
    hasPins: Boolean,
    pinEnabled: Boolean,
    pinNumber: {
      default: 0,
      type: Number,
    },
    hasMultiPins: Boolean,
    multiPinEnabled: Boolean,
    multiPinNumber: {
      default: 0,
      type: Number,
    },
    hasPolygons: Boolean,
    polygonEnabled: Boolean,
    polygonNumber: {
      default: 0,
      type: Number,
    },
    topLayout: Boolean,
  },
  beforeMount() {
    this.pinIcon = this.mixinMethods_getIcon('marker');
    this.multiPinIcon = this.mixinMethods_getIcon('markerMulti');
  },
  computed: {
    smScreen() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    mdScreen() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    pinText() {
      return this.pinEnabled ? 'Hide single markers' : 'Show single markers';
    },
    multiPinText() {
      return this.multiPinEnabled ? 'Hide multi markers' : 'Show multi markers';
    },
    polygonText() {
      return this.polygonEnabled ? 'Hide polygons' : 'Show polygons';
    },
  },
  methods: {
    catchFocusClicked() {
      this.$emit('clickedFocus');
    },
    catchPinClicked() {
      this.$emit('clickedPin');
    },
    catchMultipinClicked() {
      this.$emit('clickedMultipin');
    },
    catchPolygonClicked() {
      this.$emit('clickedPolygon');
    },
    catchClearClicked() {
      this.$emit('clickedClear');
    },
  },
  data: () => ({
    filterText: 'Pinned: ',
    highlightedText: 'Select markers to pin entries to the top of the list',
    clearButtonText: 'Clear Pins',
    clearButtonTooltipText: 'Clear all pinned Entries',
    focusText: 'Focus all elements on the map',
  }),
  components: {
    BaseIconButton,
    FilterMapWidgetLayout,
  },
};
</script>
