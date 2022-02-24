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
                 :lazy-src="loadingImg"
                 :style="`border-bottom-left-radius: 4px; border-top-left-radius: 4px;`"
                 :src="post.titleImg" />
        </v-col>

        <v-col cols="7" class="text-h5 px-4"
               align-self="center" >
          {{ post.title }}
          <div class="text-body-1">
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
  },
  computed: {
  },
};
</script>

<style scoped>

</style>
