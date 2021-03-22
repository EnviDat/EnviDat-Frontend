<template>
  <v-app class="application"
          :style="dynamicBackground">

      <div v-for="(notification, index) in visibleNotifications()"
          :key="`notification_${index}`"
          :style="`position: absolute;
                  right: ${$vuetify.breakpoint.xsOnly ? 0 : 15}px;
                  top: ${35 + index * 175}px;
                  z-index: ${NotificationZIndex};`" >

        <notification-card v-if="notification.show"
                            :notification="notification"
                            :showReportButton="config.errorReportingEnabled && notification.type === 'error'"
                            @clickedClose="catchCloseClicked(notification.key)"
                            @clickedReport="catchReportClicked(notification.key)" />
      </div>

    <the-navigation :style="`z-index: ${NavigationZIndex}`"
                    :navigationItems="navigationItems"
                    :version="appVersion"
                    @menuClick="catchMenuClicked"
                    @itemClick="catchItemClicked" />

    <the-navigation-toolbar ref="TheNavigationToolbar"
                            class="envidatToolbar"
                            :style="`z-index: ${NavToolbarZIndex}`"
                            :loading="loading"
                            :mode="mode"
                            :modeCloseCallback="catchModeClose"
                            :signedInUser="user"
                            :userNavigationItems="userMenuItems"
                            @userMenuItemClick="catchItemClicked"
                            @signinClick="catchSigninClicked"
                            @homeClick="catchHomeClicked" />

    <v-main>
      <v-container class="pa-2 pa-sm-3 fill-height"
                    fluid
                    v-on:scroll="updateScroll()"
                    ref="appContainer"
                    id="appContainer"
                    :style="pageStyle" >

        <v-row class="fill-height" >
          <v-col class="mx-0 py-0"
                  cols="12" >

            <transition name="fade" mode="out-in">
              <router-view />
            </transition>

          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="showReloadDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">New Version Available!</v-card-title>
          <v-card-text>{{ dialogVersionText() }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green darken-1" flat @click="reloadApp()">Reload</v-btn>
            <v-btn color="green darken-1" flat @click="reloadDialogCanceled = true">Cancel</v-btn>
          </v-card-actions>
        </v-card>
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
 * Last modified  : 2020-08-26 20:45:43
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  mapState,
  mapGetters,
} from 'vuex';

import {
  LANDING_PATH,
  BROWSE_PATH,
  BROWSE_PAGENAME,
  REPORT_PATH,
  USER_SIGNIN_PATH,
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
  USER_NAMESPACE,
  GET_USER_CONTEXT,
  ACTION_GET_USER_CONTEXT,
  FETCH_USER_DATA,
} from '@/modules/user/store/userMutationsConsts';


import {
  navigationItems,
  userMenuItems,
} from '@/store/navigationState';

import TheNavigation from '@/components/Navigation/TheNavigation';
import TheNavigationToolbar from '@/components/Navigation/TheNavigationToolbar';
import NotificationCard from '@/components/Cards/NotificationCard';
import '@/../node_modules/skeleton-placeholder/dist/bone.min.css';

export default {
  name: 'App',
  beforeCreate() {
    // check for the backend version
    this.$store.dispatch(SET_CONFIG);
  },
  created() {
    this.checkUserSignedIn();
    this.loadAllMetadata();

    const bgImgs = require.context('./assets/', false, /\.jpg$/);
    this.appBGImages = this.mixinMethods_importImages(bgImgs, 'app_b');

  },
  updated() {
    this.updateActiveStateOnNavItems();
  },
  methods: {
    updateScroll() {
      if (this.$refs && this.$refs.appContainer) {
        this.storeScroll(this.$refs.appContainer.scrollTop);
      }
    },
    storeScroll(scrollY) {
      this.$store.commit(SET_APP_SCROLL_POSITION, scrollY);
    },
    updateActiveStateOnNavItems() {
      if (this.navigationItems) {
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
      }
    },
    visibleNotifications() {
      const notis = Object.values(this.notifications);
      return notis.filter(n => n.show);
    },
    catchMenuClicked() {
      this.menuItem.active = !this.menuItem.active;
    },
    catchItemClicked(item) {
      if (item.pageName === 'external') {
        window.open(item.path, '_blank');
        return;
      }
      if (this.$route.name === item.pageName) {
        return;
      }

      if (this.showSmallNavigation) {
        this.catchMenuClicked();
      }

      this.$router.push({ path: item.path, query: '' });
    },
    // catchUserMenuItemClicked(item) {
    // },
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
    navigateTo(navItem) {
      if (navItem.pageName === 'external') {
        window.open(navItem.path, '_blank');
      } else {
        this.$router.push(navItem.path);
      }

      if (this.$route.name === navItem.pageName) {
        return;
      }

      this.$router.push({ path: navItem.path, query: '' });
    },
    catchCloseClicked(key) {
      if (!this.notifications) return;

      this.$store.commit(HIDE_NOTIFICATIONS, key);
    },
    catchReportClicked(index) {
      if (this.$route.path === REPORT_PATH) {
        return;
      }
      this.$router.push({ path: REPORT_PATH, query: index });
    },
    catchSigninClicked() {
      if (this.$route.path === USER_SIGNIN_PATH) {
        return;
      }
      this.$router.push({ path: USER_SIGNIN_PATH, query: '' });
    },
    catchHomeClicked() {
      if (this.$route.path === LANDING_PATH) {
        return;
      }
      this.$router.push({ path: LANDING_PATH, query: '' });
    },
    reloadApp() {
      window.location.reload();
    },
    loadAllMetadata() {
      if (!this.loadingMetadatasContent && this.metadatasContentSize <= 0) {
        this.$store.dispatch(`${METADATA_NAMESPACE}/${BULK_LOAD_METADATAS_CONTENT}`);
      }
    },
    dialogVersionText() {
      return `You are using the version ${this.appVersion}, but there is are newer version available (${this.newVersion}). Please reload to get the latest verison of EnviDat.`;
    },
    checkUserSignedIn() {
      this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`,
        {
          action: ACTION_GET_USER_CONTEXT,
          commit: true,
          mutation: GET_USER_CONTEXT,
        });      
    },
  },
  computed: {
    ...mapGetters(
      METADATA_NAMESPACE,
      [
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
        'loading',
      ],
    ),
    ...mapGetters({
      // metadataIds: `${METADATA_NAMESPACE}/metadataIds`,
      // metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
      // metadatasContentSize: `${METADATA_NAMESPACE}/metadatasContentSize`,
      // loadingMetadataIds: `${METADATA_NAMESPACE}/loadingMetadataIds`,
      // loadingMetadatasContent: `${METADATA_NAMESPACE}/loadingMetadatasContent`,
      // loadingCurrentMetadataContent: `${METADATA_NAMESPACE}/loadingCurrentMetadataContent`,
      // searchingMetadatasContent: `${METADATA_NAMESPACE}/searchingMetadatasContent`,
      // currentMetadataContent: `${METADATA_NAMESPACE}/currentMetadataContent`,
      // filteredContent: `${METADATA_NAMESPACE}/filteredContent`,
      // isFilteringContent: `${METADATA_NAMESPACE}/isFilteringContent`,
      currentPage: 'currentPage',
      appBGImage: 'appBGImage',
      outdatedVersion: 'outdatedVersion',
      newVersion: 'newVersion',
      config: 'config',
      notifications: 'notifications',
      maxNotifications: 'maxNotifications',
    }),
    ...mapState(USER_NAMESPACE, ['user']),
    loading() {
      return this.loadingMetadatasContent || this.searchingMetadatasContent || this.isFilteringContent
          || this.projectsLoading || this.policiesLoading || this.guidelinesLoading;
    },
    searchTerm() {
      return this.$route.query.search;
    },
    currentPageIsBrowsePage() {
      return this.currentPage === BROWSE_PAGENAME;
    },
    showToolbar() {
      // return this.currentPageIsBrowsePage && this.mode;
      return true;
    },
    pageStyle() {
      const heightStyle = this.showToolbar ? 'height: calc(100vh - 36px);' : 'height: 100vh;';
      return this.currentPageIsBrowsePage ? '' : `${heightStyle} overflow-y: auto; scroll-behavior: smooth; scrollbar-width: thin; `;
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
      const bgImg = this.appBGImages[imageKey];
      let bgStyle = '';

      if (bgImg) {
        bgStyle = `background: linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.25) 100%), url(${bgImg}) !important;`;

        bgStyle += `background-position: center top !important;
                      background-repeat: no-repeat !important;
                      background-size: cover !important; `;

        if (bgImg.includes('page')) {
          bgStyle = `background: linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 100%), url(${bgImg}) !important;`;

          bgStyle += `background-position: center top !important;
                        background-repeat: repeat !important; `;
        }
      }
      return bgStyle;
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
  },
  watch: {
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
    appBGImages: {},
    reloadDialogCanceled: false,
    appVersion: process.env.VUE_APP_VERSION,
    showMenu: true,
    NavToolbarZIndex: 1150,
    NavigationZIndex: 1100,
    NotificationZIndex: 1500,
    navigationItems,
    userMenuItems,
  }),
};
</script>


<style >

/* overwrite the applications background https://css-tricks.com/use-cases-fixed-backgrounds-css/ */
.application {
  font-size: 12px;
}

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

.headline {
  font-family: "Libre Baskerville", serif !important;
  /* font-weight: 700; */

  /*
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 2.15em;
    */
  line-height: 1.1em !important;
}

.card .subheading {
  /* font-family: 'Libre Baskerville', serif; */
  font-weight: 400;
  /* color: #555; */
  opacity: 0.75;
  line-height: 1.25em;
}

.readableText {
  line-height: 1.2rem;
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
  font-family: "Libre Baskerville", serif !important;
  letter-spacing: 0em !important;
}

.envidatSlogan {
  font-family: "Libre Baskerville", serif !important;
}

.metadataInfoIcon {
  opacity: 0.7;
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
</style>
