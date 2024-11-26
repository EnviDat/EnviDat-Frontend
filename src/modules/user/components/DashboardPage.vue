<template >
  <v-container class="pa-0"
                tag="article"
                fluid
                id="DashboardPage">

    <v-progress-linear v-show="loading"
                       indeterminate
                       style="position: relative; left: 0; bottom: 0;"
                       class="mb-2"
                       height="2"
                       color="accent" />
    <div v-if="!user"
          class="notSignedinGrid">

    <NotFoundCard v-bind="notSignedInInfos"
                  :actionButtonCallback="catchSigninClick" />
   </div>

   <div v-if="user"
        class="dashboardGrid" >

    <div class="topBoard mt-6 mt-md-0" >
        <IntroductionCard :userName="user.fullName"
                          :introText="userDashboardConfig.introText"
                          :feedbackText="userDashboardConfig.feedbackText"
                          :oldDashboardUrl="oldDashboardUrl"
                          :createClickCallback="canCreateDatasets ? createClickCallback : null"
                          :editingClickCallback="editingClickCallback"
                          :editingDatasetName="lastEditedDataset"
                          :currentLocalDataset="hasLocalDataset ? currentLocalDataset : undefined"
                          @localCardClicked="catchLocalCardClick"
                          @clearButtonClicked="catchClearLocalStorage"
        />

      <UserOrganizationInfo :height="userOrgaInfoCardHeight"
                            :width="userOrgaInfoCardWidth"
                            :userName="user.fullName"
                            :email="user.email"
                            :emailHash="user.emailHash"
                            :nameInitials="nameInitials"
                            :organizationRoles="organizationRoles"
                            :isCollaborator="isCollaborator" />


      <FlipLayout v-if="userEditingEnabled"
                  :height="userCardHeight"
                  :width="userCardWidth"
                  :autoButtonFlip="true" >

        <template v-slot:front>
          <UserCard :height="userCardHeight"
                    :width="userCardWidth"
                    :userName="user.fullName"
                    :email="user.email"
                    :emailHash="user.emailHash"
                    :nameInitials="nameInitials"
                    :datasetCount="publishedDatasets.length"
                    :loading="userEditLoading" />
        </template>

        <template v-slot:back>
          <EditUserProfile :height="userCardHeight"
                           :minWidth="userCardWidth"
                           :showPreview="false"
                           :firstName="userFirstName"
                           :lastName="userLastName"
                           :email="user.email"
                           :loading="userEditLoading" />
        </template>

      </FlipLayout>

      <UserCard v-if="!userEditingEnabled"
                :height="userCardHeight"
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
                  :icon='mdiRefresh'
                  :tooltipText="refreshButtonText"
                  :loading="userDatasetsLoading"
                  :clickCallback="catchRefreshClick" />

      <div v-if="hasUserDatasets && userDatasetsLoading"
           id="collaboratorPlaceholders"
           class="datasetsOverflow" >

        <v-row no-gutters>
          <v-col v-for="n in placeHolderAmount"
                 :key="`userDatasetsPlaceholder_${n}`"
                 cols="2"
                 class="pa-2" >

            <MetadataCardPlaceholder  />
          </v-col>
        </v-row>
      </div>

      <MetadataList v-if="hasUserDatasets"
                      class="datasetsOverflow px-1"
                      :listContent="filteredUserDatasets"
                      :searchCount="filteredUserDatasets.length"
                      :mapFilteringPossible="false"
                      :loading="userDatasetsLoading"
                      :placeHolderAmount="placeHolderAmount"
                      @clickedTag="catchTagClicked"
                      @clickedCard="catchMetadataClicked"
                      :selectedTagNames="selectedUserTagNames"
                      :allTags="allUserdataTags"
                      :showPlaceholder="updatingTags"
                      @clickedTagClose="catchTagCloseClicked"
                      :defaultListControls="userListDefaultControls"
                      :enabledControls="userListEnabledControls"
                      :mapTopLayout="false"
                      :topFilteringLayout="true"
                      :showSearch="false"
                      :showPublicationState="true"
                      :reloadAmount="20"
                      :metadatasContent="metadatasContent"
                      mainScrollClass=".midBoard > .datasetsGrid"
      />

      <div v-if="!hasUserDatasets"
            class="noUserDatasetsGrid px-1">
        <NotFoundCard v-bind="noDatasetsInfos"
                      :actionButtonCallback="isEditorAndAbove ? createClickCallback : null" />

        <NotificationCard v-if="noUserDatasetsError"
                          v-bind="noUserDatasetsError"
                          :showCloseButton="false" />

      </div>

    </div>

     <div class="midBoard pt-4"
          id="collaboratorDatasets"
          ref="collaboratorDatasets">

       <TitleCard title="My Collaborator Datasets"
                  :icon='mdiRefresh'
                  :tooltipText="refreshButtonText"
                  :loading="collaboratorDatasetIdsLoading || collaboratorDatasetsLoading"
                  :clickCallback="catchCollaboratorRefreshClick" />

       <div v-if="collaboratorDatasetIdsLoading || collaboratorDatasetsLoading"
            id="collaboratorPlaceholders"
            class="datasetsOverflow" >

         <v-row no-gutters>
           <v-col v-for="n in orgaDatasetsPreview"
                  :key="`orgaDatasetsPlaceholder_${n}`"
                  cols="2"
                  class="pa-2" >

             <MetadataCardPlaceholder id="orgaDataset" />
           </v-col>
         </v-row>
       </div>



       <div v-if="!collaboratorDatasetIdsLoading && !collaboratorDatasetsLoading && hasCollaboratorDatasets"
            id="collaboratorDatasetCards"
            class="datasetsOverflow" >

         <v-row no-gutters>
           <v-col v-for="(metadata, index) in collaboratorDatasets"
                  :key="`orgaDatasets_${index}`"
                  cols="2"
                  class="pa-2" >

             <MetadataCard :style="`height: ${collabCardHeight}px; `"
                           :id="metadata.id"
                           :title="metadata.title"
                           :subtitle="metadata.notes"
                           :name="metadata.name"
                           :titleImg="metadata.titleImg"
                           :resourceCount="metadata.num_resources"
                           :categoryColor="metadata.categoryColor"
                           :compactLayout="true"
                           :state="getMetadataState(metadata)"
                           :organization="metadata.organization.name"
                           :organizationTooltip="metadata.organization.title"
                           :role="metadata.role"
                           @clickedEvent="catchMetadataClicked"
                           @clickedTag="catchTagClicked"
                           :showGenericOpenButton="!!metadata.openEvent"
                           :openButtonTooltip="metadata.openButtonTooltip"
                           :openButtonIcon="metadata.openButtonIcon"
                           @openButtonClicked="catchEditingClick(metadata.openProperty)"
                            />

           </v-col>
         </v-row>

       </div>

       <div v-if="!collaboratorDatasetIdsLoading && !collaboratorDatasetsLoading && !hasCollaboratorDatasets"
            class="noUserDatasetsGrid px-1">
         <NotFoundCard v-bind="noCollaboratorDatasetsInfos" />

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
  USER_GET_COLLABORATOR_DATASETS,
  USER_GET_COLLABORATOR_DATASET_IDS,
  ACTION_COLLABORATOR_DATASET_IDS,
  USER_EDITING_UPDATE,
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
  USER_SIGNIN_PATH,
  METADATADETAIL_PAGENAME,
  METADATAEDIT_PAGENAME,
  METADATA_CREATION_PATH,
  METADATA_CREATION_PAGENAME,
} from '@/router/routeConsts';

import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';


import { getNameInitials } from '@/factories/authorFactory';
import { errorMessage } from '@/factories/notificationFactory';
import { getTagColor, getPopularTags, tagsIncludedInSelectedTags } from '@/factories/keywordsFactory';
import {
  enhanceMetadataEntry,
  isTagSelected,
} from '@/factories/metaDataFactory';

import {
  getUserOrganizationRoleMap,
  hasOrganizationRoles,
  isMember,
  USER_ROLE_ADMIN,
  USER_ROLE_EDITOR,
  USER_ROLE_SYSTEM_ADMIN,
} from '@/factories/userEditingValidations';

import UserNotFound1 from '@/modules/user/assets/UserNotFound1.jpg';
import UserNotFound2 from '@/modules/user/assets/UserNotFound2.jpg';

import {
  EDIT_USER_PROFILE_EVENT,
  eventBus,
  SELECT_EDITING_DATASET,
  SHOW_DIALOG,
  SHOW_REDIRECT_DASHBOARD_DIALOG,
  USER_PROFILE,
} from '@/factories/eventBus';

import { getPreviewDatasetFromLocalStorage } from '@/factories/userCreationFactory';

import { METADATA_TITLE_PROPERTY } from '@/factories/metadataConsts';

import { mdiRefresh } from '@mdi/js';
import { loadRouteTags } from '@/factories/stringFactory';
import categoryCards from '@/store/categoryCards';

import {defineAsyncComponent} from 'vue';

import MetadataList from '@/components/MetadataList.vue';
import MetadataCard from '@/components/Cards/MetadataCard.vue';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';
import TitleCard from '@/components/Cards/TitleCard.vue';
import UserCard from '@/components/Cards/UserCard.vue';
import EditUserProfile from '@/modules/user/components/edit/EditUserProfile.vue';
import FlipLayout from '@/components/Layouts/FlipLayout.vue';
import { getMetadataVisibilityState } from '@/factories/publicationFactory';


const IntroductionCard = defineAsyncComponent(() =>
  import('@/components/Cards/IntroductionCard.vue'),
);
const NotFoundCard = defineAsyncComponent(() =>
  import('@/components/Cards/NotFoundCard.vue'),
);
const NotificationCard = defineAsyncComponent(() =>
  import('@/components/Cards/NotificationCard.vue'),
);
const UserOrganizationInfo = defineAsyncComponent(() =>
  import('@/components/Cards/UserOrganizationInfo.vue'),
);

export default {
  name: 'DashboardPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, USER_DASHBOARD_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.pageBGImage);
    });
  },
  created() {
    this.organizationsStore = useOrganizationsStore();
    eventBus.on(SELECT_EDITING_DATASET, this.catchEditingClick);
    eventBus.on(EDIT_USER_PROFILE_EVENT, this.callUserUpdateAction);
  },
  beforeUnmount() {
    eventBus.off(SELECT_EDITING_DATASET, this.catchEditingClick);
    eventBus.off(EDIT_USER_PROFILE_EVENT, this.callUserUpdateAction);
  },
  beforeMount() {

    this.loadRouteWithTags();

    if (this.user) {
      this.fetchUserDatasets();
      this.fetchCollaboratorDatasets();
      this.fetchUserOrganizationId(true);
    }
  },
  mounted() {
    if (this.dashboardRedirect) {
      // if the config is set to redirect to the legacy dashboard
      eventBus.emit(SHOW_REDIRECT_DASHBOARD_DIALOG);
    }
  },
  computed: {
    ...mapState([
      'config',
    ]),
    ...mapState(USER_SIGNIN_NAMESPACE, [
      'user',
      'userLoading',
      'userEditLoading',
    ]),
    ...mapState(USER_NAMESPACE, [
      'collaboratorDatasetIdsLoading',
      'collaboratorDatasetIds',
      'collaboratorDatasetsLoading',
      'collaboratorDatasets',
      'userDatasets',
      'userDatasetsLoading',
      'userDatasetsError',
      'lastEditedDataset',
      'lastEditedDatasetPath',
    ]),
    ...mapGetters(METADATA_NAMESPACE, [
      'allTags',
      'updatingTags',
      'metadatasContent',
    ]),
    userDashboardConfig() {
      return this.config?.userDashboardConfig || {};
    },
    dashboardRedirect() {
      return this.userDashboardConfig?.dashboardRedirect || false;
    },
    userEditMetadataConfig() {
      return this.config?.userEditMetadataConfig;
    },
    datasetCreationActive() {
      return this.userEditMetadataConfig?.datasetCreationActive || false;
    },
    loading() {
      return this.userLoading || this.userEditLoading || this.userDatasetsLoading || this.organizationsStore.userOrganizationLoading;
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

    userOrgaDatasetList() {
      const datasets = [];

      if (!this.organizationsStore.userOrganizations) {
        return datasets;
      }

      this.organizationsStore.userOrganizations.forEach(o => {
        if (o.packages?.length > 0) {
          datasets.push(o.packages);
        }
      });

      return datasets.flat();
    },
    filteredUserDatasets() {
      const filteredContent = [];

      if (!this.hasUserDatasets) {
        return filteredContent;
      }

      if (!this.selectedUserTagNames || this.selectedUserTagNames.length <= 0) {
        return this.userDatasets;
      }

      for (let i = 0; i < this.userDatasets.length; i++) {
        const entry = this.userDatasets[i];

        if (tagsIncludedInSelectedTags(entry.tags, this.selectedUserTagNames)) {
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
    nameInitials() {
      return getNameInitials(this.user);
    },
    allUserdataTags() {
      const minTagCount = this.userDatasets?.length > 50 ? 5 : 2;

      return this.getPopularTagsFromDatasets(this.filteredUserDatasets, minTagCount, undefined, this.filteredUserDatasets.length);
    },
    oldDashboardUrl() {
      return this.userDashboardConfig.showOldDashboardUrl ? `${this.ckanDomain}${this.dashboardCKANUrl}${this.user.name}` : '';
    },
    userOrganizationRoles() {
      if (!this.organizationsStore.hasUserOrganizations) {
        return null;
      }

      return getUserOrganizationRoleMap(this.user.id, this.organizationsStore.userOrganizations);
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
        const matchedRole = roles.filter(r => r.role === USER_ROLE_EDITOR
            || r.role === USER_ROLE_ADMIN
            || r.role === USER_ROLE_SYSTEM_ADMIN);
        return matchedRole.length > 0;
      }

      return false;
    },
    isCollaborator() {
      return this.collaboratorDatasets?.length > 0;
    },
    isEditorAndAbove() {
      return hasOrganizationRoles(this.organizationRoles) && !isMember(this.organizationRoles);
    },
    noDatasetsInfos() {
      return {
        title: 'No Datasets',
        description: 'It seems you don\'t have any datasets.',
        actionDescription: this.isEditorAndAbove ? 'Get started and create a new dataset' : '',
        actionButtonText: 'New Dataset',
        image: UserNotFound2,
      };
    },
    userEditingEnabled() {
      return this.userDashboardConfig?.userEditingEnabled || false;
    },
    userFirstName() {
      return this.user?.fullName?.split(' ')[0] || '';
    },
    userLastName() {
      return this.user?.fullName?.split(' ')[1] || '';
    },
    hasLocalDataset() {
      const localStorageData = getPreviewDatasetFromLocalStorage();

      // eslint-disable-next-line no-unused-expressions
      this.localDatasetUpdateCount;

      const properties = Object.keys(localStorageData);

      return properties.length > 0;
    },
    currentLocalDataset() {
      const localStorageData = getPreviewDatasetFromLocalStorage();

      const localDataset = {
        title: localStorageData[METADATA_TITLE_PROPERTY] ? localStorageData[METADATA_TITLE_PROPERTY] : '[Untitled Dataset]',
        subTitle: localStorageData.description,
        tags: localStorageData.keywords,
        flatLayout: true,
      };

      enhanceMetadataEntry(localDataset);

      return localDataset;
    },
  },
  methods: {
    getPopularTagsFromDatasets(datasets, minCount = undefined, maxCount = undefined, maxTagAmount = 30) {
      let tags = getPopularTags(datasets, '', minCount, maxCount);

      if (tags.length <= 0) {
        tags = getPopularTags(datasets, '', 1, maxCount);
      }

      if (tags.length > this.maxFilterTags) {
        tags = tags.splice(this.maxFilterTags, tags.length - this.maxFilterTags);
      }

      for (let j = 0; j < tags.length; j++) {
        const tag = tags[j];
        tag.color = getTagColor(categoryCards, tag.name);
      }

      tags = tags.slice(0, maxTagAmount);
      tags = tags.sort((a, b) => a.count < b.count ? 1 : -1);

      return tags;
    },
    getMetadataState(metadata) {
      return getMetadataVisibilityState(metadata);
    },
    contentFilteredByTags(value, selectedUserTagNames) {
      return value.tags && tagsIncludedInSelectedTags(value.tags, selectedUserTagNames);
    },
    loadRouteWithTags() {
      const routeTags = loadRouteTags(this.$route.query.tags, this.selectedUserTagNames);

      if (routeTags?.length > 0) {
        this.selectedUserTagNames = routeTags;
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

      // always call the USER_GET_COLLABORATOR_DATASETS action because it resolves the store & state also when collaboratorDatasetIds is empty
      await this.$store.dispatch(`${USER_NAMESPACE}/${USER_GET_COLLABORATOR_DATASETS}`, this.collaboratorDatasetIds);
    },
    async fetchUserOrganizationId(forceReload = false) {
      if (forceReload || !forceReload && this.organizationsStore.userOrganizations?.length > 0) {
        await this.organizationsStore.UserGetOrgIds(this.user.id)
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
    catchSigninClick() {
      this.$router.push({ path: USER_SIGNIN_PATH, query: '' });
    },
    createClickCallback() {
      if (this.datasetCreationActive) {
        this.$router.push({ path: METADATA_CREATION_PATH, query: '' });
      } else {
        window.open(`${this.ckanDomain}${this.createCKANUrl}`, '_blank');
      }
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
      if (!isTagSelected(tagName, this.selectedTagNames)) {
        this.selectedUserTagNames.push(tagName);
      }
    },

    catchTagCloseClicked(tagName) {
      this.selectedUserTagNames = this.selectedUserTagNames.filter(tag => tag !== tagName);
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
    callUserUpdateAction(updateObject) {

      if (updateObject.object === USER_PROFILE) {

        const payload = {
          userId: this.user.id,
          firstName: updateObject.data.firstName,
          lastName: updateObject.data.lastName,
          email: updateObject.data.email,
        };

        this.$store.dispatch(
          `${USER_SIGNIN_NAMESPACE}/${USER_EDITING_UPDATE}`,
          payload,
        );
      }
    },
    catchLocalCardClick() {
      this.$router.push({
        name: METADATA_CREATION_PAGENAME,
      });
    },
    catchClearLocalStorage() {
      eventBus.emit(SHOW_DIALOG, {
        title: 'Clear your dataset in creation?',
        message: 'This dataset is not stored on the server yet! Are you sure you want to delete it?',
        callback: () => {},
        cancelCallback: () => {
          localStorage.clear();

          // increase this number to force the computed property to recalulate because the
          // localstorage is cleared. Localstorage isn't reactive so the computed prop
          // won't get it out of the box
          this.localDatasetUpdateCount++;
        },
        confirmText: 'Keep Dataset',
        cancelText: 'Delete Dataset',
      });
    },
  },
  watch: {
    user() {
      if (this.user) {
        this.fetchUserDatasets();
        this.fetchCollaboratorDatasets();
      }
    },
  },
  data: () => ({
    loadedOrg: false,
    loadOrgButton: 'Load Organizations',
    organizationsStore: null,
    dashboardCKANUrl: '/user/',
    createCKANUrl: '/dataset/new',
    ckanDomain: process.env.VITE_API_ROOT,
    title: 'Dashboard',
    pageBGImage: 'app_b_dashboardpage',
    refreshButtonText: 'Reload Datasets',
    placeHolderAmount: 4,
    orgaDatasetsPreview: 4,
    maxFilterTags: 20,
    collabCardWidth: 290,
    collabCardHeight: 115,
    userCardHeight: 400,
    userCardWidth: 300,
    userOrgaInfoCardHeight: 400,
    userOrgaInfoCardWidth: 400,
    showModal: false,
    left: false,
    right: false,
    headerTitle: 'Dashboard',
    selectedUserTagNames: [],
    notSignedInInfos: {
      title: 'Not Signed in',
      description: 'Sign in with your email address to see your datasets.',
      actionButtonText: 'Sign in',
      image: UserNotFound1,
    },
    noCollaboratorDatasetsInfos: {
      title: 'No Collaborator Datasets',
      description: 'It seems you don\'t have datasets where you are added as a collaborator.',
      image: UserNotFound2,
    },
    noOrganizationsInfos: {
      title: 'No Organizations Found',
      description: 'It seems that your aren\'t assigned to an organisation. Ask your project or group lead to add you as a member or directly as an editor so you can create and edit datasets.',
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
    localDatasetUpdateCount: 0,
    mdiRefresh,
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
    FlipLayout,
    EditUserProfile,
  },
};
</script>

<style lang="sass" scoped>
  /* @import "~vuetify/src/styles/settings/_variables.scss" */
  $spacer: 4px !default
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
      gap: $gridGap

    .midBoard
      display: grid
      grid-template-rows: 36px auto
      gap: $gridGap
      transition: 1s all
      overflow: hidden hidden

      .datasetsOverflow
        overflow: hidden hidden


      .noUserDatasetsGrid
        display: grid
        grid-template-columns: 1fr 1fr
        gap: $gridGap

    .bottomBoard
      display: grid
      grid-template-rows: 36px auto
      gap: $gridGap
      overflow: hidden auto

      .datasetsGrid
        overflow: hidden auto

      .noOrgaDatasetsGrid
        display: grid
        grid-template-columns: 1fr 1fr
        gap: $gridGap

</style>

<style scoped>

@media (min-width: 767px) {
  .topBoard {
    grid-template-columns: 4fr auto auto;
    overflow: hidden hidden;
  }
}
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
