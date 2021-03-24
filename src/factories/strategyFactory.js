import {
  OPEN_TEXT_PREVIEW,
  INJECT_TEXT_PREVIEW,
} from '@/factories/eventBus';

import TextPreviewCard from '@/modules/metadata/components/ResourcePreviews/TextPreviewCard';

export const strategies = [
  {
    fileExtensions: ['txt', 'md'],
    component: TextPreviewCard,
    openEvent: OPEN_TEXT_PREVIEW,
    injectEvent: INJECT_TEXT_PREVIEW,
  },
];

export function getPreviewStrategy(extensions) {

  if (extensions) {

    if (!(extensions instanceof Array)) {
      extensions = [extensions];
    }

    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];
      const filteredStrat = strategies.filter(strat => strat.fileExtensions.indexOf(ext) !== -1);

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
    const strat = getPreviewStrategy(resExtension);
    if (strat) {
      return strat;
    }
  }

  return null;
}

export function enhanceResourcesStrategyEvents(resources) {

  if (!resources) {
    return null;
  }

  for (let i = 0; i < resources.length; i++) {
    const res = resources[i];

    const strat = getPreviewStrategyFromUrl(res.url);

    if (strat) {
      res.openPreviewEvent = strat.openEvent;
      res.previewProperty = res.url;
    }
  }

  return resources;
}
