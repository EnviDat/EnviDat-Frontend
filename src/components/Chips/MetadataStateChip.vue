<template>
  <v-chip class="stateChip"
          small
          :color="stateColor">
    {{ stateText }}
  </v-chip>
</template>

<script>
/**
 * MetadataStateChip.vue show the publication state of a metadata entry
 *
 * @summary show the publication state
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-12-14 14:19:00
 * Last modified  : 2021-12-14 14:19:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

export default {
  name: 'MetadataStateChip',
  props: {
    state: {
      type: String,
      default: '',
    },
    colorMap: {
      type: Object,
      default: () => ({
        draft: 'gray',
        unpublished: 'warning',
        published: 'green',
      }),
    },
  },
  computed: {
    stateText() {
      return this.state?.toUpperCase() || 'DRAFT';
    },
    stateColor() {
      return this.colorMap[this.state];
    },
  },
  methods: {
  },
};
</script>

<style scoped>
  .stateChip{
    height: 1.5rem;
    font-size: 0.75rem;
  }
</style>
