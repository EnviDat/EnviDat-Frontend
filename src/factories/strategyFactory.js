import {
  OPEN_TEXT_PREVIEW,
  INJECT_TEXT_PREVIEW,
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
  SELECT_EDITING_AUTHOR_PROPERTY,
  SELECT_EDITING_AUTHOR,
} from '@/factories/eventBus';

import TextPreviewCard from '@/modules/metadata/components/ResourcePreviews/TextPreviewCard';

export const localIdProperty = 'localId';

export const resourceClickStrategies = [
  {
    fileExtensions: ['txt', 'md'],
    component: TextPreviewCard,
    openEvent: OPEN_TEXT_PREVIEW,
    injectEvent: INJECT_TEXT_PREVIEW,
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
];

export function getPreviewStrategy(extensions) {

  if (extensions) {

    if (!(extensions instanceof Array)) {
      extensions = [extensions];
    }

    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];
      const filteredStrat = resourceClickStrategies.filter(strat => strat.fileExtensions.indexOf(ext) !== -1);

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

    let strat = null;
    if (entriesAreResources && previewProperty === 'url') {
      strat = getPreviewStrategyFromUrl(entry.url);
    } else {
      strat = getPreviewStrategy(previewProperty);
    }

    if (strat) {
      entry.openEvent = strat.openEvent;
      const idValue = entry[previewProperty];
      entry.openProperty = idValue || strat.fallbackProperty;
      entry.openButtonIcon = strat.icon;
      entry.openButtonTooltip = strat.tooltip;
    }
  }

  return elementList;
}
