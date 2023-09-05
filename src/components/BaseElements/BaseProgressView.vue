<template>
  <v-row no-gutters
         style="justify-content: end; align-items: center;">
    <v-col :style="`color: ${textColor};`">
      {{ text }}
    </v-col>

    <v-col class="flex-grow-0 pl-2">
      <v-progress-circular :value="progressPct"
                           :size="38"
                           :rotate="-90"
                           :color="color"
      >
          <div style="font-size: 0.6rem;" >{{ completedPctInteger }} %</div>
      </v-progress-circular>
    </v-col>

  </v-row>
</template>

<script>
/**
 * BaseProgressView.vue
 *
 * @summary
 * @author Haas
 *
 * Created at     : 2023-05-03
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'BaseProgressView',
  props: {
    text: {
      type: String,
      default: 'Progress: ',
    },
    color: {
      type: String,
      default: 'secondary',
    },
    textColor: {
      type: String,
      default: 'black',
    },
    progressPct: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    completedPctInteger() {
      return Math.floor(this.progressPct);
    },
  },
};
</script>

<style scoped>

</style>
