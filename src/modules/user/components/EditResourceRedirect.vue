<template>
  <v-card class="pa-4">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ title }}</div>
        </v-col>
      </v-row>

      <v-row no-gutters align="center" class="pt-6">
        <v-col cols="1">
          <BaseIcon style="animation: progress-circular-rotate 3s linear infinite" :icon="mdiCog" color="secondary" />
        </v-col>

        <v-col class="text-h5" cols="11"> Under construction! </v-col>

        <v-col class="pt-2 text-body-1" v-html="text"> </v-col>
      </v-row>

      <v-row no-gutters class="pt-6">
        <v-col>
          <BaseRectangleButton :buttonText="buttonText" color="secondary" :url="buttonUrl" />
        </v-col>

        <v-col>
          <slot name="default"></slot>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditResourceRedirect.vue shows a explaination text and a button to redirect editing
 * in the ckan frontend
 *
 * @summary shows coming soon and redirect botton
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mdiCog } from '@mdi/js';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

export default {
  name: 'EditResourceRedirect',
  components: {
    BaseIcon,
    BaseRectangleButton,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
    buttonUrl: {
      type: String,
      default: null,
    },
  },
  computed: {},
  data: () => ({
    mdiCog,
  }),
};
</script>

<style scoped></style>
