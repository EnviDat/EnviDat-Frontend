/**
 * @summary story of BaseIconButton for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { mdiChevronDown, mdiContentSave } from '@mdi/js';


export default {
  title: '1 Base Elements / Icon buttons',
  component: BaseIconButton,
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
  template: '<BaseIconButton v-bind="$props" :rotated="rotated" @clicked="rotationClick" />',
});

export const IconOnly = Template.bind({});
IconOnly.args = {
  icon: mdiContentSave,
}

export const IconOnlyOutlined = Template.bind({});
IconOnlyOutlined.args = {
  icon: mdiContentSave,
  outlined: true,
  iconColor: 'black',
}

export const IconAndElevated = Template.bind({});
IconAndElevated.args = {
  icon: mdiContentSave,
  elevated: true,
  iconColor: 'black',
  color: 'accent',
}

export const IconRotated = Template.bind({});
IconRotated.args = {
  icon: mdiChevronDown,
  outlined: true,
  rotated: true,
}

export const FancyButton = Template.bind({});
FancyButton.args = {
  icon: mdiContentSave,
  outlined: true,
  iconColor: 'black',
  fancy: true,
}

export const GlowingButton = Template.bind({});
GlowingButton.args = {
  ...IconOnlyOutlined.args,
  glowing: true,
}

export const FancyAndGlowingButton = Template.bind({});
FancyAndGlowingButton.args = {
  ...FancyButton.args,
  glowing: true,
}

export const CountButton = Template.bind({});
CountButton.args = {
  ...IconOnlyOutlined.args,
  count: 12,
}
