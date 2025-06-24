<template>
  <v-container class="pa-0 ma-0" tag="article" fluid :id="BLOG_PAGENAME">
    <v-row no-gutters ref="blogHeader" class="py-1 py-md-4">
      <v-col cols="12" md="10" offset-md="1">
        <BlogHeader
          :title="blogHeaderTitle"
          :titleImage="titleImage"
          :height="$vuetify.display.smAndDown ? 100 : 150"
          :showCloseButton="!!showBlogPost"
          @clickedBack="catchClosePost"
        />
      </v-col>
    </v-row>

    <v-row no-gutters id="blogSubHeader" class="py-2">
      <v-col
        cols="12"
        offset-md="1"
        md="10"
        class="text-body-1"
        v-html="pageIntroText"
      >
      </v-col>
    </v-row>

    <v-row no-gutters ref="blogBody" class="py-1 py-md-4">
      <v-col v-if="showBlogPost" cols="12" md="10" offset-md="1">
        <BlogPost :post="post" :postContent="postContent" />
      </v-col>

      <v-col
        v-if="!showBlogPost && loadingList"
        class="pt-3"
        cols="12"
        md="10"
        offset-md="1"
      >
        Loading the blog entries...
      </v-col>

      <v-col
        v-if="!showBlogPost && !loadingList"
        class="pt-3"
        cols="12"
        md="10"
        offset-md="1"
      >
        <v-row no-gutters>
          <v-col
            v-for="(post, index) in list"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            class="pa-2"
          >
            <BlogPostCard
              :postTitle="post.title"
              :titleCssClass="
                $vuetify.display.smAndDown ? 'text-h6 px-4' : undefined
              "
              :postDate="post.date"
              :titleImg="post.titleImg"
              :loadingImg="fallbackCardImg"
              height="200"
              @clicked="catchPostClick(post.postFile)"
            />
          </v-col>
        </v-row>
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

import { BLOG_PAGENAME, BLOG_PATH } from '@/router/routeConsts';

import {
  BLOG_NAMESPACE,
  CLOSE_BLOG_POST,
  GET_BLOG_LIST,
  GET_BLOG_POST,
} from '@/modules/blog/store/blogMutationsConsts';

import BlogHeader from '@/modules/blog/components/BlogHeader.vue';
import BlogPost from '@/modules/blog/components/BlogPost.vue';
import BlogPostCard from '@/modules/blog/components/BlogPostCard.vue';


export default {
  name: BLOG_PAGENAME,
  created() {
    this.blogModuleLoaded = !!this.$store?.state?.blog;

    this.$store?.watch(
      (state) => state.blog,
      (value) => {
        this.blogModuleLoaded = !!value;
      },
    );
  },
  beforeMount() {
    this.$store.dispatch(`${BLOG_NAMESPACE}/${GET_BLOG_LIST}`);
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
    ...mapState(['config']),
    ...mapState(BLOG_NAMESPACE, [
      'loadingList',
      'loadingPost',
      'list',
      'post',
      'postContent',
    ]),
    showBlogPost() {
      return !this.loadingPost && this.post && this.postContent;
    },
    titleImage() {
      if (!this.loadingPost && this.post) {
        return this.post.titleImg;
      }

      return this.blogHeaderImg;
    },
    blogHeaderTitle() {
      if (this.showBlogPost) {
        return this.post.title;
      }

      return 'EnviDat Blog';
    },
    blogHeaderImg() {
      if (this.showBlogPost) {
        return 'postHeader';
      }

      return 'blogHeader';
    },
  },
  methods: {
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
      this.$router.push(BLOG_PATH);
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
    BlogPost,
    BlogHeader,
    BlogPostCard,
  },
  data: () => ({
    titleImageResolved: undefined,
    BLOG_PAGENAME,
    fallbackCardImg: 'contact',
    pageIntroText:
      'The EnviDat blog page provides news and information from the EnviDat team. Click on a card to read the blog post, click the close icon in the top right to go back to the overview.',
    blogModuleLoaded: false,
  }),
};
</script>

<style scoped></style>
