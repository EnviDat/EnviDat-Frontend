<template>
  <v-card>

  <v-container class="fill-height pa-4"
                tag="article"
                fluid 
                id="PageNotFound"
                >
    <v-row >

      <v-col cols="12" >
        
        Oh here is nothing! Looks like you somehow entered a wrong url?
        If you keep getting this error page, please report to the envidat team via <router-link :to="{ path: ABOUT_PATH }">about page</router-link>.

      </v-col>

      <v-col cols="12" >
        <router-link :to="{ path: LANDING_PATH }">Get me back to the home page!</router-link>
      </v-col>

      <v-col cols="12" >
        <router-link :to="{ path: BROWSE_PATH }">I want to go back to the browse page!</router-link>
      </v-col>

    </v-row>

  </v-container>
  </v-card>
</template>

<script>
/**
 * The PageNotFound is the 404 Not Found page with a link back to the browse page
 *
 * @summary 404 page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-01-27 07:15:53
 * Last modified  : 2021-01-27 08:25:16
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  ABOUT_PATH,
  LANDING_PATH,
  BROWSE_PATH,
} from '@/router/routeConsts';

export default {
  name: 'PageNotFound',
  mounted() {
    window.scrollTo(0, 0);
  },
  computed: {
  },
  methods: {
  },
  components: {
  },
  data: () => ({
    ABOUT_PATH,
    BROWSE_PATH,
    LANDING_PATH,
  }),
};
</script>
