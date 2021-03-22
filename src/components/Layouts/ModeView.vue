<template>
  <span align="center">
    <v-col v-if="compact"
          class="item body-2">
      {{ modeInfoPrefix }}:
      <br />
      {{ modeTitle }}
    </v-col>

    <v-col v-else
          class="item title">
      {{ modeInfo }}
    </v-col>

    <v-col v-if="modeLogo"
          class="item"
          style="height: 34px; width: 34px;">

      <a v-if="modeExternalUrl"
          :href="modeExternalUrl"
          target="_blank" >
        <v-img :src="modeLogo" />
      </a>
      <v-img v-else
              :src="modeLogo" />

    </v-col>

    <v-col class="item">
      <base-icon-button materialIconName="info_outline"
                        :tooltipText="`${tooltipText} ${modeTitle}`"
                        tooltipBottom
                        color="transparent"
                        iconColor="secondary"
                        isSmall />
    </v-col>

    <div v-if="closeCallback"
          class="item">
      <base-icon-button materialIconName="close"
                        :tooltipText="`Exit ${modeTitle} ${modeInfoPrefix}`"
                        tooltipBottom
                        color="transparent"
                        iconColor="red"
                        isSmall
                        @clicked="closeCallback" />
    </div>

  </span>
</template>

<script>
/**
 * ModeView.vue shows which mode is active.
 *
 * @summary mode widget for the current mode
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-10-31 15:29:14
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import { getModeData } from '@/factories/modeFactory';

export default {
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

<style scoped>
  .item {
    margin: 0px 5px;
  }
</style>
