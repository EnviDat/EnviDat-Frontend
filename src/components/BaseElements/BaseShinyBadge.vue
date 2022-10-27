<template>
  <div class="v-badge">
    {{ text }}
    <span></span>
  </div>
</template>

<script>
export default {
  name: 'BaseShinyBadge',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped >

.v-badge {
  position: relative;
  text-decoration: none;
  padding: 8px 16px;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background: linear-gradient(#6D67B9, #5747AC);
  border-radius: 999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  user-select: none;
}
.v-badge span {
  width: 25px;
  height: 25px;
  position: absolute;
  top: -12px;
  right: -2px;
  transform: rotate(-20deg);
  filter: blur(0.5px);
}
.v-badge span:before, .v-badge span:after {
  content: "";
  position: absolute;
}
.v-badge span:before {
  width: 1px;
  height: 100%;
  left: 12px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.7), transparent);
}
.v-badge span:after {
  width: 100%;
  height: 1px;
  top: 12px;
  background: linear-gradient(to left, transparent, rgba(255, 255, 255, 0.7), transparent);
}
.v-badge:before {
  content: "";
  position: absolute;
  z-index: -1;
  background: radial-gradient(97% 235% at 75% 20%, white 0%, rgba(135, 187, 255, 0.7) 38%, rgba(255, 255, 255, 0.21) 100%);
  top: -1px;
  right: -1px;
  bottom: -1px;
  left: -1px;
  border-radius: 999px;
}



</style>
