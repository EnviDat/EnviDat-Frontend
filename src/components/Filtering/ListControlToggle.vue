<template>

    <v-row align="center"
            justify="end"
            no-gutters
            class="fill-height" >

        <v-btn-toggle v-if="isEnabledControl(LISTCONTROL_MAP_ACTIVE)"
                      v-model="controlsActive"
                      class="fill-height"
                      borderless
                      tile
                      dense >
          <v-btn @click="catchControlClick(LISTCONTROL_MAP_ACTIVE)"
                  class="controlButton"
                  :class="isActiveControl(LISTCONTROL_MAP_ACTIVE) ? 'secondary' : ''"
                  text >
            <v-icon>map</v-icon>
          </v-btn>
        </v-btn-toggle>

        <v-btn-toggle v-if="isEnabledControl(LISTCONTROL_LIST_ACTIVE)
                        || isEnabledControl(LISTCONTROL_COMPACT_LAYOUT_ACTIVE)"
                      v-model="controlsActive"
                      class="fill-height ml-2"
                      tile
                      borderless
                      dense >

          <v-btn v-if="isEnabledControl(LISTCONTROL_LIST_ACTIVE)"
                  @click="catchControlClick(LISTCONTROL_LIST_ACTIVE)"
                  class="controlButton"
                  :class="isActiveControl(LISTCONTROL_LIST_ACTIVE) ? 'secondary' : ''"
                  text >
            <v-icon >view_headline</v-icon>
          </v-btn>

          <v-btn v-if="isEnabledControl(LISTCONTROL_COMPACT_LAYOUT_ACTIVE)"
                  @click="catchControlClick(LISTCONTROL_COMPACT_LAYOUT_ACTIVE)"
                  class="controlButton"
                  :class="isActiveControl(LISTCONTROL_COMPACT_LAYOUT_ACTIVE) ? 'secondary' : ''"
                  text >
            <v-icon >view_comfortable</v-icon>
          </v-btn>

          <v-btn v-if="isEnabledControl(3)"
                  @click="catchControlClick(3)"
                  class="controlButton"
                  :class="isActiveControl(3) ? 'highlight' : ''"
                  text >
            <v-icon >view_stream</v-icon>
          </v-btn>

        </v-btn-toggle>
    </v-row>
</template>

<script>
/**
 * ListControlToggle.vue shows toggle buttons for the
 * configurations of the metadata list
 *
 * @summary controls for list
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-11-08 16:32:31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
} from '@/store/metadataMutationsConsts';

export default {
  name: 'ListControlToggle',
  props: {
    controls: Array,
    enabledControls: Array,
    mapEnabled: Boolean,
    flat: Boolean,
  },
  data: () => ({
    mapFilterActivateText: 'Activate Mapfiltering',
    mapFilterDeactivateText: 'Deactivate Mapfiltering',
    listViewActivate: 'List view',
    listViewDeactivate: 'Grid view',
    controlsActive: [],
    listViewIcon: null,
    mapIcon: null,
    LISTCONTROL_LIST_ACTIVE,
    LISTCONTROL_MAP_ACTIVE,
    LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
  }),
  beforeMount: function beforeMount() {
    this.listViewIcon = this.mixinMethods_getIcon('listView');
    this.mapIcon = this.mixinMethods_getIcon('map');
  },
  mounted() {
    this.controlsActive = this.controls;
  },
  watch: {
    controls() {
      this.controlsActive = this.controls;
    },
  },
  methods: {
    isActiveControl(number) {
      return this.controlsActive ? this.controlsActive.includes(number) : false;
    },
    isEnabledControl(number) {
      return this.enabledControls ? this.enabledControls.includes(number) : false;
    },
    catchControlClick(number) {
      this.$emit('controlsChanged', number);
    },
  },
};
</script>

<style>

.envidatControlInfos.small > .v-input__control {
  min-height: 32px !important;
}
.envidatControlInfos > .v-input__control {
  min-height: 40px !important;
}

.envidatControlInfos > .v-input__slot {
    margin: 0 !important;
}

.envidatControlInfos > .v-input__append-outer {
  margin: auto !important;
}

.controlButton {
  min-width: 36px !important;
  height: 100% !important;
}

</style>
