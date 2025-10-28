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
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from '@/../stories/js/envidatViewports';

export default {
  title: '2 Search / SearchBar View',
  component: SearchBarView,
};

export const Default = {
  args: {
    labelText: 'Search',
    buttonText: 'Go',
    hasButton: true,
  },
};

export const NoButton = {
  args: {
    ...Default.args,
    hasButton: false,
  },
};

export const CustomLabels = {
  args: {
    labelText: 'Find Documents',
    buttonText: 'Submit Query',
    hasButton: true,
  },
};

export const LongLabels = {
  args: {
    labelText: 'Enter the details for a comprehensive search:',
    buttonText: 'Initiate Complex Search',
    hasButton: true,
  },
};

export const EmptyLabels = {
  args: {
    labelText: '',
    buttonText: '',
    hasButton: true,
  },
};


export const DefaultMobile = {
  args: { ...Default.args },
  parameters: mobileViewportParams,
};

export const DefaultLargeMobile = {
  args: { ...Default.args },
  parameters: mobileLargeViewportParams,
};

export const DefaultTablet = {
  args: { ...Default.args },
  parameters: tabletViewportParams,
};
