<template>
  <v-container class="pa-0 ma-0"
                fluid
                id="TextCardListLayout" >

    <v-row no-gutters >

      <v-col v-if="loading"
             cols="12" >
        Loading the entries...
      </v-col>

      <v-col v-if="!loading"
             cols="12"
             >

<!--        :style="`height: calc(100vh - ${blogBodyHeight }px);`"-->

        <v-row v-if="listItems.length > 0"
               no-gutters>

          <v-col v-for="(entry, index) in listItems"
                 :key="`listItems_${index}`"
                 :id="`listItems_${index}`"
                 cols="12"
                 :sm="smallCols"
                 :md="mediumCols"
                 :lg="largeCols"
                 class="pa-2" >

            <slot name="entry"
                  :entry="entry"
                  :loadingImg="loadingImg"
                  :titleCssClass="titleCssClass"
                  :subtitleCssClass="subtitleCssClass"
            >

            </slot>

          </v-col>
        </v-row>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
/**
 * The blog page of EnviDat. It shows either a list of posts or a specific post
 *
 * @summary TextCardListLayout
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */


export default {
  name: 'TextCardListLayout',
  props: {
    listItems: {
      type: Array,
      default: () => [],
    },
    smallCols: {
      type: Number,
      default: 3,
    },
    mediumCols: {
      type: Number,
      default: undefined,
    },
    largeCols: {
      type: Number,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingImg: {
      type: String,
      default: undefined,
    },
    titleCssClass: {
      type: String,
      default: 'text-h5',
    },
    subtitleCssClass: {
      type: String,
      default: 'text-body-1',
    },
  },
  computed: {
  },
  methods: {
  },
  components: {
  },
  data: () => ({
  }),
};
</script>

<style scoped>

</style>
