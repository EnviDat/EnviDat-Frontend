<template >
  <v-container class="pa-0"
                tag="article"
                fluid
                id="DashboardPage">

    <div v-if="!user"
          class="notSignedinGrid">

    <NotFoundCard v-bind="notSignedInInfos"
                  :actionButtonCallback="catchSigninClick" />
   </div>

   <div v-if="user"
        class="dashboardGrid" >

    <div class="topBoard" >

      <IntroductionCard :userName="user.fullName"
                        :createClickCallback="canCreateDatasets ? createClickCallback : null"
                        :existingClickCallback="existingClickCallback"
                        :editingClickCallback="editingClickCallback"
                        :editingDatasetName="lastEditedDataset"
                        :feedbackText="userDashboardConfig.feedbackText"
                        :oldDashboardUrl="oldDashboardUrl"
                        />

      <UserOrganizationInfo :height="userCardHeight"
                            :width="userCardWidth"
                            :userName="user.fullName"
                            :email="user.email"
                            :emailHash="user.emailHash"
                            :nameInitials="nameInitials"
                            :organizationRoles="organizationRoles"
                            :isCollaborator="isCollaborator" />

      <UserCard :height="userCardHeight"
                :width="userCardWidth"
                :userName="user.fullName"
                :email="user.email"
                :emailHash="user.emailHash"
                :nameInitials="nameInitials"
                :datasetCount="publishedDatasets.length"  />


    </div>

    <div class="midBoard pt-4"
         ref="userDatasets">

      <TitleCard title="My Datasets"
                  icon="refresh"
                  :tooltipText="refreshButtonText"
                  :clickCallback="catchRefreshClick" />

      <MetadataList v-if="hasUserDatasets"
                      ref="metadataList"
                      class="px-1"
                      :listContent="filteredUserDatasets"
                      :searchCount="filteredUserDatasets.length"
                      :mapFilteringPossible="$vuetify.breakpoint.smAndUp"
                      :loading="userDatasetsLoading"
                      :placeHolderAmount="placeHolderAmount"
                      @clickedTag="catchTagClicked"
                      @clickedCard="catchMetadataClicked"
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
                      :showSearch="false"
                      :showPublicationState="true"
                      :defaultPublicationState="defaultPublicationState"
                      mainScrollClass=".midBoard" />

      <div v-if="!hasUserDatasets"
            class="noUserDatasetsGrid px-1">
        <NotFoundCard v-bind="noDatasetsInfos"
                      :actionButtonCallback="createClickCallback" />

        <NotificationCard v-if="noUserDatasetsError"
                          :notification="noUserDatasetsError"
                          :showCloseButton="false" />

      </div>

    </div>

     <div class="midBoard pt-4"
          id="collaboratorDatasets"
          ref="collaboratorDatasets">

       <TitleCard title="My Collaborator Datasets"
                  icon="refresh"
                  :tooltipText="refreshButtonText"
                  :clickCallback="catchCollaboratorRefreshClick" />

       <div v-if="collaboratorDatasetIdsLoading || collaboratorDatasetsLoading"
            id="collaboratorPlaceholders"
            :style="`height: ${collabCardHeight + 30}px;`" >

         <MetadataCardPlaceholder id="orgaDataset"
                                  class="mx-2"
                                  v-for="n in orgaDatasetsPreview"
                                  :key="n"
                                  :style="`height: ${collabCardHeight}px; width: ${collabCardWidth}px;`" />
       </div>

       <div v-if="!collaboratorDatasetIdsLoading && !collaboratorDatasetsLoading && hasCollaboratorDatasets"
            id="collaboratorDatasetCards"
            :style="`height: ${collabCardHeight + 30}px;`" >

         <MetadataCard v-for="(metadata, index) in collaboratorDatasets"
                       class="mx-2"
                       :style="`height: ${collabCardHeight}px; width: ${collabCardWidth}px;`"
                       :key="index"
                       :id="metadata.id"
                       :title="metadata.title"
                       :subtitle="metadata.notes"
                       :name="metadata.name"
                       :titleImg="metadata.titleImg"
                       :resourceCount="metadata.num_resources"
                       :fileIconString="fileIconString"
                       :categoryColor="metadata.categoryColor"
                       :compactLayout="true"
                       :state="getMetadataState(metadata)"
                       @clickedEvent="catchMetadataClicked"
                       @clickedTag="catchTagClicked"
                       :showGenericOpenButton="!!metadata.openEvent"
                       :openButtonTooltip="metadata.openButtonTooltip"
                       :openButtonIcon="metadata.openButtonIcon"
                       @openButtonClicked="catchEditingClick(metadata.openProperty)" />
       </div>

<!--
       <MetadataList v-if="hasCollaboratorDatasets"
                     ref="metadataList"
                     :listContent="collaboratorDatasets"
                     :searchCount="collaboratorDatasets.length"
                     :mapFilteringPossible="$vuetify.breakpoint.smAndUp"
                     :loading="collaboratorDatasetIdsLoading || collaboratorDatasetsLoading"
                     :placeHolderAmount="placeHolderAmount"
                     @clickedTag="catchTagClicked"
                     @clickedCard="catchMetadataClicked"
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
-->

       <div v-if="!hasCollaboratorDatasets"
            class="noUserDatasetsGrid px-1">
         <NotFoundCard v-bind="noCollaboratorDatasetsInfos" />

<!--
         <NotificationCard v-if="noUserDatasetsError"
                           :notification="noUserDatasetsError"
                           :showCloseButton="false" />
-->

       </div>

     </div>

    <div class="bottomBoard pt-2 pb-4"
         ref="userOrgaDatasets">

      <TitleCard :title="`Recent Datasets of ${usersOrganisationTitle}`"
                  icon="refresh"
                  :tooltipText="refreshOrgaButtonText"
                  :clickCallback="catchRefreshOrgaClick" />

      <div v-if="userOrganizationLoading"
            class="orgaDatasets"
           :style="`height: ${orgaCardHeight + 30}px;`" >

        <MetadataCardPlaceholder id="orgaDataset"
                                  class="mx-2"
                                  v-for="n in orgaDatasetsPreview"
                                  :key="n"
                                 :style="`height: ${orgaCardHeight}px; width: ${orgaCardWidth}px;`" />
      </div>

      <div v-if="!userOrganizationLoading && hasRecentOrgaDatasets"
            class="orgaDatasets"
           :style="`height: ${orgaCardHeight + 30}px;`" >

        <MetadataCard v-for="(metadata, index) in userRecentOrgaDatasets"
                      class="mx-2"
                      :style="`height: ${orgaCardHeight}px; width: ${orgaCardWidth}px;`"
                      :key="index"
                      :id="metadata.id"
                      :title="metadata.title"
                      :subtitle="metadata.notes"
                      :name="metadata.name"
                      :titleImg="metadata.titleImg"
                      :resourceCount="metadata.num_resources"
                      :fileIconString="fileIconString"
                      :categoryColor="metadata.categoryColor"
                      :compactLayout="true"
                      :state="getMetadataState(metadata)"
                      @clickedEvent="catchMetadataClicked"
                      @clickedTag="catchTagClicked"
                      :showGenericOpenButton="!!metadata.openEvent"
                      :openButtonTooltip="metadata.openButtonTooltip"
                      :openButtonIcon="metadata.openButtonIcon"
                      @openButtonClicked="catchEditingClick(metadata.openProperty)" />

      </div>

      <div v-if="!userOrganizationLoading && !hasRecentOrgaDatasets"
            class="noOrgaDatasetsGrid px-1">

        <NotificationCard v-if="noOrgaDatasetsError"
                          :notification="noOrgaDatasetsError"
                          :showCloseButton="false" />

        <NotFoundCard v-if="!userOrganizationsList"
                      v-bind="noOrganizationsInfos"  />
      </div>

    </div>
   </div>

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
  USER_SIGNIN_NAMESPACE,
  FETCH_USER_DATA,
  ACTION_USER_SHOW,
  USER_GET_DATASETS,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_COLLABORATOR_DATASETS,
  USER_GET_COLLABORATOR_DATASET_IDS,
  ACTION_COLLABORATOR_DATASET_IDS,
  USER_GET_ORGANIZATIONS,
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
  METADATAEDIT_PAGENAME,
} from '@/router/routeConsts';

import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import {
  tagsIncludedInSelectedTags,
  getPopularTags,
} from '@/factories/metadataFilterMethods';

import { getNameInitials } from '@/factories/authorFactory';
import { errorMessage } from '@/factories/notificationFactory';
import { getMetadataVisibilityState } from '@/factories/metaDataFactory';
import { getUserOrganizationRoleMap } from '@/factories/userEditingFactory';

import NotFoundCard from '@/components/Cards/NotFoundCard';
import MetadataList from '@/components/MetadataList';
import MetadataCard from '@/components/Cards/MetadataCard';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder';
import IntroductionCard from '@/components/Cards/IntroductionCard';
import NotificationCard from '@/components/Cards/NotificationCard';
import TitleCard from '@/components/Cards/TitleCard';
import UserCard from '@/components/Cards/UserCard';
import UserOrganizationInfo from '@/components/Cards/UserOrganizationInfo';

import UserNotFound1 from '@/modules/user/assets/UserNotFound1.jpg';
import UserNotFound2 from '@/modules/user/assets/UserNotFound2.jpg';
import {
  eventBus,
  SELECT_EDITING_DATASET,
} from '@/factories/eventBus';


const domain = process.env.VUE_APP_ENVIDAT_PROXY;

export default {
  name: 'DashboardPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, USER_DASHBOARD_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  created() {
    eventBus.$on(SELECT_EDITING_DATASET, this.catchEditingClick);
  },
  beforeDestroy() {
    eventBus.$off(SELECT_EDITING_DATASET, this.catchEditingClick);
  },
  beforeMount() {
    this.fileIconString = this.mixinMethods_getIcon('file');

    this.loadRouteTags();

    if (this.user) {
      this.fetchUserDatasets();
      this.fetchCollaboratorDatasets()
      this.fetchUserOrganisationData();
    }
  },
  computed: {
    ...mapState([
      'config',
    ]),
    ...mapState(USER_SIGNIN_NAMESPACE, [
      'user',
      'userLoading',
    ]),
    ...mapState(USER_NAMESPACE, [
      'collaboratorDatasetIdsLoading',
      'collaboratorDatasetIds',
      'collaboratorDatasetsLoading',
      'collaboratorDatasets',
      'userOrganizationLoading',
      'userOrganizations',
      'userRecentOrgaDatasets',
      'userRecentOrgaDatasetsError',
      'userDatasets',
      'userDatasetsLoading',
      'userDatasetsError',
      'userOrganizationIds',
      'lastEditedDataset',
      'lastEditedDatasetPath',
    ]),
    ...mapGetters(METADATA_NAMESPACE, [
      'allTags',
      'updatingTags',
    ]),
    userDashboardConfig() {
      return this.config?.userDashboardConfig || {};
    },
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
      return this.userDatasets?.length > 0;
    },
    hasCollaboratorDatasets() {
      return this.collaboratorDatasets?.length > 0;
    },
    hasDatasetsInOrganizations() {
      return this.hasUserDatasets && this.hasRecentOrgaDatasets;
    },
    hasRecentOrgaDatasets() {
      return this.userRecentOrgaDatasets && this.userRecentOrgaDatasets.length > 0;
    },
    filteredUserDatasets() {
      const filteredContent = [];

      if (!this.hasUserDatasets) {
        return filteredContent;
      }

      if (!this.selectedTagNames || this.selectedTagNames.length <= 0) {
        return this.userDatasets;
      }

      for (let i = 0; i < this.userDatasets.length; i++) {
        const entry = this.userDatasets[i];

        if (tagsIncludedInSelectedTags(entry.tags, this.selectedTagNames)) {
          filteredContent.push(entry);
        }
      }

      return filteredContent;
    },
    publishedDatasets() {
      if (this.userDatasets) {
        return this.userDatasets.filter(dataset => !dataset.private);
      }

      return [];
    },
    unpublishedDatasets() {
      if (this.userDatasets) {
        return this.userDatasets.filter(dataset => dataset.private);
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
      let allTags = getPopularTags(this.userDatasets);

      if (allTags.length <= 0) {
        allTags = getPopularTags(this.userDatasets, '', 1);
      }

      if (allTags.length > this.maxFilterTags) {
        allTags = allTags.splice(this.maxFilterTags, allTags.length - this.maxFilterTags);
      }

      return allTags;
    },
    oldDashboardUrl() {
      return this.userDashboardConfig.showOldDashboardUrl ? `${this.domain}${this.dashboardCKANUrl}${this.user.name}` : '';
    },
    userOrganizationRoles() {
      if (!this.userOrganizations) {
        return null;
      }

      return getUserOrganizationRoleMap(this.user.id, this.userOrganizations);
    },
    organizationRoles() {
      if (!this.userOrganizationRoles) {
        return null;
      }

      const roles = [];
      const keys = Object.keys(this.userOrganizationRoles);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        roles.push ({
          organization: key,
          role: this.userOrganizationRoles[key],
        });
      }

      return roles;
    },
    canCreateDatasets() {
      const roles = this.organizationRoles;

      if (roles) {
        const matchedRole = roles.filter(r => r.role === 'editor'
            || r.role === 'admin'
            || r.role === 'sysadmin');
        return matchedRole.length > 0;
      }

      return false;
    },
  },
  methods: {
    getMetadataState(metadata) {
      return getMetadataVisibilityState(metadata);
    },
    contentFilteredByTags(value, selectedTagNames) {
      return value.tags && tagsIncludedInSelectedTags(value.tags, selectedTagNames);
    },
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
          },
          commit: true,
          mutation: USER_GET_DATASETS,
        });
    },
    async fetchCollaboratorDatasets() {
      await this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`,
        {
          action: ACTION_COLLABORATOR_DATASET_IDS,
          body: {
            id: this.user.id,
            include_datasets: true,
          },
          commit: true,
          mutation: USER_GET_COLLABORATOR_DATASET_IDS,
        });

      if (Array.isArray(this.collaboratorDatasetIds) && this.collaboratorDatasetIds.length > 0) {
        await this.$store.dispatch(`${USER_NAMESPACE}/${USER_GET_COLLABORATOR_DATASETS}`, this.collaboratorDatasetIds);
      }
    },
    async fetchUserOrganisationData() {
      await this.$store.dispatch(`${USER_NAMESPACE}/${USER_GET_ORGANIZATION_IDS}`, this.user.id);

      if (this.userOrganizationIds) {
        await this.$store.dispatch(`${USER_NAMESPACE}/${USER_GET_ORGANIZATIONS}`, this.userOrganizationIds);
      }
    },
    catchRefreshClick() {
      if (this.user) {
        this.fetchUserDatasets();
      }
    },
    catchCollaboratorRefreshClick() {
      if (this.user) {
        this.fetchCollaboratorDatasets();
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
    createClickCallback() {
      window.open(`${this.domain}${this.createCKANUrl}`, '_blank');
    },
    existingClickCallback() {
      this.$vuetify.goTo(this.$refs.userDatasets, {
        container: '#appContainer',
      });
    },
    editingClickCallback() {
      if (this.lastEditedDatasetPath) {
        this.$router.push({ path: `${this.lastEditedDatasetPath}?backPath=${this.$route.fullPath}` });

        // this.catchEditingClick(this.lastEditedDataset);
      }
    },
    catchEditingClick(selectedDataset) {
      this.$router.push({
        name: METADATAEDIT_PAGENAME,
        params: {
          metadataid: selectedDataset,
        },
        query: {
          backPath: this.$route.fullPath,
        },
      });
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
    catchMetadataClicked(datasetname) {
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
    dashboardCKANUrl: '/user/',
    createCKANUrl: '/dataset/new',
    domain,
    fileIconString: '',
    title: 'Dashboard',
    PageBGImage: 'app_b_dashboardpage',
    refreshButtonText: 'Reload Datasets',
    refreshOrgaButtonText: 'Reload Organisation Datasets',
    placeHolderAmount: 4,
    orgaDatasetsPreview: 5,
    maxFilterTags: 20,
    collabCardWidth: 290,
    collabCardHeight: 115,
    orgaCardWidth: 290,
    orgaCardHeight: 115,
    userCardHeight: 350,
    userCardWidth: 300,
    showModal: false,
    left: false,
    right: false,
    headerTitle: 'Dashboard',
    selectedTagNames: [],
    notSignedInInfos: {
      title: 'Not Signed in',
      description: 'Sign in with your email address to see your datasets.',
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
    noCollaboratorDatasetsInfos: {
      title: 'No Collaborator Datasets',
      description: "It seems you don't have datasets where you are added as a collaborator.",
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
    defaultPublicationState: 'draft',
  }),
  components: {
    MetadataList,
    NotFoundCard,
    IntroductionCard,
    NotificationCard,
    TitleCard,
    UserCard,
    MetadataCard,
    MetadataCardPlaceholder,
    UserOrganizationInfo,
  },
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

    .topBoard
      display: grid
      grid-template-columns: 4fr auto auto
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
