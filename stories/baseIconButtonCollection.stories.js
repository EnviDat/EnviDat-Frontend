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

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIconCountView from '@/components/BaseElements/BaseIconCountView.vue';
import fileIcon from '../src/assets/icons/file.png';
import contact2Icon from '../src/assets/icons/contact2.png';


export default {
  title: '1 Base Elements / Icon buttons',
  decorators: [],
  parameters: {},
};



const Template = (args, { argTypes }) => ({
  components: { BaseIconButton },
  props: Object.keys(argTypes),
  methods: {
    rotationClick() {
      this.rotated = !this.rotated;
    },
  },
  data: () => ({
    rotated: false,
  }),
  template: '<BaseIconButton v-bind="$props" :rotate-toggle="rotated" @clicked="rotationClick" />',
});

export const IconOnly = Template.bind({});
IconOnly.args = {
  materialIconName: 'save',
}

export const IconOnlyOutlined = Template.bind({});
IconOnlyOutlined.args = {
  materialIconName: 'save',
  outlined: true,
  iconColor: 'black',
}

export const IconRotated = Template.bind({});
IconRotated.args = {
  materialIconName: 'expand_less',
  outlined: true,
  rotateOnClick: true,
}

export const FancyButton = Template.bind({});
FancyButton.args = {
  materialIconName: 'save',
  outlined: true,
  iconColor: 'black',
  isFancy: true,
}

export const GlowingButton = Template.bind({});
GlowingButton.args = {
  ...IconOnlyOutlined.args,
  isGlowing: true,
}

export const FancyAndGlowingButton = Template.bind({});
FancyAndGlowingButton.args = {
  ...FancyButton.args,
  isGlowing: true,
}

export const IconsWithCountBadeViews = () => ({
    components: { BaseIconCountView },
    template: `
    <v-row style="border: solid 1px;">

      <v-col class="shrink" >
        <!-- div style="position: absolute;" -->
          <base-icon-count-view class="mr-2"
                                :iconString="fileIcon"
                                :count="counter"
                                :tooltipText="tooltip"  />
        <!-- /div -->
      </v-col>

      <v-col class="shrink" >
        <!-- div style="position: absolute;" -->
          <base-icon-count-view class="mr-2"
                                :iconString="contact2Icon"
                                :count="counter"
                                :tooltipText="tooltip" />
        <!-- /div -->
      </v-col>

    </v-row>`,
    data: () => ({
      showFullDescription: false,
      fileIcon,
      contact2Icon,
      counter: 55,
      tooltip: 'This is the tooltip of the icon count view',
    }),
  });
