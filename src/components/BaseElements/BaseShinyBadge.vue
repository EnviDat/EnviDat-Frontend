<template>
  <div class="shinyBadge" :class="isSmall ? 'v-btn v-size--x-small px-2 pt-2 smallBadge' : ''">
    {{ upperText }}

    <span v-if="showShine"></span>
  </div>
</template>

<script>
/**
 * BaseShinyBadge.vue shows a fancy badge / tag with a shiny star.
 * The shine can be toggled.
 *
 * @summary badge / tag with a little star
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
export default {
  name: 'BaseShinyBadge',
  props: {
    text: {
      type: String,
      required: true,
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
    showShine: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    upperText() {
      return this.text.toUpperCase();
    },
  },
};
</script>

<style scoped>
.shinyBadge {
  position: relative;
  display: inline-block;
  line-height: 0.5rem;
  text-decoration: none;
  padding: 8px 16px;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background: linear-gradient(#71c5bd, #00897b);
  border-radius: 999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  user-select: none;
  font-size: 0.7rem;
}

.smallBadge {
  font-size: 0.5rem;
  line-height: 0.25rem;
}

.shinyBadge span {
  width: 25px;
  height: 25px;
  position: absolute;
  top: -6px;
  right: -2px;
  filter: blur(0.5px);
  animation: progress-circular-rotate 5s linear infinite;
}
.shinyBadge span:before,
.shinyBadge span:after {
  content: '';
  position: absolute;
}
.shinyBadge span:before {
  width: 1px;
  height: 100%;
  left: 12px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.7), transparent);
}
.shinyBadge span:after {
  width: 100%;
  height: 1px;
  top: 12px;
  background: linear-gradient(to left, transparent, rgba(255, 255, 255, 0.7), transparent);
}
</style>
