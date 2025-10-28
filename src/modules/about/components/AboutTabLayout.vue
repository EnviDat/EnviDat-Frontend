<template>
  <v-row
    no-gutters
    :class="{
      'px-4': $vuetify.display.mdAndUp,
      'px-3': $vuetify.display.sm,
    }"
  >
    <v-col class="pt-3" cols="12">
      <img-and-text-layout
        :img="titleImageResolved"
        :height="$vuetify.display.smAndDown ? 100 : 150"
        :title="title"
      />
    </v-col>

    <v-col v-show="loading" class="pt-5" cols="12">
      {{ loadingText }}
    </v-col>

    <v-col
      v-if="!loading && markdownContent"
      cols="12"
      class="pt-5"
    >
      <div v-html="markdownContent"></div>
    </v-col>

    <slot v-if="hasSlotContent" />
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
import { mdiChevronDown } from '@mdi/js';
import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout.vue';
import { getImage } from '@/factories/imageFactory.js';

export default {
  name: 'AboutTabLayout',
  props: {
    title: String,
    titleImage: String,
    loading: Boolean,
    loadingText: String,
    markdownContent: String,
  },
  async mounted() {
    if (this.titleImage) {
      this.titleImageResolved = await getImage(this.titleImage);
    }
  },  
  computed: {
    hasSlotContent() {
      // correct refactoring??
      // https://v3-migration.vuejs.org/breaking-changes/slots-unification.html#_3-x-syntax
      const slotAmount = Object.values(this.$slots).length;
      if (slotAmount > 0) {
        const def = this.$slots.default();
        return def?.length > 0;
      }

      return false;
    },
  },
  components: {
    ImgAndTextLayout,
  },
  data: () => ({
    expanded: false,
    mdiChevronDown,
    titleImageResolved: undefined,
  }),  
};
</script>
