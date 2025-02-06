/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-09-06 15:11:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import EditKeywords from '@/modules/user/components/EditKeywords.vue';

import storyTags from '@/modules/metadata/store/metadataTags';
import categoryCards from '@/store/categoryCards';
import { getPopularTags, getTagColor } from '@/factories/keywordsFactory';
import metadataset from './js/metadata';

const tagsFromDatasets = getPopularTags(metadataset, '', 1);

for (let i = 0; i < tagsFromDatasets.length; i++) {
  const tag = tagsFromDatasets[i];
  tag.color = getTagColor(categoryCards, tag.name);
}


function getKeywordsSource(tagsSource) {

  const keywordsArray = [...tagsSource];

  for (let i = 0; i < keywordsArray.length; i++) {
    keywordsArray[i].color = getTagColor(keywordsArray[i].name);
  }

  return keywordsArray;
}

const storyTags5 = getKeywordsSource(storyTags).slice(0, 5);


export default {
  title: '3 Datasets / 2 Edit / Keywords',
  decorators: [],
  parameters: {},
};

export const EditingKeywords = () => ({
    components: { EditKeywords },
    template: `
    <v-col>

      <v-row>
        EditKeywords with Placeholder
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditKeywords v-bind="genericProps" />
        </v-col>
      </v-row>

      <v-row>
        EditKeywords with prefilled keywords
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditKeywords v-bind="genericProps"
                        :keywords="storyTags5"
          />
        </v-col>
      </v-row>

    </v-col>
    `,
    data: () => ({
      genericProps: {
        metadataCardTitle: 'A Mostly Glorious Title',
        metadataCardSubtitle: 'My metadata description is pleasant to read.',
        existingKeywords: tagsFromDatasets,
        componentTitle: 'Metadata Keywords',
        disclaimer: 'Please note that the screenshot below will serve as a template for the future component.',
      },
      storyTags5,
    }),
  });
