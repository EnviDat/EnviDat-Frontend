<template>
  <div class="baseIconSwitch">
    <v-tooltip :disabled="!tooltipText" bottom>
      <template v-slot:activator="{ props }">
        <div class="d-flex" v-bind="props">
          <div class="iconSwitch">
            <button
              tabindex="0"
              type="button"
              :disabled="disabled"
              class="iconSwitchButton"
              :id="'iconSwitchButton' + $.uid" :class="classList"
              role="switch"
              :aria-describedby="'iconSwitchLabel' + $.uid"
              :aria-checked="active" @click="emitClick">

              <BaseIcon
                :icon="icon"
                :color="iconColor"
              />
            </button>
          </div>
          <label v-if="label" :for="'iconSwitchButton' + $.uid" class="iconSwitchLabel" :class="{ disabled }">
            {{ label }}
          </label>
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

import BaseIcon from './BaseIcon.vue';

export default {
  name: 'BaseIconSwitch',
  components: { BaseIcon },
  props: {
    label: { type: String, default: undefined },
    icon: { type: String, default: undefined, required: true },
    color: { type: String, default: 'primary' },
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    tooltipText: { type: String, default: undefined },
  },
  watch: {
    active: {
      immediate: true,
      handler(newValue) {
        this.internalActive = newValue;
      },
    },
  },
  data: () => ({
    internalActive: false,
  }),
  computed: {
    classList() {
      return {
        disabled: this.disabled,
        active: this.internalActive,
        [`text-${this.color}-lighten-2`]: this.internalActive,
        'text-grey-lighten-2': !this.internalActive,
      };
    },
    iconColor() {
      return this.internalActive ? this.color : 'grey';
    },
  },
  methods: {
    emitClick(event) {
      if (this.disabled) {
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
$button-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
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
    min-height: $button-size;

    .iconSwitchButton {
      position: absolute;
      border-radius: 50%;
      height: $button-size;
      width: $button-size;
      left: 0;
      box-shadow: $button-shadow;
      background-color: #FFF;
      transition: none;
      display: grid;

      .baseIcon {
        justify-self: center;
        align-self: center;
      }

      &:hover {
        box-shadow: $button-shadow, 0 0 0 4px rgba(33, 33, 33, 0.2);
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
        top: calc(($button-size - $switch-bg-height) / 2) + 1px;
        background-color: currentColor;
        z-index: -1; // Behind the button
        box-shadow: inset 1px 1px 3px rgba(33, 33, 33, 0.2);
      }

    }
  }
}
</style>
