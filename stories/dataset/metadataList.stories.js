/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2025-10-15 13:22:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import MetadataList from '@/components/MetadataList.vue';
import {enhanceMetadatas} from '@/factories/metaDataFactory';
import baseTags from '@/modules/metadata/store/metadataTags';
import { getEnabledTags, getPopularTags } from '@/factories/keywordsFactory';
import {
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
} from '@/store/metadataMutationsConsts';
import categoryCards from '@/store/categoryCards';

import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from '@/../stories/js/envidatViewports';
import metadata from '@/../stories/js/metadata';


// slice of the first item of the later added entries, because the virutal-scroller from the MetadataList
// uses the ids of the datasets and if they are identical it won't be rendered
const smallList = [...metadata, ...metadata.slice(1, metadata.length)];
const longList = [...metadata, ...metadata.slice(1, metadata.length), ...metadata.slice(2, metadata.length), ...metadata.slice(3, metadata.length)];

enhanceMetadatas(smallList);
enhanceMetadatas(longList);

const popularTags = getPopularTags(metadata, undefined, 1);
const mergedWithPopulars = [...baseTags, ...popularTags.slice(0, 15)];
const allTags = getEnabledTags(mergedWithPopulars, metadata);

export default {
  title: '3 Datasets / Metadata List',
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

export const ListLoadingWithMap = {
  args: {
    categoryCards,
    loading: true,
    showSearch: true,
    defaultListControls: [LISTCONTROL_MAP_ACTIVE],
  },
}

export const MinimalList = {
  args: {
    categoryCards,
    listContent: smallList,
    showSearch: true,
    allTags,
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
    useDynamicHeight: false,
    listContent: longList,
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
    mapFilteringPossible: true,
    useDynamicHeight: true,
    defaultListControls: [LISTCONTROL_MAP_ACTIVE],
  },
}

export const BrowsePageList = {
  args: {
    ...ListWithMap.args,
    useDynamicHeight: true,
    categoryCards,
    showSearch: true,
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
}

export const TopFilteringLayout = {
  args: {
    ...ListWithMap.args,
    topFilteringLayout: true,
  },
}

export const ProjectsDatasetsList = {
  args: {
    ...TopFilteringLayout.args,
    listContent: longList,
    showSearch: false,
    useDynamicHeight: false,
  },
}

const templateForLoadingHugelist = {
  render: (args, { argTypes }) => ({
    components: { MetadataList },
    props: Object.keys(argTypes),
    template: `<MetadataList
                v-bind="$props"
                :loading="loadingList"
                :listContent="largeList"
    />`,
    created() {
      this.loadingList = true;
    },
    async mounted() {
      setTimeout(async () => {
        const packageList = await import ('../../public/testdata/packagelist.json');
        const contentMap = enhanceMetadatas(packageList.result);
        this.largeList = Object.values(contentMap);
        this.loadingList = false;
      }, 1000)
    },
    methods: {
    },
    data: () => ({
      loadingList: true,
      largeList: [],
    }),
  }),
};

export const HugeList = {
  ...templateForLoadingHugelist,
  args: {
    categoryCards,
//    listContent: hugeList,
    useDynamicHeight: true,
    showSearch: true,
    allTags,
    enabledControls: [
      LISTCONTROL_LIST_ACTIVE,
      LISTCONTROL_MAP_ACTIVE,
      LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
    ],
  },
}

export const PinnedIdsList = {
  args: {
    ...MinimalList.args,
    prePinnedIds: ['fb851074-a421-47bf-802f-f03493c57041'],
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

export const MobileEmptyMetadataList= {
  args: {
    ...EmptyMetadataList.args,
    mapFilteringPossible: false,
  },
  parameters: mobileViewportParams,
};

export const MobileListLoading= {
  args: {
    ...ListLoading.args,
    mapFilteringPossible: false,
  },
  parameters: mobileViewportParams,
};

export const MobileListSmall= {
  args: {
    ...BrowsePageList.args,
    mapFilteringPossible: false,
  },
  parameters: mobileViewportParams,
};

export const MobileListLarge ={
  args: {
    ...BrowsePageList.args,
    mapFilteringPossible: false,
  },
  parameters: mobileLargeViewportParams,
};

export const TabletEmptyMetadataList ={
  args: {
    ...EmptyMetadataList.args,
    mapFilteringPossible: false,
  },
  parameters: tabletViewportParams,
};

export const TabletListLoading ={
  args: {
    ...ListLoading.args,
    mapFilteringPossible: false,
  },
  parameters: tabletViewportParams,
};

export const TabletList ={
  args: {
    ...BrowsePageList.args,
    mapFilteringPossible: false,
  },
  parameters: tabletViewportParams,
};
