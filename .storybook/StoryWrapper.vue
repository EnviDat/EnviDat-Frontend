<template>
  <v-app :theme="themeName" class="vuetifyStorybookApp">
    <v-main>
      <slot name="story"></slot>
    </v-main>
  </v-app>
</template>

<script>
import globalMethods from '../src/factories/globalMethods';

export default {
  props: {
    themeName: String,
  },
  mixins: [globalMethods],
};
</script>

<style>
  .vuetifyStorybookApp {
    min-height: fit-content !important;
  }

  .vuetifyStorybookApp > .v-application--wrap {
    min-height: fit-content !important;
    font-family: 'Raleway', sans-serif !important;
  }
</style>

<style lang='scss' >
  @import url(../src/sass/globalStyles.scss);
</style>
