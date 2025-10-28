<template>
  <v-app
    :theme="themeName"
    class="vuetifyStorybookApp"
    style="font-family: 'Raleway', sans-serif !important"
    id="storyWrapper--v-app"
    ref="storyWrapper--v-app"
  >
    <v-main id="storyWrapper--v-main" ref="storyWrapper--v-main">
      <slot name="story"></slot>
    </v-main>
  </v-app>
</template>

<script>
export default {
  props: {
    themeName: String,
  },
  provide() {
    return {
      getStorybookAppRefs: () => this.$refs,
    };
  },
  mounted() {
    // console.log('StoryWrapper refs', this.$refs);
  },
  data: () => ({
    storybookAppRefs: null,
  }),
};
</script>

<style>
.vuetifyStorybookApp {
  background-color: transparent;
}

.vuetifyStorybookApp .v-application__wrap {
  /*
    font-family: 'Raleway', sans-serif !important;
    */
  min-height: auto;
}
</style>

<style lang="scss">
@import url(../src/sass/globalStyles.scss);
</style>
