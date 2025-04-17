<template>
  <v-container id="ProjectsPage" tag="article" fluid class="pa-0">
    <v-row>
      <v-col cols="12" lg="10" offset-lg="1">
        <ImgAndTextLayout
          :img="missionImg"
          :height="$vuetify.display.smAndDown ? 100 : 150"
          title="Research Projects"
        />
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
              xl="3"
            >
              <ProjectCardPlaceholder />
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
              xl="3"
            >
              <ProjectCard
                :id="project.name"
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

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

// Import components
import { useDisplay } from 'vuetify';
import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout.vue';
import ProjectCard from './ProjectCard.vue';
import ProjectCardPlaceholder from './ProjectCardPlaceholder.vue';

// Import constants
import {
  PROJECT_DETAIL_PAGENAME,
} from '@/router/routeConsts';
import {
  GET_PROJECTS,
  PROJECTS_NAMESPACE,
  SET_PROJECTDETAIL_PAGE_BACK_URL,
} from '../store/projectsMutationsConsts';
import { getImage } from '@/factories/imageFactory';

const display = useDisplay();
const store = useStore();
const router = useRouter();
const route = useRoute();

// Map state from Vuex
const loadingConfig = computed(() => store.state.loadingConfig);
const config = computed(() => store.state.config);
const projects = computed(
  () => store.getters[`${PROJECTS_NAMESPACE}/projects`],
);
const loading = computed(() => store.getters[`${PROJECTS_NAMESPACE}/loading`]);
const projectsCardsParents = computed(
  () => store.getters[`${PROJECTS_NAMESPACE}/projectsCardsParents`],
);

// Derived config for projects
const projectsConfig = computed(() => config.value?.projectsConfig || {});

// Image paths using getImage factory. Note: this example assumes that $vuetify is available globally.
const missionImg = computed(() => {
  const imgPath =
    display.mdAndUp
      ? 'mission'
      : 'mission_small';
  return getImage(imgPath);
});

const creatorImg = computed(() => {
  const imgPath =
    display.mdAndUp
      ? 'data_creator'
      : 'data_creator_small';
  return getImage(imgPath);
});

const loadProjects = () => {
  store.dispatch(`${PROJECTS_NAMESPACE}/${GET_PROJECTS}`, projectsConfig.value);
};


// Local data

onBeforeMount(() => {
  if (
    !loadingConfig.value &&
    !loading.value &&
    (!projects.value || projects.value.length <= 0)
  ) {
    loadProjects();
  }
});

onMounted(() => {
  window.scrollTo(0, 0);
});

watch(config, () => {
  if (
    !loadingConfig.value &&
    !loading.value &&
    (!projects.value || projects.value.length <= 0)
  ) {
    loadProjects();
  }
});


const onCardClick = (projectId: string) => {
  store.commit(
    `${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`,
    route,
  );
  router.push({
    name: PROJECT_DETAIL_PAGENAME,
    params: { id: projectId },
  });
};

const onSubprojectClick = (subprojectId: string) => {
  store.commit(
    `${PROJECTS_NAMESPACE}/${SET_PROJECTDETAIL_PAGE_BACK_URL}`,
    route,
  );
  router.push({
    name: PROJECT_DETAIL_PAGENAME,
    params: { id: subprojectId },
  });
};
</script>

