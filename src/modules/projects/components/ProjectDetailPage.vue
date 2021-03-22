<template>
  <v-container class="pa-0"
                tag="article"
                fluid>
    <v-row no-gutters>

      <v-col class="elevation-5 pa-0"
              cols="12"
              ref="header"
              style="z-index: 1; position: absolute; left: 0;"
              :style="headerStyle" >

        <project-header :title="currentProject ? currentProject.title : null"
                        :titleImg="currentProject ? currentProject.image_display_url : null"
                        :defaultImg="missionImg"
                        :showPlaceholder="loading"
                        @clickedBack="catchBackClicked" />
      </v-col>
    </v-row>

    <v-row :style="`z-index: 0; position: relative; top: ${headerHeight()}px`"
            no-gutters>

      <v-col class="pb-2 px-sm-3"
              cols="12"
              lg="10"
              offset-lg="1">

        <project-body :description="currentProject ? currentProject.description : null"
                        :showPlaceholder="loading"
                        :maxTextLength="$vuetify.breakpoint.xsOnly ? 950 : 1500" />
      </v-col>

      <v-col v-if="loading || (!loading && currentProject && currentProject.subProjects)"
              class="pb-2 px-sm-3"
              cols="12"
              lg="10"
              offset-lg="1" >

        <project-subprojects :subProjects="currentProject.subProjects"
                              :defaultImg="creatorImg"
                              :showPlaceholder="loading"
                              @projectClick="catchProjectClick"
                              @subprojectClick="catchSubprojectClick" />
      </v-col>

      <v-col class="pb-2 px-sm-3"
              cols="12"
              lg="10"
              offset-lg="1" >

        <v-card>
          <v-card-title class="metadataList_title title">
            {{ metadataListTitle }}
          </v-card-title>

          <div v-if="hasMetadatas" >
            <metadata-list ref="metadataList"
                            class="px-3"
                            :listContent="filteredListContent"
                            :showMapFilter="false"
                            :mapFilteringPossible="mapFilteringPossible"
                            :loading="loading"
                            :placeHolderAmount="placeHolderAmount"
                            @clickedTag="catchTagClicked"
                            :allTags="allMetadataTags"
                            :selectedTagNames="selectedTagNames"
                            @clickedTagClose="catchTagCloseClicked"
                            @clickedClear="catchTagCleared"
                            :defaultListControls="defaultControls"
                            :enabledControls="enabledControls"
                            :minMapHeight="mapFilterHeight"
                            :topFilteringLayout="true"
                            :showSearch="false"
                            :searchCount="filteredListContent.length"
                            @setScroll="setScrollPos" />
          </div>

          <div v-if="!hasMetadatas" >
            <v-card-text style="color: red;" >
              {{ metadataEmptyText }} '{{ currentProject ? currentProject.title : '' }}'
            </v-card-text>
          </div>

        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
/**
 * The ProjectDetailPage shows all the ProjectDetailVies for a project.
 *
 * @summary project detail page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2020-08-26 20:25:54
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters } from 'vuex';
import { PROJECTS_PATH, PROJECT_DETAIL_PAGENAME } from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import {
  METADATA_NAMESPACE,
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
} from '@/store/metadataMutationsConsts';

import MetadataList from '@/components/MetadataList';

import missionImg from '@/assets/projects/mission.jpg';
import creatorSmall from '@/assets/cards/data_creator_small.jpg';

import {
  tagsIncludedInSelectedTags,
  createTag,
} from '@/factories/metadataFilterMethods';

import creator from '../assets/data_creator.jpg';

import ProjectSubprojects from './ProjectDetailViews/ProjectSubprojects';
import ProjectBody from './ProjectDetailViews/ProjectBody';
import ProjectHeader from './ProjectDetailViews/ProjectHeader';

import {
  GET_PROJECTS,
  PROJECTS_NAMESPACE,
  SET_PROJECTDETAIL_PAGE_BACK_URL,
} from '../store/projectsMutationsConsts';

export default {
  /**
     * @description beforeRouteEnter is used to change background image of this page.
     * It's called via vue-router.
     */
  name: 'ProjectDetailPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, PROJECT_DETAIL_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);

      let backRoute = { path: PROJECTS_PATH };

      if (vm.currentProject && vm.currentProject.parent) {
        backRoute = {
          name: PROJECT_DETAIL_PAGENAME,
          params: { id: vm.currentProject.parent.id },
        };
      }

      vm.$store.commit(`${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`, backRoute);

      // reset scroll for every new load of project details
      vm.setScrollPos(0);
    });
  },
  beforeRouteUpdate(to, from, next) {
    const toProject = this.projects.find(project => project.id === to.params.id);
    let backRoute = { path: PROJECTS_PATH };

    if (toProject?.parent) {
      backRoute = {
        name: PROJECT_DETAIL_PAGENAME,
        params: { id: toProject.parent.id },
      };
    }
    this.$store.commit(`${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`, backRoute);

    this.setScrollPos(0);
    next();
  },
  beforeMount() {
    if (this.projects.length <= 0) {
      this.$store.dispatch(`${PROJECTS_NAMESPACE}/${GET_PROJECTS}`);
    }
  },
  computed: {
    ...mapGetters({
      loading: `${PROJECTS_NAMESPACE}/loading`,
      projects: `${PROJECTS_NAMESPACE}/projects`,
      projectsPageBackRoute: `${PROJECTS_NAMESPACE}/projectsPageBackRoute`,
      metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
      allTags: `${METADATA_NAMESPACE}/allTags`,
    }),
    projectsCardsParents() {
      // return this.projects.filter(project => !project.parent);
      const noSubs = [];
      for (let i = 0; i < this.projects.length; i++) {
        const p = this.projects[i];
        if (!p.parent) {
          noSubs.push(p);
        }
      }
      return noSubs;
    },
    projectId() {
      return this.$route.params.id;
    },
    currentProject() {
      return this.getProject(this.projectId);
    },
    mapFilteringPossible() {
      return this.$vuetify.breakpoint.smAndUp;
    },
    hasMetadatas() {
      return this.currentProject && this.currentProject.packages && this.currentProject.packages.length > 0;
    },
    creatorImg() {
      return this.$vuetify.breakpoint.mdAndUp ? creator : creatorSmall;
    },
    allMetadataTags() {
      const projectDatasetsTags = [];

      for (let i = 0; i < this.allTags.length; i++) {
        const tag = this.allTags[i];
        let found = false;

        for (let j = 0; j < this.filteredListContent.length; j++) {
          const dataset = this.filteredListContent[j];
          const tags = dataset.tags;

          if (tags && tags.length > 0) {
            const index = tags.findIndex(obj => obj.name.includes(tag.name));

            if (index >= 0) {
              found = true;
              break;
            }
          }
        }

        projectDatasetsTags.push(createTag(tag.name, { enabled: found }));
      }

      return projectDatasetsTags;
    },
    filteredListContent() {
      const projectDatasets = [];

      if (this.hasMetadatas) {
        for (let i = 0; i < this.currentProject.packages.length; i++) {
          const el = this.currentProject.packages[i];
          // const index = el.tags.findIndex(obj => obj.name.includes(tag.name));
          if (tagsIncludedInSelectedTags(el.tags, this.selectedTagNames)) {
            const fullDataset = this.getMetadataContent(el.id);

            if (fullDataset) {
              // the tags of each dataset has to be looked up in the metadataContents
              // because the backend call doesn't deliver the packages with the tags
              // it can only delivery the tags for the projects, which is no use for this
              // case
              projectDatasets.push(fullDataset);
            } else {
              projectDatasets.push(el);
            }
          }
        }
      }

      return projectDatasets;
    },
    headerStyle() {
      let width = 82.25;
      let margin = '0px 8.33333%';

      if (this.$vuetify.breakpoint.mdAndDown) {
        width = 100;
        margin = '0';
      }

      if (this.$vuetify.breakpoint.lg) {
        width = 83.25;
      }

      return `width: ${width}%; margin: ${margin};`;
    },
  },
  methods: {
    headerHeight() {
      if (this.$refs && this.$refs.header) {
        return this.$refs.header.clientHeight;
      }

      return 150;
    },
    getMetadataContent(id) {
      if (!this.metadatasContent) {
        return null;
      }

      return this.metadatasContent[id];
    },
    getProject(id) {
      let current = null;

      for (let i = 0; i < this.projects.length; i++) {
        const el = this.projects[i];

        if (el.id === id) {
          current = el;
          break;
        }
      }

      return current;
    },
    /**
     * @description changes the url to page the user was before. Fallback: PROJECTS_PATH
     */
    catchBackClicked() {
      const backRoute = this.projectsPageBackRoute;

      if (backRoute) {
        this.$router.push({
          path: backRoute.path,
          query: backRoute.query,
          params: backRoute.params,
        });
        return;
      }

      this.$router.push({ path: PROJECTS_PATH });
    },
    catchProjectClick(projectId) {
      this.$store.commit(`${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`, this.$route);

      this.$router.push({
        name: PROJECT_DETAIL_PAGENAME,
        params: { id: projectId },
      });
    },
    catchSubprojectClick(subprojectId) {
      this.$store.commit(`${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`, this.$route);

      this.$router.push({
        name: PROJECT_DETAIL_PAGENAME,
        params: { id: subprojectId },
      });
    },
    catchTagClicked(tagName) {
      if (!this.mixinMethods_isTagSelected(tagName)) {
        this.selectedTagNames.push(tagName);
      }
    },
    catchTagCloseClicked(tagId) {
      if (this.selectedTagNames === undefined) {
        return;
      }

      if (this.mixinMethods_isTagSelected(tagId)) {
        this.selectedTagNames = this.selectedTagNames.filter(tag => tag !== tagId);
      }
    },
    catchTagCleared() {
      this.selectedTagNames = [];
    },
    setScrollPos(toPos) {

      if (this.$root.$children && this.$root.$children[0].$refs.appContainer) {
        this.$root.$children[0].$refs.appContainer.scrollTop = toPos;
      }
    },
  },
  components: {
    ProjectHeader,
    ProjectBody,
    ProjectSubprojects,
    MetadataList,
  },
  data: () => ({
    PageBGImage: './app_b_browsepage.jpg',
    missionImg,
    creator,
    creatorSmall,
    placeHolderAmount: 3,
    selectedTagNames: [],
    defaultControls: [LISTCONTROL_MAP_ACTIVE],
    enabledControls: [
      LISTCONTROL_LIST_ACTIVE,
      LISTCONTROL_MAP_ACTIVE,
    ],
    mapFilterHeight: 400,
    metadataListTitle: 'Related Datasets',
    metadataEmptyText: 'There are no datasets connected with the project',
  }),
};
</script>

<style >
  .metadataList_title {
    font-family: 'Libre Baskerville', serif !important;
    font-weight: 700 !important;
  }
</style>
