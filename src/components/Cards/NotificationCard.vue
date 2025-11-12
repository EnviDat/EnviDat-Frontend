<template>
  <v-card
    :height="height ? height : ''"
    max-height="500"
    max-width="750"
    class="elevation-5"
    :color="notification.color"
  >
    <v-card-title>
      <v-row align="start">
        <v-col class="flex-grow-0">
          <BaseIcon :icon="notification.icon" color="black" />
        </v-col>

        <v-col>
          <div class="text-h6">{{ notification.message }}</div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text class="pb-0">
      <div :style="height ? 'overflow: hidden auto; ' : 'height: 100%;'" class="text-body-1">
        {{ notification.details }}
      </div>
    </v-card-text>

    <v-card-text v-if="notification.stack" class="pb-0">
      <div :style="height ? 'overflow: hidden auto; ' : 'height: 100%;'" class="text-caption">
        {{ notification.stack }}
      </div>
    </v-card-text>

    <v-card-text v-show="showReportButton || showCloseButton">
      <v-row no-gutters align="end" justify="end">
        <v-col v-if="showReportButton" class="shrink">
          <base-rectangle-button buttonText="Report" isSmall @clicked="$emit('clickedReport', $event)" />
        </v-col>

        <v-col v-if="showCloseButton" class="shrink">
          <base-rectangle-button
            color="black"
            buttonText="Close"
            isSmall
            marginClass="white--text"
            @clicked="$emit('clickedClose', $event)"
          />
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

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

// checkout skeleton
// https://github.com/ToxicJojo/SkeletonPlaceholder

export default {
  name: 'NotificationCard',
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
      window.clearTimeout(this.activeTimeout);

      if (this.notification.timeout) {
        this.activeTimeout = window.setTimeout(() => {
          this.$emit('clickedClose');
        }, this.notification.timeout);
      }
    },
  },
  data: () => ({
    activeTimeout: -1,
  }),
  components: {
    BaseRectangleButton,
    BaseIcon,
  },
};
</script>
