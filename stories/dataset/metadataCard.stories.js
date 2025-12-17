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

import { enhanceMetadataEntry } from '@/factories/metaDataFactory';

import { getModeData } from '@/factories/modeFactory';
import { EDNA_MODE, SWISSFL_MODE } from '@/store/metadataMutationsConsts';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';
import { createLocation } from '@/factories/geoFactory';
import { getMetadataVisibilityState } from '@/factories/publicationFactory';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from '@/../stories/js/envidatViewports';

import pinIcon from '@/assets/icons/marker.webp';
import multiPinIcon from '@/assets/icons/markerMulti.webp';
import polygonIcon from '@/assets/icons/polygons.webp';

import metadataCards from '@/../stories/js/metadata';

const enhancedDatasets = [];

for (let i = 0; i < metadataCards.length; i++) {
  let dataset = metadataCards[i];
  dataset = enhanceMetadataEntry(dataset);

  enhanceKeywords(dataset.tags, categoryCards);

  dataset.location = createLocation(dataset);

  enhancedDatasets.push(dataset);
}

const methods = {
  hasRestrictedResources(metadata) {
    if (!metadata || !metadata.resources || metadata.resources.length <= 0) {
      return false;
    }

    for (let i = 0; i < metadata.resources.length; i++) {
      const res = metadata.resources[i];

      if (
        res.restricted !== undefined &&
        (res.restricted.allowed_users !== undefined ||
          (res.restricted.level !== undefined && res.restricted.level !== 'public'))
      ) {
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

    const spatialName = spatialJSON.type.toLowerCase();

    if (spatialName === 'point') {
      return pinIcon;
    }

    if (spatialName === 'multipoint') {
      return multiPinIcon;
    }

    if (spatialName === 'polygon') {
      return polygonIcon;
    }

    return null;
  },
};

export default {
  title: '1 Base / Cards /  Metadata Cards',
  decorators: [],
  parameters: {},
};

const Template = (args, { argTypes }) => ({
  components: { MetadataCard },
  props: Object.keys(argTypes),
  template: '<MetadataCard v-bind="$props" />',
});

const firstDataset = enhancedDatasets[0];
const otherDataset = enhancedDatasets[2];

export const TitleOnly = Template.bind({});
TitleOnly.args = {
  id: firstDataset.id,
  title: firstDataset.title,
  categoryColor: firstDataset.categoryColor,
};

export const NormalCard = Template.bind({});
NormalCard.args = {
  ...TitleOnly.args,
  name: firstDataset.name,
  subtitle: firstDataset.notes,
  titleImg: firstDataset.titleImg,
};

export const CardWithTags = Template.bind({});
CardWithTags.args = {
  id: otherDataset.id,
  title: otherDataset.title,
  categoryColor: otherDataset.categoryColor,
  name: otherDataset.name,
  subtitle: otherDataset.notes,
  titleImg: otherDataset.titleImg,
  tags: otherDataset.tags,
};

export const MobileNormalCard = Template.bind({});
MobileNormalCard.args = { ...NormalCard.args };
MobileNormalCard.parameters = mobileViewportParams;

export const MobileLargeNormalCard = Template.bind({});
MobileLargeNormalCard.args = { ...NormalCard.args };
MobileLargeNormalCard.parameters = mobileLargeViewportParams;

export const TabletNormalCard = Template.bind({});
TabletNormalCard.args = { ...NormalCard.args };
TabletNormalCard.parameters = tabletViewportParams;

export const FlatCard = Template.bind({});
FlatCard.args = {
  ...NormalCard.args,
  flatLayout: true,
};

export const CardWithState = Template.bind({});
CardWithState.args = {
  ...NormalCard.args,
  state: getMetadataVisibilityState(firstDataset),
  tags: firstDataset.tags,
};

export const CardWithOrganization = Template.bind({});
CardWithOrganization.args = {
  ...CardWithState.args,
  organization: firstDataset.organization?.name,
  compactLayout: true,
};

export const CardForModeSWISSFL = Template.bind({});
CardForModeSWISSFL.args = {
  ...CardWithTags.args,
  modeData: getModeData(SWISSFL_MODE),
};

export const CardForModeEDNA = Template.bind({});
CardForModeEDNA.args = {
  ...CardWithTags.args,
  modeData: getModeData(EDNA_MODE),
  compactLayout: false,
};

export const MetadataCardCollectionView = () => ({
  components: { MetadataCard },
  template: `
    <v-container fluid>
    <v-row>

      <v-col cols="3" class="pa-2"
              v-for="(metadata, index) in enhancedDatasets"
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
          :categoryColor="metadata.categoryColor"
          :geoJSONIcon="geoJSONIcon(metadata)"
        />
      </v-col>

    </v-row>

    <!-- v-row >

      <v-col cols="3" class="pa-2"
              v-for="(metadata, index) in enhancedDatasets"
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
          :categoryColor="metadata.categoryColor"
        />
      </v-col>

    </row -->

    <v-row>

      <v-col cols="4" class="pa-2"
              v-for="(metadata, index) in enhancedDatasets"
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
          :categoryColor="metadata.categoryColor"
        />
      </v-col>

    </v-row>

    <v-row >

      <v-col cols="6" class="pa-2"
              v-for="(metadata, index) in enhancedDatasets"
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
          :categoryColor="metadata.categoryColor"
        />
      </v-col>

    </v-row>
    </v-container>
    `,
  methods,
  data: () => ({
    enhancedDatasets,
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
              v-for="(metadata, index) in enhancedDatasets"
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
          :categoryColor="metadata.categoryColor"
          :geoJSONIcon="geoJSONIcon(metadata)"          
        />
      </v-col>

    </v-row>`,
  methods,
  data: () => ({
    enhancedDatasets,
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
