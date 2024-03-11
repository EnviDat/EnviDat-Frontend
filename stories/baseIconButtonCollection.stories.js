/**
 * @summary story of BaseIconButton for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { mdiChevronDown, mdiContentSave, mdiHome } from '@mdi/js';


export default {
  title: '1 Base Elements / Icon buttons',
  component: BaseIconButton,
};



const Template = (args, { argTypes }) => ({
  components: { BaseIconButton },
  props: Object.keys(argTypes),
  data: ()=>({args}),
  template: '<div><BaseIconButton v-bind="$props" /></div>',
});

const TemplateRotatable = (args, { argTypes }) => ({
  components: { BaseIconButton },
  props: Object.keys(argTypes),
  methods: {
    rotationClick() {
      this.rotated = !this.rotated;
    },
  },
  data: () => ({
    rotated: args.rotated,
  }),
  template: '<div><BaseIconButton v-bind="$props" :rotated="rotated" @clicked="rotationClick" /></div>',
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

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  icon: 'file',
  outlined: true,
  color: 'secondary',
}

export const IconRotated = TemplateRotatable.bind({});
IconRotated.args = {
  icon: mdiChevronDown,
  outlined: true,
  rotated: true,
}

export const LargeButton = Template.bind({});
LargeButton.args = {
  icon: mdiChevronDown,
  large: true,
  outlined: true,
}

export const SmallButton = Template.bind({});
SmallButton.args = {
  icon: mdiHome,
  small: true,
  outlined: true,
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
