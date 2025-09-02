<template>
  <v-container class="pa-0 ma-0" tag="article" fluid id="AboutPage">
    <v-row no-gutters ref="aboutHeader" class="py-1 py-md-4">
      <v-col cols="12" md="10" offset-md="1">
        <!-- Tabs -->
        <v-tabs
          :model-value="activeTab"
          slider-color="accent"
          color="white"
          grow
          bg-color="highlight"
        >
          <v-tab
            v-for="(tab, index) in tabs"
            :key="tab.name"
            :value="tab.name"
            @click="catchTabClick(tab.name)"
            class="pa-0"
          >
            {{ $vuetify.display.smAndUp ? tab.name : '' }}

            <BaseIcon
              :icon="tab.icon"
              :color="activeTab === index ? 'white' : 'grey-darken-3'"
              class="px-sm-3"
            />
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row no-gutters ref="aboutBody" class="py-1 py-md-4">
      <v-col cols="12" md="10" offset-md="1">
        <v-window :model-value="activeTab">
          <!-- About -->
          <v-window-item :key="tabs[0].name">
            <about-tab-layout title="About EnviDat" :titleImage="missionImg">
              <v-row no-gutters>
                <v-col
                  v-for="(card, index) in aboutCardInfo"
                  :key="index"
                  class="pa-3"
                  :class="card.widthClass"
                >
                  <expandable-card
                    :title="card.title"
                    :text="card.text"
                    :img="card.img"
                    :min-height="100"
                    :max-height="150"
                    :contain="card.title === 'WSL'"
                  />
                </v-col>
              </v-row>
            </about-tab-layout>
          </v-window-item>

          <!-- Guidelines -->
          <v-window-item :key="tabs[1].name">
            <about-tab-layout
              title="Guidelines"
              :titleImage="guidelineImg"
              :loading="guidelinesLoading"
              loadingText="Loading Guidelines..."
              :markdownContent="guidelinesMarkdownText"
            />
          </v-window-item>

          <!-- Policies -->
          <v-window-item :key="tabs[2].name">
            <about-tab-layout
              title="Policies"
              :titleImage="policiesImg"
              :loading="policiesLoading"
              loadingText="Loading Policies..."
              :markdownContent="policiesMarkdownText"
            />
          </v-window-item>

          <!-- DMP -->
          <v-window-item :key="tabs[3].name">
            <about-tab-layout
              title="Data Management Plan"
              :titleImage="dmpImg"
              :loading="dmpLoading"
              loadingText="Loading Data Management Plan infos..."
              :markdownContent="dmpMarkdownText"
            />
          </v-window-item>

          <!-- imprint page -->
          <v-window-item :key="tabs[4].name">
            <about-tab-layout
              title="Imprint"
              :titleImage="imprintImg"
              :loading="false"
              loadingText="Loading Imprint infos..."
              :markdownContent="imprintMarkdownText"
            />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * The about page of EnviDat. It consists of:
 * - TitleImage and Title (ImgAndTextLayout)
 * - Different Card with infomation about some about topics (ExpandableCard)
 *
 * @summary about page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2021-01-06 17:06:33
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mapGetters, mapState } from 'vuex';

import {
  mdiBookOpenVariant,
  mdiInformation,
  mdiLibrary,
  mdiShieldCheckOutline,
  mdiFingerprint,
} from '@mdi/js';

import { ABOUT_PAGENAME } from '@/router/routeConsts';
import orga from '@/assets/about/EnviDat_organigram.png';
import { renderMarkdown } from '@/factories/stringFactory';
import ExpandableCard from '@/modules/about/components/ExpandableCard.vue';
import {
  ABOUT_NAMESPACE,
  GET_DMP,
  GET_GUIDELINES,
  GET_IMPRINT,
  GET_POLICIES,
} from '@/modules/about/store/aboutMutationsConsts';

import AboutTabLayout from '@/modules/about/components/AboutTabLayout.vue';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

export default {
  name: 'AboutPage',
  /**
   * @description beforeRouteEnter is used to change background image of this page.
   * It's called via vue-router.
   */
  beforeMount() {
    this.$store.dispatch(`${ABOUT_NAMESPACE}/${GET_POLICIES}`);
    this.$store.dispatch(`${ABOUT_NAMESPACE}/${GET_GUIDELINES}`);
    this.$store.dispatch(`${ABOUT_NAMESPACE}/${GET_DMP}`);
    this.$store.dispatch(`${ABOUT_NAMESPACE}/${GET_IMPRINT}`);
  },
  /**
   * @description reset the scrolling to the top,
   * because of the scrolling is set from the browsePage or metaDetailPage
   */
  mounted() {
    window.scrollTo(0, 0);

    this.checkRouteChanges();
  },
  methods: {
    checkRouteChanges() {
      const paramTab = this.$route.params.tab
        ? this.$route.params.tab.toLowerCase()
        : null;

      if (paramTab) {
        this.navigateTab(paramTab);
      }
    },
    catchTabClick(tabName) {
      if (this.$route.params?.tab !== tabName) {
        this.$router.push({
          name: ABOUT_PAGENAME,
          params: { tab: tabName },
        });
      }
    },
    navigateTab(tabName) {
      const tabObjs = this.tabs.filter((tab) => tab.name === tabName);

      if (tabObjs.length > 0) {
        const tabObj = tabObjs[0];
        this.activeTab = this.tabs.indexOf(tabObj);
      }
    },
    mergeAboutInfo(defaultAboutInfo, backendAboutInfos, defaultWidthClass) {
      const mergedAboutInfo = [];

      for (let j = 0; j < backendAboutInfos.length; j++) {
        const bInfo = backendAboutInfos[j];
        let defaultMatch = false;

        for (let i = 0; i < defaultAboutInfo.length; i++) {
          const dInfo = defaultAboutInfo[i];

          if (bInfo.title === dInfo.title) {
            const mergedInfo = {
              title: bInfo.title,
              text: bInfo.text || dInfo.text,
              img: bInfo.img || dInfo.img,
              widthClass:
                bInfo.widthClass || dInfo.widthClass || defaultWidthClass,
            };

            mergedAboutInfo.push(mergedInfo);

            defaultMatch = true;
            break;
          }
        }

        if (!defaultMatch) {
          mergedAboutInfo.push({
            title: bInfo.title,
            text: bInfo.text,
            img: bInfo.img,
            widthClass: bInfo.widthClass || defaultWidthClass,
          });
        }
      }

      return mergedAboutInfo;
    },
  },
  watch: {
    $route: function watchRouteChanges() {
      this.checkRouteChanges();
    },
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters({
      guidelinesMarkdown: `${ABOUT_NAMESPACE}/guidelinesMarkdown`,
      guidelinesLoading: `${ABOUT_NAMESPACE}/guidelinesLoading`,
      policiesMarkdown: `${ABOUT_NAMESPACE}/policiesMarkdown`,
      policiesLoading: `${ABOUT_NAMESPACE}/policiesLoading`,
      imprintLoading: `${ABOUT_NAMESPACE}/imprintLoading`,
      imprintMarkdown: `${ABOUT_NAMESPACE}/imprintMarkdown`,
      dmpMarkdown: `${ABOUT_NAMESPACE}/dmpMarkdown`,
      dmpLoading: `${ABOUT_NAMESPACE}/dmpLoading`,
    }),
    aboutCardInfo() {
      const backendAboutInfos = this.config?.aboutInfo || null;

      const defaultWidthClass = 'v-col-12 v-col-sm-6 v-col-md-4 v-col-xl-3';

      const defaultAboutInfo = [
        {
          title: 'Contact',
          text: 'Contact the EnviDat team by <a href="mailto:envidat@wsl.ch">envidat@wsl.ch</a> for support, quesitons or feedback.',
          img: 'contact',
          defaultWidthClass,
        },
        {
          title: 'Our Mission',
          text: 'EnviDat is the environmental data portal and repository developed by the Swiss Federal Research Institute WSL. We have the capability to integrate, host and publish data sets. We make environmental monitoring and research data accessible. <p><a href="https://www.wsl.ch/en/about-wsl/programmes-and-initiatives/envidat.html" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >More about EnviDat as Program of WSL</a></p>',
          img: 'hands_small',
          defaultWidthClass,
        },
        {
          title: 'Concept',
          text: 'EnviDat supports the user-friendly registration, documentation, storage, publication, search and retrieval of data sets from the environmental domain. We provide various services to our users and we follow a set of principles as summarized in our concept image below. Additional detailed information can be found in our <a href="https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:18703" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >concept paper on DORA</a>.',
          img: 'concept_small',
          defaultWidthClass,
        },
        {
          title: 'Community',
          text: 'With EnviDat, WSL aims to disseminate its data sets as broadly as possible in order to foster international research cooperation in the field of environmental science and contribute to the ongoing cultural evolution in research towards openness, shared data and opportunities for collaboration. Consequently, we are registered in <a href="https://fairsharing.org/biodbcore-001178/" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >FAIRsharing.org</a> and <a href="https://www.re3data.org/repository/r3d100012587" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >re3data.org</a> and a contributor community to <a href="https://geoportal.org/community/envidat-community" target="_blank" onclick="event.stopPropagation();" >ESA Geoportal </a>, <a href="https://gcmd.nasa.gov/search/Titles.do?AutoDisplayTitles=true&subset=envidat#titles" target="_blank" onclick="event.stopPropagation();" >NASA GCMD, <a href="https://opendata.swiss/en/organization/envidat" target="_blank" onclick="event.stopPropagation();" >OPENDATA Swiss</a></a> and <a href="https://b2find.eudat.eu/organization/envidat" target="_blank" onclick="event.stopPropagation();" >EOSC-Hub via B2FIND</a>. ',
          img: 'community_small',
          defaultWidthClass,
        },
        {
          title: 'WSL',
          text: 'The Swiss Federal Institute for Forest, Snow and Landscape Research is concerned with the use, development and protection of natural and urban spaces. The focus of our research is on solving problems to do with the responsible use of landscapes and forests and a prudent approach to natural hazards, especially those common in mountainous countries. WSL occupies a leading position internationally in these research areas. We also provide groundwork for sustainable environmental policies in Switzerland. <p><a href="https://www.wsl.ch" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >For more information have a look at the Website of WSL</a></p>',
          img: 'wslLogo',
          defaultWidthClass,
        },
        {
          title: 'Team',
          /* eslint-disable prefer-template */
          text:
            '<img src="' +
            this.orga +
            '" style="width: 100%; height: 100%;" />',
          img: 'team_small',
          defaultWidthClass: 'v-col-12 v-col-sm-12 v-col-md-8',
        },
      ];

      if (!backendAboutInfos) {
        return defaultAboutInfo;
      }

      return this.mergeAboutInfo(
        defaultAboutInfo,
        backendAboutInfos,
        defaultWidthClass,
      );
    },
    missionImg() {
      return this.$vuetify.display.mdAndUp
        ? 'mission'
        : 'mission_small';
    },
    policiesMarkdownText() {
      return renderMarkdown(this.policiesMarkdown);
    },
    policiesImg() {
      return this.$vuetify.display.mdAndUp
        ? 'policies'
        : 'policies_small';
    },
    guidelinesMarkdownText() {
      return renderMarkdown(this.guidelinesMarkdown);
    },
    guidelineImg() {
      return this.$vuetify.display.mdAndUp
        ? 'guidelines'
        : 'guidelines_small';
    },
    dmpImg() {
      return this.$vuetify.display.mdAndUp ? 'dmp' : 'dmp_small';
    },
    imprintImg() {
      return this.$vuetify.display.mdAndUp ? 'team' : 'team_small';
    },
    dmpMarkdownText() {
      return renderMarkdown(this.dmpMarkdown);
    },
    imprintMarkdownText() {
      return renderMarkdown(this.imprintMarkdown);
    },
  },
  components: {
    BaseIcon,
    ExpandableCard,
    AboutTabLayout,
  },
  data: () => ({
    orga,
    activeTab: null,
    tabs: [
      {
        name: 'about',
        icon: mdiInformation,
      },
      {
        name: 'guidelines',
        icon: mdiLibrary,
      },
      {
        name: 'policies',
        icon: mdiShieldCheckOutline,
      },
      {
        name: 'dmp',
        icon: mdiBookOpenVariant,
      },
      {
        name: 'imprint',
        icon: mdiFingerprint,
      },
    ],
  }),
};
</script>

<style>
/* Overwrite tab style vuetify, needed for smallscreen */
.v-slide-group__prev--disabled {
  display: none !important;
}
</style>

<style scoped>
/* Overwrite default vuetify background class */
.theme--light.v-tabs-items {
  background-color: transparent;
}
</style>
