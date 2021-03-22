<template>
  <v-container class="fill-height pa-0"
                id="MetadataListLayout"
                fluid >

    <v-row v-if="mapLayout"
            id="MapLayout"
            no-gutters
            class="fill-height">

      <v-col class="py-0 pr-2 flex-column"
              cols="4" >

        <v-row no-gutters >
          <v-col id="metadataListLayoutFiltering_map"
                ref="metadataListLayoutFiltering" >
            <slot name="filterKeywords" />
          </v-col>
        </v-row>

        <v-row no-gutters >
          <v-col class="pt-4 "
              :style="useDynamicHeight ? `height: calc(100vh - ${keywordHeight}px);` : ''" >

            <slot name="filterMap"/>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="py-0 pl-2"
              cols="8"
              id="metadataListScroll" >

        <v-row id="controlPanel"
                ref="controlPanel"
                no-gutters >
          <v-col class="hidden-xs-only py-0"
                  key="controlPanel"
                  cols="12">
            <slot name="controlPanel" />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col class="mt-2 pa-0"
                  cols="12"
                  ref="metadataListScroll"
                  v-on:scroll="onScroll()"
                  :class="useDynamicHeight ? 'listScroll' : ''"
                  :style="useDynamicHeight ? `height: calc(100vh - ${filteringComponentsHeight }px);` : ''">

            <slot name="metadataListPlaceholder" />

            <slot name="metadataListLayout" />

          </v-col>
        </v-row>
      </v-col>

    </v-row>

    <v-row v-if="!mapLayout"
            no-gutters
            id="nonMapLayout" >

      <v-col cols="12"
              class="py-0">
        <v-container class="pa-0"
                      id="metadataListLayoutFiltering_without_map"
                      fluid >
          <v-row ref="metadataListLayoutFiltering"
                  no-gutters
                  class="fill-height" >

            <v-col class="hidden-sm-and-up py-0" 
                    cols="12"
                    key="controlPanel_smallscreen" >
              <slot name="controlPanel" />
            </v-col>

            <v-col class="py-0"
                    cols="12"
                    id="filterKeywords"
                    key="filterKeywords" >
              <slot name="filterKeywords" />
            </v-col>

            <v-col class="hidden-xs-only pb-0 pt-3"
                    cols="12"
                    id="controlPanel"
                    key="controlPanel" >
              <slot name="controlPanel" />
            </v-col>

            <v-col v-if="showMapFilter && mapFilteringPossible"
                    cols="12"
                    class="pt-3"
                    :style="minMapHeight ? `min-height: ${minMapHeight}px;` : 'height: 100%;'"
                    key="filterMap" >
              <slot name="filterMap" />
            </v-col>

          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-row v-if="!mapLayout"
            no-gutters
            class="fill-height" >

      <v-col id="metadataListScroll"
              ref="metadataListScroll"
              class="mt-2"
              v-on:scroll="onScroll()"
              :class="useDynamicHeight ? 'listScroll' : ''"
              :style="useDynamicHeight ? `height: calc(100vh - ${filteringComponentsHeight}px);` : ''" >

        <v-container class="pa-0"
                      fluid >

          <slot name="metadataListPlaceholder" />

          <slot name="metadataListLayout" />

        </v-container>
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
 * Last modified  : 2020-08-26 20:14:46
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
  },
  updated() {
    this.setFilteringComponentsHeight();
    this.setKeywordHeight();
  },
  computed: {
    mapLayout() {
      return !this.topFilteringLayout && this.showMapFilter && this.$vuetify.breakpoint.mdAndUp;
    },
  },
  methods: {
    setFilteringComponentsHeight() {
      let searchViewHeight = 36;
      const TheNavigationToolbar = 0; // when active: 36;
      const padding = 8 + 8;

      if (this.showMapFilter && this.$refs && this.$refs.controlPanel) {
        searchViewHeight = this.$refs.controlPanel.clientHeight ? this.$refs.controlPanel.clientHeight : searchViewHeight;
      }

      this.filteringComponentsHeight = searchViewHeight + TheNavigationToolbar + padding;
    },
    setKeywordHeight() {
      const TheNavigationToolbar = 0; // when active: 36;
      const padding = 16;
      let keywordHeigth = 150;

      if (this.showMapFilter && this.$refs && this.$refs.metadataListLayoutFiltering) {
        keywordHeigth = this.$refs.metadataListLayoutFiltering.clientHeight ? this.$refs.metadataListLayoutFiltering.clientHeight : keywordHeigth;
      }

      this.keywordHeight = keywordHeigth + TheNavigationToolbar + padding;
    },    
    setScrollPos(toPos) {
      if (this.$refs && this.$refs.metadataListScroll) {
        this.$refs.metadataListScroll.scrollTop = toPos;
      }
    },
    onScroll() {
      this.$emit('onScroll', this.$refs.metadataListScroll.scrollTop);
    },
  },
  data: () => ({
    filteringComponentsHeight: 150,
    keywordHeight: 150,
  }),
};
</script>

<style scoped>

  .listScroll {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
</style>
