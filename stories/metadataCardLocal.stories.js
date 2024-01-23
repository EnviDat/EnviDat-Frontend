/**
 * @summary story of MetadataCard & MetadataCardPlaceholder for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-04 11:39:07
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import MetadataCardLocal from '@/components/Cards/MetadataCardLocal.vue';

import { enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';
import categoryCards from '@/store/categoryCards';
import globalMethods from '@/factories/globalMethods';
import { METADATA_STATE_DRAFT } from '@/factories/metadataConsts';
import fileIcon from '../src/assets/icons/file.png';

// metadata gets enhanced in the storybook config
import metadataCards from './js/metadata';

const cardBGImages = globalMethods.methods.mixinMethods_getCardBackgrounds();

enhanceMetadatasTitleImage(metadataCards, cardBGImages, categoryCards);

export default {
  title: '3 Cards / Metadata Cards',
  decorators: [],
  parameters: {},
};

const Template = (args, { argTypes }) => ({
  components: { MetadataCardLocal },
  props: Object.keys(argTypes),
  template: '<MetadataCardLocal v-bind="$props" />',
});

const firstDataset = metadataCards[0];

/*
export const LocalCardNoTitle = Template.bind({});
*/


export const LocalCard = Template.bind({});
LocalCard.args = {
  id: firstDataset.id,
  title: firstDataset.title,
  fileIconString: fileIcon,
  categoryColor: firstDataset.categoryColor,
  name: firstDataset.name,
  subtitle: firstDataset.notes,
  state: METADATA_STATE_DRAFT,
}

