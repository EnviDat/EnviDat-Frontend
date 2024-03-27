<template>
  <v-row align="center" justify="end" no-gutters >
    <v-btn-toggle
      v-if="isEnabledControl(LISTCONTROL_MAP_ACTIVE)"
      v-model="controlsActive"
      class="fill-height"
      color="secondary"
      rounded="0"
    >
      <v-btn
        @click="catchControlClick(LISTCONTROL_MAP_ACTIVE)"
        class="controlButton"
        :value="LISTCONTROL_MAP_ACTIVE"
      >
        <BaseIcon :icon='mdiMap' color='grey-darken-3' />
      </v-btn>
    </v-btn-toggle>

    <v-btn-toggle
      v-if="isEnabledControl(LISTCONTROL_LIST_ACTIVE) ||
            isEnabledControl(LISTCONTROL_COMPACT_LAYOUT_ACTIVE)"
      v-model="controlsActive"
      class="fill-height ml-2"
      :divided='true'
      color="secondary"
      rounded="0"
    >
      <v-btn
        v-if="isEnabledControl(LISTCONTROL_LIST_ACTIVE)"
        @click="catchControlClick(LISTCONTROL_LIST_ACTIVE)"
        class="controlButton"
        :value="LISTCONTROL_LIST_ACTIVE"
      >
        <BaseIcon :icon='mdiViewHeadline' color='grey-darken-3' />
      </v-btn>

      <v-btn
        v-if="isEnabledControl(LISTCONTROL_COMPACT_LAYOUT_ACTIVE)"
        @click="catchControlClick(LISTCONTROL_COMPACT_LAYOUT_ACTIVE)"
        class="controlButton"
        :value="LISTCONTROL_COMPACT_LAYOUT_ACTIVE"
      >
        <BaseIcon :icon="mdiViewComfy" color="grey-darken-3" />
      </v-btn>

<!--
      <v-btn
        v-if="isEnabledControl(3)"
        @click="catchControlClick(3)"
        class="controlButton"
        :active="isActiveControl(3)"
      >
        <BaseIcon :icon="mdiViewAgenda" color="grey-darken-3" />
      </v-btn>
-->

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
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
} from '@/store/metadataMutationsConsts';

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import { mdiMap, mdiViewAgenda, mdiViewComfy, mdiViewHeadline } from '@mdi/js';

export default {
  name: 'ListControlToggle',
  components: { BaseIcon },
  props: {
    controls: Array,
    enabledControls: Array,
    mapEnabled: Boolean,
    flat: Boolean,
  },
  data: () => ({
    mdiMap,
    mdiViewAgenda,
    mdiViewComfy,
    mdiViewHeadline,
    mapFilterActivateText: 'Activate Mapfiltering',
    mapFilterDeactivateText: 'Deactivate Mapfiltering',
    listViewActivate: 'List view',
    listViewDeactivate: 'Grid view',
    previewControls: null,
    LISTCONTROL_LIST_ACTIVE,
    LISTCONTROL_MAP_ACTIVE,
    LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
  }),
  mounted() {
    this.previewControls = this.controls;
  },
  computed: {
    controlsActive: {
      get() {
        return this.previewControls ? this.previewControls : this.controls;
      },
      set(value) {
        if (!this.previewControls) {
          this.previewControls = [];
        }

        this.previewControls.push(value);
        console.log(this.previewControls);
      },
    },
  },
/*
  watch: {
    controls() {
      this.controlsActive = this.controls;
    },
  },
*/
  methods: {
    isActiveControl(number) {
      return this.controlsActive ? this.controlsActive.includes(number) : false;
    },
    isEnabledControl(number) {
      return this.enabledControls
        ? this.enabledControls.includes(number)
        : false;
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
  padding: 0;
}
</style>
