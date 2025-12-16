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

import { enhanceMetadataEntry } from '@/factories/metaDataFactory.ts';

import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';
import { createLocation } from '@/factories/geoFactory';

import pinIcon from '@/assets/icons/marker.webp';
import multiPinIcon from '@/assets/icons/markerMulti.webp';
import polygonIcon from '@/assets/icons/polygons.webp';

import metadataCards from '@/../stories/js/metadata.js';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { enhanceElementsWithStrategyEvents, SELECT_EDITING_DATASET_PROPERTY } from '@/factories/strategyFactory.ts';

const enhancedDatasets: DatasetDTO[] = [];

for (let i = 0; i < metadataCards.length; i++) {
  let dataset = metadataCards[i];
  dataset = enhanceMetadataEntry(dataset);

  enhanceKeywords(dataset.tags, categoryCards);

  dataset.location = createLocation(dataset);

  enhancedDatasets.push(dataset);
}

const firstDataset = enhancedDatasets[0];
enhanceElementsWithStrategyEvents([firstDataset], SELECT_EDITING_DATASET_PROPERTY);

export default {
  title: '1 Base / Cards /  Metadata Compact Cards',
  component: MetadataCard,
};

export const CompactCard = {
  args: {
    id: firstDataset.id,
    title: firstDataset.title,
    categoryColor: firstDataset.categoryColor,
    name: firstDataset.name,
    subtitle: firstDataset.notes,
    compactLayout: true,
  },
};

export const CompactCardWithEditButton = {
  args: {
    id: firstDataset.id,
    title: firstDataset.title,
    categoryColor: firstDataset.categoryColor,
    name: firstDataset.name,
    subtitle: firstDataset.notes,
    titleImg: firstDataset.titleImg,
    tags: firstDataset.tags,
    showGenericOpenButton: !!firstDataset.clickEvent,
    openButtonTooltip: firstDataset.openButtonTooltip,
    openButtonIcon: firstDataset.openButtonIcon,
    compactLayout: true,
  },
};
