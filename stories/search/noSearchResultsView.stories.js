
import NoSearchResultsView from '@/components/Filtering/NoSearchResultsView.vue';
import categoryCards from '@/store/categoryCards';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from '~/stories/js/envidatViewports.js';

const disabledCards = [];

for (let i = 0; i < categoryCards.length; i++) {
  const card = categoryCards[i];
  disabledCards.push({
    title: card.title,
    type: card.type,
    imgPath: card.imgPath,
    img: card.img,
    color: card.color,
    darkColor: card.darkColor,
    contain: card.contain,
    disabled: true,
  });
}

export default {
  title: '2 Search / NoSearchResultsView',
  component: NoSearchResultsView,
};

export const DefaultCards = {
  args: {
    categoryCards,
  },
}

export const DisabledCards = {
  args: {
    categoryCards: disabledCards,
  },
}

export const MobileNoSearchResult = {
  args: { ...DefaultCards.args },
  parameters: mobileViewportParams,
}

export const MobileLargeCategoryCardCollection = {
  args: { ...DefaultCards.args },
  parameters: mobileLargeViewportParams,
}

export const TabletCategoryCardCollection = {
  args: { ...DefaultCards.args },
  parameters: tabletViewportParams,
}


