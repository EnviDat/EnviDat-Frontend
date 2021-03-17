/**
 * @summary story of all the ProjectDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-29 15:22:23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import globalMethods from '@/factories/globalMethods';

import ProjectHeader from '@/modules/projects/components/ProjectDetailViews/ProjectHeader.vue';
import ProjectBody from '@/modules/projects/components/ProjectDetailViews/ProjectBody.vue';
import ProjectDatasets from '@/modules/projects/components/ProjectDetailViews/ProjectDatasets.vue';

import {
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
} from '@/store/metadataMutationsConsts';

// import for css classes
// import App from '@/App.vue';

// get Project test data and enhance it
import {
  enhanceSubprojectsFromExtras,
} from '@/factories/projectsDataFactory';

import projectJSON from '../public/testdata/projects.json';
import metadata from './js/metadata';

const enhancedProjects = enhanceSubprojectsFromExtras(projectJSON.result);
const projects = enhancedProjects;


const imgPaths = require.context('../src/assets/projects/', false, /\.jpg$/);
const imgName = 'mission';
const images = globalMethods.methods.mixinMethods_importImages(imgPaths, imgName);
const defaultImg = images[`./${imgName}.jpg`];

const header1 = projects[5];
const header2 = projects[6];
const header3 = projects[7];

const body1 = projects[5];
const body2 = projects[6];
const body3 = projects[8];

export const methods = {
  onCardClick: action('clicked on card'),
  onTagClick: action('clicked on tag'),
};

storiesOf('6 Detail Views / Projects', module)
  .add('Project Header', () => ({
    components: { ProjectHeader },
    template: `
    <v-row >
      <v-col cols="12" class="py-3">
        <project-header />
      </v-col>

      <v-col cols="12" class="py-3">
        <project-header :showPlaceholder="true" />
      </v-col>

      <v-col cols="12" class="py-3">
        <project-header
          :title="header1.title"
          :titleImg="header1.image_url"
          :defaultImg="defaultImg"
        />
      </v-col>

      <v-col cols="12" class="py-3">
        <project-header
        :title="header2.title"
        :titleImg="header2.image_url"
        :defaultImg="defaultImg"
        />
      </v-col>

      <v-col cols="12" class="py-3">
        <project-header
        :title="header3.title"
        :titleImg="header3.image_url"
        :defaultImg="defaultImg"
        />
      </v-col>

    </v-row>
    `,
    methods,
    data: () => ({
      header1,
      header2,
      header3,
      defaultImg,
    }),
  }))
  .add('Project Body', () => ({
    components: { ProjectBody },
    template: `
    <v-row >
      <v-col cols="6" class="py-3">
        <project-body />
      </v-col>

      <v-col cols="6" class="py-3">
        <project-body
          :showPlaceholder="true"
        />
      </v-col>

      <v-col cols="4" class="py-3">
        <project-body
          :description="body1.description"
          :subProjects="body1.subProjects"
        />
      </v-col>

      <v-col cols="8" class="py-3">
        <project-body
          :description="body3.description"
          :subProjects="body3.subProjects"
        />
      </v-col>

      <v-col cols="12" class="py-3">
        <project-body
          :description="body2.description"
          :subProjects="body2.subProjects"
        />
      </v-col>


    </v-row>
    `,
    methods,
    data: () => ({
      body1,
      body2,
      body3,
    }),
  }))
  .add('Project Datasets', () => ({
    components: { ProjectDatasets },
    template: `
    <v-row >
      <v-col cols="12" >
        <ProjectDatasets :hasMetadatas="false" />
      </v-col>

      <v-col cols="12" >
        No full list for now, since the MetadataList relys on the vuex store
      </v-col>

      <!-- v-col cols="12" >
        <ProjectDatasets :hasMetadatas="true"
                          :listContent="metadata"
                          :showMapFilter="false"
                          :mapFilteringPossible="true"
                          :placeHolderAmount="4"
                          :selectedTagNames="[]"
                          :topFilteringLayout="true"
                          :showSearch="false" />
      </v-col -->

    </v-row>
    `,
    methods,
    data: () => ({
      metadata,
      defaultControls: [LISTCONTROL_MAP_ACTIVE],
      enabledControls: [
        LISTCONTROL_LIST_ACTIVE,
        LISTCONTROL_MAP_ACTIVE,
      ],
    }),
  }));  
