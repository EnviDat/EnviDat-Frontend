<template>
  <v-container class="pa-0 ma-0"
                tag="article"
                fluid
                id="CommunityPage" >

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
           id="pageBody"
           class="py-1 py-md-4">

      <v-col cols="12"
             offset-md="1"
             md="10" >

        <TextCardListLayout :listItems="list"
                            :loading="loadingList"
                            :loadingImg="fallbackCardImg">
          <template #entry="{ entry, loadingImg, titleCssClass, subtitleCssClass }">
            <ImageTextCard
                :height="300"
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

import {
  mapState,
} from 'vuex';

import {
  BLOG_PAGENAME,
  BLOG_PATH,
} from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import {
  COMMUNITY_NAMESPACE,
  GET_COMMUNITY_LIST,
} from '@/modules/community/store/communityMutationsConsts';

import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout';
import TextCardListLayout from '@/components/Layouts/TextCardListLayout';
import ImageTextCard from '@/components/Layouts/ImageTextCard';

export default {
  name: 'CommunityPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, BLOG_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  beforeMount() {
    this.$store.dispatch(`${COMMUNITY_NAMESPACE}/${GET_COMMUNITY_LIST}`);

    this.fallbackCardImg = this.mixinMethods_getWebpImage('about/contact', this.$store.state);
    this.titleImage = this.mixinMethods_getWebpImage('about/guidelines', this.$store.state);
  },
  /**
   * @description reset the scrolling to the top,
   * because of the scrolling is set from the browsePage or metaDetailPage
   */
  mounted() {
    window.scrollTo(0, 0);

    this.loadCommunityList();
  },
  computed: {
    ...mapState([
      'config',
    ]),
    ...mapState(COMMUNITY_NAMESPACE, [
      'loadingList',
      'list',
    ]),
  },
  methods: {
    loadCommunityList() {
      this.$store.dispatch(`${COMMUNITY_NAMESPACE}/${GET_COMMUNITY_LIST}`);
    },
  },
  watch: {
    $route() {
      this.checkRouteChanges();
    },
  },
  components: {
    TextCardListLayout,
    ImgAndTextLayout,
    ImageTextCard,
  },
  data: () => ({
    PageBGImage: 'app_b_browsepage',
    pageTitle: 'EnviDat Community',
    pageIntroText: '',
    fallbackCardImg: null,
    titleImage: null,
  }),
};
</script>

<style scoped>

</style>
