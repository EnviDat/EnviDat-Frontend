<template>
  <v-card class="elevation-0"
          id="FilterMapWidgetLayout" >

    <v-card-title :class="mdScreen ? 'pa-4' : 'pb-2'" >
      <div class="mb-0 title"
            style="word-break: keep-all;" >
        {{ title }}
      </div>
    </v-card-title>


    <div class="py-0 my-0 "
          :class="mdScreen ? 'px-4' : 'px-4 mb-1'"
          :style="`background-color: ${ $vuetify.theme.themes.light.highlight };`" >

      <v-row v-if="topLayout"
              class="fill-height my-0"
              align="center"
              no-gutters>

        <v-col class="grow"
                :class="mdScreen ? 'caption' : 'body-2'" >
          {{ highlightedText }}
        </v-col>

        <v-col cols="2"
                md="3"
                lg="2"
                class="caption" >
          <div :style="`color:${pinnedAmount > 0 ? 'black' : 'rgba(0,0,0,.47)'};`">
            {{ filterText + pinnedAmount }}
          </div>
        </v-col>

        <v-col class="shrink" >
          <slot name="clearPins" />
        </v-col>
      </v-row>

      <div v-if="!topLayout"
          class="my-0"
          :class="mdScreen ? 'caption' : 'body-2'" >
        {{ highlightedText }}
      </div>

    </div>

    <v-container v-if="topLayout"
                  class="pt-2 pb-4 px-4"
                  id="FilterMapWidgetLayout_topLayout" >
      <v-row no-gutters
              justify="space-around">

        <v-col class="shrink">
          <slot name="focus" />
        </v-col>

        <v-col v-if="hasPins" class="shrink">
          <slot name="pinEnabled" />
        </v-col>

        <v-col v-if="hasMultiPins" class="shrink">
          <slot name="multiPinEnabled" />
        </v-col>

        <v-col v-if="hasPolygons" class="shrink">
          <slot name="polygonEnabled" />
        </v-col>
      </v-row>

    </v-container>

    <v-container v-if="!topLayout"
                  :class="{
                    'pa-4 pt-2': mdScreen,
                    'py-0 px-4': !mdScreen,
                    }" >


      <v-row no-gutters
              align="center" >

        <v-col class="grow caption">
          <div :style="`color:${pinnedAmount > 0 ? $vuetify.theme.themes.light.primary : 'rgba(0,0,0,.47)'};`">
            {{ filterText + pinnedAmount }}
          </div>
        </v-col>

        <v-col class="shrink"
                cols="3">
          <slot name="clearPins" />
        </v-col>

      </v-row>

      <v-row no-gutters
              justify="space-around"
              align="center"
              class="py-1" >

        <v-col class="hidden-md-and-down"
                lg="9" >
          {{ focusText }}
        </v-col>

        <v-col cols="2"
                lg="3" >
          <slot name="focus" />
        </v-col>

      </v-row>

      <v-row  no-gutters
              justify="space-around"
              align="center"
              class="py-1" >

        <v-col v-if="hasPins"
               class="hidden-md-and-down"
                lg="9" >
          {{ pinText }}
        </v-col>

        <v-col v-if="hasPins"
                cols="2"
                lg="3" >
          <slot name="pinEnabled" />
        </v-col>
      
      </v-row>

      <v-row no-gutters
              justify="space-around"
              align="center"
              class="py-1" >
              

        <v-col v-if="hasMultiPins"
                class="hidden-md-and-down"
                lg="9" >
          {{ multiPinText }}
        </v-col>

        <v-col v-if="hasMultiPins"
                cols="2"
                lg="3" >
          <slot name="multiPinEnabled" />
        </v-col>
      </v-row>

      <v-row no-gutters
              justify="space-around"
              align="center"
              class="py-1" >

        <v-col v-if="hasPolygons"
                class="hidden-md-and-down"
                lg="9" >
          {{ polygonText }}
        </v-col>

        <v-col v-if="hasPolygons"
                cols="2"
                lg="3" >
          <slot name="polygonEnabled" />
        </v-col>

      </v-row>
    </v-container>

  </v-card>
</template>

<script>
/**
 * FilterMapWidgetLayout.vue only handles the different layout of the FilterMapWidget.
 *
 * @summary layout fot the FilterMapWidgetLayout
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-11-17 13:48:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'FilterMapWidgetLayout',
  props: {
    title: String,
    highlightedText: String,
    pinnedAmount: {
      type: Number,
      default: 0,
    },
    hasPins: Boolean,
    hasMultiPins: Boolean,
    hasPolygons: Boolean,
    topLayout: Boolean,
    pinText: String,
    multiPinText: String,
    polygonText: String,
  },
  computed: {
    smScreen() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    mdScreen() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
  methods: {
  },
  data: () => ({
    filterText: 'Pinned: ',
    focusText: 'Focus all elements on the map',
  }),
  components: {
  },
};
</script>
<style scoped>
  .direction-column {
    flex-direction: column;
  }
  .direction-row {
    flex-direction: row;
  }
</style>
