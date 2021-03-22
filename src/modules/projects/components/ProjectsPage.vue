<template>
  <v-container class="pa-0" tag="article" fluid>
    <v-row >

      <v-col cols="12" lg="10" offset-lg="1">
        <img-and-text-layout :img="missionImg"
                              :height="$vuetify.breakpoint.smAndDown ? 100 : 150"
                              title="Research Projects" />
      </v-col>

      <v-col class="mt-5" cols="12" lg="10" offset-lg="1" >

        <v-container v-if="loading"
                      class="pa-0"
                      fluid>
          <v-row >

            <v-col v-for="(project, index) in 4"
                    :key="index"
                    cols="12" sm="6" md="4" xl="3" >
              <project-card-placeholder />
            </v-col>

          </v-row>
        </v-container>

        <v-container  v-else
                      class="pa-0"
                      fluid >
          <v-row >

            <v-col v-for="(project, index) in projectsCardsParents"
                    :key="index"
                    cols="12" sm="6" md="4" xl="3"
                     >
              <project-card :id="project.id"
                            :title="project.title"
                            :img="project.image_display_url"
                            :defaultImg="creatorImg"
                            :description="project.description"
                            :subProjects="project.subProjects"
                            @cardClick="onCardClick"
                            @subprojectClick="onSubprojectClick"
              />
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
 * Last modified  : 2019-11-20 13:05:04
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters } from 'vuex';
import { PROJECTS_PAGENAME, PROJECT_DETAIL_PAGENAME } from '@/router/routeConsts';
import { SET_APP_BACKGROUND, SET_CURRENT_PAGE } from '@/store/mainMutationsConsts';

import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout';

import mission from '@/assets/projects/mission.jpg';
import missionSmall from '@/assets/projects/mission_small.jpg';
import creatorSmall from '@/assets/cards/data_creator_small.jpg';
import creator from '../assets/data_creator.jpg';

import ProjectCardPlaceholder from './ProjectCardPlaceholder';
import ProjectCard from './ProjectCard';

import {
  GET_PROJECTS,
  PROJECTS_NAMESPACE,
  SET_PROJECTDETAIL_PAGE_BACK_URL,
} from '../store/projectsMutationsConsts';

export default {
  name: 'ProjectPage',
  /**
   * @description beforeRouteEnter is used to change background image of this page.
   * It's called via vue-router.
   */
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, PROJECTS_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  /**
   * @description reset the scrolling to the top,
   * because of the scrolling is set from the browsePage or metaDetailPage
   */
  beforeMount() {
    this.$store.dispatch(`${PROJECTS_NAMESPACE}/${GET_PROJECTS}`);
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapGetters({
      projects: `${PROJECTS_NAMESPACE}/projects`,
      loading: `${PROJECTS_NAMESPACE}/loading`,
      projectsCardsParents: `${PROJECTS_NAMESPACE}/projectsCardsParents`,
    }),
    missionImg() {
      return this.$vuetify.breakpoint.mdAndUp ? mission : missionSmall;
    },
    creatorImg() {
      return this.$vuetify.breakpoint.mdAndUp ? creator : creatorSmall;
    },
  },
  methods: {
    onCardClick(projectId) {
      this.$store.commit(`${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`, this.$route);

      this.$router.push({
        name: PROJECT_DETAIL_PAGENAME,
        params: { id: projectId },
      });
    },
    onSubprojectClick(subprojectId) {
      this.$store.commit(`${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`, this.$route);

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
    PageBGImage: './app_b_browsepage.jpg',
    mission,
    missionSmall,
    creator,
    creatorSmall,
  }),
};
</script>
