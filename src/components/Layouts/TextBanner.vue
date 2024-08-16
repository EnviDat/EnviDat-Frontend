<template>
  <v-banner two-line class="noPaddingForActions" :color="bannerColor">
    <template v-slot:icon>
      <v-icon
        color="white"
        size="24"
        style="animation: progress-circular-rotate 3s linear infinite;"
      >
        {{ icon }}
      </v-icon>
    </template>

    <template v-slot:default>
      <span v-html="text" />
    </template>

    <template v-slot:actions>
      <div class="d-flex flex-column flex-sm-row">
        <BaseRectangleButton
          v-if="confirmText"
          marginClass="mx-1"
          color="primary"
          :buttonText="confirmText"
          @clicked="confirmClick"
        />
        <BaseRectangleButton
          v-if="deniedText"
          marginClass="mx-1 mt-4 mt-sm-0"
          color="error"
          :buttonText="deniedText"
          @clicked="deniedClick"
        />

        <BaseRectangleButton
          v-if="cancelText"
          marginClass="mx-1"
          :buttonText="cancelText"
          :isFlat="true"
          @clicked="cancelClick"
        />
      </div>
    </template>
  </v-banner>
</template>

<script>
/**
 * TextBanner.vue creates a banner with confirm and cancel buttons
 *
 * @summary text banner with ok / cancel button
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-11-03 16:13:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

export default {
  name: 'TextBanner',
  props: {
    title: String,
    text: String,
    icon: {
      type: String,
      default: 'settings',
    },
    confirmText: String,
    deniedText: String,
    confirmClick: Function,
    deniedClick: Function,
    cancelText: String,
    cancelClick: Function,
    bannerColor: {
      type: String,
      default: 'warning',
    },
  },
  components: {
    BaseRectangleButton,
  },
  methods: {
    enterclick: function enterclick() {
      this.$emit('enterclick', this.loggedinText);
    },
    singupclick: function singupclick() {
      this.$emit('singupclick', this.signupText);
    },
    loginclick: function loginclick() {
      this.$emit('loginclick', this.loginText);
    },
  },
};
</script>

<style>
.noPaddingForActions > .v-banner__wrapper > .v-banner__actions {
  padding-top: 8px !important;
  padding-bottom: 12px !important;
  justify-content: center;
}
</style>
