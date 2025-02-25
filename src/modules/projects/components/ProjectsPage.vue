<template>
  <v-container id="ProjectsPage" tag="article" fluid class="pa-0">
    <v-row>
      <v-col cols="12" lg="10" offset-lg="1">
        <img-and-text-layout
          :img="missionImg"
          :height="$vuetify.display.smAndDown ? 100 : 150"
          title="Research Projects" />
      </v-col>

      <v-col class="mt-5" cols="12" lg="10" offset-lg="1">
        <v-container v-if="loading" class="pa-0" fluid>
          <v-row>
            <v-col
              v-for="(project, index) in 4"
              :key="index"
              cols="12"
              sm="6"
              md="4"
              xl="3">
              <project-card-placeholder />
            </v-col>
          </v-row>
        </v-container>

        <v-container v-else class="pa-0" fluid>
          <v-row>
            <v-col
              v-for="(project, index) in projectsCardsParents"
              :key="index"
              cols="12"
              sm="6"
              md="4"
              xl="3">
              <project-card
                :id="project.name"
                :title="project.title"
                :img="project.image_display_url"
                :defaultImg="creatorImg"
                :description="project.description"
                :subProjects="project.subProjects"
                @cardClick="onCardClick"
                @subprojectClick="onSubprojectClick" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * The ProjectsPage shows an overview (list of ProjectCards) all the projects
 * and their subprojects.
 *
 * @summary projects page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2020-11-03 17:20:56
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters, mapState } from 'vuex';

import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout.vue';
import {
  PROJECT_DETAIL_PAGENAME,
  PROJECTS_PAGENAME,
} from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import { getImage } from '@/factories/imageFactory';
import {
  GET_PROJECTS,
  PROJECTS_NAMESPACE,
  SET_PROJECTDETAIL_PAGE_BACK_URL,
} from '../store/projectsMutationsConsts';
import ProjectCard from './ProjectCard.vue';
import ProjectCardPlaceholder from './ProjectCardPlaceholder.vue';

export default {
  name: 'ProjectsPage',
  /**
   * @description beforeRouteEnter is used to change background image of this page.
   * It's called via vue-router.
   */
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit(SET_CURRENT_PAGE, PROJECTS_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.pageBGImage);
    });
  },
  /**
   * @description reset the scrolling to the top,
   * because of the scrolling is set from the browsePage or metaDetailPage
   */
  beforeMount() {
    if (!this.loadingConfig && !this.loading && this.projects?.length <= 0) {
      this.loadProjects();
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  watch: {
    config() {
      if (!this.loadingConfig && !this.loading && this.projects?.length <= 0) {
        this.loadProjects();
      }
    },
  },
  computed: {
    ...mapState(['loadingConfig', 'config']),
    ...mapGetters({
      projects: `${PROJECTS_NAMESPACE}/projects`,
      loading: `${PROJECTS_NAMESPACE}/loading`,
      projectsCardsParents: `${PROJECTS_NAMESPACE}/projectsCardsParents`,
    }),
    projectsConfig() {
      return this.config?.projectsConfig || {};
    },
    missionImg() {
      const imgPath = this.$vuetify.display.mdAndUp
        ? 'mission'
        : 'mission_small';
      return getImage(imgPath);
    },
    creatorImg() {
      const imgPath = this.$vuetify.display.mdAndUp
        ? 'data_creator'
        : 'data_creator_small';
      return getImage(imgPath);
    },
  },
  methods: {
    loadProjects() {
      this.$store.dispatch(
        `${PROJECTS_NAMESPACE}/${GET_PROJECTS}`,
        this.projectsConfig,
      );
    },
    onCardClick(projectId) {
      this.$store.commit(
        `${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`,
        this.$route,
      );

      this.$router.push({
        name: PROJECT_DETAIL_PAGENAME,
        params: { id: projectId },
      });
    },
    onSubprojectClick(subprojectId) {
      this.$store.commit(
        `${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`,
        this.$route,
      );

      this.$router.push({
        name: PROJECT_DETAIL_PAGENAME,
        params: { id: subprojectId },
      });
    },
  },
  components: {
    ImgAndTextLayout,
    ProjectCard,
    ProjectCardPlaceholder,
  },
  data: () => ({
    pageBGImage: 'app_b_browsepage',
  }),
};
</script>
