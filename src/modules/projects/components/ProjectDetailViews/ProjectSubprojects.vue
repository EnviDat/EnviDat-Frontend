<template>
  <v-card :dark="dark">
    <v-card-title class="metadata_title text-h6">
      {{ title }}
    </v-card-title>

    <v-card-text v-if="subProjects">
      <v-container class="pa-0" fluid>
        <v-row>
          <v-col
            v-for="(project, index) in subProjects"
            :key="'sub_' + index"
            cols="12"
            sm="6"
            md="4"
            xl="3"
          >
            <project-card
              :id="project.name"
              :title="project.title"
              :img="project.image_display_url"
              :defaultImg="defaultImg"
              :description="project.description"
              :subProjects="project.subProjects"
              @cardClick="onCardClick"
              @subprojectClick="onSubprojectClick"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-text v-if="showPlaceholder && !subProjects">
      <v-skeleton-loader type="paragraph" />
    </v-card-text>

    <v-card-text v-if="!showPlaceholder && !subProjects" style="color: red;">
      {{ emptyText }}
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * ProjectSubprojects.vue shows a list of project cards
 * for every subproject entry.
 *
 * @summary shows a list of (sub)project cards
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-11-22 13:43:14
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import ProjectCard from '../ProjectCard.vue';

export default {
  components: {
    ProjectCard,
  },
  props: {
    title: {
      type: String,
      default: 'Subprojects',
    },
    defaultImg: String,
    subProjects: Array,
    dark: Boolean,
    showPlaceholder: Boolean,
  },
  computed: {},
  methods: {
    onCardClick(projectId) {
      this.$emit('projectClick', projectId);
    },
    onSubprojectClick(subprojectId) {
      this.$emit('subprojectClick', subprojectId);
    },
  },
  data: () => ({
    showFullDescription: false,
    maxTextLength: 1000,
    emptyText: 'Could not load Subprojects',
  }),
};
</script>

<style scoped></style>
