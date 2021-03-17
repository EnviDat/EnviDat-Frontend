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

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import MetadataCard from '@/components/Cards/MetadataCard.vue';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';

import fileIcon from '@/assets/icons/file.png';
import lockedIcon from '@/assets/icons/lockClosed.png';
import unlockedIcon from '@/assets/icons/lockOpen.png';
import pinIcon from '@/assets/icons/marker.png';
import multiPinIcon from '@/assets/icons/markerMulti.png';
import polygonIcon from '@/assets/icons/polygons.png';


// metadata gets enhance in the storybook config
import metadataCards from './js/metadata';

export const methods = {
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
    const spatialJSON = metadata.spatial;

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
  onCardClick: action('clicked on card'),
  onTagClick: action('clicked on tag'),
};

storiesOf('3 Cards / Metadata Cards', module)
  .add('collection', () => ({
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
          @clickedEvent="onCardClick"
          @clickedTag="onTagClick"
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
          @clickedEvent="onCardClick"
          @clickedTag="onTagClick"
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
          @clickedEvent="onCardClick"
          @clickedTag="onTagClick"
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
          @clickedEvent="onCardClick"
          @clickedTag="onTagClick"
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
  }))
  .add('Flat collection', () => ({
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
          @clickedEvent="onCardClick"
          @clickedTag="onTagClick"
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
  }))
  .add('Placeholder / Loading collection', () => ({
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
  }));
