<template>
  <v-chip
    class="envidatChip text-black"
    :class="{
      'text-white': highlighted,
      smallChip: $vuetify.display.smAndDown,
    }"
    :style="{ height: $vuetify.display.xs ? '15px' : '' }"
    :color="highlighted ? 'primary' : color"
    :small="isSmall"
    :close-icon="mdiClose"
    @click.stop="clicked"
    :closable="closeable"
    @click:close="$emit('clickedClose', name)"
  >
    {{ name }}
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
import { mdiClose } from '@mdi/js';

export default {
  props: {
    name: String,
    closeable: Boolean,
    selectable: Boolean,
    highlighted: Boolean,
    count: Number,
    color: {
      type: String,
      default: '#222',
    },
    isSmall: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
  methods: {
    clicked: function clicked() {
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
  }),
};
</script>
