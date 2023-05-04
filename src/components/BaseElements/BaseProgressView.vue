<template>
  <v-row no-gutters
         align-content="center"
          style="justify-content: end;">
    <v-col>
      {{ text }}
    </v-col>

    <v-col class="shrink pl-2">
      <v-progress-circular :value="progressPct"
                           :size="35"
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
      default: 'Your progress is',
    },
    color: {
      type: String,
      default: 'secondary',
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
