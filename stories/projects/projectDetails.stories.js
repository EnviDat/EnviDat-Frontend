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

// import for css classes
// import App from '@/App.vue';
// get Project test data and enhance it
import mission from '@/assets/projects/mission.jpg';
import { enhanceSubprojectsFromExtras } from '@/factories/projectsDataFactory';
import ProjectBody from '@/modules/projects/components/ProjectDetailViews/ProjectBody.vue';
import ProjectDatasets from '@/modules/projects/components/ProjectDetailViews/ProjectDatasets.vue';
import ProjectHeader from '@/modules/projects/components/ProjectDetailViews/ProjectHeader.vue';
import { LISTCONTROL_LIST_ACTIVE, LISTCONTROL_MAP_ACTIVE } from '@/store/metadataMutationsConsts';

import projectJSON from '@/../stories/testdata/projects.json';
import metadata from '@/../stories/js/metadata';

const enhancedProjects = enhanceSubprojectsFromExtras(projectJSON.result);
const projects = enhancedProjects;

const header1 = projects[5];
const header2 = projects[6];
const header3 = projects[7];

const body1 = projects[5];
const body2 = projects[6];
const body3 = projects[8];

const methods = {
  //  onCardClick: action('clicked on card'),
  //  onTagClick: action('clicked on tag'),
};

export default {
  title: '15 Project Page / Project Views',
  decorators: [],
  parameters: {},
};

export const ProjectHeaderViews = () => ({
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
    defaultImg: mission,
  }),
});

export const ProjectBodyViews = () => ({
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
});

export const ProjectDatasetViews = () => ({
  components: { ProjectDatasets },
  template: `
    <v-row >
      <v-col cols="12" >
        <ProjectDatasets :hasMetadatas="false" />
      </v-col>

      <v-col cols="12" >
        <ProjectDatasets :hasMetadatas="true"
                          :listContent="metadata"
                          :showMapFilter="false"
                          :mapFilteringPossible="true"
                          :placeHolderAmount="4"
                          :selectedTagNames="[]"
                          :topFilteringLayout="true"
                          :showSearch="false" />
      </v-col>

    </v-row>
    `,
  methods,
  data: () => ({
    metadata,
    defaultControls: [LISTCONTROL_MAP_ACTIVE],
    enabledControls: [LISTCONTROL_LIST_ACTIVE, LISTCONTROL_MAP_ACTIVE],
  }),
});
