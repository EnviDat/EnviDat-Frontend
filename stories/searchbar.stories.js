/**
 * @summary story of SearchBarView & SmallSearchBarView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-20 16:00:30
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import SearchBarView from '@/modules/home/components/SearchBarView.vue';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';

export default {
  title: '4 Filtering / SearchBarView',
  component: SearchBarView,
};

const Template = (args, { argTypes }) => ({
  components: { SearchBarView },
  props: Object.keys(argTypes),
  template: '<search-bar-view v-bind="$props" />',
});

export const BasicSearchBar = Template.bind({});
BasicSearchBar.args = {
  labelText: 'Search for something',
  buttonText: 'SEARCH',
  hasButton: true,
};

export const BasicSearchBarMobile = Template.bind({});
BasicSearchBarMobile.args = {
  ...BasicSearchBar.args,
  hasButton: false,
};
BasicSearchBarMobile.parameters = mobileViewportParams;

export const BasicSearchBarLargeMobile = Template.bind({});
BasicSearchBarLargeMobile.args = { ...BasicSearchBarMobile.args };
BasicSearchBarLargeMobile.parameters = mobileLargeViewportParams;

export const BasicSearchBarTablet = Template.bind({});
BasicSearchBarTablet.args = { ...BasicSearchBarMobile.args };
BasicSearchBarTablet.parameters = tabletViewportParams;

