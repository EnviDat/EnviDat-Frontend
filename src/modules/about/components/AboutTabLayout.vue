<template>

  <v-row no-gutters
          :class="{'px-4': $vuetify.breakpoint.mdAndUp,
                  'px-3': $vuetify.breakpoint.sm }" >

    <v-col class="pt-3" cols="12" >
      <img-and-text-layout :img="titleImage"
                            :height="$vuetify.breakpoint.smAndDown ? 100 : 150"
                            :title="title" />
    </v-col>

    <v-col v-show="loading"
            class="pt-5" 
            cols="12">
      {{ loadingText }}
    </v-col>

    <v-col v-if="!loading && markdownContent"
            cols="12"
            class="pt-5"
            v-html="markdownContent">

    </v-col>

    <slot v-if="hasSoltConent" />

  </v-row>

</template>

<script>
/**
 * @summary about tab layout for the different markdown tabs
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2019-11-20 13:39:14
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout';

export default {
  name: 'AboutTabLayout',
  props: {
    title: String,
    titleImage: String,
    loading: Boolean,
    loadingText: String,
    markdownContent: String,
  },
  computed: {
    hasSoltConent() {
      return !!this.$slots.default && !!this.$slots.default[0];
    },
  },
  components: {
    ImgAndTextLayout,
  },
};
</script>
