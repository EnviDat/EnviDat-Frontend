<template>
  <v-card :height="height ? height : ''"
          max-height="500"
          max-width="750"
          class="elevation-5"
          :color="notification.color" >

    <v-card-title class="pb-0">
      <v-row align="start">
        <v-col class="shrink">
          <v-icon>{{ notification.icon }}</v-icon>
        </v-col>

        <v-col cols="11">
          <div class="title">{{ notification.message }}</div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text class="pb-0">
      <div :style="`overflow: hidden scroll; ${height ? 'height: 60px;': 'max-height: 150px;'}`"
            class="caption">
        {{ notification.details }}
        <br />
        {{ notification.stack }}
      </div>
    </v-card-text>

    <v-card-text v-show="showReportButton || showCloseButton">
      <v-row no-gutters
              align="end"
              justify="end">

        <v-col v-if="showReportButton"
                class="shrink">
          <base-rectangle-button buttonText="Report"
                                  isSmall
                                  @clicked="$emit('clickedReport', $event)" />
        </v-col>

        <v-col v-if="showCloseButton"
                class="shrink">
          <base-rectangle-button color="black"
                                  buttonText="Close"
                                  isSmall
                                  marginClass="white--text"
                                  @clicked="$emit('clickedClose', $event)" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * NotificationCard.vue is used to show infos, warnings and errors
 * to the user.
 *
 * @summary card for notifications
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-11-12 08:57:58
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

// checkout skeleton
// https://github.com/ToxicJojo/SkeletonPlaceholder

export default {
  name: 'NotificationCard',
  components: {
    BaseRectangleButton,
  },
  props: {
    notification: Object,
    showReportButton: {
      type: Boolean,
      default: false,
    },
    showCloseButton: {
      type: Boolean,
      default: false,
    },
    height: Number,
  },
  mounted() {
    this.setTimeout();
  },
  computed: {},
  methods: {
    setTimeout() {
      const that = this;
      window.clearTimeout(this.activeTimeout);

      if (this.notification.timeout) {
        this.activeTimeout = window.setTimeout(() => {
          that.$emit('clickedClose');
        }, this.notification.timeout);
      }
    },
  },
  data: () => ({
    activeTimeout: -1,
  }),
};
</script>
