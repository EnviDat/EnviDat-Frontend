<template>
  <div id="BaseIconCountView" >
    <v-tooltip v-if="$vuetify.breakpoint.mdAndUp && tooltipText"
                bottom >
      <template v-slot:activator="{ on }">
        <div v-on="on"
              class="iconCountView" >
          <v-container fluid
                    class="py-0">
          <v-row @mouseover="hoverBadge = true"
                  @mouseleave="hoverBadge = false" >
            <v-col class="pa-0" >
              <v-badge :left="!hoverBadge"
                        overlap
                        color="secondary"
                        :class="{ envidatBadgeBigNumber : count > 9,
                                  envidatBadge: count <= 9 }" >
                                                      
                <span slot="badge" >{{ count }}</span>
              </v-badge>
            </v-col>

            <v-col class="pa-0" >
              <img class="envidatIcon" :src="iconString" :alt="`${iconString} icon`">
            </v-col>
          </v-row>
          </v-container>
        </div>
      </template>

      <span>{{ tooltipText }}</span>
    </v-tooltip>

    <div v-else
          class="iconCountView" >
      <v-container fluid
                    class="py-0">
      <v-row @mouseover="hoverBadge = true"
              @mouseleave="hoverBadge = false" >

        <v-col class="pa-0" >
          <v-badge :left="!hoverBadge"
                    overlap
                    color="secondary"
                    style="z-index: 2;"
                    :class="{ envidatBadgeBigNumber : count > 9,
                              envidatBadge: count <= 9 }" >
                                                  
            <span slot="badge">{{ count }}</span>
          </v-badge>
        </v-col>

        <v-col class="pa-0" style="z-index: 1;" >
          <img class="envidatIcon" :src="iconString" :alt="`${iconString} icon`">
        </v-col>

      </v-row>
      </v-container>
    </div>

  </div>
</template>

<script>
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
  props: {
    iconString: String,
    count: Number,
    tooltipText: String,
  },
  data: () => ({
    hoverBadge: false,
  }),
};
</script>

<style >
  .iconCountView {
    /* line-height has to be based on the root (1rem) because of the
    use in ex. v-card-title */
    line-height: 1rem;
  }
</style>
