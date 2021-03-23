import {
  OPEN_TEXT_PREVIEW,
  INJECT_TEXT_PREVIEW,
} from '@/factories/eventBus';

import TextPreviewCard from '@/modules/metadata/components/ResourcePreviews/TextPreviewCard';

const strategies = [
  {
    fileExtensions: ['txt', 'md'],
    component: TextPreviewCard,
    openEvent: OPEN_TEXT_PREVIEW,
    injectEvent: INJECT_TEXT_PREVIEW,
  },
];

function getPreviewStrategy(extensions) {

  if (!extensions) {
    return null;
  }

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
  
  return null;
}

module.exports = {
  strategies,
  getPreviewStrategy,
};
