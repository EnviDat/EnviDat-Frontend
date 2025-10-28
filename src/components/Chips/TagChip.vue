<template>
  <v-chip
    class="envidatChip text-black"
    :class="{
      'text-white': highlighted,
      smallChip: $vuetify.display.smAndDown,
    }"
    :style="{ height: $vuetify.display.xs ? '15px' : '' }"
    :color="highlighted ? 'primary' : color"
    :size="isSmall ? 'small': undefined"
    @click.stop="clicked"
  >
    <BaseIcon
      v-if="isAccordion"
      :icon="!isOpen ? mdiChevronDown : mdiChevronUp"
      small
    />

    {{ name }}

    <BaseIcon
      v-if="closeable"
      class="ml-1"
      :color="highlighted ? 'white' : 'black'"
      :icon="mdiClose"
      small
    />
  </v-chip>
</template>

<script>
/**
 * TagChip.vue create a colored chip with a text.
 *
 * @summary tag for keywords
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-10-23 14:15:34
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mdiClose, mdiChevronDown, mdiChevronUp } from '@mdi/js';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

export default {
  components: { BaseIcon },
  props: {
    name: String,
    closeable: Boolean,
    selectable: Boolean,
    highlighted: Boolean,
    count: Number,
    color: {
      type: String,
      default: '#e0e0e0',
    },
    isSmall: {
      type: Boolean,
      default: true,
    },
    isAccordion: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {
    clicked() {
      if (!this.selectable) {
        return;
      }

      this.$emit('clicked', this.name);
    },
    // clickedClose: function clickedClose() {
    //   this.$emit('clickedClose', this.name);
    // },
  },
  data: () => ({
    mdiClose,
    mdiChevronDown,
    mdiChevronUp,
  }),
};
</script>
