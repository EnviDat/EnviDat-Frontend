<template>
  <div
    class="stepButton px-1 px-md-2 py-0"
    :style="`border-color: ${active ? $vuetify.theme.themes.light.colors.accent : $vuetify.theme.themes.light.colors.highlight};`"
    @click="catchStepClick"
  >
    <div class="stepRow">
      <div
        v-if="showNumberOnly"
        class="stepNumber readableText text-white"
        :style="`background-color: ${stepNumberColor} ;`"
      >
        {{ number }}
      </div>

      <div v-if="!error && !showNumberOnly" class="px-2 readableText">
        {{ title }}
      </div>

      <div v-if="error" class="stepText px-2 readableText">
        <div>
          {{ title }}
        </div>

        <div class="stepErrorText" :style="`color: ${$vuetify.theme.themes.light.colors.error};`">
          {{ error }}
        </div>
      </div>

      <div v-if="!error" class="readableText pl-1 pl-md-0">
        <BaseIcon
          :icon="complete ? mdiCheckboxMarkedOutline : mdiCheckboxBlankOutline"
          :badgeDot="!complete"
          badgeColor="accent"
          :color="complete ? 'secondary' : 'grey'"
        />
      </div>

      <BaseIcon v-if="error" :icon="mdiAlertOctagram" color="error" />
    </div>
  </div>
</template>

<script>
/**
 * StepButton.vue
 *
 * @summary
 * @author Haas
 *
 * Created at     : 2023-05-03
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mdiAlertOctagram, mdiCheckboxMarkedOutline, mdiCheckboxBlankOutline } from '@mdi/js';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

export default {
  name: 'StepButton',
  components: { BaseIcon },
  data: () => ({
    mdiAlertOctagram,
    mdiCheckboxMarkedOutline,
    mdiCheckboxBlankOutline,
  }),
  props: {
    title: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    number: {
      type: Number,
      default: undefined,
    },
    active: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    showNumberOnly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    stepNumberColor() {
      return this.active
        ? this.$vuetify.theme.themes.light.colors.accent
        : this.$vuetify.theme.themes.light.colors.secondary;
    },
  },
  methods: {
    catchStepClick() {
      this.$emit('stepClick', this.title);
    },
  },
};
</script>

<style scoped>
.stepButton {
  border: 2px solid black;
  border-radius: 4px;
  height: 36px;
  display: inline-flex;
  cursor: pointer;
  background-color: whitesmoke;
}

.stepRow {
  display: inline-flex;
  align-items: center;
}

.stepText {
  display: grid;
  grid-template-rows: 20px auto;
  line-height: 1.1rem;
}

.stepErrorText {
  height: 12px;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  line-height: 0.7rem;
}

.stepNumber {
  border-radius: 50%;
  background-color: grey;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.stepNumber {
  width: 22px;
  height: 22px;
}
</style>
