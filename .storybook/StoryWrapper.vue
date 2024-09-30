<template>
  <v-app :theme="themeName" class="vuetifyStorybookApp"
          style="font-family: 'Raleway', sans-serif !important;">
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
    /*
    font-family: 'Raleway', sans-serif !important;
    */
    min-height: auto;
  }
</style>

<style lang='scss' >
  @import url(../src/sass/globalStyles.scss);
</style>
