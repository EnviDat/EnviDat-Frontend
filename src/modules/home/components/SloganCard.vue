<template>
  <v-card ripple hover @click="buttonCallback" >

    <v-container class="pa-0" >
      <v-row :class="{ 'flex-column' : $vuetify.breakpoint.xsOnly }"
              no-gutters >

        <v-col class="py-0 pr-sm-0"        
                cols="12"
                sm="5" >
          <v-img class="imagezoom"
                  :src="fingertipsImg"
                  style="max-height: 200px; min-height: 100%; border-top-left-radius: 4px;"
                  :style="`border-bottom-left-radius: ${$vuetify.breakpoint.smAndUp ? 4 : 0}px;
                    border-top-right-radius: ${$vuetify.breakpoint.xsOnly ? 4 : 0}px;`" />
        </v-col>

        <v-col class="pa-4"
                cols="12"
                sm="7" >

          <div class="hidden-sm-and-down envidatSlogan display-1"
                v-html="slogan">
          </div>
          <div class="hidden-xs-only hidden-md-and-up envidatSlogan headline px-2"
                v-html="slogan">
          </div>
          <div class="hidden-sm-and-up envidatSlogan headline x"
                style="text-align: center;"
                v-html="slogan" >
          </div>

          <div class="py-5 mb-5"
               :style="$vuetify.breakpoint.mdAndUp ? 'font-size: 14px !important;' : '' " >
            {{ subSlogan }}
          </div>
        </v-col>
      </v-row>
    </v-container>


    <v-card-actions class="ma-0 pa-4"
                    style="position: absolute; bottom: 0; right: 0;" >

      <base-rectangle-button v-if="moreButtonText && moreButtonCallback"
                                marginClass="mr-3"
                                :buttonText="moreButtonText"
                                :isSmall="true"
                                :isFlat="true"
                                @clicked="moreButtonCallback" />

      <base-rectangle-button :button-text="buttonText"
                              :is-small="true"
                              @clicked="buttonCallback"/>

    </v-card-actions>
  </v-card>
</template>


<script>
/**
 * SloganCard.vue is card with an image and a catch phrase and a few details
 *
 * @summary catch phrase card
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-11-13 18:19:42
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import fingertipsImg from '../assets/fingertips_small.jpg';

export default {
  name: 'SloganCard',
  components: { BaseRectangleButton },
  data: () => ({
    fingertipsImg,
  }),
  props: {
    slogan: String,
    subSlogan: String,
    buttonText: String,
    buttonCallback: Function,
    moreButtonText: String,
    moreButtonCallback: Function,
  },
  methods: {
  },
};
</script>
