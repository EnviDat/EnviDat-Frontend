<template>
  <v-app class="application"
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

      <v-dialog v-model="showReloadDialog"
                persistent
                max-width="300">

        <ConfirmTextCard title="New Version Available!"
                         :text="dialogVersionText()"
                         confirmText="Reload"
                         :confirmClick="reloadApp"
                         cancelText="Cancel"
                         :cancelClick="() => { reloadDialogCanceled = true }"
        />

      </v-dialog>
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
  BLOG_PAGENAME, METADATAEDIT_PAGENAME, USER_DASHBOARD_PATH,
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

import { ABOUT_NAMESPACE } from '@/modules/about/store/aboutMutationsConsts';
import { PROJECTS_NAMESPACE } from '@/modules/projects/store/projectsMutationsConsts';
import {
  USER_SIGNIN_NAMESPACE,
  GET_USER_CONTEXT,
  ACTION_GET_USER_CONTEXT,
  FETCH_USER_DATA, USER_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';


import {
  navigationItems,
  userMenuItems,
} from '@/store/navigationState';

import TheNavigation from '@/components/Navigation/TheNavigation';
import TheNavigationToolbar from '@/components/Navigation/TheNavigationToolbar';
import NotificationCard from '@/components/Cards/NotificationCard';
import ConfirmTextCard from '@/components/Cards/ConfirmTextCard';
import TextBanner from '@/components/Layouts/TextBanner';
import '@/../node_modules/skeleton-placeholder/dist/bone.min.css';

export default {
  name: 'App',
  beforeCreate() {
    // check for the backend version
    this.$store.dispatch(SET_CONFIG);
  },
  created() {
    this.checkUserSignedIn();
  },
  mounted() {
    this.startParticles();
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
    catchSigninClicked() {
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
      this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${FETCH_USER_DATA}`,
        {
          action: ACTION_GET_USER_CONTEXT,
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
      policiesLoading: `${ABOUT_NAMESPACE}/policiesLoading`,
      guidelinesLoading: `${ABOUT_NAMESPACE}/guidelinesLoading`,
      projectsLoading: `${PROJECTS_NAMESPACE}/loading`,
    }),
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
      return this.loadingMetadatasContent || this.searchingMetadatasContent || this.isFilteringContent
          || this.projectsLoading || this.policiesLoading || this.guidelinesLoading;
    },
    searchTerm() {
      return this.$route.query.search;
    },
    mainPageIsScrollable() {
      return this.currentPage === BROWSE_PAGENAME || this.currentPage === BLOG_PAGENAME;
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
  },
  watch: {
    config() {
      if (!this.loadingConfig) {
        this.setupNavItems();
        this.loadAllMetadata();
        this.startParticles();
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
    reloadDialogCanceled: false,
    appVersion: process.env.VUE_APP_VERSION,
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


<style>

.envidatNavbar {
  position: -webkit-sticky;
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
  font-family: "Baskervville", serif !important;
  letter-spacing: 0em !important;
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
