<template>
  <v-card ripple
          hover
          @click="$emit('clicked')"
          >

    <v-container class="pa-0">

      <v-row no-gutters class="pa-0">

        <v-col cols="5">
          <v-img class="imagezoom"
                 contain
                 :style="`border-bottom-left-radius: 4px; border-top-left-radius: 4px;`"
                 :src="loadingImg"  />

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

    </v-container>

  </v-card>

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

export default {
  name: 'BlogPost',
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
  },
  computed: {
  },
};
</script>

<style scoped>

</style>
