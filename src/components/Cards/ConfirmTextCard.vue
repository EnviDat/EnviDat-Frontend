<template>
  <v-card>
    <v-card-title class="headline text-no-wrap pa-4">
      {{ title }}
    </v-card-title>

    <v-card-text class="pa-4 pt-0">
      {{ text }}
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
      <v-spacer />

      <BaseRectangleButton marginClass="mx-1"
                            :buttonText="confirmText"
                            @clicked="confirmClick" />

      <BaseRectangleButton marginClass="mx-1"
                            :buttonText="cancelText"
                            :isFlat="true"
                            @clicked="cancelClick" />

    </v-card-actions>

  </v-card>
</template>


<script>
/**
 * ConfirmTextCard.vue creates a text card with confirm and cancel buttons
 *
 * @summary text card with ok / cancel button
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00 
 * Last modified  : 2020-10-27 22:37:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package. 
 */
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  name: 'ConfirmTextCard',
  props: {
    title: String,
    text: String,
    confirmText: {
      type: String,
      default: 'Okay',
    },
    confirmClick: Function,
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    cancelClick: Function,
  },
  components: {
    BaseRectangleButton,
  },
  methods: {
    enterclick: function enterclick() {
      this.$emit('enterclick', this.loggedinText);
    },
    singupclick: function singupclick() {
      this.$emit('singupclick', this.signupText);
    },
    loginclick: function loginclick() {
      this.$emit('loginclick', this.loginText);
    },
  },
};
</script>

<style scoped>

  .dataproducer_title {
    font-family: 'Baskervville', serif !important;
  }

</style>
