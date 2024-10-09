<template>
  <v-container class="fill-height pa-0" id="MetadataListLayoutComponent" fluid>
    <v-row v-if="mapLayout" class="fill-height">

      <v-col class="py-0 pr-2 flex-column" cols="4">
        <v-row no-gutters>
          <v-col id="metadataListLayoutFiltering_map" ref="metadataListLayoutFiltering">
            <slot name="filterKeywords" />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col class="pt-4 " :style="useDynamicHeight
              ? `height: calc(100vh - ${keywordHeight}px);`
              : ''
            ">
            <slot name="filterMap" />
          </v-col>
        </v-row>
      </v-col>

      <v-col class="py-0 pl-2"
             cols="8">
        <v-row ref="controlPanel">
          <v-col class="controlPanel hidden-xs"
                 key="controlPanel"
                 cols="12">
            <slot name="controlPanel" />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col
            cols="12"
            id="metadataListScroll_mapLayout"
            ref="metadataListScroll"
            class="mapLayoutContainers listScroll mt-2 mb-4 pr-1"
            v-on:scroll="onScroll()"
            :style="useDynamicHeight ? `height: calc(100vh - ${filteringComponentsHeight}px);` : ''"
          >
            <slot name="metadataListPlaceholder" />

            <slot name="metadataListLayout" :metadataListHeight="metadataListHeight" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="!mapLayout"
           id="metadataListLayoutFiltering_no_map"
           ref="metadataListLayoutFiltering"
           class="w-100"
           no-gutters>
      <v-col class="hidden-sm-and-up pb-2" cols="12" key="controlPanel_smallscreen">
        <slot name="controlPanel" />
      </v-col>

      <v-col class="pb-2" cols="12" key="filterKeywords">
        <slot name="filterKeywords" />
      </v-col>

      <v-col class="hidden-xs pb-2" cols="12" key="controlPanel">
        <slot name="controlPanel" />
      </v-col>

      <v-col v-if="showMapFilter && mapFilteringPossible" cols="12"
             :style="minMapHeight ? `min-height: ${minMapHeight}px;` : 'height: 100%;'
        " key="filterMap">
        <slot name="filterMap" />
      </v-col>
    </v-row>

    <v-row v-if="!mapLayout" class="" no-gutters>
      <v-col
        ref="metadataListScroll"
        id="metadataListScroll_no_mapLayout"
        class="noMapLayoutContainers listScroll mt-2 mb-4 pr-1"
        v-on:scroll="onScroll()"
        :style="useDynamicHeight ? `height: calc(100vh - ${filteringComponentsHeight}px);` : ''"
      >

        <slot name="metadataListPlaceholder" />

        <slot name="metadataListLayout" :metadataListHeight="metadataListHeight" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * MetadataListLayout.vue only handles the different layouts for the metadatalist
 * with slots for the FilterKeywordView, FilterMapView and the ControlPanelView.
 *
 * @summary layout of the list of metadata cards
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-01-06 16:20:45
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'MetadataListLayout',
  props: {
    showMapFilter: Boolean,
    mapFilteringPossible: Boolean,
    minMapHeight: Number,
    useDynamicHeight: Boolean,
    topFilteringLayout: {
      type: Boolean,
      default: false,
    },
    layoutRecalcTrigger: {
      type: Number,
      default: 0,
    },
  },
/*
  created() {
    window.addEventListener('resize', this.setFilteringComponentsHeight);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setFilteringComponentsHeight);
  },
*/
  updated() {
    this.setFilteringComponentsHeight();
    this.setKeywordHeight();
  },
  computed: {
    mapLayout() {
      return (
        !this.topFilteringLayout &&
        this.showMapFilter &&
        this.$vuetify.display.mdAndUp
      );
    },
  },
  methods: {
    setFilteringComponentsHeight() {
      let searchViewHeight = 36;
      const TheNavigationToolbar = 36;
      let padding = 0;

      if (this.mapLayout && this.$refs && this.$refs.controlPanel) {
        searchViewHeight = this.$refs.controlPanel.$el.clientHeight;
      }

      if (
        !this.mapLayout &&
        this.$refs &&
        this.$refs.metadataListLayoutFiltering
      ) {
        searchViewHeight = this.$refs.metadataListLayoutFiltering.$el.clientHeight;
        padding = 16;
      }

      this.filteringComponentsHeight =
        searchViewHeight + TheNavigationToolbar + padding;

      const viewportHeight = window.innerHeight;
      this.metadataListHeight = (viewportHeight - this.filteringComponentsHeight);
    },
    setKeywordHeight() {
      const TheNavigationToolbar = 36;
      const padding = 16;
      let keywordHeight = 150;

      if (
        this.showMapFilter &&
        this.$refs &&
        this.$refs.metadataListLayoutFiltering
      ) {
        // use the offset Height here to measure the padding as well
        keywordHeight = this.$refs.metadataListLayoutFiltering.$el.offsetHeight;
      }

      this.keywordHeight = keywordHeight + TheNavigationToolbar + padding;
    },
    setScrollPos(toPos) {
      if (this.$refs && this.$refs.metadataListScroll) {
        this.$refs.metadataListScroll.$el.scrollTop = toPos;
      }
    },
    onScroll() {
      this.$emit('onScroll', this.$refs?.metadataListScroll?.$el.scrollTop);
    },
  },
  watch: {
    layoutRecalcTrigger() {
      this.setFilteringComponentsHeight();
      this.setKeywordHeight();
    },
  },
  data: () => ({
    filteringComponentsHeight: 150,
    keywordHeight: 150,
    metadataListHeight: 800,
  }),
};
</script>

<style>
.listScroll {
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.noMapLayoutContainers > .v-container {
  padding: 0 4px 0 4px;
}

.mapLayoutContainers > .v-container {
  padding: 0 4px 0 4px;
}
</style>
