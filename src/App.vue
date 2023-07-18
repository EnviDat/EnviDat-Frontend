<template>
  <v-app class="application envidat-font-overwrite"
         :style="dynamicBackground">

    <div v-show="showDecemberParticles"
         id="christmas-canvas"
         style="position: absolute; width: 100%; height: 100%;"></div>

    <link v-if="showDecemberParticles"
          rel="stylesheet"
          href="./particles/decemberEffects.css">

    <div v-for="(notification, index) in visibleNotifications()"
         :key="`notification_${index}`"
         :style="`position: absolute;
                  right: ${$vuetify.breakpoint.xsOnly ? 0 : 15}px;
                  top: ${35 + index * 175}px;
                  z-index: ${NotificationZIndex};`">

      <notification-card v-if="notification.show"
                         :notification="notification"
                         :height="165"
                         :showReportButton="config.errorReportingEnabled && notification.type === 'error'"
                         :showCloseButton="true"
                         @clickedClose="catchCloseClicked(notification.key)"
                         @clickedReport="catchReportClicked(notification.key)"/>
    </div>

    <the-navigation :style="`z-index: ${NavigationZIndex}`"
                    :navigationItems="navigationItems"
                    :version="appVersion"
                    @menuClick="catchMenuClicked"
                    @itemClick="catchItemClicked"/>

    <the-navigation-toolbar v-if="showToolbar"
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
                            @continueClick="catchContinueClick"/>

    <v-main>
      <v-container class="pa-2 pa-sm-3 fill-height"
                   fluid
                   v-on:scroll="updateScroll()"
                   id="appContainer"
                   ref="appContainer"
                   :style="pageStyle">

        <v-row v-if="maintenanceBannerVisible"
               id="maintenanceBanner"
               no-gutters
               class="pb-2">
          <v-col>
            <TextBanner :text="maintenanceBannerText"
                        confirmText="Okay"
                        :bannerColor="maintenanceBannerColor"
                        :confirmClick="catchMaintenanceConfirmClick"/>
          </v-col>
        </v-row>

        <v-row class="fill-height"
               id="mainPageRow">
          <v-col class="mx-0 py-0"
                 cols="12">

            <transition name="fade" mode="out-in">
              <router-view/>
            </transition>

          </v-col>
        </v-row>
      </v-container>

      <TextBanner v-if="showCookieInfo"
                  style="position: absolute; bottom: 0; z-index: 1001; width: 100%; "
                  :text="cookieInfoText"
                  confirmText="Okay"
                  bannerColor="highlight"
                  :confirmClick="catchCookieInfoOk"/>

      <v-dialog v-model="showReloadDialog"
                persistent
                :style="`z-index: ${NotificationZIndex};`"
                max-width="450">

        <ConfirmTextCard title="New Version Available!"
                         :text="dialogVersionText()"
                         confirmText="Reload"
                         :confirmClick="reloadApp"
                         cancelText="Cancel"
                         :cancelClick="() => { reloadDialogCanceled = true }"
        />

      </v-dialog>

      <v-dialog v-model="showInfoDialog"
                persistent
                :style="`z-index: ${NotificationZIndex};`"
                max-width="500">

        <ConfirmTextCard :title="dialogTitle"
                         :text="dialogMessage"
                         :confirmText="dialogConfirmText"
                         :confirmClick="dialogCallback"
                         :cancelText="dialogCancelText"
                         :cancelClick="dialogCancelCallback"
        />

      </v-dialog>

      <GenericFullScreenModal :auto-scroll="true"/>
    </v-main>

  </v-app>
</template>

<script>
/**
 * The App.vue bootstraps all the other components.
 *
 * @summary main component
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2021-08-03 12:10:41
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  mapState,
  mapGetters,
} from 'vuex';

import { getMonth } from 'date-fns';

import {
  LANDING_PATH,
  LANDING_PAGENAME,
  BROWSE_PATH,
  BROWSE_PAGENAME,
  REPORT_PATH,
  USER_SIGNIN_PATH,
  METADATAEDIT_PAGENAME,
  USER_DASHBOARD_PATH,
  USER_DASHBOARD_PAGENAME,
  USER_SIGNIN_PAGENAME,
} from '@/router/routeConsts';

import {
  METADATA_NAMESPACE,
  BULK_LOAD_METADATAS_CONTENT,
} from '@/store/metadataMutationsConsts';

import {
  SET_CONFIG,
  SET_APP_SCROLL_POSITION,
  TRIM_NOTIFICATIONS,
  HIDE_NOTIFICATIONS,
} from '@/store/mainMutationsConsts';

import {
  USER_SIGNIN_NAMESPACE,
  GET_USER_CONTEXT,
  ACTION_GET_USER_CONTEXT,
  SIGNIN_USER_ACTION,
  USER_NAMESPACE,
  ACTION_GET_USER_CONTEXT_TOKEN,
} from '@/modules/user/store/userMutationsConsts';


import {
  navigationItems,
  userMenuItems,
} from '@/store/navigationState';

import {
  eventBus,
  OPEN_FULLSCREEN_MODAL,
  SHOW_DIALOG,
  SHOW_REDIRECT_DASHBOARD_DIALOG,
  SHOW_REDIRECT_SIGNIN_DIALOG,
} from '@/factories/eventBus';

import TheNavigation from '@/components/Navigation/TheNavigation.vue';
import TheNavigationToolbar from '@/components/Navigation/TheNavigationToolbar.vue';
import '@/../node_modules/skeleton-placeholder/dist/bone.min.css';

import { ENVIDAT_SHOW_COOKIE_BANNER } from '@/factories/metadataConsts';

const GenericFullScreenModal = () => import('@/components/Layouts/GenericFullScreenModal.vue');
const ConfirmTextCard = () => import('@/components/Cards/ConfirmTextCard.vue');
const TextBanner = () => import('@/components/Layouts/TextBanner.vue');
const NotificationCard = () => import('@/components/Cards/NotificationCard.vue');

export default {
  name: 'App',
  beforeCreate() {
    // check for the backend version
    this.$store.dispatch(SET_CONFIG);
  },
  created() {
    eventBus.on(OPEN_FULLSCREEN_MODAL, this.openGenericFullscreen);
    eventBus.on(SHOW_DIALOG, this.openGenericDialog);
    eventBus.on(SHOW_REDIRECT_SIGNIN_DIALOG, this.showRedirectSignDialog);
    eventBus.on(SHOW_REDIRECT_DASHBOARD_DIALOG, this.showRedirectDashboardDialog);

    const strShowCookieInfo = localStorage.getItem(ENVIDAT_SHOW_COOKIE_BANNER);
    this.showCookieInfo = strShowCookieInfo!== 'false';
  },
  beforeDestroy() {
    eventBus.on(OPEN_FULLSCREEN_MODAL, this.openGenericFullscreen);
    eventBus.off(SHOW_DIALOG, this.openGenericDialog);
    eventBus.off(SHOW_REDIRECT_SIGNIN_DIALOG, this.showRedirectSignDialog);
    eventBus.off(SHOW_REDIRECT_DASHBOARD_DIALOG, this.showRedirectDashboardDialog);
  },
  mounted() {
    this.checkUserSignedIn();

    this.$nextTick(() => {
      this.startParticles();
    })
  },
  updated() {
    this.updateActiveStateOnNavItems();
  },
  methods: {
    startParticles() {
      if (!this.currentParticles) {
        if (this.showDecemberParticles) {
          this.initChristmasParticles();
        } else {
          this.stopParticles();
        }
      }
    },
    stopParticles(fullClean = true) {

      try {

        if (this.currentParticles) {
          this.currentParticles.particles.move.enable = false;
          this.currentParticles.particles.opcacity.anim.enable = false;
          this.currentParticles.particles.size.anim.enable = false;
        }

      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Error during particle stop: ${error}`);
      } finally {
        this.currentParticles = null;
        if (fullClean) {
          window.pJS = null;
        }
      }
    },
    initChristmasParticles() {
      // particleOptions have to be in the folder public/particles/christmasParticleOptions.json for development
      // in production they have to be in same folder as the index.html there -> ./particles/christmasParticleOptions.json
      // eslint-disable-next-line no-undef
      particlesJS.load('christmas-canvas', './particles/christmasParticleOptions.json', () => {
        // console.log('christmas-canvas - particles.js config loaded');
        if (this.currentParticles) {
          this.stopParticles(false);
        }
        this.currentParticles = window.pJS;
      });

    },
    updateScroll() {
      if (this.$refs && this.$refs.appContainer) {
        this.storeScroll(this.$refs.appContainer.scrollTop);
      }
    },
    storeScroll(scrollY) {
      this.$store.commit(SET_APP_SCROLL_POSITION, scrollY);
    },
    updateActiveStateOnNavItems() {
      if (!this.navigationItems) {
        return;
      }

      for (let i = 0; i < this.navigationItems.length; i++) {
        const item = this.navigationItems[i];

        if (item.icon !== 'menu') {
          const isActive = this.currentPage === item.pageName;

          if (item.subpages && item.subpages instanceof Array) {
            let subIsActive = false;

            item.subpages.forEach((sub) => {
              if (!subIsActive) {
                subIsActive = this.currentPage === sub;
              }
            });

            item.active = isActive || subIsActive;
          } else {
            item.active = isActive;
          }
        }
      }

    },
    visibleNotifications() {
      const notis = Object.values(this.notifications);
      return notis.filter(n => n.show);
    },
    catchContinueClick() {
      if (this.lastEditedDatasetPath) {
        this.$router.push({ path: `${this.lastEditedDatasetPath}?backPath=${this.$route.fullPath}` });
      }
    },
    catchMenuClicked() {
      this.menuItem.active = !this.menuItem.active;
    },
    catchItemClicked(item) {
      if (this.signinRedirectActive && item.pageName === USER_SIGNIN_PAGENAME) {
        this.showRedirectSignDialog();

        return;
      }

      if (item.pageName === 'external') {
        window.open(item.path, '_blank');
        return;
      }

      if (this.showSmallNavigation) {
        this.catchMenuClicked();
      }

      this.navigateTo(item.path);
    },
    catchUserItemClicked(item) {

      // make a redirect in case we need to disable the editing in the frontend
      if (this.dashboardRedirect && item.pageName === USER_DASHBOARD_PAGENAME) {
        this.showRedirectDashboardDialog();

        return;
      }

      this.$router.push({ name: item.pageName });
    },
    catchSearchClicked(search) {
      this.mixinMethods_additiveChangeRoute(BROWSE_PATH, search);
    },
    catchSearchCleared() {
      // the search parameter needs to be '' to clear it
      this.mixinMethods_additiveChangeRoute(BROWSE_PATH, '');
    },
    catchModeClose() {
      this.$router.push({
        path: BROWSE_PATH,
      });
    },
    catchMaintenanceConfirmClick() {
      if (this.userIsOnEditPage) {
        this.editMaintenanceBanner = false;
        return;
      }

      this.showMaintenanceBanner = false;
    },
    navigateTo(path) {
      if (this.$route.path === path) {
        return;
      }

      this.$router.push({
        path,
        query: '',
      });
    },
    catchCloseClicked(key) {
      if (!this.notifications) return;

      this.$store.commit(HIDE_NOTIFICATIONS, key);
    },
    catchReportClicked(index) {
      if (this.$route.path === REPORT_PATH) {
        return;
      }
      this.$router.push({
        path: REPORT_PATH,
        query: index,
      });
    },
    catchCookieInfoOk() {
      localStorage.setItem(ENVIDAT_SHOW_COOKIE_BANNER, 'false');
      this.showCookieInfo = false;
    },
    redirectMessage(componentName = 'Sign In') {
      const userName = this.user?.name || '';
      return `Hello ${userName}, we are urgently working on the "${componentName}" to fix an issue.\n We are going to open a new tab with the legacy website, so you can do any dataset editing there.\n (if it doesn't work please disable popup blocking and try again).`;
    },
    handleRedirectCallBack(redirectToDashboard) {

      let message = this.redirectMessage();
      let callback = this.redirectToLegacySignin;

      if (redirectToDashboard) {
        message = this.redirectMessage('Dashboard');
        callback = this.redirectToLegacyDashboard;
      }

      eventBus.emit(SHOW_DIALOG, {
        title: 'Redirect to Legacy Website!',
        message,
        callback,
      });
    },
    redirectToLegacyDashboard() {
      const userName = this.user?.name || '';
      window.open(`${this.ckanDomain}/user/${userName}`, '_blank');

      if (this.$route.path === USER_DASHBOARD_PATH) {
        this.$router.replace('/');
      }
    },
    redirectToLegacySignin() {
      window.open(`${this.ckanDomain}/user/reset/`, '_blank');
    },
    showRedirectSignDialog() {
      this.handleRedirectCallBack(false);
    },
    showRedirectDashboardDialog() {
      this.handleRedirectCallBack(true);
    },
    // eslint-disable-next-line default-param-last
    openGenericDialog({ title = 'Redirect to Legacy Website!', message, callback, cancelCallback, confirmText = 'Ok', cancelText = 'Cancel' }) {
      this.dialogTitle = title;

      if (!message) {
        this.dialogMessage = this.redirectMessage();
      } else {
        this.dialogMessage = message;
      }

      if (cancelCallback) {
        this.dialogCancelCallback = () => {
          cancelCallback();
          this.showInfoDialog = false;
        }
      } else {
        this.dialogCancelCallback = undefined;
      }

      if (callback) {
        this.dialogCallback = () => {
          callback();
          this.showInfoDialog = false;
        }
      } else {
        this.dialogCallback = undefined;
      }

      this.dialogConfirmText = confirmText;
      this.dialogCancelText = cancelText;

      this.showInfoDialog = true;
    },
    openGenericFullscreen() {
      this.showModal = true;
    },
    catchSigninClicked() {

      // make a redirect to the legacy website in case the sign in via the frontend doesn't work
      if (this.signinRedirectActive) {
        this.showRedirectSignDialog();

        return;
      }

      this.navigateTo(USER_SIGNIN_PATH);
    },
    catchHomeClicked() {
      this.navigateTo(LANDING_PATH);
    },
    reloadApp() {
      window.location.reload();
    },
    loadAllMetadata() {
      if (!this.loadingMetadatasContent && this.metadatasContentSize <= 0) {
        this.$store.dispatch(`${METADATA_NAMESPACE}/${BULK_LOAD_METADATAS_CONTENT}`, this.config);
      }
    },
    dialogVersionText() {
      return `You are using the version ${this.appVersion}, but there is are newer version available (${this.newVersion}). Please reload to get the latest verison of EnviDat.`;
    },
    setupNavItems() {

      if (this.signinDisabled) {
        const signItem = this.navigationItems.filter(item => item.path === USER_SIGNIN_PATH)[0];
        if (signItem) {
          signItem.disabled = true;
        }
      }

    },
    checkUserSignedIn() {
      let action = ACTION_GET_USER_CONTEXT_TOKEN;

      if (this.config?.userDashboardConfig && !this.useTokenSignin) {
        action = ACTION_GET_USER_CONTEXT;
      }
      
      this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`,
        {
          action,
          commit: true,
          mutation: GET_USER_CONTEXT,
        });
    },
  },
  computed: {
    ...mapState([
      'loadingConfig',
      'config',
      'webpIsSupported',
    ]),
    ...mapState(USER_SIGNIN_NAMESPACE, ['user']),
    ...mapState(USER_NAMESPACE, [
      'lastEditedDataset',
      'lastEditedDatasetPath',
    ]),
    ...mapGetters(
        METADATA_NAMESPACE, [
          'metadataIds',
          'metadatasContent',
          'metadatasContentSize',
          'loadingMetadataIds',
          'loadingMetadatasContent',
          'loadingCurrentMetadataContent',
          'searchingMetadatasContent',
          'currentMetadataContent',
          'filteredContent',
          'isFilteringContent',
        ],
    ),
    ...mapGetters({
      currentPage: 'currentPage',
      appBGImage: 'appBGImage',
      outdatedVersion: 'outdatedVersion',
      newVersion: 'newVersion',
      notifications: 'notifications',
      maxNotifications: 'maxNotifications',
    }),
    effectsConfig() {
      return this.config?.effectsConfig || {};
    },
    maintenanceConfig() {
      return this.config?.maintenanceConfig || {};
    },
    userDashboardConfig() {
      return this.config?.userDashboardConfig || {};
    },
    signinRedirectActive() {
      return this.maintenanceConfig?.signinRedirectActive || false;
    },
    dashboardRedirect() {
      return this.userDashboardConfig?.dashboardRedirect || false;
    },
    useTokenSignin() {
      return this.userDashboardConfig?.useTokenSignin || false;
    },
    maintenanceBannerVisible() {
      if (!this.maintenanceConfig.messageActive){
        return false;

      }

      if (this.userIsOnEditPage) {
        return this.editMaintenanceBanner;
      }

      if (this.currentPage !== LANDING_PAGENAME) {
        return this.showMaintenanceBanner;
      }

      return false;
    },
    maintenanceBannerText() {
      if (this.userIsOnEditPage) {
        return this.editMaintenanceMessage;
      }

      return this.maintenanceConfig.message;
    },
    maintenanceBannerColor() {
      if (this.userIsOnEditPage) {
        return 'error';
      }

      // this will use the default defined by the TextBanner component
      return undefined;
    },
    signinDisabled() {
      return this.maintenanceConfig?.signinDisabled || false;
    },
    showDecemberParticles() {
      return this.$vuetify.breakpoint.mdAndUp && this.effectsConfig.decemberParticles && this.itIsDecember;
    },
    userIsOnEditPage() {
      return this.currentPage === METADATAEDIT_PAGENAME;
    },
    itIsDecember() {
      return getMonth(Date.now()) === 11;
    },
    polygonParticlesActive() {
      return this.$vuetify.breakpoint.mdAndUp && this.currentPage && this.currentPage === LANDING_PAGENAME;
    },
    loading() {
      return this.loadingMetadatasContent || this.searchingMetadatasContent || this.isFilteringContent;
    },
    searchTerm() {
      return this.$route.query.search;
    },
    mainPageIsScrollable() {
      return this.currentPage === BROWSE_PAGENAME;
    },
    showToolbar() {
      // return this.mainPageIsScrollable && this.mode;
      return true;
    },
    pageStyle() {
      const heightStyle = this.showToolbar ? 'height: calc(100vh - 36px);' : 'height: 100vh;';
      return this.mainPageIsScrollable ? '' : `${heightStyle} overflow-y: auto; scroll-behavior: smooth; scrollbar-width: thin; `;
    },
    showSmallNavigation() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    searchCount() {
      return this.filteredContent !== undefined ? Object.keys(this.filteredContent).length : 0;
    },
    showReloadDialog() {
      return this.outdatedVersion && !this.reloadDialogCanceled;
    },
    dynamicBackground() {
      const imageKey = this.appBGImage;
      if (!imageKey) {
        return '';
      }

      const bgImg = this.mixinMethods_getWebpImage(imageKey, this.$store.state);
      if (!bgImg) {
        return '';
      }

      let gradient = `background: linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.25) 100%), url(${bgImg}) !important;`;
      let bgStyle = 'background-position: center top !important;';

      if (bgImg.includes(LANDING_PAGENAME.toLowerCase())) {
        bgStyle += `background-size: cover !important;
                    background-repeat: no-repeat !important; `;
      }

      if (bgImg.includes(BROWSE_PAGENAME.toLowerCase())) {
        gradient = `background: linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 100%), url(${bgImg}) !important;
                    background-repeat: repeat !important; `;
      }

      return gradient + bgStyle;
    },
    menuItem() {
      let menuItem = { active: true };
      this.navigationItems.forEach((el) => {
        if (el.icon === 'menu') {
          menuItem = el;
        }
      });
      // return default with active true so all items will be shown
      return menuItem;
    },
    mode() {
      return this.$route.query.mode ? this.$route.query.mode.toLowerCase() : null;
    },
  },
  components: {
    TheNavigation,
    TheNavigationToolbar,
    NotificationCard,
    ConfirmTextCard,
    TextBanner,
    GenericFullScreenModal,
  },
  watch: {
    config() {
      if (!this.loadingConfig) {
        this.setupNavItems();
        this.loadAllMetadata();

        this.$nextTick(() => {
          this.startParticles();
        });
      }
    },
    notifications() {
      if (!this.notifications) return;

      const keys = Object.keys(this.notifications);
      if (keys.length > this.maxNotifications) {
        this.$store.commit(TRIM_NOTIFICATIONS);
      }
    },
  },
  /* eslint-disable object-curly-newline */
  data: () => ({
    ckanDomain: process.env.VITE_ENVIDAT_PROXY,
    reloadDialogCanceled: false,
    showInfoDialog: false,
    showModal: false,
    dialogTitle: 'Redirect to Legacy Website!',
    dialogConfirmText: 'Ok',
    dialogCancelText: 'Cancel',
    dialogMessage: '',
    dialogCallback: () => {},
    dialogCancelCallback: () => {},
    showCookieInfo: true,
    cookieInfoText: 'On envidat.ch cookies are used to enhance your experience and provide features when you\'re signed in. These cookies are "technical only" and are NOT used for tracking or monitoring you.',
    redirectToDashboard: false,
    appVersion: import.meta.env.VITE_VERSION,
    showMenu: true,
    NavToolbarZIndex: 1150,
    NavigationZIndex: 1100,
    NotificationZIndex: 1500,
    showMaintenanceBanner: true,
    editMaintenanceBanner: true,
    currentParticles: null,
    navigationItems,
    userMenuItems,
    editMaintenanceMessage: `There is maintenance going on, please don't edit anything return to the <a href='./#${USER_DASHBOARD_PATH}' >dashboard page </a> or the <a href='/' >main page</a> for details!.`,
  }),
};
</script>


<style lang="scss">
$font-family: 'Raleway', sans-serif;

.envidat-font-overwrite {
  font-family: $font-family, sans-serif !important;

  [class*='display-'],
  [class*='text-'] {
    font-family: $font-family, sans-serif !important;
  }

  [class*='headerTitle'] {
    font-family: 'Baskervville', serif !important;
    font-weight: 400;
    opacity: 1;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
  }

  [class*='envidatTitle'] {
    font-family: 'Baskervville', serif !important;
  }
}
</style>

<style>

.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 95% !important;
}

.envidatNavbar {
  position: sticky;
  top: 8px;
  z-index: 1000;
}

.envidatNavbar.small {
  top: 0px;
}

/*** General Card styles ***/

.card .subheading {
  /* font-family: 'Baskervville', serif; */
  font-weight: 400;
  /* color: #555; */
  opacity: 0.75;
  line-height: 1.25em;
}

.readableText {
  line-height: 1.2rem;
  color: rgba(0, 0, 0, 0.87) !important;
}

.readableText img {
  max-width: 100%;
}

.accentLink a {
  color: #FFD740 !important;
}

.imagezoom,
.imagezoom .v-image__image {
  transition: all 0.2s;
}

.imagezoom:hover .v-image__image,
.imagezoom:focus .v-image__image {
  transform: scale(1.2);
}

.envidatSmallNavigation {
  position: fixed;
  top: auto;
  right: 10px;
  bottom: 10px;
}

.envidatToolbar > .v-toolbar__content {
  padding: 0px 8px !important;
}

.envidatIcon {
  height: 24px !important;
  width: 24px !important;
}

.envidatIcon.small {
  height: 20px !important;
  width: 20px !important;
}

.envidatTitle {
  letter-spacing: 0 !important;
}

.metadataInfoIcon,
.metadataInfoIcon .v-icon,
.metadataInfoIcon .v-image {
  opacity: 0.8;
}

.metadataTitleIcons {
  opacity: 0.5;
}

.envidatBadge span {
  font-size: 0.8rem !important;
}

.envidatBadgeBigNumber span {
  font-size: 0.7rem !important;
}

.envidatChip {
  height: 1.1rem !important;
  font-size: 0.65rem !important;
  margin: 1px 2px !important;
  /* opacity: 0.85 !important; */
}

.enviDatSnackbar > .v-snack__wrapper > .v-snack__content {
  height: 100%;
  padding: 12px;
}

.smallChip {
  height: 1.25rem !important;
  font-size: 0.55rem !important;
}

.smallChip > .v-chip__content > .v-chip__close > .v-icon {
  font-size: 15px !important;
}

.authorTag span,
.envidatChip span {
  cursor: pointer !important;
}

.authorTag span {
  font-size: 14px !important;
}

.chip__content span {
  cursor: pointer !important;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: height, opacity;
  transition-timing-function: ease;
  /* overflow: hidden; */
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.application .v-overlay.v-overlay--active {
  z-index: 1025 !important;
}
</style>
