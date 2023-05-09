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

import StepButton from '@/components/Navigation/StepButton.vue';
import {
  envidatViewportParameters,
  mobileViewportParams,
} from './js/envidatViewports';


export default {
  title: '1 Base Elements / Step button',
  decorators: [],
  parameters: {
    ...envidatViewportParameters,
  },
};

const catchStepClick = (title) => {
  console.log(`clicked on step ${title}`);
}

const Template = (args, { argTypes }) => ({
  components: { StepButton },
  props: Object.keys(argTypes),
  methods: {
    catchStepClick,
  },
  template: '<StepButton v-bind="$props" @stepClick="catchStepClick" />',
});

export const TextOnly = Template.bind({});
TextOnly.args = {
  title: 'Data & Resources',
  number: 1,
}

export const Active = Template.bind({});
Active.args = {
  ...TextOnly.args,
  active: true,
};

export const Completed = Template.bind({});
Completed.args = {
  ...TextOnly.args,
  complete: true,
};

export const Error = Template.bind({});
Error.args = {
  ...TextOnly.args,
  error: 'Detail step has errors',
};

export const ErrorActive = Template.bind({});
ErrorActive.args = {
  ...Active.args,
  error: 'Detail step has errors',
};

export const LongError = Template.bind({});
LongError.args = {
  ...TextOnly.args,
  error: 'An data licence must be selected and some more text',
};
