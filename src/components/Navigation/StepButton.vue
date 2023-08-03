<template>

  <div class="stepButton px-2 py-1"
        :style="`border-color: ${ active ? $vuetify.theme.themes.light.accent : $vuetify.theme.themes.light.highlight };`"
        @click="catchStepClick">

    <div class="stepRow">
      <div class="stepNumber readableText white--text"
            :style="`background-color: ${stepNumberColor} ;`">
        {{ number }}
      </div>

      <div v-if="!error && title"
           class="px-3 readableText ">
          {{ title }}
      </div>

      <div v-if="error"
           class="stepText px-3 readableText ">
        <div>
          {{ title }}
        </div>

        <div class="stepErrorText"
             :style="`color: ${ $vuetify.theme.themes.light.error };`">
          {{ error }}
        </div>
      </div>
        
      <div v-if="!error"
           class="readableText" >
          <v-icon :color="complete ? 'secondary' : 'grey'">
            {{ complete ? 'check_circle' : 'check_circle_outline' }}
          </v-icon>
      </div>

      <v-icon v-if="error"
              color="error">
        error
      </v-icon>

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

export default {
  name: 'StepButton',
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
  },
  computed: {
    stepNumberColor() {
      return this.active ? this.$vuetify.theme.themes.light.accent : this.$vuetify.theme.themes.light.secondary;
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
    height: 42px;
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
    width: 24px;
    height: 24px;
  }

</style>
