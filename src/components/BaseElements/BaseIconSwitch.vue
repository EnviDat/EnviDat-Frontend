<template>
  <v-tooltip bottom
              id="BaseIconSwitch" >

    <template v-slot:activator="{ on }">

      <div v-on="on"
           style="position: relative; width: 44px; " >

        <div class="authorSwitch"
             :class="disabled ? '': 'authorSwitchClickable'"
             :style="active ? 'left: -5px;' : 'left: 21px;'"
             @click="emitClick"
             >
          <v-icon v-if="materialIconName"
                  :color="active ? 'primary' : 'gray'"
                  style="top: 0; left: 1px;">
            {{ materialIconName }}
          </v-icon>

        </div>

        <div class="authorSwitchHover"
             :style="active ? 'left: -10px;' : 'left: 16px;'" />

        <div style="width: 44px; height: 14px; border-radius: 8px;"
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
    disabled: {
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
    bgColor() {
      const secondary = this.$vuetify?.theme?.themes?.light?.secondary || 'lightgray';
      return this.active ? secondary : 'lightgray';
    },
  },
  methods: {
    emitClick(event) {
      if (this.disabled){
        return;
      }
      
      this.$emit('clicked', event);
    },
  },
};

</script>

<style>

.authorSwitch {
  z-index: 1;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
}

.authorSwitchClickable:hover {
  cursor: pointer;
}

.authorSwitch, .authorSwitchHover {
  position: absolute;
  transition: 0.3s all ease-in-out;
  border-radius: 50%;
  background-color: #fff;
  top: -6px;
  height: 26px;
  width: 26px;
}

.authorSwitch:hover + .authorSwitchHover {
  visibility: visible;
}

.authorSwitchHover {
  visibility: hidden;
  top: -11px;
  background-color: rgba(33, 33, 33, 0.2);
  width: 36px;
  height: 36px;
  z-index: 0;
}

.authorSwitchHover:hover {
  display: inherit;
}

</style>
