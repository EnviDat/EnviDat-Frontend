<template>
  <div style="cursor: pointer;">
    <!-- Top of Card -->
    <v-card :height="headerCardHeight" class="elevation-3" style="z-index: 1;">
      <v-skeleton-loader type='heading' color='gray' />
    </v-card>

    <!-- Bottom of Card -->
    <v-card height="100%" style="z-index: 0;" class="elevation-2 mx-2">
      <v-skeleton-loader type='paragraph' color='gray' />
    </v-card>
  </div>
</template>

<script>
/**
 * ProjectCard.vue creates a card with a header image, title, keywords and preview description.
 * When clicked its emits the 'clickedEvent' event, also the clickedTag can be emitted.
 *
 * @summary card with img, title, keywords and preview description
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2019-11-28 12:57:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'ProjectCard',
  components: {},
  props: {},
  computed: {},
  methods: {},
  data: () => ({
    headerCardHeight: 150,
  }),
};
</script>
