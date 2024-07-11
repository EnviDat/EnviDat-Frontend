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
import categoryCards from '@/store/categoryCards';
import { enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';
import globalMethods from '@/factories/globalMethods';
import baseTags from '@/modules/metadata/store/metadataTags';
import { getEnabledTags, getPopularTags } from '@/factories/keywordsFactory';
import { envidatViewportParameters, mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';
import metadata from './js/metadata';

const cardBGImages = globalMethods.methods.mixinMethods_getCardBackgrounds();

enhanceMetadatasTitleImage(metadata, cardBGImages, categoryCards);


const popularTags = getPopularTags(metadata, undefined, 1);
const mergedWithPopulars = [...baseTags, ...popularTags.slice(0, 15)];
const allTags = getEnabledTags(mergedWithPopulars, metadata);

export default {
  title: '6 Dataset Detail Views / Metadata List',
  component: MetadataList,
  decorators: [],
  parameters: {
    ...envidatViewportParameters,
  },
};

const Template = (args, { argTypes }) => ({
  components: { MetadataList },
  props: Object.keys(argTypes),
  template: '<MetadataList v-bind="$props" />',
});

export const EmptyMetadataList = Template.bind({});
EmptyMetadataList.args = {
  // added minimal props to show the no result view properly
  categoryCards,
}


export const ListLoading = Template.bind({});
ListLoading.args = {
  ...EmptyMetadataList.args,
  loading: true,
  showSearch: true,
}

export const MinimalList = Template.bind({});
MinimalList.args = {
  ...EmptyMetadataList.args,
  listContent: metadata,
  showSearch: true,
  allTags,
};

export const MobileEmptyMetadataList = Template.bind({});
MobileEmptyMetadataList.args = { ...EmptyMetadataList.args };
MobileEmptyMetadataList.parameters = mobileViewportParams;

export const MobileListLoading = Template.bind({});
MobileListLoading.args = { ... ListLoading.args };
MobileListLoading.parameters = mobileViewportParams;

export const MobileMinimalListSmall = Template.bind({});
MobileMinimalListSmall.args = { ...MinimalList.args };
MobileMinimalListSmall.parameters = mobileViewportParams;

export const MobileMinimalListLarge = Template.bind({});
MobileMinimalListLarge.args = { ...MinimalList.args };
MobileMinimalListLarge.parameters = mobileLargeViewportParams;

export const TabletEmptyMetadataList = Template.bind({});
TabletEmptyMetadataList.args = { ...EmptyMetadataList.args };
TabletEmptyMetadataList.parameters = tabletViewportParams;

export const TabletListLoading = Template.bind({});
TabletListLoading.args = { ... ListLoading.args };
TabletListLoading.parameters = tabletViewportParams;

export const TabletMinimalList = Template.bind({});
TabletMinimalList.args = { ...MinimalList.args };
TabletMinimalList.parameters = tabletViewportParams;
