<template>
  <div style="cursor: pointer;" >

    <!-- Top of Card -->
    <v-card :height="headerCardHeight"
            class="elevation-3"
            style="z-index: 1;" >

      <v-card-text>
        <div class="skeleton skeleton-size-big skeleton-color-concrete skeleton-animation-shimmer">
          <div class="bone bone-type-multiline bone-style-steps" />
        </div>
      </v-card-text>

    </v-card>

    <!-- Bottom of Card -->
    <v-card height="100%"
            style="z-index: 0;"
            class="elevation-2 mx-2" >

      <v-card-text >
        <div class="skeleton skeleton-color-silver skeleton-animation-shimmer"
              style="width: 100%;" >
          <div class="bone bone-type-multiline" />
          <div class="bone bone-type-multiline bone-style-paragraph" />
        </div>
      </v-card-text>

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
  components: {
  },
  props: {
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
    headerCardHeight: 150,
  }),
};
</script>
