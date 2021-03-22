<template>
  <v-chip class="envidatChip"
          :class="{
            'white--text': highlighted ? true : false,
            'smallChip': $vuetify.breakpoint.smAndDown ? true : false,
            }"
          v-bind="{ 'color': highlighted ? 'primary' : color }"
          :style="{ 'height' : $vuetify.breakpoint.xsOnly ? '15px' : '' }"
          @click.stop="clicked"
          @input="clickedClose" >
    {{ name }}

    <span v-if="closeable"
          style="margin: 0 -5px 3px 5px;"
          class="" >
      <v-icon small >close</v-icon>
    </span>

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
      default: '#e0e0e0',
    },
    size: {
      type: String,
      default: 'default',
    },
  },
  computed: {
  },
  methods: {
    clicked: function clicked() {
      if (!this.selectable) {
        return;
      }

      this.$emit('clicked', this.name);
    },
    clickedClose: function clickedClose() {
      this.$emit('clickedClose', this.name);
    },
  },
};
</script>
