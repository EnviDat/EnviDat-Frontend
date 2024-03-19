<template>
  <v-app :theme="themeName" class="vuetifyStorybookApp">
    <v-main>
      <slot name="story"></slot>
    </v-main>
  </v-app>
</template>

<script>

export default {
  props: {
    themeName: String,
  },
};
</script>

<style>
  .vuetifyStorybookApp .v-application__wrap {
    font-family: 'Raleway', sans-serif;
    min-height: auto;
  }
</style>

<style lang='scss' >
  @import url(../src/sass/globalStyles.scss);
</style>
