import type { Component } from 'vue';
import { mdiFileEye, mdiPencil } from '@mdi/js';
import { METADATA_DEPRECATED_RESOURCES_PROPERTY } from '@/factories/metadataConsts';
import {
  OPEN_DATA_PREVIEW_IFRAME,
  OPEN_TEXT_PREVIEW,
  OPEN_VIDEO_PREVIEW,
  SELECT_EDITING_AUTHOR,
  SELECT_EDITING_DATASET,
  SELECT_EDITING_RESOURCE,
} from '@/factories/eventBus';

import { Resource } from '@/types/modelTypes';
import { ExtrasDTO } from '@/types/dataTransferObjectsTypes';

const DataPreviewIframe = () => import('@/modules/metadata/components/ResourcePreviews/DataPreviewIframe.vue');
const ImagePreviewCard = () => import('@/modules/metadata/components/ResourcePreviews/ImagePreviewCard.vue');
const TextPreviewCard = () => import('@/modules/metadata/components/ResourcePreviews/TextPreviewCard.vue');
const VideoPreviewCard = () => import('@/modules/metadata/components/ResourcePreviews/VideoPreviewCard.vue');

const ResourceDataViz = () => import('@/modules/charts/components/ResourceDataViz.vue');

const S3PreviewCard = () => import('@/modules/metadata/components/ResourcePreviews/S3PreviewCard.vue');

export const localIdProperty = 'localId';

export const SELECT_EDITING_RESOURCE_PROPERTY = 'id';
export const SHOW_DATA_PREVIEW_PROPERTY = 'previewUrl';
const SHOW_DATA_PREVIEW_KEY_PREFIX = 'resourcePreview';
export const SELECT_EDITING_AUTHOR_PROPERTY = 'email';
export const SELECT_EDITING_DATASET_PROPERTY = 'name';

export type ClickStrategy = {
  keys: string[];
  clickEvent: string;
  icon: string;
  tooltip: string;
};

export type AsyncComponentLoader = () => Promise<{ default: Component }>;

export type PreviewComponentStrategy = {
  keys: string[];
  component: AsyncComponentLoader;
};

const previewComponentStrategies: PreviewComponentStrategy[] = [
  {
    keys: ['txt', 'md'],
    component: TextPreviewCard,
  },
  {
    keys: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    component: ImagePreviewCard,
  },
  {
    keys: ['mp4', 'avi', 'mpeg'],
    component: VideoPreviewCard,
  },
  {
    keys: [SHOW_DATA_PREVIEW_PROPERTY],
    component: DataPreviewIframe,
  },
  {
    keys: ['csv'],
    component: ResourceDataViz,
  },
  {
    keys: ['envicloud'],
    component: S3PreviewCard,
  },
];

const clickStrategies: ClickStrategy[] = [
  {
    keys: ['txt', 'md'],
    clickEvent: OPEN_TEXT_PREVIEW,
    icon: mdiFileEye,
    tooltip: 'Click for a preview of this resource',
  },
  {
    keys: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    clickEvent: OPEN_TEXT_PREVIEW,
    icon: mdiFileEye,
    tooltip: 'Click for a preview of this image',
  },
  {
    keys: ['mp4', 'avi', 'mpeg'],
    clickEvent: OPEN_VIDEO_PREVIEW,
    icon: 'preview',
    tooltip: 'Click for a preview of this video',
  },
  {
    keys: [SHOW_DATA_PREVIEW_PROPERTY],
    clickEvent: OPEN_DATA_PREVIEW_IFRAME,
    icon: mdiFileEye,
    tooltip: 'Click for a preview of this resource',
  },
  {
    keys: ['csv'],
    clickEvent: OPEN_VIDEO_PREVIEW,
    icon: 'preview',
    tooltip: 'Click for a data visualization of this resource',
  },
  {
    keys: [SELECT_EDITING_RESOURCE_PROPERTY],
    clickEvent: SELECT_EDITING_RESOURCE,
    icon: mdiPencil,
    tooltip: 'Click to select this resource for editing',
  },
  {
    keys: [SELECT_EDITING_AUTHOR_PROPERTY],
    clickEvent: SELECT_EDITING_AUTHOR,
    icon: mdiPencil,
    tooltip: 'Click to select this author for editing',
  },
  {
    keys: [SELECT_EDITING_DATASET_PROPERTY],
    clickEvent: SELECT_EDITING_DATASET,
    icon: mdiPencil,
    tooltip: 'Click to edit this dataset',
  },
];

export function getClickEventStrategy(key: string): ClickStrategy | undefined {
  if (!key) {
    return undefined;
  }

  const filteredStrat = clickStrategies.filter((strat) => strat.keys.indexOf(key) !== -1);
  return filteredStrat[0] || undefined;
}

export function getUrlExtension(url: string): string | undefined {
  const splits = url?.split('.');

  return splits?.length > 0 ? splits[splits.length - 1] : undefined;
}

export function getPreviewComponent(key: string): AsyncComponentLoader | undefined {
  if (!key) return undefined;

  const strat = previewComponentStrategies.filter((strategy: PreviewComponentStrategy) =>
    strategy.keys.includes(key),
  )[0];
  return strat?.component;
}

function inAnyPreviewKeys(extension: string) {
  const allKeys = previewComponentStrategies.map((strat) => strat.key);
  return allKeys.includes(extension);
}
export function getPreviewComponentFromUrl(url: string): AsyncComponentLoader | undefined {
  const fileExtension = getUrlExtension(url);
  let previewComp = getPreviewComponent(fileExtension);

  if (!previewComp && url?.includes('envicloud') && !inAnyPreviewKeys(fileExtension)) {
    // manually check for envicould preview,
    // because it doesn't work based on the url extension
    previewComp = getPreviewComponent('envicloud');
  }

  return previewComp;
}

export function enhanceResourcesUrlPreviewEvents(resources: Resource[]) {
  if (!resources) {
    return null;
  }

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const idValue = resource.url;

    if (idValue) {
      const fileExtension = getUrlExtension(resource.url);
      const strat = getClickEventStrategy(fileExtension);

      if (strat) {
        resource.clickEvent = strat.clickEvent;
        resource.openProperty = idValue;
        resource.openButtonIcon = strat.icon;
        resource.openButtonTooltip = strat.tooltip;
      }
    }
  }

  return resources;
}

export function enhanceElementsWithStrategyEvents(elementList: any[], previewProperty: string) {
  if (!elementList) {
    return null;
  }

  for (let i = 0; i < elementList.length; i++) {
    const entry = elementList[i];
    const idValue = entry[previewProperty];

    if (idValue) {
      const strat = getClickEventStrategy(previewProperty);

      if (strat) {
        entry.clickEvent = strat.clickEvent;
        entry.openProperty = idValue;
        entry.openButtonIcon = strat.icon;
        entry.openButtonTooltip = strat.tooltip;
      }
    }
  }

  return elementList;
}

export function enhanceResourcesWithMetadataExtras(metadataExtras: ExtrasDTO[], resources: Resource[]) {
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
