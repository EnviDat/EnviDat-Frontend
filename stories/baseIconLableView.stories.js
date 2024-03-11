/**
 * @summary story of BaseIconLabelView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-24 11:01:43
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView.vue';

export default {
  title: '1 Base Elements / Labels Collection',
  component: BaseIconLabelView,
};

export const DifferentLabelsView = () => ({
  components: { BaseIconLabelView },
  template: `
    <v-row>

      <v-col cols="12">
        <v-alert type="info">Hover over the icon label for a description of the properties used</v-alert>
      </v-col>

      <v-col cols="4">
        <base-icon-label-view iconTooltip="icon label view with label & text"
                              text="somefilename.mp4" />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view iconTooltip="icon label view with alignLeft"
                              text="somefilename.mp4"
                              alignLeft
                              />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view iconTooltip="icon label view with alignLeft, wordBreak, label & text"
                              label="label text: "
                              text="somefilename.mp4"
                              alignLeft
                              wordBreak />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view icon="fileAudio"
                              iconTooltip="icon label view with bold, icon, label & text"
                              label="label text: "
                              text="somefilename.mp4"
                              bold />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view icon="fileAudio"
                              iconTooltip="icon label view with alignLeft, icon, label & text"
                              label="label text: "
                              text="somefilelongerfilename.mp4"
                              alignLeft />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view icon="fileAudio"
                              iconTooltip="icon label view without text & usePlaceholder, alignLeft, icon, label"
                              label="label text: "
                              alignLeft
                              usePlaceholder />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view icon="fileAudio"
                              iconTooltip="icon label view with wordBreak, icon, label & text"
                              label="label text: "
                              text="somefilename.mp4"
                              wordBreak />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view icon="fileAudio"
                              iconTooltip="icon label view with compactLayout, icon, label & text"
                              label="label text: "
                              text="somefilename.mp4"
                              compactLayout />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view icon="fileAudio"
                              iconTooltip="icon label view with icon, text & without label text"
                              text="somefilename.mp4" />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view icon="fileAudio"
                              iconTooltip="icon label view with compactLayout, alignLeft, icon, text & without label text"
                              text="somefilename.mp4"
                              alignLeft
                              compactLayout />
      </v-col>

      <v-col cols="4">
        <base-icon-label-view icon="fileAudio"
                              iconTooltip="Url test with wsl link"
                              url="https://www.wsl.ch" />
      </v-col>

    </v-row>`,
});
