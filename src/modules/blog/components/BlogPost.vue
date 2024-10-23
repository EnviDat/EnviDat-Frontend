<template>
  <div id="blogPostContent"
       class="blogPost"
       v-html="postContentMarkdown"></div>
</template>

<script>
/**
 * BlogPost.vue shows the content of a post
 *
 * @summary
 * @author Dominik Haas-Artho
 *
 * Created at     : 2022-02-17
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { renderMarkdown } from '@/factories/stringFactory';

export default {
  name: 'BlogPost',
  props: {
/*
    post: Object,
*/
    postContent: String,
  },
  computed: {
    postContentMarkdown() {
      return renderMarkdown(this.postContent);
    },
  },
};
</script>

<style>
.blogPost {
  img {
    max-width: 100%;
    border-radius: 5px;
  }

  h1 + p,
  h2 + p {

    &::first-letter {
      font-size: 2rem;
      font-family: 'Baskervville', serif !important;
    }
  }

}

p {
  text-wrap: pretty;
}


</style>
