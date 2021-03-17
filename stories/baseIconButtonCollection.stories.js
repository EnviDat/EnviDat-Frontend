/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-31 08:14:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIconCountView from '@/components/BaseElements/BaseIconCountView.vue';
import fileIcon from '@/assets/icons/file.png';
import contact2Icon from '@/assets/icons/contact2.png';

export const methods = {
  onClick: action('clicked'),
};

storiesOf('2 Buttons / Icon buttons', module)
  .add('icon buttons with envidat icons', () => ({
    components: { BaseIconButton },
    template: `
    <v-row style="border: solid 1px;">
      <v-col cols="1">
        <base-icon-button class="mr-2"
                          :customIcon="contact2Icon"
                          iconColor="accent"
                          color="transparent"
                          :outlined="showFullDescription"
                          :rotateOnClick="true"
                          :rotateToggle="showFullDescription"
                          @clicked="showFullDescription = !showFullDescription" />
      </v-col>

      <v-col cols="1">
        <base-icon-button tooltipText="Example Text"
                          class="mr-2"
                          materialIconName="expand_less"
                          color="transparent"
                          :outlined="showFullDescription"
                          :rotateOnClick="true"
                          :rotateToggle="showFullDescription"
                          @clicked="showFullDescription = !showFullDescription" />
      </v-col>

      <v-col cols="1">
        <base-icon-button class="mr-2"
                          materialIconName="close"
                          iconColor="accent"
                          color="transparent"
                          :outlined="showFullDescription"
                          :rotateOnClick="true"
                          :rotateToggle="showFullDescription"
                          @clicked="showFullDescription = !showFullDescription" />
      </v-col>

      <v-col cols="1">
        <base-icon-button class="mr-2"
                          materialIconName="close"
                          iconColor="accent"
                          color="primary"
                          :outlined="showFullDescription"
                          :rotateOnClick="true"
                          :rotateToggle="showFullDescription"
                          @clicked="showFullDescription = !showFullDescription" />

      </v-col>

    </v-row>`,
    methods,
    data: () => ({
      showFullDescription: false,
      contact2Icon,
    }),
  }))
  .add('envidat icons with count badge', () => ({
    components: { BaseIconCountView },
    template: `
    <v-row style="border: solid 1px;">

      <v-col cols="2" >
        <!-- div style="position: absolute;" -->
          <base-icon-count-view class="mr-2"
                                :iconString="fileIcon"
                                :count="counter"
                                :tooltipText="tooltip"
                                @clicked="onClick" />
        <!-- /div -->
      </v-col>

      <v-col cols="2" >
        <!-- div style="position: absolute;" -->
          <base-icon-count-view class="mr-2"
                                :iconString="contact2Icon"
                                :count="counter"
                                :tooltipText="tooltip"
                                @clicked="onClick" />
        <!-- /div -->
      </v-col>

    </v-row>`,
    methods,
    data: () => ({
      showFullDescription: false,
      fileIcon,
      contact2Icon,
      counter: 55,
      tooltip: 'This is the tooltip of the icon count view',
    }),
  }));
