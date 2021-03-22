<template>
  <v-card class="datasetTitleCard"
          :class="cardClass"
          style="align-self: center;">

      <div :class="titleClass" >{{ title }}</div>

      <!-- <BaseRectangleButton v-if="buttonText"
                        style="justify-self: end;"
                        :materialIconName="icon"
                        :tooltipText="tooltipText"
                        @clicked="clickCallback" /> -->

      <BaseIconButton style="justify-self: end;"
                        :materialIconName="icon"
                        :tooltipText="tooltipText"
                        @clicked="clickCallback" />
  </v-card>
</template>


<script>
/**
 * NotFoundCard is used to communicate that the users has no
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
// import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';

export default {
  name: 'TitleCard',
  props: {
    title: String,
    cardClass: {
      type: String,
      default: 'px-2 py-0',
    },
    titleClass: {
      type: String,
      default: 'text-h6',
    },
    icon: String,
    // buttonText: String,
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
    // BaseRectangleButton,
    BaseIconButton,
  },
};
</script>

<style lang="sass" scoped>

  .datasetTitleCard
    display: grid
    grid-template-columns: 11fr 1fr

</style>
