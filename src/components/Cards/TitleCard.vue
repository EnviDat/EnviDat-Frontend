<template>
  <v-card class="datasetTitleCard"
          :class="cardClass"
          style="align-self: center;" >

    <v-progress-linear v-if="loading"
                       color="primary"
                       absolute
                       indeterminate />

    <v-container fluid
                 class="px-2 py-0 fill-height">

      <v-row no-gutters >
        <v-col cols="12">
          <div :class="titleClass" >{{ title }}</div>
        </v-col>

      </v-row>
    </v-container>

    <div v-if="clickCallback" style="position: absolute; right: 8px;">

      <BaseIconButton
        :icon="icon"
        :tooltipText="tooltipText"
        @clicked="clickCallback"
      />
    </div>


  </v-card>
</template>


<script>
/**
 * TitleCard is used to communicate that the users has no
 * datasets.
 *
 * @summary card with img, title, description and button to add datasets
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-08-25 12:22:58
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

export default {
  name: 'TitleCard',
  props: {
    title: String,
    cardClass: {
      type: String,
      default: '',
    },
    titleClass: {
      type: String,
      default: 'text-h6',
    },
    icon: String,
    loading: Boolean,
    tooltipText: String,
    clickCallback: Function,
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
  }),
  components: {
    BaseIconButton,
  },
};
</script>

<style lang="scss" scoped>

  .datasetTitleCard {
    display: grid;
    grid-template-columns: 11fr 1fr;
  }

</style>
