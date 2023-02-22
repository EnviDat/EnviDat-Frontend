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

const menuEntry = '4 Filtering / filtering control panels';

export default {
    title: menuEntry,
    decorators: [],
    parameters: {},
};

export const BaseIconSwitchViews = () => ({
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
      BaseIconSwitch with lock icon
    </v-col>

    <v-col class="shrink">
      <BaseIconSwitch :active="true"
                      materialIconName="lock"
                      tooltipText="access restricted" />
    </v-col>

    <v-col cols="12">
      BaseIconSwitch with lock open icon
    </v-col>

    <v-col class="shrink">
      <BaseIconSwitch materialIconName="lock_open"
                      tooltipText="access public" />
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
      <BaseIconSwitch :active="active2"
                      materialIconName="info"
                      tooltipText="notification tool tip"
                      @clicked="active2 = !active2"/>
    </v-col>

  </v-row>
  `,
  data: () => ({
    active: false,
    active2: false,
  }),
})

export const ControlPanelViews = () => ({
    components: { ControlPanel },
    template: `
    <v-row >
      <v-col cols="12">
        Empty Filtering Control Panel
      </v-col>

      <v-col>
        <ControlPanel />
      </v-col>

      <v-col cols="12">
        No search Compact layout
      </v-col>

      <v-col>
        <ControlPanel :compactLayout="true"
                      searchTerm="Prefilled search"
        />
      </v-col>

      <v-col cols="12">
        Empty Filtering Control Panel with search enabled and placeholder text
      </v-col>

      <v-col>
        <ControlPanel :showSearch="true"
                      searchBarPlaceholder="Enter your search term" />
      </v-col>

      <v-col cols="12">
        Prefilled search
      </v-col>

      <v-col>
        <ControlPanel searchTerm="Prefilled search"
                      :showSearch="true"
        />
      </v-col>

      <v-col cols="12">
        Prefilled author search Compact layout
      </v-col>

      <v-col>
        <ControlPanel :compactLayout="true"
                      :showSearch="true"
                      :isAuthorSearch="true"
                      searchTerm="Mathias Gerber"
        />
      </v-col>

      <v-col cols="12">
        Prefilled search with search count
      </v-col>

      <v-col>
        <ControlPanel searchTerm="Prefilled search"
                      :showSearch="true"
                      :searchCount="132"
                      searchBarPlaceholder="Enter your search term" />
      </v-col>

      <v-col cols="12">
        Prefilled author search with search count while loading
      </v-col>

      <v-col>
        <ControlPanel searchTerm="Prefilled search"
                      :showSearch="true"
                      :searchCount="132"
                      :isAuthorSearch="true"
                      searchBarPlaceholder="Enter your search term"
                      :loading="true"
                      :controlsActive="[]"
                      :enabledControls="preEnabledControls" />
      </v-col>

      <v-col cols="12">
        Prefilled search with search count and active controls compact layout
      </v-col>

      <v-col>
        <ControlPanel searchTerm="Prefilled search"
                      :compactLayout="true"
                      :showSearch="true"
                      :searchCount="132"
                      searchBarPlaceholder="Enter your search term"
                      :controlsActive="controlsActive"
                      :enabledControls="preEnabledControls" />
      </v-col>

      <v-col cols="12">
        Prefilled search with search count and active controls
      </v-col>

      <v-col>
        <ControlPanel searchTerm="Prefilled search"
                      :showSearch="true"
                      :searchCount="132"
                      searchBarPlaceholder="Enter your search term"
                      :controlsActive="controlsActive"
                      :enabledControls="preEnabledControls" />
      </v-col>

    </v-row>`,
  data: () => ({
    preEnabledControls: [
      LISTCONTROL_LIST_ACTIVE,
      LISTCONTROL_MAP_ACTIVE,
      LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
    ],
    controlsActive: [LISTCONTROL_COMPACT_LAYOUT_ACTIVE],
  }),
});
