<template >
  <v-container class="pa-0"
                tag="article"
                fluid
                id="DashboardPage">

    <div v-if="!user"
          class="notSignedinGrid">

    <NotFoundCard v-bind="notSignedInInfos" 
                  :height="notFoundCardHeight"
                  :actionButtonCallback="catchSigninClick" />
   </div>

   <div v-if="user"
        class="dashboardGrid"
        :style="`grid-template-rows: 30px ${userCardHeight}px min-content 410px`">

    <div class="header" >

      <div class="headerTitle title" >
        {{ headerTitle }}
      </div>

      <!-- <div class="headerButtons" >

        <div class="skeleton skeleton-size-big skeleton-color-yellow skeleton-animation-shimmer" >
          <div style="width: 28px; height: 28px;"
                class="bone bone-type-image bone-style-round" />
        </div>

        <div class="skeleton skeleton-size-big skeleton-color-yellow skeleton-animation-shimmer" >
          <div style="width: 28px; height: 28px;"
                class="bone bone-type-image bone-style-round" />
        </div>

      </div> -->

    </div>

    <div class="topBoard" >

      <WelcomeCard :userName="user.fullname"
                    :publishedDatasetCount="publishedDatasets.length"
                    :unpublishedDatasetCount="unpublishedDatasets.length" 
                    :editingDatasetCount="editingDatasets.length" />

      <UserCard :height="userCardHeight"
                :width="userCardWidth"
                :userName="user.fullname"
                :email="user.email"
                :emailHash="user.email_hash"
                :nameInitials="nameInitials"
                :datasetCount="publishedDatasets.length"  />

    </div>

    <div class="midBoard pt-4" >

      <TitleCard title="My Datasets"
                  icon="refresh"
                  :tooltipText="refreshButtonText"
                  :clickCallback="catchRefreshClick" />

      <MetadataList v-if="hasUserDatasets"
                      ref="metadataList"
                      :listContent="filteredUserDatasets"
                      :searchCount="filteredUserDatasets.length"
                      :mapFilteringPossible="$vuetify.breakpoint.smAndUp"
                      :loading="loading"
                      :placeHolderAmount="placeHolderAmount"
                      @clickedTag="catchTagClicked"
                      :selectedTagNames="selectedTagNames"
                      :allTags="allUserdataTags"
                      :showPlaceholder="updatingTags"
                      @clickedTagClose="catchTagCloseClicked"
                      :defaultListControls="userListDefaultControls"
                      :enabledControls="userListEnabledControls"
                      :useDynamicHeight="false"
                      :minMapHeight="250"
                      :mapTopLayout="$vuetify.breakpoint.mdAndUp"
                      :topFilteringLayout="$vuetify.breakpoint.mdAndDown"
                      :showSearch="false" />

      <div v-if="!hasUserDatasets"
            class="noUserDatasetsGrid">
        <NotFoundCard v-bind="noDatasetsInfos"
                      :height="notFoundCardHeight"
                      :actionButtonCallback="catchCreateClick" />

        <NotificationCard v-if="noUserDatasetsError"
                          :notification="noUserDatasetsError"
                          :showCloseButton="false" />

      </div>

    </div>

    <div class="bottomBoard pt-2 pb-4" >

      <TitleCard :title="`Recent Datasets of ${usersOrganisationTitle}`"
                  icon="refresh"
                  :tooltipText="refreshOrgaButtonText"
                  :clickCallback="catchRefreshOrgaClick" />
      
      <div v-if="userOrganizationLoading"
            class="orgaDatasets" >

        <MetadataCardPlaceholder id="orgaDataset"
                                  class="mx-2"
                                  v-for="n in orgaDatasetsPreview"
                                  :key="n"
                                  :style="`height: 300px; min-width: ${previewWidth}px;`" />
      </div>

      <div v-if="!userOrganizationLoading && hasRecentOrgaDatasets"
            class="orgaDatasets" >

        <MetadataCard v-for="(metadata, index) in userRecentOrgaDatasets"
                      class="mx-2"
                      :style="`height: 300px; width: ${previewWidth}px;`"          
                      :key="index"
                      :id="metadata.id"
                      :title="metadata.title"
                      :name="metadata.name"
                      :subtitle="metadata.notes"
                      :titleImg="metadata.titleImg"
                      :resourceCount="metadata.num_resources"
                      :fileIconString="fileIconString"
                      :categoryColor="metadata.categoryColor"
                      @clickedEvent="metaDataClicked"
                      @clickedTag="catchTagClicked" />
      </div>

      <div v-if="!userOrganizationLoading && !hasRecentOrgaDatasets"
            class="noOrgaDatasetsGrid">

        <NotificationCard v-if="noOrgaDatasetsError"
                          :notification="noOrgaDatasetsError"
                          :showCloseButton="false" />

        <NotFoundCard v-if="!userOrganizationsList"
                      :height="notFoundCardHeight"
                      v-bind="noOrganizationsInfos"  />
      </div>

    </div>

   </div>
   
<!--
    <v-row>
      <v-col>
        <v-dialog
          v-model="showModal"
          attach="#DashboardPage"
        >
        <template v-slot:activator="{on, attrs}">
          <v-btn v-bind="attrs"
                v-on="on" >
                showModal
            </v-btn>

        </template>
          <v-card>
            dialog thingy
          </v-card>
          
        </v-dialog>
      </v-col>
    </v-row> -->

  </v-container>

</template>

<script>
/**
 * Dashboard Page
 *
 * @summary Dashboard page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 14:18:32 
 * Last modified  : 2020-10-13 12:49:34
 */

import {
  mapState,
  mapGetters,
} from 'vuex';

import {
  USER_NAMESPACE,
  FETCH_USER_DATA,
  ACTION_USER_SHOW,
  USER_GET_DATASETS,
  USER_GET_ORGANIZATION_IDS,
} from '@/modules/user/store/userMutationsConsts';

import {
  SET_DETAIL_PAGE_BACK_URL,
  METADATA_NAMESPACE,
  // LISTCONTROL_MAP_ACTIVE,
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
} from '@/store/metadataMutationsConsts';

import {
  USER_DASHBOARD_PAGENAME,
  USER_DASHBOARD_PATH,
  USER_SIGNIN_PATH,
  METADATADETAIL_PAGENAME,
} from '@/router/routeConsts';

import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import {
  contentFilteredByTags,
  getPopularTags,
} from '@/factories/metadataFilterMethods';

import { getNameInitials } from '@/factories/authorFactory';
import { errorMessage } from '@/factories/notificationFactory';

import NotFoundCard from '@/components/Cards/NotFoundCard';
import MetadataList from '@/components/MetadataList';
import MetadataCard from '@/components/Cards/MetadataCard';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder';
import WelcomeCard from '@/components/Cards/WelcomeCard';
import NotificationCard from '@/components/Cards/NotificationCard';
import TitleCard from '@/components/Cards/TitleCard';
import UserCard from '@/components/Cards/UserCard';

import UserNotFound1 from '@/modules/user/assets/UserNotFound1.jpg';
import UserNotFound2 from '@/modules/user/assets/UserNotFound2.jpg';

export default {
  name: 'DashboardPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, USER_DASHBOARD_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  components: {
    MetadataList,
    NotFoundCard,
    WelcomeCard,
    NotificationCard,
    TitleCard,
    UserCard,
    MetadataCard,
    MetadataCardPlaceholder,
  },
  beforeMount() {
    this.fileIconString = this.mixinMethods_getIcon('file');
    
    this.loadRouteTags();

    if (this.user) {
      this.fetchUserDatasets();
      this.fetchUserOrganisationData();
    }
  },
  computed: {
    ...mapState(USER_NAMESPACE, [
      'user',
      'userLoading',
      'userOrganizationLoading',
      'userOrganizations',
      'userRecentOrgaDatasets',
      'userRecentOrgaDatasetsError',
      'userDatasetsError',
    ]),
    ...mapGetters(USER_NAMESPACE, ['userDatasets']),
    ...mapGetters(METADATA_NAMESPACE, [
      'allTags',
      'updatingTags',
    ]),
    loading() {
      return this.userLoading;
    },
    noOrgaDatasetsError() {
      if (!this.userRecentOrgaDatasetsError) {
        return null;
      }

      const errorDetail = `${this.userRecentOrgaDatasetsError}<br /> <strong>Try reloading the datasets. If the problem persists please let use know via envidat@wsl.ch!</strong>`;

      const notification = errorMessage('Error Loading Datasets From Organization', errorDetail);
      notification.timeout = 0;

      return notification;
    },
    noUserDatasetsError() {
      if (!this.userDatasetsError) {
        return null;
      }

      const errorDetail = `${this.userDatasetsError}<br /> <strong>Try reloading the datasets. If the problem persists please let use know via envidat@wsl.ch!</strong>`;

      const notification = errorMessage('Error Loading Your Datasets', errorDetail);
      notification.timeout = 0;

      return notification;
    },
    hasUserDatasets() {
      return this.userDatasets && this.userDatasets.length > 0;
    },
    filteredUserDatasets() {
      const filteredContent = [];

      if (!this.hasUserDatasets) {
        return filteredContent;
      }

      for (let i = 0; i < this.userDatasets.length; i++) {
        const entry = this.userDatasets[i];

        if (contentFilteredByTags(entry, this.selectedTagNames)) {
          filteredContent.push(entry);
        }
      }
      
      return filteredContent;
    },
    publishedDatasets() {
      if (this.user.datasets) {
        return this.user.datasets.filter(dataset => !dataset.private);
      }

      return [];
    },
    unpublishedDatasets() {
      if (this.user.datasets) {
        return this.user.datasets.filter(dataset => dataset.private);
      }

      return [];
    },
    editingDatasets() {
      return [];
    },
    nameInitials() {
      return getNameInitials(this.user);
    },
    userOrganizationsList() {
      const keys = this.userOrganizations ? Object.keys(this.userOrganizations) : null;

      if (keys?.length > 0) {
        return Object.values(this.userOrganizations);
      }
      
      return null;
    },
    usersOrganisationTitle() {
      if (this.userOrganizationsList?.length > 0) {
        return this.userOrganizationsList[0].display_name;
      }

      return 'your Organizations';
    },
    hasRecentOrgaDatasets() {
      return this.userRecentOrgaDatasets && this.userRecentOrgaDatasets.length > 0;
    },
    usersOrganisationRecentDatasets() {
      const list = this.userOrganizationsList;

      if (list?.length > 0) {
        
        const datasets = [];

        for (let i = 0; i < list.length; i++) {
          const orga = list[i];
          const subList = orga.packages;

          if (subList?.length > 0) {
            for (let j = 0; j < subList.length; j++) {
              const dataset = subList[j];
              datasets.push(dataset);

              if (datasets.length >= this.orgaDatasetsPreview) {
                break;
              }
            }
          }
        }

        return datasets;
      }

      return null;
    },
    allUserdataTags() {
      let allTags = getPopularTags(this.filteredUserDatasets);

      if (allTags.length > this.maxFilterTags) {
        allTags = allTags.splice(this.maxFilterTags, allTags.length - this.maxFilterTags);
      }

      return allTags;
    },
  },
  methods: {
    loadRouteTags() {
      const routeTags = this.mixinMethods_loadRouteTags(this.$route.query.tags, this.selectedTagNames);

      if (routeTags) {
        this.selectedTagNames = routeTags;
      }
    },
    fetchUserDatasets() {
      this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`,
        {
          action: ACTION_USER_SHOW,
          body: {
            id: this.user.id,
            include_datasets: true,
            key: this.user.apikey,
          },
          commit: true,
          mutation: USER_GET_DATASETS,
        });
    },
    fetchUserOrganisationData() {
      this.$store.dispatch(`${USER_NAMESPACE}/${USER_GET_ORGANIZATION_IDS}`, this.user.id);
    },
    catchRefreshClick() {
      if (this.user) {
        this.fetchUserDatasets();
      }
    },
    catchRefreshOrgaClick() {
      if (this.user) {
        this.fetchUserOrganisationData();
      }
    },
    catchSigninClick() {
      this.$router.push({ path: USER_SIGNIN_PATH, query: '' });
    },
    catchCreateClick() {
      console.log('clicked create dataset');
      // this.$router.push({ path: USER_SIGNIN_PATH, query: '' });
    },
    catchShowUnpublishedClick() {
      console.log('clicked show unpublished dataset');
      // this.$router.push({ path: USER_SIGNIN_PATH, query: '' });
    },
    catchEditingClick() {
      console.log('clicked editing dataset');
      // this.$router.push({ path: USER_SIGNIN_PATH, query: '' });
    },
    catchTagClicked(tagName) {
      if (!this.mixinMethods_isTagSelected(tagName)) {
        this.selectedTagNames.push(tagName);

        const newTags = [];
        this.selectedTagNames.forEach(t => newTags.push(t.toLowerCase()));

        this.mixinMethods_additiveChangeRoute(USER_DASHBOARD_PATH, undefined, newTags.toString());
      }
    },
    catchTagCloseClicked(tagName) {
      this.selectedTagNames = this.selectedTagNames.filter(tag => tag !== tagName);

      const newTags = [];

      for (let i = 0; i < this.selectedTagNames.length; i++) {
        newTags.push(this.selectedTagNames[i].toLowerCase());
      }

      this.mixinMethods_additiveChangeRoute(USER_DASHBOARD_PATH, undefined, newTags.toString());
    },
    metaDataClicked(datasetname) {
      this.$store.commit(`${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`, this.$route);

      this.$router.push({
        name: METADATADETAIL_PAGENAME,
        params: {
          metadataid: datasetname,
        },
      });
    },
  },
  data: () => ({
    fileIconString: '',
    title: 'Dashboard',
    PageBGImage: './app_b_dashboardpage.jpg',
    refreshButtonText: 'Reload Datasets',
    refreshOrgaButtonText: 'Reload Organisation Datasets',
    placeHolderAmount: 4,
    orgaDatasetsPreview: 5,
    maxFilterTags: 20,
    previewWidth: 370,
    userCardHeight: 350,
    notFoundCardHeight: 300,
    userCardWidth: 300,
    showModal: false,
    left: false,
    right: false,
    headerTitle: 'Dashboard',
    selectedTagNames: [],
    notSignedInInfos: {
      title: 'Not Signed in',
      description: 'Sign in with your e-mail to see your datasets.',
      actionButtonText: 'Sign in',
      image: UserNotFound1,
    },
    noDatasetsInfos: {
      title: 'No Datasets',
      description: "It seems you don't have any datasets.",
      actionDescription: 'Get started and create a new dataset',
      actionButtonText: 'New Dataset',
      image: UserNotFound2,
    },
    noOrganizationsInfos: {
      title: 'No Organizations Found',
      description: "It seems that your aren't assigend to an Organisation. Ask your project or organization lead to add you as a member or even better as an editor so you can create datasets.",
      image: UserNotFound1,
    },
    userListDefaultControls: [
      LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
    ],
    userListEnabledControls: [
      LISTCONTROL_LIST_ACTIVE,
      // LISTCONTROL_MAP_ACTIVE,
      LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
    ],
  }),
};
</script>

<style lang="sass" scoped>
  @import "~vuetify/src/styles/settings/_variables.scss"
  $gridGap: $spacer * 4

  .notSignedinGrid
    display: grid
    grid-template-rows: auto 1fr
    gap: $gridGap

  .dashboardGrid
    display: grid
    gap: $gridGap
    grid-template-columns: 1fr

    .header
      display: grid
      grid-template-columns: 3fr 1fr
      align-items: center

      .headerButtons
        display: grid
        grid-template-columns: repeat(2, auto)
        justify-content: end
        gap: $gridGap

    .topBoard
      display: grid
      grid-template-columns: 5fr auto
      gap: $gridGap

    .midBoard
      display: grid
      grid-template-rows: 36px auto
      gap: $gridGap
      transition: 1s all

      .datasetTitleCard
        display: grid
        grid-template-columns: 11fr 1fr

      .noUserDatasetsGrid
        display: grid
        grid-template-columns: 1fr 1fr
        gap: $gridGap

    .bottomBoard
      overflow: auto
      display: grid
      grid-template-rows: 36px auto
      gap: $gridGap

      .orgaDatasets
        overflow: auto
        display: grid
        grid-auto-flow: column
        justify-content: start

      .orgaDatasets:first-child
        margin-left: 0

      .orgaDatasets:last-child
        margin-right: 0

      .noOrgaDatasetsGrid
        display: grid
        grid-template-columns: 1fr 1fr
        gap: $gridGap

</style>

<style scoped>
  /* html,
  body {
    height: 100%;
  }

  body {
    margin: 0;
    background-color: #222;
  } */

  /* #placeHolderContainer {
    width: 100%;
    height: 100%;
    background: center url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgb(40,40,40)' viewBox='0 0 100 169.5'%3E%3Cpolygon points='50,34.75 93.5,59.75 93.5,109.75 50,134.75 6.5,109.75 6.5,59.75'%3E%3C/polygon%3E%3Cpolygon points='0,-50 43.5,-25 43.5,25 0,50 -43.5,25 -43.5,-25'%3E%3C/polygon%3E%3Cpolygon points='100,-50 143.5,-25 143.5,25 100,50 56.5,25 56.5,-25'%3E%3C/polygon%3E%3Cpolygon points='0,119.5 43.5,144.5 43.5,194.5 0,219.5 -43.5,194.5 -43.5,144.5'%3E%3C/polygon%3E%3Cpolygon points='100,119.5 143.5,144.5 143.5,194.5 100,219.5 56.5,194.5 56.5,144.5'%3E%3C/polygon%3E%3C/svg%3E");
    background-size: 8px;
  } */
</style>
