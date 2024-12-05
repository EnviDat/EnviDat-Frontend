<template>
  <v-app class="application envidat-font-overwrite" :style="dynamicBackground">
    <div
      v-show="showDecemberParticles"
      id="christmas-canvas"
      style="position: absolute; width: 100%; height: 100%;"
    ></div>

    <div
      v-show="showDecemberParticles"
      id="christmas-canvas"
      style="position: absolute; width: 100%; height: 100%;"
    ></div>

    <link
      v-if="showDecemberParticles"
      rel="stylesheet"
      href="./particles/decemberEffects.css"
    />

    <div
      v-for="(notification, index) in visibleNotifications()"
      :key="`notification_${index}`"
      :style="
        `position: absolute;
                right: ${$vuetify.display.xs ? 0 : 15}px;
                top: ${35 + index * 175}px;
                z-index: ${NotificationZIndex};`
      "
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

    <TheNavigationToolbar
      v-if="showToolbar"
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

    <TheNavigation
      :style="`z-index: ${NavigationZIndex}`"
      :navigationItems="navigationItems"
      :version="appVersion"
      @menuClick="catchMenuClicked"
      @itemClick="catchItemClicked"
    />

    <v-main class="custom-v-main pt-4 pt-md-8">
      <v-container
        class="mainPageContainer pa-2 pa-sm-3"
        fluid
        @scroll="updateScroll()"
        id="appContainer"
        ref="appContainer"
        :style="pageStyle"
      >
        <v-row id="mainPageRow">
          <v-col cols="12">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </v-col>
        </v-row>

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
            :style="`position: fixed; bottom: 0; left: 60px; z-index: 1001; width: calc(100vw - 60px); background-color: ${$vuetify.theme.themes.light.colors.highlight};`"
            :text="cookieInfoText"
            icon="cookie"
            deniedText="Reject"
            confirmText="Accept"
            :confirmClick="catchCookieInfoOk"
            :deniedClick="deniedTracking"
        />

      </v-container>

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
              reloadDialogCanceled = true;
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

import { mapState, mapGetters } from 'vuex';

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
  SET_APP_BACKGROUND,
} from '@/store/mainMutationsConsts';

import {
  ACTION_OLD_GET_USER_CONTEXT,
  ACTION_GET_USER_CONTEXT_TOKEN,
  ACTION_USER_SHOW,
  USER_SIGNIN_NAMESPACE,
  GET_USER_CONTEXT,
  SIGNIN_USER_ACTION,
  USER_NAMESPACE,
  FETCH_USER_DATA,
  USER_GET_DATASETS,
} from '@/modules/user/store/userMutationsConsts';

import { navigationItems, userMenuItems } from '@/store/navigationState';

import {
  eventBus,
  OPEN_FULLSCREEN_MODAL,
  SHOW_DIALOG,
  SHOW_REDIRECT_DASHBOARD_DIALOG,
  SHOW_REDIRECT_SIGNIN_DIALOG,
} from '@/factories/eventBus';


import { ENVIDAT_SHOW_COOKIE_BANNER } from '@/factories/metadataConsts';
import { getImage } from '@/factories/imageFactory';
import { defineAsyncComponent } from 'vue';

const TheNavigation = defineAsyncComponent(() =>
  import('@/components/Navigation/TheNavigation.vue'),
);
const TheNavigationToolbar = defineAsyncComponent(() =>
  import('@/components/Navigation/TheNavigationToolbar.vue'),
);

const GenericFullScreenModal = defineAsyncComponent(() =>
  import('@/components/Layouts/GenericFullScreenModal.vue'),
);
const ConfirmTextCard = defineAsyncComponent(() =>
  import('@/components/Cards/ConfirmTextCard.vue'),
);
const TextBanner = defineAsyncComponent(() =>
  import('@/components/Layouts/TextBanner.vue'),
);
const NotificationCard = defineAsyncComponent(() =>
  import('@/components/Cards/NotificationCard.vue'),
);

export default {
  name: 'App',
  beforeCreate() {
    // check for the backend version
    this.$store.dispatch(SET_CONFIG);

    this.$store.subscribe(mutation => {
      if (mutation.type === SET_APP_BACKGROUND) {
        this.appBGImage = mutation.payload;
      }
    });
  },
  created() {
    eventBus.on(OPEN_FULLSCREEN_MODAL, this.openGenericFullscreen);
    eventBus.on(SHOW_DIALOG, this.openGenericDialog);
    eventBus.on(SHOW_REDIRECT_SIGNIN_DIALOG, this.showRedirectSignDialog);
    eventBus.on(
      SHOW_REDIRECT_DASHBOARD_DIALOG,
      this.showRedirectDashboardDialog,
    );

    const strShowCookieInfo = localStorage.getItem(ENVIDAT_SHOW_COOKIE_BANNER);
    this.showCookieInfo = strShowCookieInfo !== 'false';
  },
  beforeUnmount() {
    eventBus.on(OPEN_FULLSCREEN_MODAL, this.openGenericFullscreen);
    eventBus.off(SHOW_DIALOG, this.openGenericDialog);
    eventBus.off(SHOW_REDIRECT_SIGNIN_DIALOG, this.showRedirectSignDialog);
    eventBus.off(
      SHOW_REDIRECT_DASHBOARD_DIALOG,
      this.showRedirectDashboardDialog,
    );
  },
  mounted() {
    this.checkUserSignedIn();

    this.$nextTick(() => {
      this.startParticles();
    });
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
        console.error(`Error during particle stop: ${error}`);
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
      particlesJS.load(
        'christmas-canvas',
        './particles/christmasParticleOptions.json',
        () => {
          // console.log('christmas-canvas - particles.js config loaded');
          if (this.currentParticles) {
            this.stopParticles(false);
          }
          this.currentParticles = window.pJS;
        },
      );
    },
    updateScroll() {
      const appContainer =
        this.$refs.appContainer?.$el || this.$refs.appContainer;

      if (appContainer) {
        this.storeScroll(appContainer.scrollTop);
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

            item.subpages.forEach(sub => {
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
        this.$router.push({
          path: `${this.lastEditedDatasetPath}?backPath=${this.$route.fullPath}`,
        });
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
      this.$router.options.additiveChangeRoute(
        this.$route,
        this.$router,
        BROWSE_PATH,
        search,
      );
    },
    catchSearchCleared() {
      // the search parameter needs to be '' to clear it
      this.$router.options.additiveChangeRoute(
        this.$route,
        this.$router,
        BROWSE_PATH,
        '',
      );
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
    deniedTracking() {
      localStorage.setItem(ENVIDAT_SHOW_COOKIE_BANNER, 'false');
      localStorage.setItem('matomoConsentGiven', 'false');
      /* eslint-disable no-underscore-dangle */
      window._paq.push(['forgetConsentGiven']);
      this.showCookieInfo = false;
    },
    catchCookieInfoOk() {
      // handledeniedTracking consent with Matomo
      localStorage.setItem('matomoConsentGiven', 'true');
      window._paq.push(['rememberConsentGiven']);

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
    openGenericDialog({
      title = 'Redirect to Legacy Website!',
      message,
      callback,
      cancelCallback,
      confirmText = 'Ok',
      cancelText = 'Cancel',
    }) {
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
        };
      } else {
        this.dialogCancelCallback = undefined;
      }

      if (callback) {
        this.dialogCallback = () => {
          callback();
          this.showInfoDialog = false;
        };
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
        this.$store.dispatch(
          `${METADATA_NAMESPACE}/${BULK_LOAD_METADATAS_CONTENT}`,
          this.config,
        );
      }
    },
    dialogVersionText() {
      return `You are using the version ${this.appVersion}, but there is are newer version available (${this.newVersion}). Please reload to get the latest verison of EnviDat.`;
    },
    setupNavItems() {
      if (this.signinDisabled) {
        const signItem = this.navigationItems.filter(
          item => item.path === USER_SIGNIN_PATH,
        )[0];
        if (signItem) {
          signItem.disabled = true;
        }
      }
    },
    fetchUserDatasets() {
      this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`, {
        action: ACTION_USER_SHOW,
        body: {
          id: this.user.id,
          include_datasets: true,
        },
        commit: true,
        mutation: USER_GET_DATASETS,
      });
    },
    async checkUserSignedIn() {
      let action = ACTION_GET_USER_CONTEXT_TOKEN;

      if (this.config?.userDashboardConfig && !this.useTokenSignin) {
        action = ACTION_OLD_GET_USER_CONTEXT;
      }

      await this.$store.dispatch(
        `${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`,
        {
          action,
          data: {
            include_datasets: true,
          },
          commit: true,
          mutation: GET_USER_CONTEXT,
        },
      );

      if (this.user) {
        this.fetchUserDatasets();
      }
    },
  },
  computed: {
    ...mapState(['loadingConfig', 'config', 'webpIsSupported']),
    ...mapState(USER_SIGNIN_NAMESPACE, ['user']),
    ...mapState(USER_NAMESPACE, ['lastEditedDataset', 'lastEditedDatasetPath']),
    ...mapGetters(METADATA_NAMESPACE, [
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
    ]),
    ...mapGetters({
      currentPage: 'currentPage',
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
      if (!this.maintenanceConfig.messageActive) {
        return false;
      }

      if (this.userIsOnEditPage) {
        return this.editMaintenanceBanner;
      }

      // exclude the landing page with the banner because
      // on the landingpage a "news" entry for maintenance can be shown!
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
      return this.$vuetify.theme.themes.light.colors.warning;
    },
    signinDisabled() {
      return this.maintenanceConfig?.signinDisabled || false;
    },
    showDecemberParticles() {
      return (
        this.$vuetify.display.mdAndUp &&
        this.effectsConfig.decemberParticles &&
        this.itIsDecember
      );
    },
    userIsOnEditPage() {
      return this.currentPage === METADATAEDIT_PAGENAME;
    },
    itIsDecember() {
      return getMonth(Date.now()) === 11;
    },
    polygonParticlesActive() {
      return (
        this.$vuetify.display.mdAndUp &&
        this.currentPage &&
        this.currentPage === LANDING_PAGENAME
      );
    },
    loading() {
      return (
        this.loadingMetadatasContent ||
        this.searchingMetadatasContent ||
        this.isFilteringContent
      );
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
      const heightStyle = this.showToolbar
        ? 'height: calc(100vh - 32px);'
        : 'height: 100vh;';
      return this.mainPageIsScrollable
        ? ''
        : `${heightStyle} overflow-y: auto; scroll-behavior: smooth; scrollbar-width: thin; `;
    },
    showSmallNavigation() {
      return this.$vuetify.display.smAndDown;
    },
    searchCount() {
      return this.filteredContent !== undefined
        ? Object.keys(this.filteredContent).length
        : 0;
    },
    showReloadDialog() {
      return this.outdatedVersion && !this.reloadDialogCanceled;
    },
    dynamicBackground() {
      const bgImg = getImage(this.appBGImage);

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
      this.navigationItems.forEach(el => {
        if (el.icon === 'menu') {
          menuItem = el;
        }
      });
      // return default with active true so all items will be shown
      return menuItem;
    },
    mode() {
      return this.$route.query.mode
        ? this.$route.query.mode.toLowerCase()
        : null;
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
    appBGImage: '',
    ckanDomain: process.env.VITE_API_ROOT,
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
    cookieInfoText:
      "On envidat.ch cookies are used to enhance your experience and provide features when you're signed in. These cookies are 'technical only' and are NOT used for tracking or monitoring you.",
    cookieInfoTextMatomo:
      "On envidat.ch, cookies are used to enhance your experience and provide features when you're signed in. These cookies are 'technical only' and we ANONYMOUSLY track usage (e.g. page views and downloads).",
    redirectToDashboard: false,
    appVersion: import.meta.env.VITE_VERSION,
    showMenu: true,
    NavToolbarZIndex: 1150,
    NavigationZIndex: 1100,
    NotificationZIndex: 1500,
    showMaintenanceBanner: false,
    editMaintenanceBanner: true,
    currentParticles: null,
    navigationItems,
    userMenuItems,
    editMaintenanceMessage: `There is maintenance going on, please don't edit anything return to the <a href='./#${USER_DASHBOARD_PATH}' >dashboard page </a> or the <a href='/' >main page</a> for details!.`,
  }),
};
</script>

<style lang="scss">
@import url(./sass/globalStyles.scss);

.custom-v-main {
  position: relative;
  left: 0px;
}

@media (min-width: 960px) and (max-width: 1279px) {
  .custom-v-main {
    left: 60px;
  }
}

</style>
