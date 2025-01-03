<template>
    <v-card
      ripple
      @mouseover="hover = true"
      @mouseleave="hover = false"
      class="fill-height pa-14 rounded-xl"
      :dark="false"
    >
      <v-container
        :class="{ 'grey-background': hasGreyBackground }"
        class="ma-2 fill-height info-card d-flex"
      >
        <v-row>
          <!-- Invert layout if grey background and on desktop -->
          <v-col
            v-if="hasGreyBackground"
            cols="12"
            md="4"
            class="d-md-flex"
            order-md="1"
            order="2"
          >
            <v-row class="info-action">
              <v-col class="d-flex flex-column align-center justify-center">
                <img class="info-img" src="https://placehold.co/600x400/000000/FFF" />
                <v-btn rounded="xl" :color="'secondary'" @click="cardClick">
                  {{ info.actionTitle }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <!-- Info text part -->
          <v-col cols="12" md="8" order-md="2" order="1">
            <v-row class="info-text">
              <v-row class="info-title">
                <v-col v-if="info.title">
                  <span class="text-h5 font-weight-bold">{{ info.title }}</span>
                </v-col>
              </v-row>

              <v-row v-if="info.subtitle" class="info-subtitle">
                <v-col>{{ info.subtitle }}</v-col>
              </v-row>

              <v-row v-if="info.points?.length > 0" class="info-points">
                <v-col>
                  <v-list lines="two">
                    <v-list-item v-for="n in info.points" :key="n" class="pa-0">
                      <span>- {{ n }}</span>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-row>
          </v-col>

          <!-- Action part if grey background is not present -->
          <v-col
            v-if="!hasGreyBackground"
            cols="12"
            md="4"
            class="d-md-flex"
            order-md="3"
            order="2"
          >
            <v-row class="info-action">
              <v-col class="d-flex flex-column align-center justify-center">
                <img class="info-img" src="https://placehold.co/600x400/000000/FFF" />
                <v-btn rounded="xl" :color="'secondary'" @click="cardClick">
                  {{ info.actionTitle }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </template>

  <script>
  /**
   * MetaDataCard.vue creates a card with a header image, title, keywords and preview description.
   * When clicked its emits the 'clickedEvent' event, also the clickedTag can be emitted.
   *
   * @summary card with img, title, keywords and preview description
   * @author Dominik Haas-Artho
   *
   * Created at     : 2019-10-02 11:24:00
   * Last modified  : 2021-01-06 11:37:52
   *
   * This file is subject to the terms and conditions defined in
   * file 'LICENSE.txt', which is part of this source code package.
   */

  //    import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

  //   import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

  // Header Sleek design
  // https://codepen.io/GeorgeGedox/pen/NQrxrY

  // checkout possible transition animation
  // https://codepen.io/balapa/pen/embYYB
  // https://codepen.io/zavoloklom/pen/eNaEBM

  // this one maybe for the guided content scrolling
  // https://codepen.io/pgreg/pen/EDoFB

  // Card design #2 probably only the header would be doable?
  // https://codepen.io/marlenesco/pen/NqOozj

  // Card opening animation
  // https://codepen.io/luizotcarvalho/pen/yyQNRO

  // check multi line truncation via css (only works with one-colored background)
  // http://hackingui.com/front-end/a-pure-css-solution-for-multiline-text-truncation/
  //   import iconGet from '../../assets/icon-get.png';

  export default {
    name: 'InfoCards',
    props: {
      info: Object,
      index: Number,
    },
    computed: {
      hasGreyBackground() {
        return this.index % 2 === 0;
      },
    },
    created() {},

    components: {
      //   BaseIconButton,
    },
    data: () => ({
      hover: false,
    }),
  };
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .info-img {
    width: 100%;
    height: auto;
    max-width: 300px;
    margin-bottom: 2rem;
  }
  </style>
