<template>
  <div class="baseIconSwitch">
    <v-tooltip :disabled="!tooltipText" bottom>
      <template v-slot:activator="{ on }">
        <div class="d-flex" v-on="on">
          <div class="iconSwitch">
            <button
              tabindex="0"
              type="button"
              :disabled="disabled"
              class="iconSwitchButton"
              :id="'iconSwitchButton' + _uid"
              :class="classList"
              role="switch"
              :aria-describedby="'iconSwitchLabel' + _uid"
              :aria-checked="active"
              @click="emitClick"
            >
              <v-icon v-if="materialIconName" class="iconSwitchButtonIcon" :color="iconColor">
                {{ materialIconName }}
              </v-icon>
            </button>
          </div>
          <label v-if="label" :for="'iconSwitchButton' + _uid" class="iconSwitchLabel" :class="{disabled}">{{ label }}</label>
        </div>
      </template>
      <span v-if="tooltipText">{{ tooltipText }}</span>
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
    label: {
      type: String,
      default: undefined,
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
    classList(){
      return {
        disabled: this.disabled,
        active: this.active,
        [`${this.color}--text text--lighten-2`]: this.internalActive,
        'grey--text text--lighten-2': !this.internalActive,
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
  display: flex;
  flex-wrap: nowrap;
  .iconSwitchLabel {
    user-select: none;
    padding-left: 12px;
    margin-top: 3px;
    cursor: pointer;
    &.disabled {
      cursor: default;
      color: rgba(0, 0, 0, 0.38);
    }
  }

  .iconSwitch {
    position: relative;
    z-index: 0;
    min-width: $switch-length;
    min-height: $button-size + 4px;
    .iconSwitchButton {
      position: absolute;
      border-radius: 50%;
      height: $button-size;
      width: $button-size;
      left: 0;
      box-shadow: $button-shadow;
      background-color: #FFF;
      transition: none;

      &:hover {
        box-shadow: $button-shadow, 0 0 0 4px rgba(33,33,33,0.2);
      }

      &.active {
        $activeDelta: $switch-length - $button-size;
        left: $activeDelta;
        transition: left $slide-duration ease-in-out;
        &:before {
          margin-left: -$activeDelta;
          transition: margin-left $slide-duration ease-in-out, background-color $slide-duration;
        }
      }

      &.disabled {
        background-color: #DDD;
        cursor: not-allowed;
        box-shadow: 0 0 1px 1px rgba(33, 33, 33, 0.1);
        &:before {
          box-shadow: none;
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
        z-index: -1; // Behind the button
        box-shadow: inset 1px 1px 3px rgba(33, 33, 33, 0.2);
      }

    }
  }
}

</style>
