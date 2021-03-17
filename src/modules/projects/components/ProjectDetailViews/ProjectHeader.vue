<template>
  <v-card :height="height"
          :class="{
            'pa-4': $vuetify.breakpoint.smAndUp,
            'pa-3': $vuetify.breakpoint.xsOnly,
          }"
          :dark="dark"
          :color="showPlaceholder ? 'primary' : 'white'" >

    <div v-bind="{['style'] : dynamicCardBackground }" >
      <!-- this loads the background image -->
    </div>

    <base-icon-button class="ma-2"
                      style="position: absolute; top: 0px; right: 0px; z-index: 2;"
                      material-icon-name="close"
                      icon-color="primary"
                      color="primary"
                      outlined
                      tooltip-text="Close Project Detail"
                      :tooltip-bottom="true"
                      @clicked="catchBackClicked" />


    <div v-if="title"
          :style="`position: absolute; top: 0px; right: 0px;
                  height: ${height}px; width: 100%;
                  z-index: 1;`"
          class="headerTitle pa-4"
          :class="{ 'display-2': $vuetify.breakpoint.lgAndUp,
                    'display-1': $vuetify.breakpoint.mdAndDown,
                    'headline': $vuetify.breakpoint.smAndDown,
          }" >
      {{ title }}
    </div>


    <div v-if="!title && !showPlaceholder"
          :style="`position: absolute; top: 0px; right: 0px;
                  height: ${height}px; width: 100%;
                  z-index: 1; color: ${$vuetify.theme.themes.light.error};`"
          class="headerTitle pa-4"
          :class="{ 'display-2': $vuetify.breakpoint.lgAndUp,
                    'display-1': $vuetify.breakpoint.mdAndDown,
                    'headline': $vuetify.breakpoint.smAndDown,
          }" >
      {{ NotFoundTitle }}
    </div>


    <div v-if="!title && showPlaceholder"
          style="z-index: 1;"
          class="skeleton skeleton-size-big skeleton-color-concrete skeleton-animation-shimmer" >
      <div class="bone bone-type-multiline bone-style-steps" />
    </div>

  </v-card>
</template>

<script>
/**
 * ProjectHeader.vue shows the title and a background image
 * of a project entry.
 *
 * @summary shows the main infos the a project entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-10-27 16:25:26
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import BaseIconButton from '@/components/BaseElements/BaseIconButton';

export default {
  components: {
    BaseIconButton,
  },
  props: {
    title: String,
    titleImg: String,
    defaultImg: String,
    showPlaceholder: Boolean,
  },
  computed: {
    titleImage() {
      const img = new Image();
      let imgSrc = this.defaultImg;

      if (this.titleImg) {
        imgSrc = this.titleImg;
        if (!imgSrc.includes('http')) {
          imgSrc = `https://www.envidat.ch/uploads/group/${imgSrc}`;
        }
      }

      if (imgSrc !== undefined) {
        img.src = imgSrc;
      }
      // img.onload = this.setHeightAndWidth;

      return img;
    },
    dynamicCardBackground() {
      const gradient = this.dark ? this.blackTopToBottom : this.whiteTopToBottom;

      let style = `position: absolute; top: 0px; right: 0px;
                  height: ${this.height}px; width: 100%;
                  background-image: linear-gradient(0deg, ${gradient});
                  background-position: center, center; background-size: cover;
                  background-repeat: initial;
                  z-index: 0;`;

      if (this.titleImage.src !== '') {
        style += `background-image: linear-gradient(0deg, ${gradient}), url(${this.titleImage.src});
        filter: blur(2px);`;
      }

      return style;
    },
  },
  methods: {
    catchBackClicked() {
      this.$emit('clickedBack');
    },
  },
  data: () => ({
    height: 150,
    dark: false,
    blackTopToBottom: 'rgba(80,80,80, 0.1) 0%, rgba(80,80,80, 0.9) 70%',
    // whiteTopToBottom: 'rgba(255,255,255, 0.3) 0%, rgba(255,255,255, 1) 60%',
    whiteTopToBottom: 'rgba(255,255,255, 0.6) 0%, rgba(255,255,255, 0.99) 70%',
    NotFoundTitle: 'No Project found',
  }),
};
</script>

<style scoped>

  .headerTitle {
    font-family: 'Baskervville', serif !important;
    font-weight: 400;
    opacity: 1;
  }

</style>
