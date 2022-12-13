<template>
  <v-tooltip bottom
              id="BaseIconSwitch">

    <template v-slot:activator="{ on }">

      <div v-on="on"
           style="position: relative; ">

        <div class="authorSwitch"
             :style="active ? 'left: -2px;' : 'left: 18px;'"
             @click="$emit('clicked', $event)"
             >
          <v-icon v-if="materialIconName"
                  :color="active ? 'primary' : 'gray'"
                  style="top: -4px; left: -2px;">
            {{ materialIconName }}
          </v-icon>

        </div>

        <div class="authorSwitchHover"
             :style="active ? 'left: -7px;' : 'left: 13px;'" />

        <div style="width: 38px; height: 14px; border-radius: 8px;"
             :style="`background-color: ${bgColor};`"
              class="" />

      </div>

    </template>

    <span>{{ tooltipText }}</span>

  </v-tooltip>
</template>

<script>
/**
 * BaseIconSwitch.vue create a on/off switch which can contain an icon
 * from the material design font
 *
 * @summary on/off switch with icon
 * @author Dominik Haas-Artho
 *
 * Created at     : 2022-09-15 11:32:12
 * Last modified  : 2022-09-15 11:32:12
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'BaseIconSwitch',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    materialIconName: String,
    tooltipText: String,
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
    bgColor() {
      const secondary = this.$vuetify?.theme?.themes?.light?.secondary || 'lightgray';
      return this.active ? secondary : 'lightgray';
    },
  },
};

</script>

<style>

.authorSwitch {
  z-index: 1;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
}

.authorSwitch:hover {
  cursor: pointer;
}

.authorSwitch, .authorSwitchHover {
  position: absolute;
  transition: 0.3s all ease-in-out;
  border-radius: 50%;
  background-color: #fff;
  top: -3px;
  height: 20px;
  width: 20px;
}

.authorSwitch:hover + .authorSwitchHover {
  visibility: visible;
}

.authorSwitchHover {
  visibility: hidden;
  top: -8px;
  background-color: rgba(33, 33, 33, 0.2);
  width: 30px;
  height: 30px;
  z-index: 0;
}

.authorSwitchHover:hover {
  display: inherit;
}

</style>
