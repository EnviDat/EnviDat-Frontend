<template>
  <v-container class="fill-height pa-0" tag="article"
                fluid 
                >
    <v-row no-gutters>

      <v-col cols="12"
              md="6"
            v-for="(err, index) in errors"
            :key="index" >

        <NotificationCard :notification="err"
                            />

      </v-col>
    </v-row>

    <!-- <v-row  >
      <v-col cols="12"  >
        <v-card>
          <v-card-title :style="`background-color: ${color}`">
            <div v-if="errors"
                  class="headline">
              Report Error
            </div>
            <div v-if="feedback"
                  class="headline">
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
                            label="E-mail"
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
import {
  REPORT_PAGENAME,
} from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import NotificationCard from '@/components/Cards/NotificationCard';


export default {
  /**
     * @description beforeRouteEnter is used to change background image of this page.
     * It's called via vue-router.
     */
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, REPORT_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  /**
     * @description reset the scrolling to the top,
     * because of the scrolling is set from the browsePage or metaDetailPage
     */
  mounted() {
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapState([
      'notifications',
    ]),
    color() {
      return this.error ? this.$vuetify.theme.themes.light.error : this.$vuetify.theme.themes.light.highlight;
    },
    errors() {
      return Object.values(this.notifications);
    },    
  },
  methods: {
    submit() {
      console.log('submit clicked');
    },
  },
  components: {
    NotificationCard,
  },
  data: () => ({
    PageBGImage: 'app_b_browsepage',
    name: '',
    email: '',
    feedback: false,
    feedbackText: '',
  }),
};
</script>
