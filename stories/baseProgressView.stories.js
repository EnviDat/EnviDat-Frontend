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

import BaseProgressView from '@/components/BaseElements/BaseProgressView.vue';
import { mobileViewportParams } from './js/envidatViewports';


export default {
  title: '1 Base / Labels / Progress View',
};


const Template = (args, { argTypes }) => ({
  components: { BaseProgressView },
  props: Object.keys(argTypes),
  template: '<BaseProgressView v-bind="$props"  />',
});

export const NoProgress = Template.bind({});

export const SomeProgress = Template.bind({});

SomeProgress.args = {
  text: 'A few steps more to do',
  progressPct: 45.33,
  color: 'secondary',
}

export const MoreProgress = Template.bind({});

MoreProgress.args = {
  text: 'A few steps more to do',
  progressPct: 96.88,
  color: 'warning',
}


export const MobileSomeProgress = Template.bind({});
MobileSomeProgress.args = { ...SomeProgress.args };
MobileSomeProgress.parameters = mobileViewportParams;
