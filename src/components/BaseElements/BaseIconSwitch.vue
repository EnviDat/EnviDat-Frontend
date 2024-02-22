<template>
  <div class="baseIconSwitch">
    <v-tooltip bottom >

      <template v-slot:activator="{ on }">
        <button
          tabindex="0"
          type="button"
          :disabled="disabled"
          class="iconSwitchPip"
          :id="'iconSwitchPip' + _uid"
          :class="classList" 
          role="switch"
          :aria-labelledby="'iconSwitchLabel' + _uid"
          :aria-checked="active"
          @click="emitClick"
          v-on="on"
        >
          <v-icon v-if="materialIconName" class="iconSwitchPipIcon" :color="pipColor">
            {{ materialIconName }}
          </v-icon>
        </button>
      </template>

      <label :for="'iconSwitchPip' + _uid">{{ tooltipText }}</label>

    </v-tooltip>
  </div>
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
  watch: {
    active: {
      immediate: true,
      handler(newValue){
        this.internalActive = newValue;
      },
    },
  },
  data: () => ({
    internalActive: false,
  }),
  computed: {
    classList(){
      return {
        'clickable': !this.disabled,
        'active': this.active,
      }
    },
    pipColor(){
      return this.internalActive ? 'primary' : 'gray';
    },
    bgColor() {
      return this.internalActive ? 'primary lighten-2' : 'gray lighten-1';
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

<style scoped lang="scss">

$switch-length: 44px;
$switch-bg-height: 14px;
$pip-size: 26px;
$pip-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
$slide-duration: 0.2s;

.baseIconSwitch {
  position: relative;
  z-index: 0;
  width: $switch-length;
  height: $pip-size;
  .iconSwitchPip {
    margin: 0;
    padding: 0;
    box-shadow: $pip-shadow;
    border-radius: 50%;
    background-color: #fff;
    height: $pip-size;
    width: $pip-size;
    left: 0;
    transition: left $slide-duration ease-in-out;

    &.active {
      $activeDelta: $switch-length - $pip-size;
      position: absolute;
      left: $activeDelta;
      transition: left $slide-duration ease-in-out;
      &:before {
        margin-left: -$activeDelta;
        transition: margin-left $slide-duration ease-in-out;
      }
    }

    &.clickable {
      &:hover {
        box-shadow: $pip-shadow, 0 0 0 4px rgba(33,33,33,0.2);
      }
    }

    // BG
    &:before {
      content: ' ';
      position: absolute;
      display: block; 
      width: $switch-length;
      height: $switch-bg-height;
      border-radius: 8px; 
      top: ($pip-size - $switch-bg-height) / 2;
      background-color: lightgray;
      box-shadow: inset 1px 1px 3px rgba(33, 33, 33, 0.2);
      z-index: -1; // Behind the pip
    }

  }
}

</style>
