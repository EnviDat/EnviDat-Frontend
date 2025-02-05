<template>
  <v-card
    ripple
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="fill-height pa-4 elevation-10 rounded-xl"
    :dark="false"
  >
    <!-- :style="{ backgroundColor: categoryColor }" -->
    <!-- <v-card-title primary-title class="pa-0"> -->

    <v-container class="ma-2 fill-height category-card">
      <v-chip
        class="outlined flat pa-0 mb-4 d-flex aling-center justify-center"
        style="width: 100%; max-width: 150px;"
        size="x-large"
        color="secondary"
      >
        <span class="text-subtitle-1 font-weight-bold">Blog article</span>
      </v-chip>
      <v-row class="category-title w-100">
        <v-col cols="12">
          <span class="text-h6 font-weight-bold">{{ postTitle }}</span>
        </v-col>
      </v-row>
      <v-row class="category-subtitle">
        <v-col>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam eos
          saepe explicabo. Blanditiis cumque officia enim velit suscipit tenetur
          distinctio eveniet, dolorum perferendis, nulla commodi amet, magnam
          sunt nam repudiandae.
        </v-col>
      </v-row>
      <v-row class="category-action">
        <v-col class="d-flex justify-space-between">
          <!-- class="primary" -->
          <div v-if="postDate" class="text-body-1">
            {{ postDate }}
          </div>
          <v-btn rounded="xl" :color="'primary'" @click="cardClick"
            >Read</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
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
    postTitle: String,
    postDate: String,
    titleImg: String,
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
  computed: {},
  methods: {
    cardClick() {
      this.$emit('clicked');
    },
  },
};
</script>

<style scoped></style>
