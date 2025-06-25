<script setup lang="ts">
  import { useDisplay } from 'vuetify';
  import TheNavigation from '@/components/Navigation/TheNavigation.vue';
  import TheNavigationToolbar from '@/components/Navigation/TheNavigationToolbar.vue';
  import { navigationItems, useUserMenuItems } from '@/store/navigationState';

  const NavToolbarZIndex = 1150;
  const NavigationZIndex = 1100;
  const userMenuItems = useUserMenuItems();
  const display = useDisplay();
  
  const pageStyle = () => {
    const heightStyle = `height: calc(100vh - ${display.smAndDown ? 50 : 36}px);`;

    return `${heightStyle} overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; scrollbar-width: thin; `;
  }

</script>

<template>
  <v-app
    class="application envidat-font-overwrite"
    id="app-container"
  >

    <TheNavigationToolbar
      ref="TheNavigationToolbar"
      class="envidatToolbar"
      :style="`z-index: ${NavToolbarZIndex}`"
      :userNavigationItems="userMenuItems"
    />
<!--
      v-if="showToolbar"
    :loading="loading"
    :mode="mode"
    :modeCloseCallback="catchModeClose"
    :signedInUser="user"
    :signInDisabled="signinDisabled"
      :editingDatasetName="lastEditedDataset"
      @userMenuItemClick="catchUserItemClicked"
      @signinClick="catchSigninClicked"
      @homeClick="catchHomeClicked"
      @continueClick="catchContinueClick"
-->



    <TheNavigation
      :style="`z-index: ${NavigationZIndex}`"
      :navigationItems="navigationItems"
    />
<!--
    :version="appVersion"
    @menuClick="catchMenuClicked"
    @itemClick="catchItemClicked"
-->



    <v-main class="pt-13 pt-md-9 custom-v-main">
      <v-container
        class="mainPageContainer"
        fluid
        id="appContainer"
        ref="appContainer"
        :style="pageStyle"
      >
        <v-row id="mainPageRow" no-gutters>
          <v-col cols="12">
            <div class="content"><slot /></div>

          </v-col>
        </v-row>
      </v-container>
    </v-main>

  </v-app>
</template>

<style scoped>

</style>
