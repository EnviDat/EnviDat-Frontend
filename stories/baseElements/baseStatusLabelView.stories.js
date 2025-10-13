/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-02-18 16:10:39
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable object-property-newline */
// noinspection JSUnusedGlobalSymbols

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';


export default {
  title: '1 Base / Labels / Status Label View',
  component: BaseStatusLabelView,
};

export const BaseStatusLabelViews = () => ({
  components: { BaseStatusLabelView },
  template: `
  <v-col >

    <v-row >
      Empty BaseStatusLabelView
    </v-row>

    <v-row class="py-1">
      <v-col class="pa-0"
             style="border: solid 1px;" >
        <BaseStatusLabelView />
      </v-col>
    </v-row>

    <v-row>
      Loading BaseStatusLabelView
    </v-row>

    <v-row class="py-1">
      <v-col class="pa-0"
             style="border: solid 1px;" >
        <BaseStatusLabelView :loading="true" />
      </v-col>
    </v-row>

    <v-row>
      Info BaseStatusLabelView
    </v-row>

    <v-row class="py-1">
      <v-col class="pa-0"
             style="border: solid 1px;" >
        <BaseStatusLabelView :loading="false"
                              status="info"
                              statusColor="info"
                              statusText="Here you see a info title"
                              expandedText="Here you see more details about the info" />
      </v-col>
    </v-row>

    <v-row>
      Warning BaseStatusLabelView
    </v-row>

    <v-row class="py-1">
      <v-col class="pa-0"
             style="border: solid 1px;" >
        <BaseStatusLabelView :loading="false"
                              status="warning"
                              statusColor="warning"
                              statusText="Warning Title Here"
                              expandedText="Some longer text about the details of the warning" />
      </v-col>
    </v-row>

    <v-row>
      Error BaseStatusLabelView
    </v-row>

    <v-row class="py-1">
      <v-col class="pa-0"
             style="border: solid 1px;" >
        <BaseStatusLabelView :loading="false"
                              status="error"
                              statusColor="error"
                              statusText="Error title message"
                              expandedText="Details about the error probably with a stack of the coder and it will be very long and not meant to be seen be the users that's why you need to catch the error and return a meaningfull text for the users" />
      </v-col>
    </v-row>

  </v-col>
  `,
});
