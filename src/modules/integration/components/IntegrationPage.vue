<template>
  <v-container class="pa-0 ma-0" tag="article" fluid id="CommunityPage">
    <v-row no-gutters id="pageHeader" class="py-1 py-md-4">
      <v-col cols="12" offset-md="1" md="10">
        <ImgAndTextLayout
          style="position: relative; z-index: 0"
          :title="pageTitle"
          :img="titleImage"
          :height="$vuetify.display.smAndDown ? 100 : 150"
        />
      </v-col>
    </v-row>

    <v-row no-gutters id="pageSubHeader" class="py-2">
      <v-col
        cols="12"
        offset-md="1"
        md="10"
        class="text-body-1"
        v-html="pageIntroText"
      >
      </v-col>
    </v-row>

    <v-row no-gutters id="pageBody" class="py-4">
      <v-col cols="12" offset-md="1" md="10">
        <TextCardListLayout
          :listItems="list"
          :smallCols="4"
          :loading="loadingList"
          :loadingImg="fallbackCardImg"
        >
          <template
            #entry="{ entry, loadingImg, titleCssClass, subtitleCssClass }"
          >
            <ImageTextCard
              :height="cardHeight"
              :title="entry.title"
              :text="entry.text"
              :image="entry.image"
              :loadingImg="loadingImg"
              :titleCssClass="titleCssClass"
              :subtitleCssClass="subtitleCssClass"
              :imageTopLayout="true"
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

import { INTEGRATION_PAGENAME } from '@/router/routeConsts';

import { SET_CURRENT_PAGE } from '@/store/mainMutationsConsts';

import {
  INTEGRATION_NAMESPACE,
  GET_INTEGRATION_LIST,
} from '@/modules/integration/store/integrationMutationsConsts';

import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout.vue';
import TextCardListLayout from '@/components/Layouts/TextCardListLayout.vue';
import ImageTextCard from '@/components/Layouts/ImageTextCard.vue';
import { getImage } from '@/factories/imageFactory';

export default {
  name: INTEGRATION_PAGENAME,
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, INTEGRATION_PAGENAME);
    });
  },
  beforeMount() {
    this.loadCommunityList();

    this.fallbackCardImg = getImage('contact');
    this.titleImage = getImage('integration_header');
  },
  /**
   * @description reset the scrolling to the top,
   * because of the scrolling is set from the browsePage or metaDetailPage
   */
  mounted() {
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapState(['config']),
    ...mapState(INTEGRATION_NAMESPACE, ['loadingList', 'list']),
    cardHeight() {
      return this.$vuetify?.display?.smAndDown ? 350 : 300;
    },
  },
  methods: {
    loadCommunityList() {
      this.$store.dispatch(`${INTEGRATION_NAMESPACE}/${GET_INTEGRATION_LIST}`);
    },
  },
  components: {
    TextCardListLayout,
    ImgAndTextLayout,
    ImageTextCard,
  },
  data: () => ({
    pageTitle: 'Community Integration',
    pageIntroText: `With EnviDat, WSL aims to disseminate its data sets as broadly as possible in order to foster international research cooperation in the field of environmental science and contribute to the ongoing cultural evolution in research towards openness, shared data and opportunities for collaboration.
    Consequently, we are officially registered in re3data.org and FAIRsharing.org and a contributor community to NASA Earthdata, ESA's GEOSS Portal and data.europa.eu via opendata.swiss.`,
    fallbackCardImg: null,
    titleImage: null,
  }),
};
</script>

<style scoped></style>
