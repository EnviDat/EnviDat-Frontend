<template>
  <v-container class="pa-0" tag="article" ref="projectDetail">
    <v-row no-gutters>
      <v-col
        class="elevation-5 pa-0"
        cols="12"
        ref="header"
        style="z-index: 1; left: 0"
      >
        <ProjectHeader
          :title="currentProject ? currentProject.title : null"
          :titleImg="currentProject ? currentProject.image_display_url : null"
          :defaultImg="missionImg"
          :showPlaceholder="loading"
          @clickedBack="catchBackClicked"
        />
      </v-col>
    </v-row>

    <v-row :style="`z-index: 0; position: relative;`" no-gutters>
      <v-col class="pb-2" cols="12" lg="12">
        <ProjectBody
          :description="currentProject ? currentProject.description : null"
          :showPlaceholder="loading"
          :maxTextLength="$vuetify.display.xs ? 900 : 2000"
        />
      </v-col>

      <v-col
        v-if="loading || (!loading && subProjects)"
        class="pb-2"
        cols="12"
        lg="12"
      >
        <ProjectSubprojects
          :subProjects="subProjects"
          :defaultImg="creatorImg"
          :showPlaceholder="loading"
          @projectClick="catchProjectClick"
          @subprojectClick="catchSubprojectClick"
        />
      </v-col>

      <v-col ref="projectDatasetsList" class="pb-2" cols="12" lg="12">
        <ProjectDatasets
          ref="projectDatasets"
          :hasMetadatas="hasMetadatas"
          :listContent="filteredListContent"
          :mapFilteringPossible="mapFilteringPossible"
          :placeHolderAmount="placeHolderAmount"
          @clickedTag="catchTagClicked"
          :allTags="allMetadataTags"
          :selectedTagNames="selectedTagNames"
          @clickedTagClose="catchTagCloseClicked"
          @clickedClear="catchTagCleared"
          @clickedCard="catchMetadataClicked"
          :prePinnedIds="selectedPins"
          @pinnedIds="catchPinnedIds"
          :defaultListControls="defaultControls"
          :enabledControls="enabledControls"
          :topFilteringLayout="true"
          :showSearch="false"
          :metadatasContent="metadatasContent"
          :loading="loading"
          @setScroll="setScrollPos"
        />
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
 * Last modified  : 2020-11-04 10:18:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters, mapState } from 'vuex';
import { defineAsyncComponent } from 'vue';

import {
  METADATADETAIL_PAGENAME,
  PROJECT_DETAIL_PAGENAME,
  PROJECTS_PATH,
} from '@/router/routeConsts';
import {
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
  METADATA_NAMESPACE,
  SET_DETAIL_PAGE_BACK_URL,
} from '@/store/metadataMutationsConsts';

import {
  convertArrayToUrlString,
  convertUrlStringToArray,
} from '@/factories/stringFactory';
import { getImage } from '@/factories/imageFactory';
import {
  createTag,
  tagsIncludedInSelectedTags,
} from '@/factories/keywordsFactory';
import { isTagSelected } from '@/factories/metaDataFactory';
import {
  GET_PROJECTS,
  PROJECTS_NAMESPACE,
  SET_PROJECTDETAIL_PAGE_BACK_URL,
} from '../store/projectsMutationsConsts';

import ProjectBody from './ProjectDetailViews/ProjectBody.vue';
import ProjectHeader from './ProjectDetailViews/ProjectHeader.vue';

const ProjectSubprojects = defineAsyncComponent(
  () =>
    import(
      '@/modules/projects/components/ProjectDetailViews/ProjectSubprojects.vue'
    ),
);

const ProjectDatasets = defineAsyncComponent(
  () =>
    import(
      '@/modules/projects/components/ProjectDetailViews/ProjectDatasets.vue'
    ),
);

export default {
  /**
   * @description beforeRouteEnter is used to change background image of this page.
   * It's called via vue-router.
   */
  name: 'ProjectDetailPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let backRoute = { path: PROJECTS_PATH };

      if (vm.currentProject?.parent) {
        backRoute = {
          name: PROJECT_DETAIL_PAGENAME,
          params: { id: vm.currentProject.parent.name },
        };
      }

      vm.$store.commit(
        `${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`,
        backRoute,
      );

      // reset scroll for every new load of project details
      if (from.name === METADATADETAIL_PAGENAME) {
        vm.setScrollPos('projectDatasetsList');
      } else {
        vm.setScrollPos('header');
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    const toProject = this.getProject(to.params.id);

    let backRoute = { path: PROJECTS_PATH };

    if (toProject?.parent) {
      backRoute = {
        name: PROJECT_DETAIL_PAGENAME,
        params: { id: toProject.parent.name },
      };
    }
    this.$store.commit(
      `${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`,
      backRoute,
    );
    if (from.name === METADATADETAIL_PAGENAME) {
      this.setScrollPos('projectDatasetsList');
    } else {
      this.setScrollPos('header');
    }
    next();
  },
  beforeMount() {
    if (!this.loadingConfig && !this.loading) {
      this.loadProjects();
    }
  },
  mounted() {
    this.loadRoutePins();
  },
  computed: {
    ...mapState(['loadingConfig', 'config']),
    ...mapGetters({
      loading: `${PROJECTS_NAMESPACE}/loading`,
      projects: `${PROJECTS_NAMESPACE}/projects`,
      projectsPageBackRoute: `${PROJECTS_NAMESPACE}/projectsPageBackRoute`,
      metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
      allTags: `${METADATA_NAMESPACE}/allTags`,
    }),
    projectsConfig() {
      return this.config?.projectsConfig || {};
    },
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
    subProjects() {
      return this.currentProject?.subProjects || null;
    },
    mapFilteringPossible() {
      return this.$vuetify.display.smAndUp;
    },
    hasMetadatas() {
      return (
        this.currentProject &&
        this.currentProject.packages &&
        this.currentProject.packages.length > 0
      );
    },
    creatorImg() {
      const imgPath = this.$vuetify.display.mdAndUp
        ? 'data_creator'
        : 'data_creator_small';
      return getImage(imgPath);
    },
    missionImg() {
      const imgPath = this.$vuetify.display.mdAndUp
        ? 'mission'
        : 'mission_small';
      return getImage(imgPath);
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
            const index = tags.findIndex((obj) => obj.name.includes(tag.name));

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
  },
  methods: {
    loadRoutePins() {
      let pins = this.$route.query.pins || '';
      if (pins.length > 0) {
        pins = convertUrlStringToArray(pins, false, true);

        this.selectedPins = pins;
      }
    },
    catchPinnedIds(pins) {
      this.selectedPins = pins;

      const stringPins = convertArrayToUrlString(this.selectedPins);

      this.$router.options.additiveChangeRoute(
        this.$route,
        this.$router,
        this.$route.path,
        undefined,
        undefined,
        undefined,
        stringPins,
        undefined,
      );
    },
    catchMetadataClicked(datasetname) {
      this.$store.commit(
        `${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`,
        this.$route,
      );

      this.$router.push({
        name: METADATADETAIL_PAGENAME,
        params: {
          metadataid: datasetname,
        },
      });
    },
    loadProjects() {
      if (this.projects.length <= 0) {
        this.$store.dispatch(
          `${PROJECTS_NAMESPACE}/${GET_PROJECTS}`,
          this.projectsConfig,
        );
      }
    },
    getMetadataContent(id) {
      if (!this.metadatasContent) {
        return null;
      }

      return this.metadatasContent[id];
    },
    getProject(id) {
      for (let i = 0; i < this.projects.length; i++) {
        const el = this.projects[i];

        if (el.id === id || el.name === id) {
          return el;
        }
      }

      return null;
    },
    /**
     * @description changes the url to page the user was before. Fallback: PROJECTS_PATH
     */
    catchBackClicked() {
      const backRoute = this.projectsPageBackRoute;

      if (backRoute) {
        this.$router.push({
          path: backRoute.path,
          query: backRoute.query || {},
          params: backRoute.params || {},
        });
        return;
      }

      this.$router.push({ path: PROJECTS_PATH });
    },
    catchProjectClick(projectId) {
      this.$store.commit(
        `${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`,
        this.$route,
      );

      this.$router.push({
        name: PROJECT_DETAIL_PAGENAME,
        params: { id: projectId },
      });
    },
    catchSubprojectClick(subprojectId) {
      this.$store.commit(
        `${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`,
        this.$route,
      );

      this.$router.push({
        name: PROJECT_DETAIL_PAGENAME,
        params: { id: subprojectId },
      });
    },
    catchTagClicked(tagName) {
      if (!isTagSelected(tagName, this.selectedTagNames)) {
        this.selectedTagNames.push(tagName);
      }
    },
    catchTagCloseClicked(tagId) {
      if (this.selectedTagNames === undefined) {
        return;
      }

      if (isTagSelected(tagId, this.selectedTagNames)) {
        this.selectedTagNames = this.selectedTagNames.filter(
          (tag) => tag !== tagId,
        );
      }
    },
    catchTagCleared() {
      this.selectedTagNames = [];
    },
    setScrollPos(refEl) {
      this.$nextTick(() => {
        const refName = refEl;
        const el = this.$refs[refName];

        if (el) {
          (el.$el || el).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },
  },
  watch: {
    config() {
      if (!this.loadingConfig && !this.loading) {
        this.loadProjects();
      }
    },
    $route() {
      // react on changes of the route ( pin clicks )
      // removed to fix the lang layer problem when clicking on markers, not very clear why. to be checked in redesign
      this.loadRoutePins();
    },
  },
  components: {
    ProjectHeader,
    ProjectBody,
    ProjectSubprojects,
    ProjectDatasets,
  },
  data: () => ({
    placeHolderAmount: 3,
    selectedTagNames: [],
    selectedPins: [],
    defaultControls: [LISTCONTROL_MAP_ACTIVE],
    enabledControls: [LISTCONTROL_LIST_ACTIVE, LISTCONTROL_MAP_ACTIVE],
  }),
};
</script>
