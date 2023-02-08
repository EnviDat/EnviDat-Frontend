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
import { enhanceMetadatas } from '@/factories/metaDataFactory';
import globalMethods from '@/factories/globalMethods';
import metadata from './js/metadata';

const cardBGImages = globalMethods.methods.mixinMethods_getCardBackgrounds();

enhanceMetadatas(metadata, cardBGImages, categoryCards);

export default {
  title: '6 Detail Views / Metadata List View',
  component: MetadataList,
  decorators: [],
  parameters: {},
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
  loading: true,
  showSearch: true,
}

export const ListOnly = Template.bind({});
ListOnly.args = {
  listContent: metadata,
  showSearch: true,
}

/*
export const MetadataListEmpty = () => ({
    components: { MetadataList },
    template: `
    <v-row style="border: solid 1px; background-color: grey;">
    
      <v-col >
        <MetadataList />
      </v-col>
    
    </v-row>`,
    data: () => ({
    }),
  });
*/

