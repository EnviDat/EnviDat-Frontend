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

import MetadataCard from '@/components/Cards/MetadataCard.vue';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';

import { enhanceMetadatas } from '@/factories/metaDataFactory';
import categoryCards from '@/store/categoryCards';
import globalMethods from '@/factories/globalMethods';
import fileIcon from '../src/assets/icons/file.png';
import lockedIcon from '../src/assets/icons/lockClosed.png';
import unlockedIcon from '../src/assets/icons/lockOpen.png';
import pinIcon from '../src/assets/icons/marker.png';
import multiPinIcon from '../src/assets/icons/markerMulti.png';
import polygonIcon from '../src/assets/icons/polygons.png';



// metadata gets enhance in the storybook config
import metadataCards from './js/metadata';
import { CARD_VIEWS } from './storybookFolder';

const cardBGImages = globalMethods.methods.mixinMethods_getCardBackgrounds();

enhanceMetadatas(metadataCards, cardBGImages, categoryCards);

const methods = {
  hasRestrictedResources(metadata) {
    if (!metadata || !metadata.resources || metadata.resources.length <= 0) {
      return false;
    }

    for (let i = 0; i < metadata.resources.length; i++) {
      const res = metadata.resources[i];

      if (res.restricted !== undefined
        && (res.restricted.allowed_users !== undefined
        || (res.restricted.level !== undefined
            && res.restricted.level !== 'public'))) {
        return true;
      }
    }

    return false;
  },
  geoJSONIcon(metadata) {
    // const spatialJSON = JSON.parse(metadata.spatial);
    if (!metadata || !metadata.spatial) {
      return null;
    }
    const spatialJSON = typeof metadata.spatial === 'string' ? JSON.parse(metadata.spatial) : metadata.spatial;

    if (spatialJSON.type.toLowerCase() === 'point') {
      return this.pinIcon;
    }

    if (spatialJSON.type.toLowerCase() === 'multipoint') {
      return this.multiPinIcon;
    }

    if (spatialJSON.type.toLowerCase() === 'polygon') {
      return this.polygonIcon;
    }

    return null;
  },
};

export default {
  title: `${CARD_VIEWS} / Metadata Cards`,
  decorators: [],
  parameters: {},
};

export const MetadataCardCollectionView = () => ({
    components: { MetadataCard },
    template: `
    <v-container fluid>
    <v-row>

      <v-col cols="3" class="pa-2"
              v-for="(metadata, index) in metadataCards"
              :key="index" >
        <metadata-card
          :id="metadata.id"
          :ref="metadata.id"
          :title="metadata.title"
          :name="metadata.name"
          :subtitle="metadata.notes"
          :tags="metadata.tags"
          :titleImg="metadata.titleImg"
          :restricted="hasRestrictedResources(metadata)"
          :resourceCount="metadata.num_resources || metadata.res_name.length"
          :resources="metadata.resources"
          :fileIconString="fileIcon"
          :lockedIconString="lockedIcon"
          :unlockedIconString="lockedIcon"
          :categoryColor="metadata.categoryColor"
          :geoJSONIcon="geoJSONIcon(metadata)"
        />
      </v-col>

    </v-row>

    <!-- v-row >

      <v-col cols="3" class="pa-2"
              v-for="(metadata, index) in metadataCards"
              :key="index" >
        <metadata-card
          :id="metadata.id"
          :ref="metadata.id"
          :title="metadata.title"
          :name="metadata.name"
          :subtitle="metadata.notes"
          :tags="metadata.tags"
          :restricted="hasRestrictedResources(metadata)"
          :resourceCount="metadata.num_resources || metadata.res_name.length"
          :resources="metadata.resources"
          :fileIconString="fileIcon"
          :lockedIconString="lockedIcon"
          :unlockedIconString="lockedIcon"
          :categoryColor="metadata.categoryColor"
        />
      </v-col>

    </row -->

    <v-row>

      <v-col cols="4" class="pa-2"
              v-for="(metadata, index) in metadataCards"
              :key="index" >
        <metadata-card
          :id="metadata.id"
          :ref="metadata.id"
          :title="metadata.title"
          :name="metadata.name"
          :subtitle="metadata.notes"
          :tags="metadata.tags"
          :titleImg="metadata.titleImg"
          :restricted="hasRestrictedResources(metadata)"
          :resourceCount="metadata.num_resources || metadata.res_name.length"
          :resources="metadata.resources"
          :fileIconString="fileIcon"
          :lockedIconString="lockedIcon"
          :unlockedIconString="lockedIcon"
          :categoryColor="metadata.categoryColor"
        />
      </v-col>

    </v-row>

    <v-row >

      <v-col cols="6" class="pa-2"
              v-for="(metadata, index) in metadataCards"
              :key="index" >
        <metadata-card
          :id="metadata.id"
          :ref="metadata.id"
          :title="metadata.title"
          :name="metadata.name"
          :subtitle="metadata.notes"
          :tags="metadata.tags"
          :titleImg="metadata.titleImg"
          :restricted="hasRestrictedResources(metadata)"
          :resourceCount="metadata.num_resources || metadata.res_name.length"
          :resources="metadata.resources"
          :fileIconString="fileIcon"
          :lockedIconString="lockedIcon"
          :unlockedIconString="lockedIcon"
          :categoryColor="metadata.categoryColor"
        />
      </v-col>

    </v-row>
    </v-container>
    `,
    methods,
    data: () => ({
      metadataCards,
      fileIcon,
      lockedIcon,
      unlockedIcon,
      pinIcon,
      multiPinIcon,
      polygonIcon,
    }),
  });

export const MetadataCardFlatCollectionView = () => ({
    components: { MetadataCard },
    template: `
    <v-row >

      <v-col cols="12" class="pa-2"
              v-for="(metadata, index) in metadataCards"
              :key="index" >
        <metadata-card
          :id="metadata.id"
          :ref="metadata.id"
          :title="metadata.title"
          :name="metadata.name"
          :subtitle="metadata.notes"
          :tags="metadata.tags"
          :titleImg="metadata.titleImg"
          :restricted="hasRestrictedResources(metadata)"
          :resourceCount="metadata.num_resources || metadata.res_name.length"
          :resources="metadata.resources"
          flatLayout
          :fileIconString="fileIcon"
          :lockedIconString="lockedIcon"
          :unlockedIconString="lockedIcon"
          :categoryColor="metadata.categoryColor"
        />
      </v-col>

    </v-row>`,
    methods,
    data: () => ({
      metadataCards,
      fileIcon,
      lockedIcon,
      unlockedIcon,
    }),
  });

export const PlaceholderLoadingCollectionView = () => ({
    components: { MetadataCardPlaceholder },
    template: `
    <v-container fluid >
      <v-row>

        <v-col cols="3" class="pa-2"
          v-for="index in 3"
          :key="index" >
          <metadata-card-placeholder />
        </v-col>

      </v-row>

      <v-row>

        <v-col cols="4" class="pa-2"
          v-for="index in 3"
          :key="index" >
          <metadata-card-placeholder />
        </v-col>

      </v-row>

      <v-row>

        <v-col cols="6" class="pa-2"
          v-for="index in 3"
          :key="index" >
          <metadata-card-placeholder />
        </v-col>

      </v-row>
    </v-container>
    `,
    methods,
    data: () => ({}),
  });
