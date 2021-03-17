<template>
  <v-row align="center"
          justify="center"
          no-gutters >

    <v-col v-if="compact"
          class="shrink body-2 mx-1 text-no-wrap" >
      {{ modeInfoPrefix }}: {{ modeTitle }}
     </v-col>

    <v-col v-else
          class="shrink title mx-1 text-no-wrap">
      {{ modeInfo }}
    </v-col>

    <v-col v-if="modeLogo"
            class="shrink mx-1"
            style="height: 34px; width: 34px;">

      <a v-if="modeExternalUrl"
          :href="modeExternalUrl"
          rel="noopener noreferrer"
          target="_blank" >
        <v-img :src="modeLogo"
                height="34" width="34" />
      </a>

      <v-img v-else
              :src="modeLogo"
              height="34" width="34" />

    </v-col>

    <v-col class="shrink mx-1" >

      <base-icon-button materialIconName="info_outline"
                        :tooltipText="`${tooltipText} ${modeTitle}`"
                        tooltipBottom
                        color="transparent"
                        iconColor="secondary"
                        isSmall />
    </v-col>

    <div v-if="closeCallback"
          class="shrink mx-1" >
      <base-icon-button materialIconName="close"
                        :tooltipText="`Exit ${modeTitle} ${modeInfoPrefix}`"
                        tooltipBottom
                        color="transparent"
                        iconColor="red"
                        isSmall
                        @clicked="closeCallback" />
    </div>

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
import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import { getModeData } from '@/factories/modeFactory';

export default {
  name: 'ModeView',
  // TODO: Component is not in use. Moved content to TheNavigationToolbar while upgrading to vuetify2
  components: {
    BaseIconButton,
  },
  props: {
    mode: String,
    compact: Boolean,
    closeCallback: Function,
  },
  data: () => ({
    modeInfoPrefix: 'Special View',
    tooltipText: 'You are in a specific view which shows data for',
  }),
  computed: {
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
