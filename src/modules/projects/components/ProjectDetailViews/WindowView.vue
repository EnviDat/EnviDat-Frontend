<template>
  <v-card tile min-height="200">

    <v-card-title>Subprojects</v-card-title>

    <v-row >

      <v-col v-for="(project, index) in subProjects" :key="'sub_' + index">
        <project-card :id="project.id"
                      :title="project.title"
                      :img="project.image_display_url"
                      :defaultImg="defaultImg"
                      :description="project.description"
                      :subProjects="project.subProjects"
                      @cardClick="onCardClick"
                      @subprojectClick="onSubprojectClick" />
      </v-col>

    </v-row>

  </v-card>
</template>

<script>
/**
 * WindowView.vue IS UNFINISHED!
 * Experimental a horizontal slider for content (instead of images).
 *
 * @summary vertical horizontal for content
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-10-23 16:35:03
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

// import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import ProjectCard from '@/modules/projects/components/ProjectCard';

export default {
  components: {
    ProjectCard,
  },
  props: {
    subProjects: Array,
    metadatas: Array,
    showPlaceholder: Boolean,
  },
  computed: {
    // window() {
    //   return this.subProjects;
    // },
  },
  methods: {
  },
  data: () => ({
    window: 0,
  }),
};
</script>

<style scoped>

  .bodyTitle {
    font-family: 'Baskervville', serif !important;
    font-weight: 700 !important;
  }

  .heightAndScroll {
    max-height: 500px;
    overflow-y: auto !important;
    scrollbar-width: thin;
  }

</style>
