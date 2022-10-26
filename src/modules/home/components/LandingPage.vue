<template>
  <v-container fluid class="pa-0" tag="article" id="LandingPage">
    <div
      v-show="showPolygonParticles"
      id="polygon-canvas"
      style="position: absolute; width: 99%; height: 325px; bottom: 0; left: 0;"
    />

    <div
      v-show="showPolygonParticles"
      id="polygon-canvas2"
      style="position: absolute; width: 400px; height: 300px; bottom: 30%; left: 22.5%;"
    />

    <LandingPageLayout
      :categoriesTitle="welcomeInfo.categoriesTitle"
      :datasetsTitle="welcomeInfo.datasetsTitle"
      :newsTitle="welcomeInfo.newsTitle"
      :articlesTitle="welcomeInfo.articlesTitle"
    >
      <template v-if="$vuetify.breakpoint.mdAndUp" v-slot:logo>
        <v-row align="center">
          <v-col class="hidden-sm-and-down" cols="4" lg="3">
            <img :src="mdLogo" :alt="alternativeText" />
          </v-col>

          <v-col class="hidden-xs-only hidden-md-and-up" cols="2">
            <img :src="smLogo" :alt="alternativeText" />
          </v-col>

          <v-col class="hidden-sm-and-up" cols="3">
            <img :src="smLogo" :alt="alternativeText" />
          </v-col>

          <v-col
            class="envidatTitle text-h1 pl-5 hidden-md-and-down"
            style="font-size: 80px !important;"
          >
            {{ welcomeInfo.titleText }}
          </v-col>

          <v-col
            class="envidatTitle text-h2 pl-2 hidden-sm-and-down hidden-lg-and-up"
          >
            {{ welcomeInfo.titleText }}
          </v-col>

          <v-col
            class="envidatTitle text-h3 pl-2 hidden-xs-only hidden-md-and-up"
          >
            {{ welcomeInfo.titleText }}
          </v-col>

          <v-col class="envidatTitle text-h2 hidden-sm-and-up">
            {{ welcomeInfo.titleText }}
          </v-col>
        </v-row>
      </template>

      <template v-slot:welcome>
        <SloganCard
          :slogan="welcomeInfo.Slogan"
          :subSlogan="welcomeInfo.SubSlogan"
          :maxHeight="200"
          :buttonText="sloganButtonText"
          :buttonCallback="catchBrowseClicked"
          :moreButtonText="sloganMoreButtonText"
          :moreButtonCallback="catchMoreClicked"
        />
      </template>

      <template v-slot:search>
        <SearchBarView
          v-if="$vuetify.breakpoint.smAndUp"
          :labelText="welcomeInfo.searchLabelText"
          :buttonText="buttonText"
          :hasButton="true"
          @clicked="catchSearchClicked"
        />

        <SmallSearchBarView
          v-if="$vuetify.breakpoint.xsOnly"
          :labelText="welcomeInfo.smallSearchLabelText"
          :buttonText="buttonText"
          @clicked="catchSearchClicked"
        />
      </template>

      <template v-slot:datasets>
        <v-row v-if="loadingMetadatasContent" no-gutters>
          <v-col v-for="index in 2" :key="index" cols="6" class="pa-2">
            <MetadataCardPlaceholder id="orgaDataset" class="mx-2" />
          </v-col>
        </v-row>

        <v-row v-if="!loadingMetadatasContent" no-gutters>
          <v-col
            v-for="(metadata, index) in recentMetadata"
            :key="index"
            cols="6"
            class="pa-2"
          >
            <MetadataCard
              :key="index"
              :id="metadata.id"
              :title="metadata.title"
              :subtitle="metadata.notes"
              :name="metadata.name"
              :titleImg="metadata.titleImg"
              :resourceCount="metadata.num_resources"
              :fileIconString="fileIconString"
              :categoryColor="metadata.categoryColor"
              :compactLayout="true"
              @clickedEvent="catchMetadataClicked"
            />
          </v-col>
        </v-row>
      </template>

      <template v-slot:categories>
        <v-row no-gutters>
          <v-col
            v-for="card in categoryCards"
            :key="card.title"
            cols="6"
            class="pa-2"
          >
            <BaseClickCard
              :height="$vuetify.breakpoint.lgAndDown ? '65' : '90'"
              :title="card.title"
              :img="card.img"
              :color="card.darkColor"
              :contain="card.contain"
              :disabled="card.disabled"
              @click="catchCategoryClicked(card.type)"
            />
          </v-col>
        </v-row>
      </template>

      <template v-slot:articles>
        <v-row no-gutters>
          <v-col
            v-for="(post, index) in blogPosts"
            :key="index"
            cols="6"
            class="pa-2"
          >
            <BlogPostCard
              :postTitle="post.title"
              :titleImg="post.titleImg"
              :loadingImg="fallbackCardImg"
              titleCssClass="compactBlogPostCard"
              subtitleCssClass="text-caption"
              :height="$vuetify.breakpoint.lgAndDown ? '75' : '100'"
              @clicked="catchPostClick(post.postFile)"
            />
          </v-col>
        </v-row>
      </template>

      <template v-slot:news v-if="hasActiveNews">
        <TitleCard
          :title="welcomeInfo.newsTitle"
          cardClass="pa-2"
          titleClass="titleCardClass"
        />

        <div
          v-for="(entry, index) in newsEntries"
          :key="index"
          class="pt-4 px-1"
        >
          <SloganCard
            :slogan="entry.title"
            :subSlogan="entry.text"
            :sloganImg="entry.image"
          />
        </div>

        <div v-if="showWinterHolidayWishs" class="pt-4 px-1">
          <SloganCard
            slogan="Happy Holidays!"
            :sloganImg="winterHolidayImage"
            :subSlogan="decemberWishes"
          />
        </div>

        <div v-if="showNewYearWishs" class="pt-4 px-1">
          <SloganCard
            slogan="Happy New Year!"
            :sloganImg="newYearImage"
            :subSlogan="newYearWishes"
          />
        </div>
      </template>
    </LandingPageLayout>

    <!--
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

        <the-title-screen-layout :title="welcomeInfo.titleText"
                                  :slogan="welcomeInfo.Slogan"
                                  :subSlogan="welcomeInfo.SubSlogan"
                                  :buttonText="sloganButtonText"
                                  :buttonCallback="catchBrowseClicked"
                                  :moreButtonText="sloganMoreButtonText"
                                  :moreButtonCallback="catchMoreClicked" />
      </v-row>
-->

    <!--
      <v-row class="hidden-xs-only px-0 py-5 offset-md-4 offset-lg-6"
              no-gutters>
        <search-bar-view :labelText="welcomeInfo.searchLabelText"
                          :buttonText="buttonText"
                          :hasButton="true"
                          @clicked="catchSearchClicked" />
      </v-row>

      <v-row class="py-5 pa-0 hidden-sm-and-up"
              no-gutters>
        <small-search-bar-view :labelText="welcomeInfo.smallSearchLabelText"
                                :buttonText="buttonText"
                                @clicked="catchSearchClicked" />
      </v-row>
-->

    <!--
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
-->
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

import { getMonth } from 'date-fns';
import { mapGetters, mapState } from 'vuex';

import smLogo from '@/assets/logo/EnviDat_logo_64.png';
import mdLogo from '@/assets/logo/EnviDat_logo_128.png';
import lgLogo from '@/assets/logo/EnviDat_logo_256.png';
import BaseClickCard from '@/components/BaseElements/BaseClickCard.vue';
import MetadataCard from '@/components/Cards/MetadataCard.vue';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';
import TitleCard from '@/components/Cards/TitleCard.vue';
import SmallSearchBarView from '@/components/Filtering/SmallSearchBarView.vue';
import { eventBus, SHOW_REDIRECT_SIGNIN_DIALOG } from '@/factories/eventBus';
import BlogPostCard from '@/modules/blog/components/BlogPostCard.vue';
import {
  BLOG_NAMESPACE,
  GET_BLOG_LIST,
} from '@/modules/blog/store/blogMutationsConsts';
import LandingPageLayout from '@/modules/home/components/LandingPageLayout.vue';
// import TheTitleScreenLayout from '@/modules/home/components/TheTitleScreenLayout.vue';
import SearchBarView from '@/modules/home/components/SearchBarView.vue';
import SloganCard from '@/modules/home/components/SloganCard.vue';
import {
  ABOUT_PATH,
  BLOG_PAGENAME,
  BROWSE_PATH,
  LANDING_PAGENAME,
  METADATADETAIL_PAGENAME,
  USER_SIGNIN_PATH,
} from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';
import {
  METADATA_NAMESPACE,
  SET_DETAIL_PAGE_BACK_URL,
} from '@/store/metadataMutationsConsts';

// Login & Register form and animation
// https://codepen.io/yusufbkr/pen/RPBQqg

// This animation is a bit smoother
// https://codepen.io/andytran/pen/RPBdgM

// Here is one with a progress button/bar
// https://codepen.io/suez/pen/dPqxoM

export default {
  name: 'LandingPage',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // console.log("landing beforeRouteEnter to: " + to + " from: " + from + " next: " + next);
      vm.$store.commit(SET_CURRENT_PAGE, LANDING_PAGENAME);
      const bgimg = vm.$vuetify.breakpoint.smAndDown
        ? vm.MobileBGImage
        : vm.PageBGImage;
      vm.$store.commit(SET_APP_BACKGROUND, bgimg);
    });
  },
  beforeMount() {
    this.$store.dispatch(`${BLOG_NAMESPACE}/${GET_BLOG_LIST}`);

    this.fileIconString = this.mixinMethods_getIcon('file');
    this.fallbackCardImg = this.mixinMethods_getWebpImage(
      'about/contact',
      this.$store.state,
    );
  },
  mounted() {
    window.scrollTo(0, 0);

    this.initPolygonParticles();
  },
  destroyed() {
    this.stopParticles();
  },
  computed: {
    ...mapState(['categoryCards', 'config']),
    ...mapGetters(METADATA_NAMESPACE, [
      'loadingMetadatasContent',
      'recentMetadata',
    ]),
    ...mapState(BLOG_NAMESPACE, ['list']),
    blogPosts() {
      if (this.list?.length > 0) {
        return this.list.slice(0, 4);
      }

      return this.list;
    },
    welcomeInfo() {
      return this.config?.welcomeInfo || this.defaultWelcomeInfo;
    },
    hasActiveNews() {
      return (
        (this.config?.newsConfig?.newsActive && this.newsEntries.length > 0) ||
        this.showNewYearWishs ||
        this.showWinterHolidayWishs
      );
    },
    newsEntries() {
      return this.config?.newsConfig?.entries || [];
    },
    showPolygonParticles() {
      return (
        this.$vuetify.breakpoint.lgAndUp &&
        this.effectsConfig.landingPageParticles &&
        !this.showDecemberParticles
      );
    },
    maintenanceConfig() {
      return this.config?.maintenanceConfig || {};
    },
    signinRedirectActive() {
      return this.maintenanceConfig?.signinRedirectActive || false;
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
      return this.mixinMethods_getWebpImage(
        'cards/slogan/holidays_winter',
        this.$store.state,
      );
    },
    newYearWishes() {
      return this.effectsConfig.newYearWishes || '';
    },
    newYearImage() {
      return this.mixinMethods_getWebpImage(
        'cards/slogan/new_year',
        this.$store.state,
      );
    },
    effectsConfig() {
      return this.config?.effectsConfig || {};
    },
    sloganButtonText() {
      /*
      if (this.$vuetify.breakpoint.lgAndDown) {
        return 'EXPLORE';
      }
*/

      return 'EXPLORE DATA';
    },
    sloganMoreButtonText() {
      if (this.$vuetify.breakpoint.lgAndDown) {
        return 'ABOUT';
      }

      return 'ABOUT ENVIDAT';
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
        particlesJS.load(
          'polygon-canvas',
          './particles/polygonParticleOptions.json',
          () => {
            // console.log('polygon-canvas - particles.js config loaded');
            if (this.currentParticles) {
              this.stopParticles(false);
            }
            this.currentParticles = window.pJS;
          },
        );

        // eslint-disable-next-line no-undef
        particlesJS.load(
          'polygon-canvas2',
          './particles/polygonParticleOptions2.json',
          () => {
            // console.log('polygon-canvas - particles.js config loaded');
            if (this.currentParticles) {
              this.stopParticles(false);
            }
            this.currentParticles = window.pJS;
          },
        );
      }
    },
    catchCategoryClicked(cardType) {
      if (cardType.includes('login')) {
        this.catchSigninClick();
        return;
      }

      if (cardType.includes('mode')) {
        const splits = cardType.split('_');
        const modeName = splits[1];
        this.catchModeClicked(modeName);
        return;
      }

      const newTags = [cardType];
      const stringTags = this.mixinMethods_convertArrayToUrlString(newTags);

      this.mixinMethods_additiveChangeRoute(BROWSE_PATH, '', stringTags);
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
    catchSigninClick() {
      if (this.signinRedirectActive) {
        // don't pass any parameters to show the default message for Sign In redirect
        eventBus.$emit(SHOW_REDIRECT_SIGNIN_DIALOG);
        return;
      }

      if (this.$route.path === USER_SIGNIN_PATH) {
        return;
      }

      this.$router.push({ path: USER_SIGNIN_PATH, query: '' });
    },
    redirectToDashboard() {
      window.open('https://www.envidat.ch/user/reset', '_blank');
    },
    catchMetadataClicked(datasetname) {
      this.$store.commit(
        `${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`,
        this.$route,
      );

      this.$router.push({
        name: METADATADETAIL_PAGENAME,
        params: {
          metadataid: datasetname,
        },
      });
    },
    catchPostClick(post) {
      if (this.$route.params?.post !== post) {
        this.$router.push({
          name: BLOG_PAGENAME,
          params: { post },
        });
      }
    },
  },
  components: {
    LandingPageLayout,
    // TheTitleScreenLayout,
    SearchBarView,
    SmallSearchBarView,
    BaseClickCard,
    SloganCard,
    MetadataCard,
    MetadataCardPlaceholder,
    TitleCard,
    BlogPostCard,
  },
  data: () => ({
    PageBGImage: 'app_b_landingpage',
    MobileBGImage: 'app_b_browsepage',
    buttonText: 'SEARCH',
    defaultWelcomeInfo: {
      titleText: 'EnviDat',
      Slogan: 'Environmental Research Data at your Fingertips',
      SubSlogan:
        'EnviDat provides research data from Switzerland and all over the world. The data is being provided by researchers of the many research units of the Swiss Federal Institute for Forest, Snow and Landscape WSL.',
      searchLabelText:
        'Looking for something specific? Enter research term, topic or author here!',
      smallSearchLabelText: 'Enter research term, topic or author',
      searchText: 'Looking for something specific?',
      categoryText:
        'Have a look at one of theses categories or sign in to upload your data',
      articlesTitle: 'Recent EnviDat Blog Articles',
      newsTitle: 'News From The EnviDat Team',
      categoriesTitle: 'Research Data Categories',
      datasetsTitle: 'Recently Published Research Datasets',
    },
    fileIconString: '',
    alternativeText: 'EnviDat logo',
    fallbackCardImg: null,
    smLogo,
    mdLogo,
    lgLogo,
  }),
};
</script>

<style scoped>

</style>

<style>
.compactBlogPostCard {
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.1rem;
}
</style>
