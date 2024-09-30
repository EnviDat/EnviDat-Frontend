<template>
  <v-card>
    <v-container class="pa-0" fluid>
      <v-row no-gutters>
        <v-col
          class="py-0 pr-sm-0"
          cols="12"
          sm="5"
          :style="buttonCallback ? 'cursor: pointer;' : ''"
          @click="buttonCallback ? buttonCallback : ''"
        >
          <v-img
            class="imagezoom"
            cover
            :aspect-ratio="1"
            :src="sloganImg ? sloganImg : fallbackImg"
            style="min-height: 100%; border-top-left-radius: 4px;"
            :style="
              `max-height: ${maxHeight}px; border-bottom-left-radius: ${ $vuetify.display.smAndUp ? 4 : 0 }px;
              border-top-right-radius: ${ $vuetify.display.xs ? 4 : 0 }px;`
            "
          />
        </v-col>

        <v-col class="pa-4" cols="12" sm="7">
          <div
            class="hidden-sm-and-down envidatSlogan text-h4 pb-4"
            v-html="slogan"
          ></div>
          <div
            class="hidden-xs hidden-md-and-up envidatSlogan text-h5 pb-5"
            v-html="slogan"
          ></div>
          <div
            class="hidden-sm-and-up envidatSlogan text-h5 pb-5"
            style="text-align: center;"
            v-html="slogan"
          ></div>

          <div
            :class="hasButtons ? 'pb-5 mb-5' : 'pb-0'"
            v-html="subSlogan"
          ></div>
        </v-col>
      </v-row>
    </v-container>

    <v-card-actions
      v-if="hasButtons"
      class="ma-0 pa-4"
      style="position: absolute; bottom: 0; right: 0;"
    >
      <base-rectangle-button
        v-if="moreButtonText && moreButtonCallback"
        marginClass="mr-3"
        :buttonText="moreButtonText"
        :isSmall="true"
        :isFlat="true"
        @clicked="moreButtonCallback"
      />

      <base-rectangle-button
        v-if="buttonText && buttonCallback"
        :button-text="buttonText"
        :is-small="true"
        @clicked="buttonCallback"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
/**
 * SloganCard.vue is card with an image and a catch phrase and a few details
 *
 * @summary catch phrase card
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-12-02 16:32:21
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import {getImage} from '@/factories/imageFactory';

export default {
  name: 'SloganCard',
  props: {
    slogan: {
      type: String,
      default: '',
    },
    sloganImg: {
      type: String,
      default: '',
    },
    subSlogan: {
      type: String,
      default: '',
    },
    maxHeight: Number,
    buttonText: {
      type: String,
      default: '',
    },
    buttonCallback: {
      type: Function,
      default: null,
    },
    moreButtonText: {
      type: String,
      default: '',
    },
    moreButtonCallback: {
      type: Function,
      default: null,
    },
  },
  components: { BaseRectangleButton },
  beforeMount() {
    this.fallbackImg = getImage('fingertips_small');
  },
  data: () => ({
    fallbackImg: '',
  }),
  computed: {
    hasButtons() {
      return (
        (this.moreButtonText && this.moreButtonCallback) ||
        (this.buttonText && this.buttonCallback)
      );
    },
  },
};
</script>

<style scoped>
.envidatSlogan {
  line-height: 2.25rem;
}
</style>
