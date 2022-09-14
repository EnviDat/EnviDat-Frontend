<template>
  <v-container class="pa-0 ma-0"
                tag="article"
                fluid
                :id="SERVICE_PAGENAME" >

    <v-row no-gutters
           id="pageHeader"
           class="py-1 py-md-4">

      <v-col cols="12"
             offset-md="1"
             md="10" >

        <ImgAndTextLayout style="position: relative; z-index: 0;"
                          :title="pageTitle"
                          :img="titleImage"
                          :height="$vuetify.breakpoint.smAndDown ? 100 : 150" />

      </v-col>

    </v-row>

    <v-row no-gutters
           id="pageSubHeader"
           class="py-1 py-md-4">

      <v-col cols="12"
             offset-md="1"
             md="10" >

        <div v-html="pageIntroText"></div>
      </v-col>

    </v-row>

    <v-row no-gutters
           id="pageBody"
           style="overflow: hidden auto; "
           :style="`height: calc(100vh - ${headerHeight}px);`"

           class="py-1 py-md-4">

      <v-col cols="12"
             offset-md="1"
             md="10" >

        <TextCardListLayout :listItems="serviceList"
                            :smallCols="4"
                            subtitleCssClass="text-body-2"
                            :loading="loadingList"
                            :loadingImg="fallbackCardImg">

          <template #entry="{ entry, loadingImg, titleCssClass, subtitleCssClass }">
            <ImageTextCard
                :height="cardHeight"
                :title="entry.title"
                :text="entry.text"
                :image="entry.image"
                :loadingImg="loadingImg"
                :titleCssClass="titleCssClass"
                :subtitleCssClass="subtitleCssClass"
            >

            </ImageTextCard>
          </template>
        </TextCardListLayout>

      </v-col>

    </v-row>

  </v-container>
</template>

<script>
/**
 * The blog page of EnviDat. It shows either a list of posts or a specific post
 *
 * @summary blog page
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapState } from 'vuex';
import { SERVICE_PAGENAME } from '@/router/routeConsts';

import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import {
  SERVICE_NAMESPACE,
  GET_SERVICE_LIST,
} from '@/modules/services/store/serviceMutationsConsts';

import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout';
import TextCardListLayout from '@/components/Layouts/TextCardListLayout';
import ImageTextCard from '@/components/Layouts/ImageTextCard';
import { renderMarkdown } from '@/factories/stringFactory';

import imageNotFound from '@/modules/services/assets/imageNotFound.jpg';

export default {
  name: SERVICE_PAGENAME,
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, SERVICE_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  beforeMount() {
    this.loadServiceList();

    this.fallbackCardImg = this.mixinMethods_getWebpImage('about/contact', this.$store.state);
    this.titleImage = this.mixinMethods_getWebpImage('about/mission', this.$store.state);
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
      'config',
    ]),
    ...mapState(SERVICE_NAMESPACE, [
      'loadingList',
      'list',
    ]),
    serviceList() {
      const serviceList = [...this.list];

      if (serviceList.length > 0) {
        serviceList.push({
          title: 'Missing a Something?',
          image: this.missingCardImage,
          text: 'Missing a service, a tool or a feature? Let us know via <a href="mailto:envidat@wsl.ch" >envidat@wsl.ch</a>.',
        });
      }

      return serviceList;
    },
    cardHeight() {
      return 200;
      // return this.$vuetify?.breakpoint?.smAndDown ? 350 : 300;
    },
  },
  methods: {
    loadServiceList() {
      this.$store.dispatch(`${SERVICE_NAMESPACE}/${GET_SERVICE_LIST}`);
    },
    markdownText(text) {
      return renderMarkdown(text);
    },
  },
  components: {
    TextCardListLayout,
    ImgAndTextLayout,
    ImageTextCard,
  },
  data: () => ({
    PageBGImage: 'app_b_browsepage',
    pageTitle: 'Tools & Services',
    pageIntroText: 'List of the Research Data Management (RDM) tools and services currently provided for WSL employees by WSL IT and EnviDat. <a href="mailto:envidat@wsl.ch" >Get in touch</a> with the EnviDat team for consulting on services, tools or any other requests.',
    fallbackCardImg: null,
    titleImage: null,
    headerHeight: 320,
    SERVICE_PAGENAME,
    missingCardImage: imageNotFound,
  }),
};
</script>

<style scoped>

</style>
