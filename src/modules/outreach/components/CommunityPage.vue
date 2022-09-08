<template>
  <v-container class="pa-0 ma-0"
                tag="article"
                fluid
                id="CommunityPage" >

    <v-row no-gutters
           id="pageHeader"
           class="py-1 py-md-4">

      <v-col cols="12"
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
             md="10" >

        <TextCardListLayout :listItems="entries"
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
  BLOG_NAMESPACE,
  CLOSE_BLOG_POST,
  GET_BLOG_LIST,
  GET_BLOG_POST,
} from '@/modules/blog/store/blogMutationsConsts';

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
    this.$store.dispatch(`${BLOG_NAMESPACE}/${GET_BLOG_LIST}`);

    this.fallbackCardImg = this.mixinMethods_getWebpImage('about/contact', this.$store.state);
  },
  /**
   * @description reset the scrolling to the top,
   * because of the scrolling is set from the browsePage or metaDetailPage
   */
  mounted() {
    window.scrollTo(0, 0);

    this.checkRouteChanges();
  },
  computed: {
    ...mapState([
      'config',
    ]),
    ...mapState(BLOG_NAMESPACE, [
      'loadingList',
      'loadingPost',
      'list',
      'post',
      'postContent',
    ]),
    showBlogPost() {
      return this.post && this.postContent;
    },
    blogHeaderTitle() {
      if (this.showBlogPost) {
        return this.post.title;
      }

      return 'EnviDat Blog';
    },
    blogHeaderImg() {
      if (this.showBlogPost) {
        return this.mixinMethods_getWebpImage('blog/postHeader', this.$store.state);
      }

      return this.mixinMethods_getWebpImage('blog/blogHeader', this.$store.state);
    },
  },
  updated() {
    this.setBlogBodyHeight();
  },
  methods: {
    setBlogBodyHeight() {
      let bodyHeaderHeight = 150;
      const TheNavigationToolbar = 36;
      const padding = 32;

      if (this.$refs?.blogHeader) {
        bodyHeaderHeight = this.$refs.blogHeader.clientHeight ? this.$refs.blogHeader.clientHeight : bodyHeaderHeight;
      }

      this.blogBodyHeight = bodyHeaderHeight + TheNavigationToolbar + padding;
    },
    checkRouteChanges() {
      const post = this.$route.params?.post || null;
      
      if (post) {
        this.loadPost(post);
      } else {
        this.clearPost();
      }
    },
    catchPostClick(post) {

      if (this.$route.params?.post !== post) {
        this.$router.push({
          name: BLOG_PAGENAME,
          params: { post },
        });
      }
    },
    loadPost(postFile) {
      if (this.post !== postFile) {
        this.$store.dispatch(`${BLOG_NAMESPACE}/${GET_BLOG_POST}`, postFile);
      }
    },
    catchClosePost() {
      this.$router.push({
        path: BLOG_PATH,
        params: { post: null},
      });
    },
    clearPost() {
      this.$store.commit(`${BLOG_NAMESPACE}/${CLOSE_BLOG_POST}`);
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
    fallbackCardImg: null,
    pageTitle: 'EnviDat Community',
    pageIntroText: '',
  }),
};
</script>

<style scoped>

</style>
