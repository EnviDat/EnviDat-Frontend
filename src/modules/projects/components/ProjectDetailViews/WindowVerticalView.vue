<template>
  <v-card tile min-height="200">
    <v-row align="center">
      <v-item-group v-model="window" mandatory class="flex-grow-0 mr-2" tag="v-flex">
        <div v-if="!subProjects && showPlaceholder">
          <v-item v-for="index in 3" :key="'bullet_' + index">
            <div class="px-3 skeleton">
              <div
                style="height: 36px; width: 36px;"
                class="bone bone-type-image bone-style-round"
              ></div>
            </div>
          </v-item>
        </div>

        <v-item v-for="(sub, index) in subProjects" :key="'nav_' + index"
                v-slot:default="{ active, toggle }">
<!--
          <div >
-->
            <v-tooltip top>
              <template v-slot:activator >
                <v-btn
                  :input-value="active"
                  icon
                  @click="toggle"
                >
                  <v-icon>{{
                    active ? 'arrow_right' : 'arrow_drop_down'
                  }}</v-icon>
                </v-btn>

                <span>{{ sub.title }}</span>
              </template>
            </v-tooltip>
<!--
          </div>
-->
        </v-item>
      </v-item-group>

      <v-col>
        <v-window v-model="window" vertical>
          <v-window-item v-if="!subProjects && showPlaceholder" class="ma-3">
            <v-card height="150" class="pa-3">
              <div
                class="skeleton skeleton-size-big skeleton-color-concrete skeleton-animation-shimmer"
              >
                <div class="bone bone-type-heading " />
              </div>

              <div
                class="pt-4 skeleton skeleton-size-big skeleton-color-concrete skeleton-animation-shimmer"
              >
                <div class="bone bone-type-multiline bone-style-steps" />
              </div>
            </v-card>
          </v-window-item>

          <v-window-item
            v-for="(sub, index) in subProjects"
            :key="'window_' + index"
            class="ma-3"
          >
            <v-card height="200">
              <v-card-title>
                <strong class="text-h6">{{ sub.title }}</strong>
              </v-card-title>

              <v-card-text>
                <v-row class="fill-height" align="center" justify="center">
                  <v-col cols="11">
                    {{ sub.description }}
                  </v-col>

                  <v-col cols="1">
                    <v-btn icon>
                      <v-icon :icon="mdiFileFindOutline" />
                    </v-btn>
                  </v-col>

                  <v-col cols="12">Metadata</v-col>

                  <v-col
                    cols="12"
                    v-for="(meta, index) in metadatas"
                    :key="index"
                  >
                    {{ meta.id }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
/**
 * WindowVerticalView.vue IS UNFINISHED!
 * Experimental a vertical slider for content (instead of images).
 *
 * @summary vertical slider for content
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-10-23 16:06:31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {mdiFileFindOutline} from '@mdi/js'; 

export default {
  props: {
    subProjects: Array,
    metadatas: Array,
    showPlaceholder: Boolean,
  },
  computed: {
    // window() {
    //   return this.subProjects;
    // },
  },
  methods: {},
  data: () => ({
    window: 0,
  }),
};
</script>

<style scoped>

</style>
