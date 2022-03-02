<template>
  <v-card ripple
          hover
          :height="height"
          @click="$emit('clicked')"
          >

      <v-row no-gutters
             class="pa-0">

        <v-col cols="5"
               class="pa-0">

          <v-img class="imagezoom"
                 :height="height"
                 :aspect-ratio="1"
                 :style="`border-bottom-left-radius: 4px; border-top-left-radius: 4px;`"
                 :lazy-src="loadingImg"
                 :src="post.titleImg"  />

        </v-col>

        <v-col cols="7"
               class="px-2"
               :class="titleCssClass"
               align-self="center" >
          {{ post.title }}

          <div :class="subtitleCssClass">
            {{ post.date }}
          </div>
        </v-col>
      </v-row>

  </v-card>

</template>

<script>
/**
 * BlogPostCard shows the content the title of a post
 *
 * @summary BlogPostCard shows the content the title of a post
 * @author Dominik Haas-Artho
 *
 * Created at     : 2022-02-17
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'BlogPostCard',
  props: {
    post: Object,
    loadingImg: String,
    titleCssClass: {
      type: String,
      default: 'text-h5',
    },
    subtitleCssClass: {
      type: String,
      default: 'text-body-1',
    },
    height: String,
  },
  computed: {
  },
};
</script>

<style scoped>

</style>
