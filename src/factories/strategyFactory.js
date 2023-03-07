import TextPreviewCard from '@/modules/metadata/components/ResourcePreviews/TextPreviewCard.vue';
import DataPreviewIframe from '@/modules/metadata/components/ResourcePreviews/DataPreviewIframe.vue';

import {
  OPEN_TEXT_PREVIEW,
  OPEN_DATA_PREVIEW_IFRAME,
  SELECT_EDITING_AUTHOR,
  SELECT_EDITING_AUTHOR_PROPERTY,
  SELECT_EDITING_DATASET,
  SELECT_EDITING_DATASET_PROPERTY,
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
  SHOW_DATA_PREVIEW_PROPERTY,
} from './eventBus';


export const localIdProperty = 'localId';

export const clickStrategies = [
  {
    strategyKeys: ['txt', 'md'],
    component: TextPreviewCard,
    openEvent: OPEN_TEXT_PREVIEW,
    icon: 'preview',
    tooltip: 'Click for a preview of this resource',
    fallbackProperty: '',
  },
  {
    strategyKeys: [SELECT_EDITING_RESOURCE_PROPERTY],
    openEvent: SELECT_EDITING_RESOURCE,
    icon: 'edit',
    tooltip: 'Click to select this resource for editing',
    fallbackProperty: localIdProperty,
  },
  {
    strategyKeys: [SELECT_EDITING_AUTHOR_PROPERTY],
    openEvent: SELECT_EDITING_AUTHOR,
    icon: 'edit',
    tooltip: 'Click to select this author for editing',
    fallbackProperty: localIdProperty,
  },
  {
    strategyKeys: [SELECT_EDITING_DATASET_PROPERTY],
    openEvent: SELECT_EDITING_DATASET,
    icon: 'edit',
    tooltip: 'Click to edit this dataset',
    fallbackProperty: localIdProperty,
  },
  {
    strategyKeys: [SHOW_DATA_PREVIEW_PROPERTY],
    component: DataPreviewIframe,
    openEvent: OPEN_DATA_PREVIEW_IFRAME,
    icon: 'preview',
    tooltip: 'Click for a preview of this resource',
    fallbackProperty: '',
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
    const filteredStrat = clickStrategies.filter(strat => strat.strategyKeys.indexOf(ext) !== -1);

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
    const entryPreviewProperty = entry.previewUrl ? SHOW_DATA_PREVIEW_PROPERTY : previewProperty

    let strat = null;
    if (entriesAreResources && entryPreviewProperty === 'url') {
      // get the click strategy based on the url file extension
      strat = getPreviewStrategyFromUrlExtension(entry.url);
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
