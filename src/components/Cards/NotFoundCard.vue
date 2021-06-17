<template>
  <v-card id="NotFoundCard"
          :height="height"
          class="pa-0 notFoundGrid" >

    <v-img :src="notFoundImage"
            :max-height="height"
            style="border-bottom-left-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 0px;" />

    <v-container fluid class="pa-4">

      <v-row>
        <v-col class="display-2">
          {{ title }}
        </v-col>
      </v-row>

      <v-row >
        <v-col cols="12"
                class="text-md-h6 text-xs-body-1" >
          {{ description }}
        </v-col>
      </v-row>

      <v-row >
        <v-col v-if="actionDescription"
                cols="6"
                class="text-body-1" >
          {{ actionDescription }}
        </v-col>

        <v-col v-if="actionButtonText"
                cols="6"  >
          <base-rectangle-button :button-text="actionButtonText"
                                  @clicked="actionButtonCallback" />
        </v-col>
      </v-row>

    </v-container>

  </v-card>

</template>


<script>
/**
 * NotFoundCard is used to communicate that the users has no
 * datasets.
 *
 * @summary card with img, title, description and button to add datasets
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-08-20 07:50:36
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import userNotFound1 from '@/modules/user/assets/UserNotFound1.jpg';

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  name: 'NotFoundCard',
  props: {
    title: {
      type: String,
      default: 'Content Not Found',
    },
    height: {
      type: Number,
      default: 300,
    },
    description: {
      type: String,
      default: 'Ups we have trouble showing you want you were looking for. Try reloading the page.',
    },
    actionDescription: String,
    actionButtonText: String,
    actionButtonCallback: Function,
    image: String,
  },
  computed: {
    notFoundImage() {
      return this.image ? this.image : this.userNotFound1;
    },
  },
  methods: {
  },
  data: () => ({
    userNotFound1,
  }),  
  components: {
    BaseRectangleButton,
  },
};
</script>

<style lang="scss" scoped>
  .notFoundGrid {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
</style>
