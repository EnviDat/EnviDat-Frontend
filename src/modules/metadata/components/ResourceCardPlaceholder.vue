<template>
  <v-card
    color="primary"
    class="metadataResourceCard white--text"
    style="height: 100%; min-width: 200px;"
  >
    <v-card-title>
      <div
        class="skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer"
        style="width: 100%;"
      >
        <div class="bone bone-type-heading" />
      </div>
    </v-card-title>

    <v-card-text class="pt-0">
      <v-container class="pa-0 pr-5">
        <v-row  >
          <v-col >
            <v-row >
              <v-col cols="11">
                <div class="skeleton skeleton-size-big skeleton-color-concrete skeleton-animation-shimmer">
                  <div class="bone bone-type-multiline bone-style-paragraph" />
                </div>
              </v-col>
            </v-row>
          </v-col>

        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions class="mb-2 py-0"
                    style="position: absolute; bottom: 0; right: 0;" >
      <v-spacer />

      <div color="accent"
            class="skeleton skeleton-size-big skeleton-color-yellow skeleton-animation-shimmer" >
        <div
          style="width: 32px; height: 32px;"
          class="bone bone-type-image bone-style-round"
        />
      </div>
    </v-card-actions>
  </v-card>
</template>


<script>
/**
 * ResourceCardPlaceholder.vue is a placeholder card for the resoureceCard.vue
 *
 * @summary placeholder card for a resource
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-10-23 14:13:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

export default {
  components: {
  },
  props: {
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
  },
};
</script>
