<template>

  <v-row align="center" justify="center" no-gutters>
    <v-col v-if="compact" class="flex-grow-0 text-body-2 mx-1 text-no-wrap">

      {{ modeInfoPrefix }}: {{ modeTitle }}
    </v-col>

    <v-col v-else class="flex-grow-0 text-h6 mx-1 text-no-wrap">
      {{ modeInfo }}
    </v-col>

    <v-col v-if="modeLogo"
            class="flex-grow-0 mx-1" >
      <a
        v-if="modeExternalUrl"
        :href="modeExternalUrl"
        rel="noopener noreferrer"
        target="_blank"
      >
        <v-img :src="modeLogo"
               :height="size"
               :width="size" />
      </a>

      <v-img v-else :src="modeLogo"
                     :height="size"
                     :width="size" />
    </v-col>

    <v-col class="flex-grow-0 mx-1">
      <BaseIconButton
        :icon="mdiInformationOutline"
        :tooltip-text="`${tooltipText} ${modeTitle}`"
        tooltip-bottom
        color="transparent"
        icon-color="secondary"
      />
    </v-col>

    <v-col v-if="closeCallback" class="flex-grow-0 mx-1">

      <BaseIconButton
        :icon="mdiClose"
        :tooltip-text="`Exit ${modeTitle} ${modeInfoPrefix}`"
        tooltip-bottom
        color="transparent"
        icon-color="red"
        @clicked="closeCallback"
      />
    </v-col>
  </v-row>
</template>

<script>
/**
 * ModeView.vue shows which mode is active.
 *
 * @summary mode widget for the current mode
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-11-17 15:37:53
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mdiClose, mdiInformationOutline } from '@mdi/js';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { getModeData } from '@/factories/modeFactory';

export default {
  name: 'ModeView',
  components: {
    BaseIconButton,
  },
  props: {
    mode: String,
    compact: Boolean,
    closeCallback: Function,
  },
  data: () => ({
    mdiClose,
    mdiInformationOutline,
    modeInfoPrefix: 'Special View',
    tooltipText: 'You are in a specific view which shows ',
  }),
  computed: {
    size() {
      return this.compact ? 24 : 34;
    },
    modeInfo() {
      let infoText = this.modeInfoPrefix;

      if (this.modeTitle) {
        infoText = `${infoText}: ${this.modeTitle}`;
      }

      return infoText;
    },
    modeTitle() {
      return this.modeData ? this.modeData.title : null;
    },
    modeLogo() {
      return this.modeData ? this.modeData.logo : null;
    },
    modeExternalUrl() {
      return this.modeData ? this.modeData.externalUrl : null;
    },
    modeData() {
      if (!this.mode) return null;

      return getModeData(this.mode);
    },
  },
};
</script>
