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

import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch.vue'


export default {
  title: '1 Base Elements / Icon Switch',
  component: BaseIconSwitch,
};

export const Inactive = {};

export const Active = { args: { active: true } };

export const WithIconAndTooltip = {
  args: {
    ...Active.args,
    materialIconName: 'lock',
    tooltipText: 'access restricted',
  },
};

export const WithIconAndTooltipInactive = {
  args: {
    ...Inactive.args,
    materialIconName: 'lock',
    tooltipText: 'access restricted',
  },
};

export const AuthorSearchSwitch = {
  args: {
    ...Active.args,
    materialIconName: 'account_circle',
    tooltipText: 'Author search tool tip',
  },
};

export const InteractiveSwitches = () => ({
  components: { BaseIconSwitch },
  template: `
    <v-container>
  <v-row>
    
    <v-col cols="12">
      BaseIconSwitch active clickable
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12"
           class="flex-grow-0">
      <BaseIconSwitch :active="!active"
                      materialIconName="account_circle"
                      tooltipText="Author search tool tip"
                      @clicked="active = !active"/>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12"
           class="flex-grow-0">
      <BaseIconSwitch :active="!active"
                      materialIconName="home"
                      tooltipText="Home"
                      color="orange"
                      @clicked="active = !active"/>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12"
           class="flex-grow-0">
      <BaseIconSwitch :active="active"
                      materialIconName="account_circle"
                      tooltipText="Author search tool tip"
                      @clicked="active = !active"/>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12"
           class="flex-grow-0">
      <BaseIconSwitch :active="active2"
                      materialIconName="info"
                      tooltipText="notification tool tip"
                      @clicked="active2 = !active2"/>
    </v-col>

  </v-row>
    </v-container>
  `,
  data: () => ({
    active: false,
    active2: false,
  }),
})
