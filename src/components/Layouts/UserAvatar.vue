<template>
      <base-icon-button materialIconName="account_circle"
                        tooltipBottom
                        color="highlight"
                        iconColor="black"
                        isSmall />
</template>

<script>
/**
 * UserAvatar.vue
 *
 * @summary
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-10-31 15:29:14
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import BaseIconButton from '@/components/BaseElements/BaseIconButton';

export default {
  components: {
    BaseIconButton,
  },
  props: {
    compact: Boolean,
    clickCallback: Function,
  },
  data: () => ({
    modeInfoPrefix: 'Special View',
    tooltipText: 'You are in a specific view which shows data for',
  }),
  computed: {
  },
};
</script>

<style scoped>
  .item {
    margin: 0px 5px;
  }
</style>
