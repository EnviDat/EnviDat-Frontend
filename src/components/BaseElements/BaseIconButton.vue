<template>
  <div
    :style="`height: ${height}px; `"
    @mouseover="hoverBadge = true"
    @mouseleave="hoverBadge = false"
  >
    <v-tooltip
      v-if="$vuetify.breakpoint.mdAndUp && tooltipText"
      v-bind="{ top: !tooltipBottom, bottom: tooltipBottom }"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :style="{
            height: `${height}px`,
            width: `${height}px`,
            backgroundColor: fillColor ? fillColor : '',
          }"
          style="margin: 0 !important;"
          :icon="!isElevated"
          :fab="isElevated"
          :small="(isSmall || isElevated) && !(isSmall && isElevated)"
          :x-small="isSmall && isElevated"
          :outlined="outlined"
          :color="color ? color : disabled ? '' : 'primary'"
          :href="url"
          :disabled="disabled"
          :class="buttonClass"
          v-bind="{ ['target']: '_blank' }"
          @click.stop="onClick"
        >
          <div v-if="customIcon">
            <img
              class="envidatIcon"
              :alt="`${customIcon} icon`"
              :src="customIcon"
            />
          </div>

          <v-icon
            v-if="materialIconName"
            :color="iconColor ? iconColor : 'primary'"
            :style="
              rotateOnClick && rotateToggle ? 'transform: rotate(-180deg);' : ''
            "
          >
            {{ materialIconName }}
          </v-icon>

          <slot v-else> </slot>
        </v-btn>
      </template>

      <span>{{ tooltipText }}</span>
    </v-tooltip>

    <v-btn
      v-else
      :style="{ backgroundColor: fillColor ? fillColor : '' }"
      style="margin: 0 !important;"
      :icon="!isElevated"
      :fab="isElevated"
      :small="isSmall || isElevated"
      :outlined="outlined"
      :color="color ? color : disabled ? '' : 'primary'"
      :href="url"
      :disabled="disabled"
      :class="buttonClass"
      v-bind="{ ['target']: '_blank' }"
      @click.stop="onClick"
    >
      <div v-if="customIcon" class="iconCentering">
        <img
          class="envidatIcon"
          :alt="`${customIcon} icon`"
          :src="customIcon"
        />
      </div>

      <v-icon
        v-if="materialIconName"
        :color="iconColor ? iconColor : 'primary'"
        :style="
          rotateOnClick && rotateToggle ? 'transform: rotate(-180deg);' : ''
        "
      >
        {{ materialIconName }}
      </v-icon>

      <slot v-else> </slot>
    </v-btn>

    <v-badge
      v-if="count > 0"
      :overlap="!isSmall"
      :left="isSmall"
      :style="isSmall ? 'position: relative; bottom: 10px;' : ''"
      color="highlight"
      :class="{ envidatBadgeBigNumber: count > 9, envidatBadge: count <= 9 }"
      @click.stop="onClick"
    >
      <span slot="badge" class="black--text">
        {{ count }}
      </span>
    </v-badge>
  </div>
</template>

<script>
/**
 * BaseIconButton.vue creates a round button with an icon, either a custom icon or a material (material design libery) icon.
 * Similar to @class RectangleButton
 * React on the 'clicked' event or pass an @prop url to create a href-link.
 *
 * Fill the @prop tooltipText for a tooltip when hovering over the Button.
 * Use the @prop tooltipBottom to set it to appear beneath the button.
 *
 * The @prop iconColor only works for material icons.
 *
 * Set the @prop rotateOnClick to true for the icon to rotate 180° once clicked
 *
 * If @prop count is > 0 a little Circle with the number is appear in the bottom left of the icon Button.
 *
 * The @prop isElevated creates a FAB button with high elevation (box-shadows) if true.
 *
 * When @prop disabled is true clicks won't do anything.
 *
 * @summary a clickable icon button which emits 'clicked' event
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:32:12
 * Last modified  : 2019-11-01 14:04:34
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'BaseIconButton',
  props: {
    fillColor: String,
    customIcon: String,
    materialIconName: String,
    tooltipText: String,
    tooltipBottom: Boolean,
    color: String,
    iconColor: String,
    outlined: Boolean,
    isSmall: Boolean,
    rotateOnClick: Boolean,
    rotateToggle: Boolean,
    url: String,
    isElevated: Boolean,
    disabled: Boolean,
    count: Number,
    overwriteHeight: Number,
    isFancy:Boolean,
    isGlowing:Boolean,
  },
  data: () => ({
    hoverBadge: false,
  }),
  computed: {
    height() {
      if (this.overwriteHeight) {
        return this.overwriteHeight;
      }

      let height = 36;

      if (this.isSmall) {
        height = 28;
      } else if (this.isElevated) {
        height = 40;
      }

      return height;
    },
    buttonClass() {
      let classes = this.isFancy ? 'fancyButton' : '';

      classes += this.isGlowing ? ' glowingButton' : '';

      return classes;
    },
  },
  methods: {
    onClick() {
      this.$emit('clicked');
    },
  },
};
</script>

<style scoped>
.fancyButton {
  background-color: #00BFAD;
  background-image:
    linear-gradient(
      to right bottom,
      #E2F27C,
      #00BFAD
    );
}

.fancyButton:hover {
  background-image:
    linear-gradient(
      to right bottom,
      #E2F27C 20%,
      #00BFAD
    );
}

.glowingButton {
  animation-name: glow;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
}

@keyframes glow {
  from {
    box-shadow: 0 0 10px 0 yellow;
  }

  50% {
    box-shadow: 0 0 10px 10px yellow;
  }

  to {
    box-shadow: 0 0 10px 0 yellow;
  }
}

</style>
