<template>
  <v-badge
    id="BaseIconToggleButton"
    :model-value="active"
    class="dataCreditIcon"
    bordered
    :disabled="disabled"
    :icon="mdiCheck"
    style="width: 32px; height: 32px"
    :color="dark ? 'white' : 'black'"
  >
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          :class="{ noHover: elevation == 0 }"
          :disabled="disabled"
          color="transparent"
          :elevation="elevation"
          :variant="disabled ? 'text' : 'elevated'"
          size="32"
          @click.stop="onClick"
        >
          <v-icon :disabled="disabled" :icon="icon" :color="dark ? 'white' : 'black'" />
        </v-btn>
      </template>

      <div v-html="tooltip" />
    </v-tooltip>
  </v-badge>
</template>

<script>
/**
 * BaseIconToggleButton.vue
 *
 * @summary a clickable icon button which emits 'clicked' event
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mdiCheck } from '@mdi/js';

export default {
  name: 'BaseIconToggleButton',
  props: {
    active: { type: Boolean, default: false },
    value: { type: String, default: undefined },
    outlineColor: { type: String, default: undefined },
    tooltip: { type: String, default: undefined },
    icon: { type: String, default: undefined, required: true },
    dark: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    elevation: { type: Number, default: 2 },
  },
  computed: {},
  methods: {
    onClick() {
      this.$emit('clicked', this.value);
    },
  },
  data: () => ({
    mdiCheck,
  }),
};
</script>

<style scoped lang="scss">
.fancyButton {
  background-color: #00bfad;
  background-image: linear-gradient(to right bottom, #e2f27c, #00bfad);
}

.fancyButton:hover {
  background-image: linear-gradient(to right bottom, #e2f27c 20%, #00bfad);
}

.glowingButton {
  animation-name: glowing;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
}

.noHover {
  cursor: default;
}

@keyframes glowing {
  0% {
    box-shadow: 0 0 10px 0 yellow;
  }

  50% {
    box-shadow: 0 0 10px 10px yellow;
  }

  100% {
    box-shadow: 0 0 10px 0 yellow;
  }
}
</style>
