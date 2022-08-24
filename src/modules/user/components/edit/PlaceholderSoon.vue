<template>
  <v-card class="pa-4">

    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">Edit Selected Resource</div>
        </v-col>
      </v-row>

      <v-row no-gutters align="center" class="pt-6">
        <v-col cols="1">
          <v-icon color="secondary"
                  style="animation: progress-circular-rotate 3s linear infinite" x-large>settings</v-icon>
        </v-col>

        <v-col class="text-h5" cols="11">
          Coming Soon!
        </v-col>

        <v-col class="pt-2 text-body-1">
          <slot></slot>
        </v-col>
      </v-row>

      <v-row no-gutters
             class="pt-6" >

        <v-col v-if="buttonText"
               class="pr-2 text-left">
          <BaseRectangleButton :buttonText="buttonText"
                               color="secondary"
                               @clicked="$emit('buttonClick1')"/>

        </v-col>

        <v-col v-if="buttonText2"
               class="pr-2 text-right">
          <BaseRectangleButton :buttonText="buttonText2"
                               color="error"
                                @clicked="$emit('buttonClick2')"/>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditDataAndResources.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources for a metadata entry
 * @author Dominik Haas-Artho & Sam Woodcock
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
// eslint-disable-next-line import/no-cycle
import { BaseRectangleButton } from '@/components/BaseElements/BaseRectangleButton';


export default {
  name: 'PlaceholderSoon',
  components: {
    BaseRectangleButton,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
    buttonText2: {
      type: String,
      default: '',
    },
  },
  mounted() {
  },
  data: () => ({
  }),
};
</script>

<style scoped></style>
