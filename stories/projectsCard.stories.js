/**
 * @summary story of ProjectCard for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import bark2 from '@/assets/cards/forest/c_b_forest_texture_bark2.jpg';
import {
  enhanceSubprojectsFromExtras,
} from '@/factories/projectsDataFactory';
import ProjectCard from '@/modules/projects/components/ProjectCard.vue';

// get Project test data and enhance it
import projectJSON from './testdata/projects.json';

const enhancedProjects = enhanceSubprojectsFromExtras(projectJSON.result);
const projectsCards = enhancedProjects;

function projectsCardsParents() {
  const noParents = [];

  for (let i = 0; i < projectsCards.length; i++) {
    const p = projectsCards[i];
    if (p.subProjects) {
      noParents.push(p);
    }
  }

  return noParents;
}

function projectsCardsChilds() {
  const parents = [];

  for (let i = 0; i < projectsCards.length; i++) {
    const p = projectsCards[i];
    if (p.parent) {
      parents.push(p);
    }
  }

  return parents;
}

export default {
  title: '3 Cards / Projects Cards',
  component: ProjectCard,
};

const projectCardForParent = projectsCardsParents()[0];

export const ProjectCardParent = {
  args: {
    ...projectCardForParent,
    img: projectCardForParent.image_url,
    defaultImg: bark2,
  },
}

const projectCardForChildren = projectsCardsChilds()[0]

export const ProjectCardChildren = {
  args: {
    ...projectCardForChildren,
    img: projectCardForChildren.image_url,
    defaultImg: bark2,
  },
}

/*
export const ProjectCardsParents = () => ({
    components: { ProjectCard, ProjectCardPlaceholder },
    template: `
    <v-container grid-list-lg fluid pa-0>
    <v-row>

      <v-col cols="3" >
        <project-card-placeholder />
      </v-col>

      <v-col cols="3"
        v-for="(project, index) in projectsCardsParents()"
        :key="index" >
        <project-card
          :id="project.id"
          :title="project.title"
          :img="project.image_url"
          :defaultImg="defaultImg"
          :description="project.description"
          :subProjects="project.subProjects"
        />
      </v-col>

    </v-row>
    </v-container>
    `,
    methods: {
      projectsCardsParents,
    },
    data: () => ({
      projectsCards,
      defaultImg: bark2,
    }),
  });
*/

/*
export const ProjectCardsChildren = () => ({
    components: { ProjectCard },
    template: `
    <v-container grid-list-lg fluid pa-0>
    <v-row>

      <v-col cols="3"
        v-for="(project, index) in projectsCardsChilds()"
        :key="index"
      >
        <project-card
          :id="project.id"
          :title="project.title"
          :img="project.image_url"
          :defaultImg="defaultImg"
          :description="project.description"
          :subProjects="project.subProjects"
        />
      </v-col>

    </v-row>
    </v-container>
    `,
    methods: {
      projectsCardsChilds,
    },
    data: () => ({
      projectsCards,
      defaultImg: bark2,
    }),
  });
*/
