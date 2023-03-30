<template>
  <div
    class="cube_wrapper"
    :style="`transform: rotateX(-30deg) translateX(${positionOffset}%);`"
  >
    <div class="cube">
      <div
        v-for="index in 6"
        :key="index"
        class="cube_face"
        :style="`background-color: ${color}`"
      />
    </div>
  </div>
</template>

<script>
/**
 * MetadataCube.vue creates a small cube to illustrate the different sections which metadata consist of.
 *
 * @summary cube with slices
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-11-17 13:45:56
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'MetadataCube',
  props: {
    positionOffset: {
      type: Number,
      default: 10,
    },
    color: {
      type: String,
      default: 'green',
    },
  },
  methods: {
    clicked() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped>
.cube_wrapper {
  /* transform: rotateX(-30deg) translateX(0%); */
  /* margin: 50px auto; */
  /* left: 50%; */
  position: relative;

  /* margin: 50px auto;
    left: 50%;
    position: absolute; */
  transform-style: preserve-3d;
}

.cube {
  transition: all 0.3s ease;
  height: 50px;
  width: 150px;
  transform: rotateY(-65deg);
  transform-style: preserve-3d;
  animation: cube_rotate 20s infinite linear;
}

.cube_face {
  color: rgb(100, 100, 100);
  background: blue;
  border: solid 1px black;
  position: absolute;
  transform-style: preserve-3d;
  box-sizing: border-box;
  /* backface-visibility: hidden; */
  height: 50px;
  width: 50px;
  opacity: 0.25;
}

.cube_face span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 7rem;
}

/* .cube_face img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 150px;
    width: 50px;
    filter: grayscale(70%);
  } */

.cube .cube_face:nth-child(1) {
  width: 150px;
  height: 150px;
  transform: rotateX(90deg) rotateY(0deg) translateZ(25px);
  filter: brightness(90%);
}

.cube .cube_face:nth-child(2) {
  width: 150px;
  transform: rotateX(0deg) rotateY(0deg) translateZ(75px);
  filter: brightness(80%);
}

.cube .cube_face:nth-child(3) {
  width: 150px;
  transform: rotateX(0deg) rotateY(90deg) translateZ(75px);
  filter: brightness(70%);
}

.cube .cube_face:nth-child(4) {
  width: 150px;
  transform: rotateX(0deg) rotateY(180deg) translateZ(75px);
  filter: brightness(80%);
}

.cube .cube_face:nth-child(5) {
  width: 150px;
  transform: rotateX(0deg) rotateY(270deg) translateZ(75px);
  filter: brightness(70%);
}

.cube .cube_face:nth-child(6) {
  width: 150px;
  height: 150px;
  transform: rotateX(-90deg) rotateY(0deg) translateZ(-25px);
  filter: brightness(60%);
}

@keyframes cube_rotate {
  0% {
    transform: rotateY(-0deg);
  }
  25% {
    transform: rotateY(-90deg);
  }
  50% {
    transform: rotateY(-180deg);
  }
  100% {
    transform: rotateY(-360deg);
  }
  /*
    0% {transform: rotateY(-45deg);}
    16.7% {transform: rotateY(-45deg) rotateX(-90deg);}
    33.3% {transform: rotateY(-45deg) rotateX(-90deg) rotateZ(90deg) rotateX(0deg);}
    50% {transform: rotateY(-45deg) rotateX(-90deg) rotateZ(90deg) rotateX(-90deg);}
    66.7% {transform: rotateY(-45deg) rotateX(-90deg) rotateZ(90deg) rotateX(-90deg) rotateZ(90deg) rotateX(0deg);}
    83.3% {transform: rotateY(-45deg) rotateX(-90deg) rotateZ(90deg) rotateX(-90deg) rotateZ(90deg) rotateX(-90deg);}
    100% {transform: rotateY(-45deg) rotateX(-90deg) rotateZ(90deg) rotateX(-90deg) rotateZ(90deg) rotateX(-90deg) rotateZ(90deg);} */
}
</style>
