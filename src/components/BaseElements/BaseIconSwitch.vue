<template>
  <div class="baseIconSwitch">
    <v-tooltip bottom >

      <template v-slot:activator="{ on }">
        <button
          tabindex="0"
          type="button"
          :disabled="disabled"
          class="iconSwitchButton"
          :id="'iconSwitchButton' + _uid"
          :class="classList" 
          :style="styleList"
          role="switch"
          :aria-labelledby="'iconSwitchLabel' + _uid"
          :aria-checked="active"
          @click="emitClick"
          v-on="on"
        >
          <v-icon v-if="materialIconName" class="iconSwitchButtonIcon" :color="iconColor">
            {{ materialIconName }}
          </v-icon>
        </button>
      </template>

      <label :for="'iconSwitchButton' + _uid">{{ tooltipText }}</label>

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
    color: {
      type: String,
      default: 'primary',
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
    styleList() {
      return {

      }
    },
    classList(){
      return {
        'clickable': !this.disabled,
        'active': this.active,
        [`${this.color}--text text--lighten-2`]: this.internalActive,
        'grey--text text--lighten-1': !this.internalActive,
      }
    },
    iconColor(){
      return this.internalActive ? this.color : 'gray';
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
$button-size: 26px;
$button-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
$slide-duration: 0.2s;

.baseIconSwitch {
  position: relative;
  z-index: 0;
  width: $switch-length;
  height: $button-size;
  .iconSwitchButton {
    margin: 0;
    padding: 0;
    box-shadow: $button-shadow;
    border-radius: 50%;
    background-color: #fff;
    height: $button-size;
    width: $button-size;
    left: 0;
    transition: left $slide-duration ease-in-out;

    &.active {
      $activeDelta: $switch-length - $button-size;
      position: absolute;
      left: $activeDelta;
      transition: left $slide-duration ease-in-out;
      &:before {
        margin-left: -$activeDelta;
        transition: margin-left $slide-duration ease-in-out, background-color $slide-duration;
      }
    }

    &.clickable {
      &:hover {
        box-shadow: $button-shadow, 0 0 0 4px rgba(33,33,33,0.2);
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
      top: ($button-size - $switch-bg-height) / 2;
      background-color: currentColor;
      box-shadow: inset 1px 1px 3px rgba(33, 33, 33, 0.2);
      z-index: -1; // Behind the button
    }

  }
}

</style>
