import TextPreviewCard from '@/modules/metadata/components/ResourcePreviews/TextPreviewCard.vue';

import {
  OPEN_TEXT_PREVIEW,
  OPEN_DATA_PREVIEW_IFRAME,
  SELECT_EDITING_AUTHOR,
  SELECT_EDITING_AUTHOR_PROPERTY,
  SELECT_EDITING_DATASET,
  SELECT_EDITING_DATASET_PROPERTY,
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from './eventBus';

export const localIdProperty = 'localId';

export const clickStrategies = [
  {
    fileExtensions: ['txt', 'md'],
    component: TextPreviewCard,
    openEvent: OPEN_TEXT_PREVIEW,
    icon: 'preview',
    tooltip: 'Click for a preview of this resource',
    fallbackProperty: '',
  },
  {
    fileExtensions: [SELECT_EDITING_RESOURCE_PROPERTY],
    openEvent: SELECT_EDITING_RESOURCE,
    icon: 'edit',
    tooltip: 'Click to select this resource for editing',
    fallbackProperty: localIdProperty,
  },
  {
    fileExtensions: [SELECT_EDITING_AUTHOR_PROPERTY],
    openEvent: SELECT_EDITING_AUTHOR,
    icon: 'edit',
    tooltip: 'Click to select this author for editing',
    fallbackProperty: localIdProperty,
  },
  {
    fileExtensions: [SELECT_EDITING_DATASET_PROPERTY],
    openEvent: SELECT_EDITING_DATASET,
    icon: 'edit',
    tooltip: 'Click to edit this dataset',
    fallbackProperty: localIdProperty,
  },
];

export function getPreviewStrategy(extensions) {

  if (extensions) {

    if (!(extensions instanceof Array)) {
      extensions = [extensions];
    }

    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];
      const filteredStrat = clickStrategies.filter(strat => strat.fileExtensions.indexOf(ext) !== -1);

      if (filteredStrat.length > 0) {
        return filteredStrat[0];
      }
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

export function getPreviewStrategyFromUrl(url) {
  const resExtension = getUrlExtension(url);

  if (resExtension) {
    return getPreviewStrategy(resExtension);
  }

  return null;
}

export function enhanceElementsWithStrategyEvents(elementList, previewProperty = 'url', entriesAreResources = false) {

  if (!elementList) {
    return null;
  }

  for (let i = 0; i < elementList.length; i++) {
    const entry = elementList[i];
    const entryPreviewProperty = entry.previewUrl ? 'previewUrl' : previewProperty

    let strat = null;
    if (entriesAreResources && entryPreviewProperty === 'previewUrl') {
      strat = {
        openEvent: OPEN_DATA_PREVIEW_IFRAME,
        icon: 'preview',
        tooltip: 'Click for a preview of this resource',
        fallbackProperty: '',
      };
    } else if (entriesAreResources && entryPreviewProperty === 'url') {
      strat = getPreviewStrategyFromUrl(entry.url);
    } else {
      strat = getPreviewStrategy(entryPreviewProperty);
    }

    if (strat) {
      entry.openEvent = strat.openEvent;
      const idValue = entry[entryPreviewProperty];
      entry.openProperty = idValue || entry[strat.fallbackProperty];
      entry.openButtonIcon = strat.icon;
      entry.openButtonTooltip = strat.tooltip;
    }
  }

  return elementList;
}
