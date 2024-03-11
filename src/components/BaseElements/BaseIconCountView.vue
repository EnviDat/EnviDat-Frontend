<template>
  <div class="BaseIconCountView">
    <base-icon-button
      :icon="icon"
      :count="count"
    ></base-icon-button>
  </div>
</template>

<script>
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

/**
 * BaseIconCountView.vue creates a round with an icon with a badge which shows a number
 * Similar to @class BaseIconButton but without the click event.
 *
 * @summary icon with a small number in a circle
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2019-11-27 14:54:23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
export default {
  name: 'BaseIconCountView',
  components: { BaseIconButton },
  props: {
    iconString: String,
    icon: String,
    count: Number,
    tooltipText: String,
  },
  data: () => ({
    hoverBadge: false,
  }),
};
</script>

<style>
  .iconCountView {
    /* line-height has to be based on the root (1rem) because of the
      use in ex. v-card-title */
    line-height: 1rem;
  }
</style>
