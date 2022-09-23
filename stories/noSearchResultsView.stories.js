
import NoSearchResultsView from '@/components/Filtering/NoSearchResultsView';
import categoryCards from '@/store/categoryCards';
import { FILTERING_VIEWS } from './storybookFolder';

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
  title: `${FILTERING_VIEWS} / NoSearchResultsView`,
  decorators: [],
  parameters: {
  },
};

export const NoSearchResultViews = () => ({
  components: { NoSearchResultsView },
  template: `
    <v-row>
      <v-col cols="12" class="pa-2">
        Normal cards
      </v-col>
      <v-col cols="12" class="pa-2">
        <no-search-results-view :categoryCards="categoryCards"  />
      </v-col>

      <v-col cols="12" class="pa-2">
        Disabled cards
      </v-col>
      <v-col cols="12" class="pa-2">
        <no-search-results-view :categoryCards="disabledCards"  />
      </v-col>

      <v-col cols="12" class="pa-2">
        small cards
      </v-col>
      <v-col cols="6" class="pa-2">
        <no-search-results-view :categoryCards="categoryCards" />
      </v-col>

      <v-col cols="6" class="pa-2">
        <no-search-results-view :categoryCards="categoryCards"  />
      </v-col>

    </v-row>`,
  data: () => ({
    categoryCards,
    disabledCards,
  }),
});
