<template>
  <v-col order-md="2" order="1">
    <v-row align="center">
      <v-col class="hidden-sm-and-down" cols="4" lg="3">
        <v-img :src="mdLogo" height="128" width="128" :alt="alternativeText" />
      </v-col>

      <v-col class="hidden-xs hidden-md-and-up" cols="2">
        <v-img :src="smLogo" height="64" width="64" :alt="alternativeText" />
      </v-col>

      <v-col class="hidden-sm-and-up" cols="3">
        <v-img :src="smLogo" height="64" width="64" :alt="alternativeText" />
      </v-col>

      <v-col
        class="envidatTitle text-h1 pl-5 hidden-md-and-down"
        style="font-size: 80px !important;"
      >
        {{ title }}
      </v-col>

      <v-col
        class="envidatTitle text-h2 pl-2 hidden-sm-and-down hidden-lg-and-up"
      >
        {{ title }}
      </v-col>

      <v-col class="envidatTitle text-h3 pl-2 hidden-xs hidden-md-and-up">
        {{ title }}
      </v-col>

      <v-col class="envidatTitle text-h2 hidden-sm-and-up">
        {{ title }}
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <slogan-card
          :slogan="slogan"
          :subSlogan="subSlogan"
          :maxHeight="200"
          :buttonText="buttonText"
          :buttonCallback="buttonCallback"
          :moreButtonText="moreButtonText"
          :moreButtonCallback="moreButtonCallback"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
/**
 * TheTitleScreenLayout.vue shows the EnviDat logo and the SloganCard
 * with different layouts for the differen screen sizes.
 *
 * @summary responsive layout for the title screen with logo and SloganCard
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-01-06 18:21:07
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import smLogo from '@/assets/logo/EnviDat_logo_64.png';
import mdLogo from '@/assets/logo/EnviDat_logo_128.png';

import SloganCard from '@/modules/home/components/SloganCard.vue';

export default {
  components: {
    SloganCard,
  },
  props: {
    title: String,
    slogan: String,
    subSlogan: String,
    buttonText: String,
    buttonCallback: Function,
    moreButtonText: String,
    moreButtonCallback: Function,
  },
  data: () => ({
    smLogo,
    mdLogo,
    alternativeText: 'EnviDat logo',
  }),
  computed: {},
};
</script>

<style scoped>

.mt-md-pct {
  margin-top: 15%;
}

.mt-sm-pct {
  margin-top: 8%;
}
</style>
