import { defineAsyncComponent } from 'vue';
import { mdiFileEye, mdiPencil } from '@mdi/js';
import { METADATA_DEPRECATED_RESOURCES_PROPERTY } from '@/factories/metadataConsts';
import {
  OPEN_DATA_PREVIEW_IFRAME,
  OPEN_TEXT_PREVIEW,
  OPEN_VIDEO_PREVIEW,
  SELECT_EDITING_AUTHOR,
  SELECT_EDITING_DATASET,
  SELECT_EDITING_RESOURCE,
} from './eventBus';

const DataPreviewIframe = () => import('@/modules/metadata/components/ResourcePreviews/DataPreviewIframe.vue');
const ImagePreviewCard = () => import('@/modules/metadata/components/ResourcePreviews/ImagePreviewCard.vue');
const TextPreviewCard = () => import('@/modules/metadata/components/ResourcePreviews/TextPreviewCard.vue');
const VideoPreviewCard = () => import('@/modules/metadata/components/ResourcePreviews/VideoPreviewCard.vue');

export const localIdProperty = 'localId';

export const SELECT_EDITING_RESOURCE_PROPERTY = 'id';
export const SHOW_DATA_PREVIEW_PROPERTY = 'previewUrl';
export const SHOW_DATA_PREVIEW_KEY_PREFIX = 'resourcePreview';
export const SELECT_EDITING_AUTHOR_PROPERTY = 'email';
export const SELECT_EDITING_DATASET_PROPERTY = 'name';

export const clickStrategies = [
  {
    strategyKeys: ['txt', 'md'],
    component: TextPreviewCard,
    openEvent: OPEN_TEXT_PREVIEW,
    icon: mdiFileEye,
    tooltip: 'Click for a preview of this resource',
  },
  {
    strategyKeys: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    component: ImagePreviewCard,
    openEvent: OPEN_TEXT_PREVIEW,
    icon: mdiFileEye,
    tooltip: 'Click for a preview of this image',
  },
  {
    strategyKeys: ['mp4', 'avi', 'mpeg'],
    component: VideoPreviewCard,
    openEvent: OPEN_VIDEO_PREVIEW,
    icon: 'preview',
    tooltip: 'Click for a preview of this video',
  },
  {
    strategyKeys: [SELECT_EDITING_RESOURCE_PROPERTY],
    openEvent: SELECT_EDITING_RESOURCE,
    icon: mdiPencil,
    tooltip: 'Click to select this resource for editing',
  },
  {
    strategyKeys: [SELECT_EDITING_AUTHOR_PROPERTY],
    openEvent: SELECT_EDITING_AUTHOR,
    icon: mdiPencil,
    tooltip: 'Click to select this author for editing',
  },
  {
    strategyKeys: [SELECT_EDITING_DATASET_PROPERTY],
    openEvent: SELECT_EDITING_DATASET,
    icon: mdiPencil,
    tooltip: 'Click to edit this dataset',
  },
  {
    strategyKeys: [SHOW_DATA_PREVIEW_PROPERTY],
    component: DataPreviewIframe,
    openEvent: OPEN_DATA_PREVIEW_IFRAME,
    icon: mdiFileEye,
    tooltip: 'Click for a preview of this resource',
  },
];

export function getPreviewStrategy(strategyKeys) {
  if (!strategyKeys) {
    return null;
  }

  if (!(strategyKeys instanceof Array)) {
    strategyKeys = [strategyKeys];
  }

  for (let i = 0; i < strategyKeys.length; i++) {
    const ext = strategyKeys[i];
    const filteredStrat = clickStrategies.filter((strat) => strat.strategyKeys.indexOf(ext) !== -1);

    if (filteredStrat.length > 0) {
      return filteredStrat[0];
    }
  }

  return null;
}

export function getUrlExtension(url) {
  const splits = url.split('.');

  if (splits.length <= 0) {
    return null;
  }

  return splits[splits.length - 1];
}

export function getPreviewStrategyFromUrlExtension(url) {
  const fileExtension = getUrlExtension(url);

  if (fileExtension) {
    return getPreviewStrategy(fileExtension);
  }

  return null;
}

export function enhanceElementsWithStrategyEvents(elementList, previewProperty = 'url', entriesAreResources = false) {
  if (!elementList) {
    return null;
  }

  for (let i = 0; i < elementList.length; i++) {
    const entry = elementList[i];
    const idValue = entry[previewProperty];

    if (idValue) {
      let strat = null;
      if (entriesAreResources && previewProperty === 'url') {
        // get the click strategy based on the url file extension
        strat = getPreviewStrategyFromUrlExtension(entry.url);
      } else {
        strat = getPreviewStrategy(previewProperty);
      }

      if (strat) {
        entry.openEvent = strat.openEvent;
        entry.openProperty = idValue;
        entry.openButtonIcon = strat.icon;
        entry.openButtonTooltip = strat.tooltip;
      }
    }
  }

  return elementList;
}

export function enhanceResourcesWithMetadataExtras(metadataExtras, resources) {
  if (!metadataExtras || !resources) return null;

  if (typeof metadataExtras === 'object' && metadataExtras instanceof Array) {
    let deprecatedResources = [];

    if (metadataExtras?.length > 0) {
      const customFieldEntry = metadataExtras.filter(
        (entry) => entry?.key === METADATA_DEPRECATED_RESOURCES_PROPERTY,
      )[0];
      deprecatedResources = JSON.parse(customFieldEntry?.value || '[]');
    }

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      resource.deprecated = deprecatedResources?.includes(resource.id);

      const enhanceKey = `${SHOW_DATA_PREVIEW_KEY_PREFIX}_${resource.id}`;
      const match = metadataExtras.filter((entry) => entry.key === enhanceKey)[0];

      if (match) {
        resource[SHOW_DATA_PREVIEW_PROPERTY] = match.value;
      }
    }

    // the deprecated resources have to be at the bottom of the list
    resources.sort((a, b) => (a.deprecated && !b.deprecated ? 1 : -1));
  }

  return resources;
}
