<template>
  <v-banner two-line
            color="warning" >

    <v-avatar slot="icon"
              color="secondary"
              size="24" >

      <v-icon color="white"
              style="animation: progress-circular-rotate 3s linear infinite" >
        settings
      </v-icon>
    </v-avatar>

    <span v-html="text" />

    <template v-slot:actions>
      <BaseRectangleButton v-if="confirmText"
                            marginClass="mx-1"
                            color="secondary"
                            :buttonText="confirmText"
                            @clicked="confirmClick" />

      <BaseRectangleButton v-if="cancelText"
                            marginClass="mx-1"
                            :buttonText="cancelText"
                            :isFlat="true"
                            @clicked="cancelClick" />

    </template>
  </v-banner>
</template>


<script>
/**
 * TextBanner.vue creates a banner with confirm and cancel buttons
 *
 * @summary text banner with ok / cancel button
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00 
 * Last modified  : 2020-11-03 16:13:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package. 
 */
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  name: 'TextBanner',
  props: {
    title: String,
    text: String,
    confirmText: String,
    confirmClick: Function,
    cancelText: String,
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
