<template>
  <v-card
    ripple
    hover
  >
    <v-card-media
      class="imagezoom"
      v-bind="{ [`height`]: this.$vuetify.breakpoint.smAndDown ? '200px' : '300px',
      }"
      :src="dataCreatorImg"
    >
      <v-container class="fill-height"
        
        fluid
      >
        <v-row class="fill-height" >
          <v-col cols="12">
            <span class="display-2 dataproducer_title white--text">{{ titleText }}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-media>

    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="loggedIn"
        large
        color="primary"
        @click.native="enterclick"
      >
        {{ loggedinText }}
      </v-btn>

      <v-btn
        v-if="!loggedIn"
        large
        color="primary"
        @click.native="singupclick"
      >
        {{ signupText }}
      </v-btn>

      <v-btn
        v-if="!loggedIn"
        large
        color="primary"
        @click.native="loginclick"
      >
        {{ loginText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
/**
 * DataProducerCard.vue creates a specific card login or signup button
 * and emits respectie events.
 *
 * @summary card with login / signup button
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00 
 * Last modified  : 2019-10-02 13:22:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package. 
 */
import dataCreatorImg from '@/modules/projects/assets/data_creator.jpg';

export default {
  props: {
    titleText: String,
    loginText: String,
    signupText: String,
    loggedIn: Boolean,
    loggedinText: String,
  },
  data: () => ({
    dataCreatorImg,
  }),
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
