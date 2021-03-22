<template>
  <v-card height="165"
          class="elevation-3"
          :color="notification.color">

    <v-card-title >
      <v-row align-content="center" no-gutters>

        <v-col cols="1" >
          <v-icon>{{ notification.icon }}</v-icon>
        </v-col>

        <v-col cols="11">
          <div class="title">{{ notification.message }}</div>
        </v-col>

      </v-row>
    </v-card-title>

    <v-card-text v-html="notification.details">
      {{ notification.details }}
    </v-card-text>

    <v-card-actions class="ma-0 py-0 px-2"
                    style="position: absolute; bottom: 0px; right: 5px;" >
      <v-row class="fill-height" 
              align="end"
              justify="end">
        <v-col v-if="showReportButton"
                class="shrink" >
          <base-rectangle-button buttonText="Report"
                                  isSmall
                                  @clicked="$emit('clickedReport')" />
        </v-col>

        <v-col v-if="showCloseButton"
                class="shrink" >
          <base-rectangle-button color="black"
                                  buttonText="Close"
                                  isSmall
                                  marginClass="white--text"
                                  @clicked="$emit('clickedClose')" />
        </v-col>
      </v-row>
    </v-card-actions>

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
 * Last modified  : 2019-10-23 14:38:19
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  components: {
    BaseRectangleButton,
  },
  props: {
    notification: Object,
    showReportButton: Boolean,
    showCloseButton: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    if (this.notification.timeout > 0) {
      this.setTimeout();
    }
  },
  computed: {
  },
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
