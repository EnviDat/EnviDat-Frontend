<template>
  <div class="BaseIconCountView">
    <base-icon :icon="icon" :count="count" color="grey-darken-4" v-bind="$props" />
  </div>
</template>

<script>
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

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
  components: { BaseIcon },
  props: {
    icon: String,
    count: Number,
    tooltipText: String,
  },
  data: () => ({
    hoverBadge: false,
  }),
};
</script>

<style scoped></style>
