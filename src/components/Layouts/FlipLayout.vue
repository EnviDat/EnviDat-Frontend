<template>
  <div :style="`height: ${height}px; width: ${width}px; position: relative; `">

    <div :style="`position: absolute; z-index: 2; top: 10px; left: ${ width - 50}px; width: 40px;`">

      <base-icon-button :materialIconName="buttonIcon"
                        iconColor="black"
                        :color="buttonColor"
                        :isElevated="true"
                        :isSmall="true"
                        @clicked="flipCard" />
    </div>

    <div class="flipAnimation"
         :class="animationFlip()" >

      <div class="front" >
        <slot name="front"></slot>
      </div>

      <div class="back" >
        <slot name="back"></slot>
      </div>
    </div>

  </div>


</template>

<script>
import BaseIconButton from '@/components/BaseElements/BaseIconButton';

/**
 * FlipLayout.vue
 *
 * @summary
 * @author Haas
 *
 * Created at     : 2022-08-31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'FlipLayout',
  props: {
    height: {
      type: Number,
      default: 300,
    },
    width: {
      type: Number,
      default: 300,
    },
    autoButtonFlip: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonIcon() {
      if (!this.autoButtonFlip) {
        return 'edit';
      }

      return this.flipped ? 'check' : 'edit';
    },
    buttonColor() {
      if (!this.autoButtonFlip) {
        return 'accent';
      }

      return this.flipped ? 'green' : 'accent';
    },
  },
  methods: {
    flipCard() {
      this.flipped = !this.flipped;
    },
    animationFlip(inAnimation = false) {
      if (inAnimation) {
        return this.flipped ? 'flipIn' : 'flipOut';
      }

      return this.flipped ? 'flipOut' : 'flipIn';
    },
  },
  data: () => ({
    flipped: false,
  }),
  components: {
    BaseIconButton,
  },
};
</script>

<style scoped >

.flipAnimation {
  transition: 0.3s ease-in-out;
  transform-style: preserve-3d;
  width: 100%;
  height: 100%;
  position: relative;
}

.flipAnimation.flipIn > .front {
  z-index: 1;
}

.flipAnimation.flipIn > .back {
  z-index: 0;
}

.flipAnimation.flipOut > .front {
  z-index: 0;
}

.flipAnimation.flipOut > .back {
  z-index: 1;
}

.flipIn {
  transform: rotateY(0deg);
}

.flipOut {
  transform: rotateY(180deg);
}

.front, .back {
  position: absolute;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* safari */
}

.front {
/*
  background-color: red;
*/
}

.back {
  transform: rotateY(180deg);
/*
  background-color: blue;
*/
}

</style>
