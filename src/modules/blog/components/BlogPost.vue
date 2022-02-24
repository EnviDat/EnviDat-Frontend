<template>

  <div v-html="postContentMarkdown" >

  </div>
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
    post: Object,
    postContent: String,
  },
  computed: {
    postContentMarkdown() {
      return renderMarkdown(this.postContent);
    },
  },
};
</script>

<style scoped>

</style>
