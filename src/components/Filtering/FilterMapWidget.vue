<template>
  <filter-map-widget-layout
    :title="title"
    :highlightedText="highlightedText"
    :pinnedAmount="pinnedIds ? pinnedIds.length : 0"
    :hasPins="hasPins"
    :hasMultiPins="hasMultiPins"
    :hasPolygons="hasPolygons"
    :topLayout="topLayout"
    :pinText="pinText"
    :multiPinText="multiPinText"
    :polygonText="polygonText"
  >
    <template v-slot:clearPins>
      <base-icon-button
        :icon="mdiClose"
        icon-color="red"
        color="transparent"
        :outlined="pinnedIds.length > 0"
        outline-color="highlight"
        :disabled="pinnedIds.length <= 0"
        :tooltip-text="clearButtonTooltipText"
        @clicked="catchClearClicked()"
      />
    </template>

    <template v-slot:focus>
      <base-icon-button
        :icon="mdiEye"
        icon-color="black"
        outlined
        outline-color="highlight"
        :tooltip-text="focusText"
        @clicked="catchFocusClicked()"
      />
    </template>

    <template v-slot:pinEnabled>
      <base-icon-button
        :count="pinNumber"
        :icon="mdiMapMarker"
        icon-color="black"
        :color="pinEnabled ? 'secondary' : 'transparent'"
        outlined
        outline-color="highlight"
        :tooltipText="pinText"
        @clicked="catchPinClicked()"
      />
    </template>

    <template v-slot:multiPinEnabled>
      <base-icon-button
        :count="multiPinNumber"
        :icon="mdiMapMarkerMultiple"
        icon-color="black"
        :color="multiPinEnabled ? 'secondary' : 'transparent'"
        outlined
        outline-color="highlight"
        :tooltip-text="multiPinText"
        @clicked="catchMultipinClicked()"
      />
    </template>

    <template v-slot:polygonEnabled>
      <base-icon-button
        :count="polygonNumber"
        :icon="mdiLayers"
        icon-color="black"
        :color="polygonEnabled ? 'secondary' : 'transparent'"
        outlined
        outline-color="highlight"
        :tooltip-text="polygonText"
        @clicked="catchPolygonClicked()"
      />
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

import {mdiClose, mdiEye, mdiLayers, mdiMapMarker, mdiMapMarkerMultiple} from '@mdi/js';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import FilterMapWidgetLayout from '@/components/Filtering/FilterMapWidgetLayout.vue';

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
  },
  computed: {
    smScreen() {
      return this.$vuetify.display.smAndDown;
    },
    mdScreen() {
      return this.$vuetify.display.mdAndDown;
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
    mdiClose,
    mdiEye,
    mdiMapMarker,
    mdiMapMarkerMultiple,
    mdiLayers,
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
