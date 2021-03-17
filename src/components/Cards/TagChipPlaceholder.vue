<template>
  <v-chip class="placeholder_chip" >
    <div style="width: 35px;"
          class="skeleton skeleton-size-small skeleton-color-concrete skeleton-animation-shimmer" >
      <div class="bone bone-type-text bone-style-steps" />
    </div>
  </v-chip>
</template>

<script>
/**
 * TagChipPlaceholder.vue is a placeholder to show the placement any tag while the page is loading.
 *
 * @summary placeholder for tags
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-10-23 14:17:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

export default {
  props: {
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style scoped>
  .placeholder_chip{
    height: 1.5rem;
    font-size: 0.75rem;
  }
</style>
