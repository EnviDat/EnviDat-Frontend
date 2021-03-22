<template>
  <v-col >

    <v-row align="center" >

      <v-col class="hidden-sm-and-down"
              cols="4"
              lg="3" >
        <img :src="mdLogo" :alt="alternativeText">
      </v-col>

      <v-col class="hidden-xs-only hidden-md-and-up"
              cols="2" >
        <img :src="smLogo"
              :alt="alternativeText" >
      </v-col>

      <v-col class="hidden-sm-and-up"
              cols="3" >
        <img :src="smLogo"
              :alt="alternativeText" >
      </v-col>

      <v-col class="envidatTitle display-4 pl-5 hidden-md-and-down"
              style="font-size: 80px !important;" >
        {{ title }}
      </v-col>

      <v-col class="envidatTitle display-3 pl-2 hidden-sm-and-down hidden-lg-and-up" >
        {{ title }}
      </v-col>

      <v-col class="envidatTitle display-2 pl-2 hidden-xs-only hidden-md-and-up" >
        {{ title }}
      </v-col>

      <v-col class="envidatTitle display-3 hidden-sm-and-up" >
        {{ title }}
      </v-col>
    </v-row>

    <v-row no-gutters >
      <v-col >
        <slogan-card :slogan="slogan"
                      :subSlogan="subSlogan"
                      :buttonText="buttonText"
                      :buttonCallback="buttonCallback"
                      :moreButtonText="moreButtonText"
                      :moreButtonCallback="moreButtonCallback" />
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
 * Last modified  : 2019-10-31 08:20:02
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import SloganCard from './SloganCard';
import smLogo from '../assets/EnviDat_logo_64.png';
import mdLogo from '../assets/EnviDat_logo_128.png';
import lgLogo from '../assets/EnviDat_logo_256.png';

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
    lgLogo,
    alternativeText: 'EnviDat logo',
  }),
  computed: {
  },
};
</script>

<style scoped>

  .mt-md-pct{
    margin-top: 15%;
  }

  .mt-sm-pct{
    margin-top: 8%;
  }

</style>
