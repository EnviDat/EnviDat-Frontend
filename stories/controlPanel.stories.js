/**
 * @summary story of TagChip & TagChipPlaceholder for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-07-15 11:09:29
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import ControlPanel from '@/components/Filtering/ControlPanel.vue';
import {
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
} from '@/store/metadataMutationsConsts';
import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch.vue'
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';


export default {
  title: '4 Filtering / filtering control panels',
  decorators: [],
  parameters: {
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
    },
  },
};

const mobileViewportParams =  { viewport: { defaultViewport: 'mobile1' } };
const mobileLargeViewportParams = { viewport: {defaultViewport: 'mobile2' } };
const tabletViewportParams = { viewport: { defaultViewport: 'tablet' } };

export const BaseIconSwitches = () => ({
  components: { BaseIconSwitch },
  template: `
  <v-row>
    <v-col cols="12">
      BaseIconSwitch inactive
    </v-col>

    <v-col class="shrink">
      <BaseIconSwitch :active="false"/>
    </v-col>

    <v-col cols="12">
      BaseIconSwitch active
    </v-col>

    <v-col class="shrink">
      <BaseIconSwitch :active="true"/>
    </v-col>

    <v-col cols="12">
      BaseIconSwitch active clickable
    </v-col>

    <v-col class="shrink">
      <BaseIconSwitch :active="!active"
                      materialIconName="account_circle"
                      tooltipText="Author search tool tip"
                      @clicked="active = !active"/>
    </v-col>

    <v-col cols="12">
      BaseIconSwitch active clickable
    </v-col>

    <v-col class="shrink">
      <BaseIconSwitch :active="active"
                      materialIconName="account_circle"
                      tooltipText="Author search tool tip"
                      @clicked="active = !active"/>
    </v-col>
    
    <v-col cols="12">
      BaseIconSwitch active clickable
    </v-col>

    <v-col class="shrink">
      <BaseIconSwitch :active="active"
                      materialIconName="info"
                      tooltipText="notification tool tip"
                      @clicked="active = !active"/>
    </v-col>

  </v-row>
  `,
  data: () => ({
    active: false,
  }),
})

/*
const Template = (args, { argTypes }) => ({
  components: { ControlPanel },
  props: Object.keys(argTypes),
  template: '<ControlPanel v-bind="$props" />',
});
*/

const Template2 = (args, { argTypes }) => ({
  components: { ControlPanel },
  props: Object.keys(argTypes),
  template: `
  <v-row>
    <v-col cols="12">
        compact layout disabled
    </v-col>  
    <v-col cols="12">
        <ControlPanel v-bind="$props" />
    </v-col>

    <v-col cols="12">
        compact layout enabled
    </v-col>
    
    <v-col cols="12">
        <ControlPanel v-bind="$props" compact-layout />
    </v-col>    
  </v-row>
`,
});
export const EmptySearchDisabled = Template2.bind({});

export const EmptyWithPlaceholder = Template2.bind({});
EmptyWithPlaceholder.args = {
  showSearch: true,
  searchBarPlaceholder: 'Enter your search term',
}

export const PrefilledSearchEnabled = Template2.bind({});
PrefilledSearchEnabled.args = {
  showSearch: true,
  searchTerm: 'In Memory of Koni Steffen',
}

export const PrefilledAuthorSearch = Template2.bind({});
PrefilledAuthorSearch.args = {
  showSearch: true,
  isAuthorSearch: true,
  searchTerm: 'In Memory of Koni Steffen',
}

export const PrefilledWithSearchCount = Template2.bind({});
PrefilledWithSearchCount.args = {
  ...EmptyWithPlaceholder.args,
  ... PrefilledSearchEnabled.args,
  searchCount: 123,
}

export const PrefilledWithSearchLoading = Template2.bind({});
PrefilledWithSearchLoading.args = {
  ...PrefilledWithSearchCount.args,
  loading: true,
}

export const PrefilledAuthorSearchLoading = Template2.bind({});
PrefilledAuthorSearchLoading.args = {
  ...PrefilledAuthorSearch.args,
  loading: true,
  searchCount: 123,
}

const enabledControls = [
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
];
const controlsActive = [LISTCONTROL_COMPACT_LAYOUT_ACTIVE];

export const PrefilledSearchWithControls = Template2.bind({});
PrefilledSearchWithControls.args = {
  ...PrefilledWithSearchCount.args,
  controlsActive: [],
  enabledControls,
}

export const PrefilledSearchWithActiveControls = Template2.bind({});
PrefilledSearchWithActiveControls.args = {
  ...PrefilledSearchWithControls.args,
  controlsActive,
}

export const MobilePrefilledSearchWithActiveControls = Template2.bind({});
MobilePrefilledSearchWithActiveControls.args = { ...PrefilledSearchWithActiveControls.args };
MobilePrefilledSearchWithActiveControls.parameters = mobileViewportParams;

export const MobileLargePrefilledSearchWithActiveControls = Template2.bind({});
MobileLargePrefilledSearchWithActiveControls.args = { ...PrefilledSearchWithActiveControls.args };
MobileLargePrefilledSearchWithActiveControls.parameters = mobileLargeViewportParams;

export const TabletPrefilledSearchWithActiveControls = Template2.bind({});
TabletPrefilledSearchWithActiveControls.args = { ...PrefilledSearchWithActiveControls.args };
TabletPrefilledSearchWithActiveControls.parameters = tabletViewportParams;
