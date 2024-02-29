/**
 * @summary story of BaseIconButton for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';


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
  materialIconName: 'save',
}

export const IconOnlyOutlined = Template.bind({});
IconOnlyOutlined.args = {
  materialIconName: 'save',
  outlined: true,
  iconColor: 'black',
}

export const IconAndElevated = Template.bind({});
IconAndElevated.args = {
  materialIconName: 'save',
  isElevated: true,
  iconColor: 'black',
  color: 'accent',
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

export const CountButton = Template.bind({});
CountButton.args = {
  ...IconOnlyOutlined.args,
  count: 12,
}
