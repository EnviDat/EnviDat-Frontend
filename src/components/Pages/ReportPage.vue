<template>
  <v-container class="fill-height pa-0" tag="article" fluid>
    <v-row no-gutters>
      <v-col cols="12" md="6" v-for="(err, index) in errors" :key="index">
        <NotificationCard v-bind="err" />
      </v-col>
    </v-row>

    <!-- <v-row  >
      <v-col cols="12"  >
        <v-card>
          <v-card-title :style="`background-color: ${color}`">
            <div v-if="errors"
                 class="text-h5">
              Report Error
            </div>
            <div v-if="feedback"
                 class="text-h5">
              Feedback is always welcome!
            </div>
          </v-card-title>

          <v-divider :color="color" />

          <v-card-text>
            <form>
              <v-text-field v-model="name"
                            label="Name"
                            required />

              <v-text-field v-model="email"
                            label="Email"
                            required />

              <v-text-field v-if="error"
                            v-model="error.message"
                            label="Error message"
                            required />

              <v-textarea v-if="error && error.details"
                          label="Error details"
                          v-model="error.details" disabled />

              <v-textarea v-if="error && error.stack"
                          label="Error stack"
                          v-model="error.stack" disabled />

              <v-textarea v-if="feedback"
                          label="Feedback"
                          placeholder="What is nice? What needs improvement?"
                          v-model="feedbackText" />

              <v-btn color="primary" @click="submit">Send</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row> -->
  </v-container>
</template>

<script>
/**
 * The ReportPage is UNFINISHED.
 * It show an form with the error message to send to the backend.
 *
 * @summary projects page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2020-11-12 17:08:33
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  mapState,
  // mapGetters,
} from 'vuex';

import NotificationCard from '@/components/Cards/NotificationCard.vue';

export default {
  /**
   * @description reset the scrolling to the top,
   * because of the scrolling is set from the browsePage or metaDetailPage
   */
  mounted() {
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapState(['notifications']),
    color() {
      return this.error
        ? this.$vuetify.theme.themes.light.colors.error
        : this.$vuetify.theme.themes.light.colors.highlight;
    },
    errors() {
      return Object.values(this.notifications);
    },
  },
  methods: {
    submit() {
      // eslint-disable-next-line no-console
      console.log('submit clicked');
    },
  },
  components: {
    NotificationCard,
  },
  data: () => ({
    name: '',
    email: '',
    feedback: false,
    feedbackText: '',
  }),
};
</script>
