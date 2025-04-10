<template>
  <v-app
    class="application envidat-font-overwrite"
    id="app-container"
  >
<!--
    :class="{
    'bg-dark': !isLandingPage && !isDashboardPage,
    'bg-dark-dashboard': isDashboardPage,
    'hide-after': isScrolled,
    }"
-->

<!--
    <div
      v-for="(notification, index) in visibleNotifications()"
      :key="`notification_${index}`"
      :style="`position: absolute;
                right: ${$vuetify.display.xs ? 0 : 15}px;
                top: ${35 + index * 175}px;
                z-index: ${NotificationZIndex};`"
    >
      <NotificationCard
        :notification="notification"
        :height="165"
        :showReportButton="
          config.errorReportingEnabled && notification.type === 'error'
        "
        :showCloseButton="true"
        @clickedClose="catchCloseClicked(notification.key)"
        @clickedReport="catchReportClicked(notification.key)"
      />
    </div>

    <MaintenanceBanner v-if="maintenanceBannerVisible" />
-->

<!--
    <TheNavigationToolbar
      ref="TheNavigationToolbar"
      class="envidatToolbar"
      :style="`z-index: ${NavToolbarZIndex}`"
      :loading="loading"
      :mode="mode"
      :modeCloseCallback="catchModeClose"
      :signedInUser="user"
      :signInDisabled="signinDisabled"
      :userNavigationItems="userMenuItems"
      :editingDatasetName="lastEditedDataset"
      @userMenuItemClick="catchUserItemClicked"
      @signinClick="catchSigninClicked"
      @homeClick="catchHomeClicked"
      @continueClick="catchContinueClick"
    />
-->

    <TheNavigation
      style="z-index: 1100;"
      :navigationItems="navigationItems"
      version="1.0.0-vike"
    />

    <v-main class="pt-13 pt-md-9 custom-v-main">
      <v-container
        class="mainPageContainer"
        fluid
        id="appContainer"
        ref="appContainer"
      >
        <v-row id="mainPageRow" no-gutters>
          <v-col cols="12">
            <div class="content"><slot /></div>

<!--
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
-->
          </v-col>
        </v-row>

<!--
        <TextBanner
          v-if="showMaintenanceBanner"
          id="maintenanceBanner"
          :style="`position: absolute; top: 0; left: 0; z-index: 1001; width: 100%; background-color: ${maintenanceBannerColor};`"
          :text="maintenanceBannerText"
          confirmText="Okay"
          :confirmClick="catchMaintenanceConfirmClick"
        />

        <TextBanner
          v-if="showCookieInfo"
          id="cookieBanner"
          :style="bannerStyle"
          :text="cookieInfoTextMatomo"
          icon="cookie"
          deniedText="Reject"
          confirmText="Accept"
          :confirmClick="catchCookieInfoOk"
          :deniedClick="deniedTracking"
        />
-->
      </v-container>

<!--
      <v-dialog
        v-model="showReloadDialog"
        persistent
        :style="`z-index: ${NotificationZIndex};`"
        max-width="450"
      >
        <ConfirmTextCard
          title="New Version Available!"
          :text="dialogVersionText()"
          confirmText="Reload"
          :confirmClick="reloadApp"
          cancelText="Cancel"
          :cancelClick="
            () => {
              this.reloadDialogCanceled = true;
            }
          "
        />
      </v-dialog>

      <v-dialog
        v-model="showInfoDialog"
        persistent
        :style="`z-index: ${NotificationZIndex};`"
        max-width="500"
      >
        <ConfirmTextCard
          :title="dialogTitle"
          :text="dialogMessage"
          :confirmText="dialogConfirmText"
          :confirmClick="dialogCallback"
          :cancelText="dialogCancelText"
          :cancelClick="dialogCancelCallback"
        />
      </v-dialog>

      <GenericFullScreenModal :auto-scroll="true" />
-->
    </v-main>


<!--
    <div v-if="isLandingPage" class="scroll-icon">
      <v-icon @click="scrollDown()" :size="46" class="mr-1" :color="'#000'">
        {{ iconScroll }}
      </v-icon>
      <p class="font-weight-bold">Scroll</p>
    </div>
-->

  </v-app>
</template>

<script setup lang="ts">

import TheNavigation from '@/components/Navigation/TheNavigation.vue';
import { navigationItems } from '@/store/navigationState';

return {
  navigationItems,
}
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
</style>

<style scoped>
.layout {
  display: flex;
  max-width: 900px;
  margin: auto;
}
.content {
  padding: 20px;
  border-left: 2px solid #eee;
  padding-bottom: 50px;
  min-height: 100vh;
}
.navigation {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.8em;
}
.logo {
  margin-top: 20px;
  margin-bottom: 10px;
}
.navitem {
  padding: 3px;
}
</style>
