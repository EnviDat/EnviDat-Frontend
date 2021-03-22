import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import NoSearchResultsView from '@/components/Filtering/NoSearchResultsView';
import categoryCards from '@/modules/metadata/store/categoryCards';

export const methods = {
  onClick: action('clicked on card'),
};

storiesOf('4 Filtering / NoSearchResultsView ', module).add('NoSearchResultView', () => ({
  components: { NoSearchResultsView },
  template: `
    <v-row>
      <v-col cols="12" class="pa-2">
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
  }),
}));
