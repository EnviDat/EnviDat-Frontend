<template>
  <v-card class="elevation-0"
          id="FilterMapWidgetLayout" >

    <v-card-title :class="mdScreen ? 'pa-4' : 'pb-2'" >
      <div class="mb-0 title" >
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

        <v-col cols="2" md="3" lg="2" >
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

    <v-container :class="{
                    'pa-0': mdScreen,
                    'pa-4': mdScreen && !topLayout,
                    'py-0 px-4': !mdScreen,
                    }" >

      <v-row v-if="topLayout" justify="space-around">

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

      <v-row v-if="!topLayout"
              no-gutters
              align="center" >

        <v-col v-if="mdScreen" >
          <v-row align="center"
                  no-gutters>

            <v-col class="shrink" cols="9">
              <div :style="`color:${pinnedAmount > 0 ? $vuetify.theme.themes.light.primary : 'rgba(0,0,0,.47)'};`">
                {{ filterText + pinnedAmount }}
              </div>
            </v-col>

            <v-col cols="3">
              <slot name="clearPins" />
            </v-col>
          </v-row>
        </v-col>

        <v-col v-if="!mdScreen"
                class="grow py-1 col-5" >
          <div :style="`color:${pinnedAmount > 0 ? $vuetify.theme.themes.light.primary : 'rgba(0,0,0,.47)'};`">
            {{ filterText + pinnedAmount }}
          </div>
        </v-col>

        <v-col v-if="!mdScreen"
                class="py-1"
                :class="mdScreen ? 'shrink' : 'col-lg-3'" >

          <slot name="clearPins" />

        </v-col>

      </v-row>

      <v-row v-if="!topLayout"
              no-gutters
              justify-sm="space-around"
              align="center" >

        <v-col class="hidden-md-and-down py-1" lg="9" >
          {{ focusText }}
        </v-col>

        <v-col class="py-1"
                cols="2"
                md="12"
                lg="3" >
          <slot name="focus" />
        </v-col>

      </v-row>

      <v-row v-if="!topLayout"
              no-gutters
              justify-sm="space-around"
              align="center" >

        <v-col v-if="hasPins"
               class="hidden-md-and-down py-1"
                lg="9" >
          {{ pinText }}
        </v-col>

        <v-col v-if="hasPins"
                class="py-1"
                cols="2"
                md="12" lg="3" >
          <slot name="pinEnabled" />
        </v-col>
      
      </v-row>

      <v-row v-if="!topLayout"
              no-gutters
              justify-sm="space-around"
              align="center" >

        <v-col v-if="hasMultiPins"
                class="hidden-md-and-down py-1"
                lg="9" >
          {{ multiPinText }}
        </v-col>

        <v-col v-if="hasMultiPins"
                class="py-1"
                cols="2"
                md="12" lg="3" >
          <slot name="multiPinEnabled" />
        </v-col>
      </v-row>

      <v-row v-if="!topLayout"
              no-gutters
              justify-sm="space-around"
              align="center" >

        <v-col v-if="hasPolygons"
                class="hidden-md-and-down py-1"
                lg="9" >
          {{ polygonText }}
        </v-col>

        <v-col v-if="hasPolygons"
                class="py-1"
                cols="2"
                md="12"
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
 * Last modified  : 2019-11-14 17:57:05
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
