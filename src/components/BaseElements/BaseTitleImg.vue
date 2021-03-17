<template>
  <div :style="`height: ${height}px;`">
    <!-- use slot for the content and make a component for only the layouting -->

    <v-parallax v-if="parallax"
                :height="height"
                :src="img"
                :dark="dark"
                :class="{ 'blur_parallax' : blur }"
                :style="blur ? 'opacity: 0.8' : ''" />

    <v-img v-if="!parallax"
          :height="height"
          :src="img"
          :dark="dark"
          :class="{ 'blur_parallax' : blur }"
          :style="blur ? 'opacity: 0.8' : ''" />

    <v-row class="fill-height mx-2"
            align="center"
            justify="center" 
            :style="`position: relative; top: -${height }px;
                    text-align: center;`" >

      <div style="background-color: white;" />

      <div class="envidatTitle"
          :class="{
            'black--text': dark,
            'white--text': !dark,
            'display-3' : $vuetify.breakpoint.mdAndUp,
            'display-1' : $vuetify.breakpoint.smAndDown,
          }" >
        <span :style="`background-color: ${textBackgroundColor};
                        text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.7);`">
          {{ title }}
        </span>
      </div>

      <div class="envidatTitle"
          :class="{
            'black--text': dark,
            'white--text': !dark,
            'headline' : $vuetify.breakpoint.mdAndUp,
            'subtitle-1' : $vuetify.breakpoint.smAndDown,
          }" >
        <span :style="`background-color: ${textBackgroundColor};
                        text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.7);`">
          {{ subTitle }}
        </span>
      </div>
    </v-row>
  </div>
</template>

<script>
/**
 * The @class BaseTitleImg uses a image a background and overlays the Title and subTitle on top of it.
 *
 * If @prop parallax is true the image will be shown with a parallax effect provided the images is
 * bigger than the @prop height.
 *
 * Set @prop blur to true to add a blur filter of 2px and reduce the opacity, which increases
 * the focus and readability of the Title & subTitle.
 *
 * If @prop dark is true the text color will be black otherwise it's white.
 *
 * Depending on the contrasts and brigthness of the image it might make sense to set a
 * @prop textBackgroundColor which works well together with the text and increases contrast
 * and readability of the text.
 *
 * @summary Full width image with a title and subtitle, image can have parallax effect and/or blur
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2019-10-23 14:05:36
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  props: {
    parallax: Boolean,
    height: Number,
    title: String,
    subTitle: String,
    img: String,
    dark: Boolean,
    blur: Boolean,
    textBackgroundColor: String,
  },
};
</script>

<style scoped>

  .blur_parallax {
    filter: blur(2px);
  }

</style>
