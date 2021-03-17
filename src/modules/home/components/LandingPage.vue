<template>
  <v-container fluid
                class="pa-0"
                tag="article"
                id="LandingPage">

    <div v-show="showPolygonParticles"
          id="polygon-canvas"
          style="position: absolute; width: 100%; height: 400px; bottom: 0; left: 0;"></div>

      <v-row class="pb-5"
              no-gutters>

        <v-col cols="12"
                md="6"
                align-self="end"
                order-md="1"
                order="2"
                class="pr-md-4 pt-4 pt-md-0">

          <SloganCard v-if="showWinterHolidayWishs"
                      slogan="Happy Holidays!"
                      :sloganImg="winterHolidayImage"
                      :maxHeight="275"
                      :subSlogan="decemberWishes" />

          <SloganCard v-if="showNewYearWishs"
                      slogan="Happy New Year!"
                      :sloganImg="newYearImage"
                      :maxHeight="300"
                      :subSlogan="newYearWishes" />
        </v-col>

        <the-title-screen-layout :title="envidatTitle"
                                  :slogan="envidatSlogan"
                                  :subSlogan="envidatSubSlogan"
                                  :buttonText="sloganButtonText"
                                  :buttonCallback="catchBrowseClicked"
                                  :moreButtonText="sloganMoreButtonText"
                                  :moreButtonCallback="catchMoreClicked" />
      </v-row>


      <v-row class="hidden-xs-only px-0 py-5 offset-md-4 offset-lg-6"
              no-gutters>
        <search-bar-view :labelText="labelText"
                          :buttonText="buttonText"
                          :hasButton="true"
                          @clicked="catchSearchClicked" />
      </v-row>

      <v-row class="py-5 pa-0 hidden-sm-and-up"
              no-gutters>
        <small-search-bar-view :labelText="smallScreenLabelText"
                                :buttonText="buttonText"
                                @clicked="catchSearchClicked" />
      </v-row>

      <v-row class="pt-5 pb-2 offset-md-4 offset-lg-6"
              no-gutters>
        <v-col>          
          <v-card>
            <v-card-title primary style="word-break: break-word; line-height: 1.5rem;">
              {{ welcomeInfo.categoryText }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <v-row class=" offset-md-4 offset-lg-6"
              no-gutters >
        <v-container class="pt-3 pb-0 px-1 pa-sm-0 pt-sm-3">
          <v-row>

            <v-col v-for="card in categoryCards"
                    :key="card.title"
                    cols="6"
                    class="pa-2 pa-sm-3" >

              <base-click-card :title="card.title"
                                :img="card.img"
                                :color="card.darkColor"
                                :contain="card.contain"
                                :disabled="card.disabled"
                                @click="catchCategoryClicked(card.type)" />
            </v-col>
          </v-row>
        </v-container>
      </v-row>

  </v-container>
</template>

<script>
/**
 * The landing page of EnviDat is the root page ("./") first page shown
 * It consists of:
 * - TheTitleScreenLayout
 * - SearchBarView
 * - and show a list of category cards (baseClickCard)
 *
 * @summary landing page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2021-01-06 21:12:38
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapState } from 'vuex';
import { getMonth } from 'date-fns';

import {
  LANDING_PAGENAME,
  BROWSE_PATH,
  ABOUT_PATH,
} from '@/router/routeConsts';

import BaseClickCard from '@/components/BaseElements/BaseClickCard';
import SmallSearchBarView from '@/components/Filtering/SmallSearchBarView';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import SloganCard from '@/modules/home/components/SloganCard';
import TheTitleScreenLayout from './TheTitleScreenLayout';
import SearchBarView from './SearchBarView';

require('particles.js');

// Login & Register form and animation
// https://codepen.io/yusufbkr/pen/RPBQqg

// This animation is a bit smoother
// https://codepen.io/andytran/pen/RPBdgM

// Here is one with a progress button/bar
// https://codepen.io/suez/pen/dPqxoM

export default {
  name: 'LandingPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // console.log("landing beforeRouteEnter to: " + to + " from: " + from + " next: " + next);
      vm.$store.commit(SET_CURRENT_PAGE, LANDING_PAGENAME);
      const bgimg = vm.$vuetify.breakpoint.smAndDown ? vm.MobileBGImage : vm.PageBGImage;
      vm.$store.commit(SET_APP_BACKGROUND, bgimg);
    });
  },
  mounted() {
    window.scrollTo(0, 0);

    this.initPolygonParticles();
  },
  destroyed() {
    this.stopParticles();
  },
  computed: {
    ...mapState([
      'categoryCards',
      'config',
    ]),
    showPolygonParticles() {
      return this.$vuetify.breakpoint.mdAndUp && this.effectsConfig.landingPageParticles && !this.showDecemberParticles;
    },
    showDecemberParticles() {
      return this.effectsConfig.decemberParticles && this.itIsDecember;
    },
    itIsDecember() {
      return getMonth(Date.now()) === 11;
    },
    showNewYearWishs() {
      return this.effectsConfig.showNewYearWishes && getMonth(Date.now()) === 0;
    },
    showWinterHolidayWishs() {
      return this.effectsConfig.showDecemberWishes && this.itIsDecember;
    },
    decemberWishes() {
      return this.effectsConfig.decemberWishes;
    },
    winterHolidayImage() {
      return this.mixinMethods_getWebpImage('cards/slogan/holidays_winter', this.$store.state);
    },
    newYearWishes() {
      return this.effectsConfig.newYearWishes || '';
    },
    newYearImage() {
      return this.mixinMethods_getWebpImage('cards/slogan/new_year', this.$store.state);
    },
    effectsConfig() {
      return this.config?.effectsConfig || {};
    },
  },
  watch: {
    config() {
      if (!this.loadingConfig) {
        this.initPolygonParticles();
      }
    },
  },
  methods: {
    stopParticles(fullClean = true) {
      
      try {
       
        if (this.currentParticles) {
          this.currentParticles.particles.move.enable = false;
          this.currentParticles.particles.opacity.anim.enable = false;
          this.currentParticles.particles.size.anim.enable = false;
        }

      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Error during particle stop: ${error}`);
      } finally {
        this.currentParticles = null;
        if (fullClean) {
          window.pJS = null;
        }
      }
    },
    initPolygonParticles() {
      if (this.showPolygonParticles) {
        // particleOptions have to be in the folder public/particles/polygonParticleOptions.json for development
        // in production they have to be in same folder as the index.html there -> ./particles/polygonParticleOptions.json
        // eslint-disable-next-line no-undef
        particlesJS.load('polygon-canvas', './particles/polygonParticleOptions.json', () => {
          // console.log('polygon-canvas - particles.js config loaded');
          if (this.currentParticles) {
            this.stopParticles(false);
          }
          this.currentParticles = window.pJS;
        });
      }
    },
    catchCategoryClicked(cardType) {
      if (cardType.includes('login')) {
        this.catchLoginclick();
        return;
      }

      if (cardType.includes('mode')) {
        const splits = cardType.split('_');
        const modeName = splits[1];
        this.catchModeClicked(modeName);
        return;
      }

      const tagsEncoded = this.mixinMethods_encodeTagForUrl([cardType.toUpperCase()]);
      this.mixinMethods_additiveChangeRoute(BROWSE_PATH, '', tagsEncoded);
    },
    catchModeClicked(mode) {
      this.$router.push({
        path: BROWSE_PATH,
        query: { mode },
      });
    },
    catchSearchClicked(search) {
      this.$router.push({
        path: BROWSE_PATH,
        query: { search },
      });
    },
    catchBrowseClicked() {
      this.$router.push({ path: BROWSE_PATH });
    },
    catchMoreClicked() {
      this.$router.push({ path: ABOUT_PATH });
    },
    catchLoginclick() {
      this.redirectToDashboard();
    },
    redirectToDashboard() {
      window.open('https://www.envidat.ch/user/reset', '_blank');
    },
  },
  components: {
    TheTitleScreenLayout,
    SearchBarView,
    SmallSearchBarView,
    BaseClickCard,
    SloganCard,
  },
  data: () => ({
    PageBGImage: 'app_b_landingpage',
    MobileBGImage: 'app_b_browsepage',
    labelText: 'Looking for something specific? Enter research term, topic or author here!',
    smallScreenLabelText: 'Enter research term, topic or author',
    buttonText: 'SEARCH',
    envidatTitle: 'EnviDat',
    envidatSlogan: 'Environmental Research Data at your Fingertips',
    envidatSubSlogan: 'EnviDat provides research data from Switzerland and all over the world. The data is being being provided by researchers of the many research units of the Swiss Federal Institute for Forest, Snow and Landscape WSL.',
    sloganButtonText: 'EXPLORE DATA',
    sloganMoreButtonText: 'ABOUT ENVIDAT',
    welcomeInfo: {
      titleText: 'Welcome to EnviDat',
      searchText: 'Looking for something specific?',
      // categoryText: 'Have a look at a category of research data or sign in',
      categoryText: 'Have a look at the data of one of theses categories or sign in to upload your data',
    },
  }),
};
</script>
