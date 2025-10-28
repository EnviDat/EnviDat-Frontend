<template>
  <v-card class="pa-4" id="EditImgPlaceholder">
    <v-row v-if="title">
      <v-col>
        <div class="text-h5">{{ title }}</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="text-subtitle-1">
          <span class="text-red">{{ disclaimer }}</span>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="img">
      <v-col>
        <v-img :src="img" style="border-radius: 8px" />
      </v-col>
    </v-row>

    <v-row v-if="!img">
      <v-col cols="12" class="text-red">
        {{
          'Given image not found! If you see this please conact envidat@wsl.ch to let the team know something is broken!'
        }}
      </v-col>
      <v-col>
        <v-img :src="notFoundImg" style="max-width: 800px; border-radius: 8px" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
/**
 * EditImgPlaceholder.vue renders a component title, disclaimer, and an image
 *
 * @summary Renders a component title, disclaimer, and image
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2020-08-31
 * Last modified  : 2021-09-01 11:16:45
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import notFoundImg from '@/modules/user/assets/imageNotFound.jpg';

export default {
  name: 'EditImgPlaceholder',
  data: () => ({
    notFoundImg,
  }),
  props: {
    title: String,
    disclaimer: {
      type: String,
      default: 'Please note that the screenshot below will serve as a preview for the future component.',
    },
    img: String,
  },
  computed: {},
  methods: {},
  components: {},
};
</script>
