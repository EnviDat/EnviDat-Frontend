<template>
  <v-chip
    class="projectTag"
    :class="{
      'white--text': highlighted,
      smallChip: $vuetify.display.smAndDown,
    }"
    :color="highlighted ? 'primary' : color"
    :style="{
      height: $vuetify.display.xs ? '15px' : '',
    }"
    :small="isSmall"
    close-icon="close"
    @click.stop="clicked"
    :close="closeable"
    @click:close="$emit('clickedClose', name)"
  >
    <v-avatar v-if="iconName != null" left>
      <v-icon :size="iconSize">{{ iconName }}</v-icon>
    </v-avatar>
    <span :style="{ fontSize: fontSize }">
      {{ name }}
    </span>
  </v-chip>
</template>

<script>
export default {
  props: {
    name: String,
    closeable: Boolean,
    selectable: Boolean,
    highlighted: Boolean,
    count: Number,
    iconName: {
      type: String,
      default: null,
    },
    fontSize: {
      type: String,
      default: '0.65rem',
    },
    iconSize: {
      type: String,
      default: '24px',
    },
    color: {
      type: String,
      default: '#e0e0e0',
    },
    isSmall: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
  methods: {
    clicked: function clicked() {
      this.$emit('clicked', this.name);
    },
  },
};
</script>
