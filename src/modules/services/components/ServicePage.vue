<template>
  <v-container class="pa-0 ma-0"
    tag="article"
    fluid
    :id="SERVICE_PAGENAME">

    <v-row no-gutters
      id="pageHeader"
      class="py-1 py-md-4">

      <v-col cols="12"
        offset-md="1"
        md="10">

        <ImgAndTextLayout style="position: relative; z-index: 0;"
          :title="pageTitle"
          :img="titleImage"
          :height="$vuetify.display.smAndDown ? 100 : 150" />

      </v-col>

    </v-row>

    <v-row no-gutters
      id="pageSubHeader"
      class="py-2">

      <v-col cols="12"
        offset-md="1"
        md="10"
        class="text-body-1"
        v-html="pageIntroText">

      </v-col>

    </v-row>

    <v-row no-gutters
      id="pageBody"
      class="py-4">

      <v-col cols="12"
        offset-md="1"
        md="10">

        <TextCardListLayout :listItems="list"
          :smallCols="6"
          :mediumCols="4"
          subtitleCssClass="text-body-2"
          :loading="loadingList"
          :loadingImg="fallbackCardImg">

          <template #entry="{ entry, loadingImg, titleCssClass, subtitleCssClass }">
            <ImageTextCard :height="cardHeight"
              :title="entry.title"
              :text="entry.text"
              :image="entry.image"
              :loadingImg="loadingImg"
              :titleCssClass="titleCssClass"
              :subtitleCssClass="subtitleCssClass">

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

import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout.vue';
import TextCardListLayout from '@/components/Layouts/TextCardListLayout.vue';
import ImageTextCard from '@/components/Layouts/ImageTextCard.vue';
import { renderMarkdown } from '@/factories/stringFactory';
import { getImage } from '@/factories/imageFactory';

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

    this.fallbackCardImg = getImage('contact');
    this.titleImage = getImage('service_header');
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
    cardHeight() {
      if (this.$vuetify?.display?.sm) {
        return 210;
      }

      return this.$vuetify?.display.mdAndUp ? 220 : undefined;
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
    PageBGImage: getImage('app_b_browsepage'),
    pageTitle: 'Tools & Services',
    pageIntroText: 'List of the Research Data Management (RDM) tools and services currently provided for WSL employees by WSL IT and EnviDat. <a href="mailto:envidat@wsl.ch" >Get in touch</a> with the EnviDat team for consulting on services, tools or any other requests.',
    fallbackCardImg: null,
    titleImage: null,
    SERVICE_PAGENAME,
  }),
};
</script>

<style scoped></style>
