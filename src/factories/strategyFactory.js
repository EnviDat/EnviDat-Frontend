import {
  OPEN_TEXT_PREVIEW,
  INJECT_TEXT_PREVIEW,
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/eventBus';

import TextPreviewCard from '@/modules/metadata/components/ResourcePreviews/TextPreviewCard';

export const resourceClickStrategies = [
  {
    fileExtensions: ['txt', 'md'],
    component: TextPreviewCard,
    openEvent: OPEN_TEXT_PREVIEW,
    injectEvent: INJECT_TEXT_PREVIEW,
    icon: 'preview',
    tooltip: 'Click for a preview of this resource',
  },
  {
    fileExtensions: [SELECT_EDITING_RESOURCE_PROPERTY],
    openEvent: SELECT_EDITING_RESOURCE,
    icon: 'edit',
    tooltip: 'Click to select this resource for editing',
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

export function enhanceResourcesStrategyEvents(resources, previewProperty = 'url') {

  if (!resources) {
    return null;
  }

  for (let i = 0; i < resources.length; i++) {
    const res = resources[i];

    let strat = null;
    if (previewProperty === 'url') {
     strat = getPreviewStrategyFromUrl(res.url);
    } else {
      strat = getPreviewStrategy(previewProperty);
    }

    if (strat) {
      res.openEvent = strat.openEvent;
      res.openProperty = res[previewProperty];
      res.openButtonIcon = strat.icon;
      res.openButtonTooltip = strat.tooltip;
    }
  }

  return resources;
}
