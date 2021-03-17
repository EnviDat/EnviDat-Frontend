/**
 * @summary story of ProjectCard for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-27 14:55:40
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import globalMethods from '@/factories/globalMethods';
import ProjectCard from '@/modules/projects/components/ProjectCard.vue';
import ProjectCardPlaceholder from '@/modules/projects/components/ProjectCardPlaceholder.vue';
// get Project test data and enhance it
import {
  enhanceSubprojectsFromExtras,
} from '@/factories/projectsDataFactory';

import projectJSON from '../public/testdata/projects.json';

const enhancedProjects = enhanceSubprojectsFromExtras(projectJSON.result);
const projectsCards = enhancedProjects;


const imgPaths = require.context('../src/assets/cards/forest/', false, /\.jpg$/);
const imgName = 'c_b_forest_texture_bark2';
const images = globalMethods.methods.mixinMethods_importImages(imgPaths, imgName);
const defaultImg = images[`./${imgName}.jpg`];

export const methods = {
  onCardClick: action('clicked on card'),
  onTagClick: action('clicked on tag'),
  projectsCardsParents() {
    const noParents = [];

    for (let i = 0; i < this.projectsCards.length; i++) {
      const p = this.projectsCards[i];
      if (!p.parent) {
        noParents.push(p);
      }
    }

    return noParents;
  },
  projectsCardsChilds() {
    const parents = [];

    for (let i = 0; i < this.projectsCards.length; i++) {
      const p = this.projectsCards[i];
      if (p.parent) {
        parents.push(p);
      }
    }

    return parents;
  },
};

storiesOf('3 Cards / Projects Cards', module)
  .add('collection of Parents', () => ({
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
          @cardClick="onCardClick"
        />
      </v-col>

    </v-row>
    </v-container>
    `,
    methods,
    data: () => ({
      projectsCards,
      defaultImg,
    }),
  }))
  .add('collection of Children', () => ({
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
          @cardClick="onCardClick"
        />
      </v-col>

    </v-row>
    </v-container>
    `,
    methods,
    data: () => ({
      projectsCards,
      defaultImg,
    }),
  }));
