<template>
  <div id="BaseIconCountView"
       style="max-width: 26px;" >

    <v-tooltip v-if="$vuetify.display.mdAndUp && tooltipText" bottom>
      <template v-slot:activator="{ on, props }">
        <div v-on="on"
             v-bind="props"
             class="iconCountView">
          <v-container fluid class="pa-0">
            <v-row
              @mouseover="hoverBadge = true"
              @mouseleave="hoverBadge = false"
              no-gutters
            >
              <v-col class="pa-0">
                <v-badge
                  :left="!hoverBadge"
                  overlap
                  color="secondary"
                  :content="count"
                  :class="{
                    envidatBadgeBigNumber: count > 9,
                    envidatBadge: count <= 9,
                  }"
                />
              </v-col>

              <v-col class="pa-0">
                <BaseIcon :custom-icon="iconString"
                          :icon="materialIconName"
                />

              </v-col>
              
            </v-row>
          </v-container>
        </div>
      </template>

      <span>{{ tooltipText }}</span>
    </v-tooltip>

    <div v-else class="iconCountView">
      <v-container fluid class="pa-0">
        <v-row
          @mouseover="hoverBadge = true"
          @mouseleave="hoverBadge = false"
          no-gutters
        >
          <v-col class="pa-0"
                 style="z-index: 2;"
          >
            <v-badge
              :left="!hoverBadge"
              overlap
              color="secondary"
              :class="{
                envidatBadgeBigNumber: count > 9,
                envidatBadge: count <= 9,
              }"
              :content="count"
            />
          </v-col>

          <v-col class="pa-0" style="z-index: 1;">
            <BaseIcon :custom-icon='iconString'
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

/**
 * BaseIconCountView.vue creates a round with an icon with a badge which shows a number
 * Similar to @class BaseIconButton but without the click event.
 *
 * @summary icon with a small number in a circle
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2019-11-27 14:54:23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
export default {
  name: 'BaseIconCountView',
  components: { BaseIcon },
  props: {
    iconString: String,
    materialIconName: String,
    count: Number,
    tooltipText: String,
  },
  data: () => ({
    hoverBadge: false,
  }),
};
</script>

<style>
.iconCountView {
  /* line-height has to be based on the root (1rem) because of the
    use in ex. v-card-title */
  line-height: 1rem;
}
</style>
