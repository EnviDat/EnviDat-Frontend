import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import NoSearchResultsView from '@/components/Filtering/NoSearchResultsView';
import categoryCards from '@/store/categoryCards';

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

export const methods = {
  onClick: action('clicked on card'),
};

storiesOf('4 Filtering / NoSearchResultsView ', module).add('NoSearchResultView', () => ({
  components: { NoSearchResultsView },
  template: `
    <v-row>
      <v-col cols="12" class="pa-2">
        Normal cards
      </v-col>
      <v-col cols="12" class="pa-2">
        <no-search-results-view :categoryCards="categoryCards"
                                  @clickedCategory="onClick" />
      </v-col>

      <v-col cols="12" class="pa-2">
        Disabled cards
      </v-col>
      <v-col cols="12" class="pa-2">
        <no-search-results-view :categoryCards="disabledCards"
                                  @clickedCategory="onClick" />
      </v-col>

      <v-col cols="12" class="pa-2">
        small cards
      </v-col>
      <v-col cols="6" class="pa-2">
        <no-search-results-view :categoryCards="categoryCards"
                                  @clickedCategory="onClick" />
      </v-col>

      <v-col cols="6" class="pa-2">
        <no-search-results-view :categoryCards="categoryCards"
                                  @clickedCategory="onClick" />
      </v-col>

    </v-row>`,
  methods,
  data: () => ({
    categoryCards,
    disabledCards,
  }),
}));
