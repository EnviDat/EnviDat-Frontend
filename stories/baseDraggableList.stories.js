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

import BaseDraggableList from '@/components/BaseElements/BaseDraggableList.vue';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';


export default {
  title: '1 Base Elements / Base Draggable List',
  component: BaseDraggableList,
  argTypes: { listChanged: { action: 'listChanged' } },
};


export const EmptyList = { args: {} };

export const FilledList = {
  args: {
    items: [
      'Dominik Haas-Artho',
      'Ionut Iosifescu',
      'Samuel Woodcock',
      'Gian-Kasper Plattner',
      'Ranita Pal',
    ],
  },
};

export const FilledAuthorsList = {
  args: { ...FilledList.args, useAuthorTags: true },
};

export const MobileNormalCitation = {
  args: { ...FilledList.args },
  parameters: mobileViewportParams,
};

export const MobileLargeNormalCitation = {
  args: { ...FilledList.args },
  parameters: mobileLargeViewportParams,
};

export const TabletNormalCitation = {
  args: { ...FilledList.args },
  parameters: tabletViewportParams,
};
