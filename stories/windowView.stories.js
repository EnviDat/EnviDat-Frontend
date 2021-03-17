/**
 * @summary story of windowView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-24 11:42:03
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import WindowVerticalView from '@/modules/projects/components/ProjectDetailViews/WindowVerticalView.vue';
import WindowView from '@/modules/projects/components/ProjectDetailViews/WindowView.vue';

import {
  enhanceSubprojectsFromExtras,
} from '@/factories/projectsDataFactory';

import projectJSON from '../public/testdata/projects.json';

const enhancedProjects = enhanceSubprojectsFromExtras(projectJSON.result);
const projects = enhancedProjects;

const projectDetail1 = projects[6];
const projectDetail2 = projects[3];

export const methods = {
  onCardClick: action('clicked on card'),
};

storiesOf('6 Detail Views / Window Slider', module)
  .add('Window Vertical View', () => ({
    components: { WindowVerticalView },
    template: `
    <v-row >

      <v-col cols="12" class="py-2" >
        <window-vertical-view :showPlaceholder="false" />
      </v-col>

      <v-col cols="12" class="py-2" >
        <window-vertical-view :showPlaceholder="true" />
      </v-col>

      <v-col cols="12" class="py-2" >
        <window-vertical-view :subProjects="projectDetail1.subProjects" :metadatas="projectDetail1.packages" />
      </v-col>

      <v-col cols="12" class="py-2" >
        <window-vertical-view :subProjects="projectDetail2.subProjects" :metadatas="projectDetail2.packages" />
      </v-col>
      
    </v-row>
    `,
    methods,
    data: () => ({
      projectDetail1,
      projectDetail2,
    }),
  }))
  .add('Window View', () => ({
    components: { WindowView },
    template: `
    <v-row >

      <v-col cols="12" class="py-2" >
        <window-view :showPlaceholder="false" />
      </v-col>

      <v-col cols="12" class="py-2" >
        <window-view :showPlaceholder="true" />
      </v-col>

      <v-col cols="12" class="py-2" >
        <window-view :subProjects="projectDetail1.subProjects" :metadatas="projectDetail1.packages" />
      </v-col>

      <v-col cols="12" class="py-2" >
        <window-view :subProjects="projectDetail2.subProjects" :metadatas="projectDetail2.packages" />
      </v-col>
      
    </v-row>
    `,
    methods,
    data: () => ({
      projectDetail1,
      projectDetail2,
    }),
  }));
