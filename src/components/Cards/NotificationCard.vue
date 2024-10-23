<template>
  <v-card
    :height="height ? height : ''"
    max-height="500"
    max-width="750"
    class="elevation-5"
    :color="type"
    :style="height ? 'overflow: hidden auto; ' : 'height: 100%;'"
  >
    <v-alert :title="message"
             :text="details"
             :type="type"
    />

    <v-alert v-if="stack"
             :type="type"
    >
      {{ stack }}
    </v-alert>

    <v-row no-gutters align="end" justify="end">
      <v-col v-if="showReportButton" class="flex-grow-0 mx-2">
        <base-rectangle-button
          buttonText="Report"
          isSmall
          @clicked="$emit('clickedReport', $event)"
        />
      </v-col>

      <v-col v-if="showCloseButton" class="flex-grow-0 mx-2">
        <base-rectangle-button
          color="black"
          buttonText="Close"
          isSmall
          marginClass="text-white"
          @clicked="$emit('clickedClose', $event)"
        />
      </v-col>
    </v-row>

<!--
    <v-card-title>
      <v-row align="start">
        <v-col class="flex-grow-0">
          <BaseIcon :icon="notification.icon" />
        </v-col>

        <v-col>
          <div class="text-h6">{{ notification.message }}</div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text class="pb-0">
      <div
        :style="height ? 'overflow: hidden auto; ' : 'height: 100%;'"
        class="text-body-1"
      >
        {{ notification.details }}
      </div>
    </v-card-text>

    <v-card-text v-if="notification.stack" class="pb-0">
      <div
        :style="height ? 'overflow: hidden auto; ' : 'height: 100%;'"
        class="text-caption"
      >
        {{ notification.stack }}
      </div>
    </v-card-text>

    <v-card-text v-show="showReportButton || showCloseButton">
      <v-row no-gutters align="end" justify="end">
        <v-col v-if="showReportButton" class="flex-grow-0">
          <base-rectangle-button
            buttonText="Report"
            isSmall
            @clicked="$emit('clickedReport', $event)"
          />
        </v-col>

        <v-col v-if="showCloseButton" class="flex-grow-0">
          <base-rectangle-button
            color="black"
            buttonText="Close"
            isSmall
            marginClass="text-white"
            @clicked="$emit('clickedClose', $event)"
          />
        </v-col>
      </v-row>
    </v-card-text>
-->

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

export default {
  name: 'NotificationCard',
  components: {
    BaseRectangleButton,
  },
  props: {
    message: {
      type: String,
      default: 'info',
    },
    details: {
      type: String,
      default: undefined,
    },
    stack: {
      type: String,
      default: undefined,
    },
    type: {
      type: String,
      default: undefined,
    },
    timeout: {
      type: Number,
      default: 2000,
    },
    showReportButton: {
      type: Boolean,
      default: false,
    },
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
      default: 200,
    },
  },
  mounted() {
    this.setTimeout();
  },
  computed: {},
  methods: {
    setTimeout() {
      const that = this;
      window.clearTimeout(this.activeTimeout);

      if (this.notification?.timeout) {
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
