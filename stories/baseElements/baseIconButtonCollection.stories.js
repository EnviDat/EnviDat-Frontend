/**
 * @summary story of BaseIconButton for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mdiChevronDown, mdiContentSave, mdiHome } from '@mdi/js';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { getFileIcon } from '@/factories/imageFactory.js';

export default {
  title: '1 Base / Icons / Icon buttons',
  component: BaseIconButton,
};

const Template = (args, { argTypes }) => ({
  components: { BaseIconButton },
  props: Object.keys(argTypes),
  data: () => ({ args }),
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
};

export const IconOnlyDisabled = Template.bind({});
IconOnlyDisabled.args = {
  ...IconOnly.args,
  disabled: true,
};

export const IconOutlined = Template.bind({});
IconOutlined.args = {
  icon: mdiContentSave,
  outlined: true,
  outlineColor: 'primary',
  iconColor: 'black',
};

export const IconOutlinedDisabled = Template.bind({});
IconOutlinedDisabled.args = {
  ...IconOutlined.args,
  disabled: true,
};

export const IconOutlinedColored = Template.bind({});
IconOutlinedColored.args = {
  ...IconOutlined.args,
  outlined: true,
  outlineColor: 'red',
  color: 'secondary',
  iconColor: 'yellow',
};

export const IconOutlinedColoredAndElevated = Template.bind({});
IconOutlinedColoredAndElevated.args = {
  ...IconOutlined.args,
  outlined: true,
  elevated: true,
  outlineColor: 'red',
  color: 'secondary',
  iconColor: 'yellow',
};

export const IconAndElevated = Template.bind({});
IconAndElevated.args = {
  icon: mdiContentSave,
  elevated: true,
  iconColor: 'black',
  color: 'accent',
};

export const IconAndElevatedDisabled = Template.bind({});
IconAndElevatedDisabled.args = {
  ...IconAndElevated.args,
  disabled: true,
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  icon: getFileIcon(),
  outlined: true,
  color: 'white',
};

export const IconRotated = TemplateRotatable.bind({});
IconRotated.args = {
  icon: mdiChevronDown,
  outlined: true,
  rotated: true,
};

export const LargeButton = Template.bind({});
LargeButton.args = {
  icon: mdiChevronDown,
  large: true,
  outlined: true,
};

export const SmallButton = Template.bind({});
SmallButton.args = {
  icon: mdiHome,
  small: true,
  outlined: true,
};

export const FancyButton = Template.bind({});
FancyButton.args = {
  icon: mdiContentSave,
  outlined: true,
  iconColor: 'black',
  fancy: true,
};

export const GlowingButton = Template.bind({});
GlowingButton.args = {
  ...IconOutlined.args,
  glowing: true,
};

export const FancyAndGlowingButton = Template.bind({});
FancyAndGlowingButton.args = {
  ...FancyButton.args,
  glowing: true,
};

export const CountButton = Template.bind({});
CountButton.args = {
  ...IconOutlined.args,
  count: 12,
};

export const ReadonlyCountButtonSmall = Template.bind({});
ReadonlyCountButtonSmall.args = {
  ...IconOutlined.args,
  outlined: false,
  small: true,
  count: 100,
  readonly: true,
};
