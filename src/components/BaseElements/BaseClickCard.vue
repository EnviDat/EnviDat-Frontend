<template>
  <v-card ripple
          hover
          raised
          :disabled="disabled"
          @click.native="clicked" >
    <v-container class="pa-0" >
      <v-row align="center"
              no-gutters >
        <!-- Image -->
        <v-col class="py-0"
                cols="5" >
          <v-img class="imagezoom"
                  :contain="contain"
                  :height=" $vuetify.breakpoint.smAndDown ? '65px' : '100px' "
                  style="border-bottom-left-radius: 4px; border-top-left-radius: 4px;"
                  :src="img" />
        </v-col>

        <!-- Text -->
        <v-col class="px-0"
                cols="7" >
          <div class="px-4 headline"
                :class="{ 'compactTitle' : this.$vuetify.breakpoint.smAndDown }" >
            {{ title }}
          </div>

          <div v-if="color"
                class="py-0 my-0 "
                :style="`height: 5px; background-color: ${color};`" >
          </div>

        </v-col>
      </v-row>
    </v-container>

  </v-card>
</template>

<script>
/**
 * BaseClickCard.vue creates a small card with a title and an image, it emits the
 * 'clicked' event with the title a parameter.
 *
 * @summary Card with title & img, emits a 'clicked' event
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-11-17 13:45:56
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

// un blurry zooming
// https://stackoverflow.com/questions/36143337/how-to-prevent-blur-from-css-transform

export default {
  name: 'BaseClickCard',
  props: {
    title: String,
    img: String,
    color: String,
    contain: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clicked() {
      this.$emit('click', this.title.toLowerCase());
    },
  },
};
</script>

<style scoped>

  .card .headline {
    font-size: 1.45em !important;
    overflow: inherit !important;
    text-overflow: inherit !important;
    max-height: inherit !important;
    line-height: inherit !important;
  }

  .compactTitle {
    font-size: 15px !important;
    line-height: 1.3em !important;
  }

  .v-card__media img {
    width: inherit !important;
  }
</style>
