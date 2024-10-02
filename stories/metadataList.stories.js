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

import MetadataList from '@/components/MetadataList.vue';
import {enhanceMetadatas} from '@/factories/metaDataFactory';
import baseTags from '@/modules/metadata/store/metadataTags';
import { getEnabledTags, getPopularTags, enhanceTags } from '@/factories/keywordsFactory';
import {
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
} from '@/store/metadataMutationsConsts';
import categoryCards from '@/store/categoryCards';

import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';
import metadata from './js/metadata';

metadata.forEach(dataset => enhanceTags(dataset));

const longList = [...metadata, ...metadata, ...metadata];

enhanceMetadatas(longList);

const hugeList = [
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
  ...longList, ...longList, ...longList,
];

const popularTags = getPopularTags(metadata, undefined, 1);
const mergedWithPopulars = [...baseTags, ...popularTags.slice(0, 15)];
const allTags = getEnabledTags(mergedWithPopulars, metadata);

export default {
  title: '6 Dataset Detail Views / Metadata List',
  component: MetadataList,
};


export const EmptyMetadataList = {
  args: {
    categoryCards,
  },
}


export const ListLoading = {
  args: {
    categoryCards,
    loading: true,
    showSearch: true,
  },
}

export const MinimalList = {
  args: {
    categoryCards,
    listContent: longList,
    showSearch: true,
    allTags,
  },
}

export const HugeList = {
  args: {
    categoryCards,
    listContent: hugeList,
    showSearch: true,
    useDynamicHeight: true,
    allTags,
  },
}

export const PinnedIdsList = {
  args: {
    ...MinimalList.args,
    prePinnedIds: ['fb851074-a421-47bf-802f-f03493c57041'],
  },
}

const selectedTagNames = allTags.filter(tag => tag.name === 'CLIMATE').map(tag => tag.name);
export const MinimalSelectionList = {
  args: {
    ...MinimalList.args,
    selectedTagNames,
  },
}

export const ListWithControls = {
  args: {
    ...MinimalList.args,
    enabledControls: [
      LISTCONTROL_LIST_ACTIVE,
      LISTCONTROL_MAP_ACTIVE,
      LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
    ],
  },
}

export const ListWithMap = {
  args: {
    ...ListWithControls.args,
    defaultListControls: [LISTCONTROL_MAP_ACTIVE],
  },
}

export const CompactList = {
  args: {
    ...ListWithControls.args,
    defaultListControls: [LISTCONTROL_COMPACT_LAYOUT_ACTIVE],
  },
}

export const CompactListWithMap = {
  args: {
    ...ListWithMap.args,
    defaultListControls: [LISTCONTROL_MAP_ACTIVE, LISTCONTROL_COMPACT_LAYOUT_ACTIVE],
  },
}

export const ListRowView = {
  args: {
    ...ListWithControls.args,
    defaultListControls: [LISTCONTROL_LIST_ACTIVE],
  },
}

export const ListRowViewWithMap = {
  args: {
    ...ListWithControls.args,
    defaultListControls: [LISTCONTROL_MAP_ACTIVE, LISTCONTROL_LIST_ACTIVE],
  },
}

export const MobileEmptyMetadataList= { args: EmptyMetadataList.args };
MobileEmptyMetadataList.parameters = mobileViewportParams;

export const MobileListLoading= { args: ListLoading.args };
MobileListLoading.parameters = mobileViewportParams;

export const MobileMinimalListSmall= { args: MinimalList.args };
MobileMinimalListSmall.parameters = mobileViewportParams;

export const MobileMinimalListLarge = { args: MinimalList.args };
MobileMinimalListLarge.parameters = mobileLargeViewportParams;

export const TabletEmptyMetadataList = { args: EmptyMetadataList.args };
TabletEmptyMetadataList.parameters = tabletViewportParams;

export const TabletListLoading = { args: ListLoading.args };
TabletListLoading.parameters = tabletViewportParams;

export const TabletMinimalList = { args: MinimalList.args };
TabletMinimalList.parameters = tabletViewportParams;
