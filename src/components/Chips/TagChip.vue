<template>
  <v-chip
    class="envidatChip black--text"
    :class="{
      'white--text': highlighted,
      smallChip: $vuetify.display.smAndDown,
    }"
    :color="highlighted ? 'primary' : color"
    :style="{ height: $vuetify.display.xs ? '15px' : '' }"
    :small="isSmall"
    close-icon="close"
    @click.stop="clicked"
    :close="closeable"
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
};
</script>
