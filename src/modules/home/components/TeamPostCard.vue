<template>
  <v-card
    ripple
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="pa-4 elevation-10 rounded-xl"
    :dark="false"
  >
    <v-container class="ma-2 fill-height category-card">
      <v-chip
        class="outlined flat pa-0 mb-4 d-flex aling-center justify-center"
        style="width: 100%; max-width: 150px"
        size="x-large"
        color="#aab2ff"
      >
        <span class="text-subtitle-1 font-weight-bold">Envidat Team</span>
      </v-chip>
      <v-row class="category-title w-100">
        <v-col cols="12">
          <span class="text-h6 font-weight-bold">{{ postTitle }}</span>
        </v-col>
      </v-row>
      <v-row class="category-subtitle">
        <v-col>
          <div v-html="postText"></div>
        </v-col>
      </v-row>
      <v-row class="category-action">
        <v-col class="d-flex justify-space-between">
          <!-- class="primary" -->
          <div v-if="postDate" class="text-body-1">
            {{ postDate }}
          </div>
          <v-btn v-if="showButton" :color="'secondary'" @click="cardClick"
            >View</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { type } from '@amcharts/amcharts5';

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
    postText: {
      type: String,
      default: '',
    },
    showButton: {
      type: Boolean,
      default: false,
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
