/**
 * @summary story of SearchBarView & SmallSearchBarView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-20 16:00:30
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';
import SmallSearchBarView from '../src/components/Filtering/SmallSearchBarView.vue';

export default {
  title: '2 Search / Small SearchBar View',
  component: SmallSearchBarView,
};

export const Basic = {
  args: {
    labelText: 'Search for something',
    buttonText: 'SEARCH',
  },
}

export const BasicSmallSearchBar = {
  args: {
    ...Basic.args,
    showSearch: true,
  },
};

export const SmallSearchBarButton = {
  args: {
    ...BasicSmallSearchBar.args,
    hasButton: true,
  },
};

export const SmallSearchBarButtonMobile = {
  args: SmallSearchBarButton.args,
  parameters: mobileViewportParams,
};

export const SmallSearchBarButtonLargeMobile = {
  args: SmallSearchBarButton.args,
  parameters: mobileLargeViewportParams,
};

export const SmallSearchBarButtonTablet = {
  args: SmallSearchBarButton.args,
  parameters: tabletViewportParams,
};


export const SmallSearchBarButtonCompact = {
  args: {
    ...SmallSearchBarButton.args,
    hasButton: true,
    compactLayout: true,
  },
};

export const SmallSearchBarSearchCountZero = {
  args: {
    ...SmallSearchBarButton.args,
    searchCount: 0,
    showSearchCount: true,
  },
};

export const SmallSearchBarSearchCount = {
  args: {
    ...SmallSearchBarSearchCountZero.args,
    searchCount: 123,
  },
};

export const SearchBarInFilterView = {
  args: {
    ...BasicSmallSearchBar.args,
    searchCount: 591,
    showSearchCount: true,
    compactLayout: true,
  },
};

export const SearchBarInFilterViewMobile = {
  args: SearchBarInFilterView.args,
  parameters: mobileViewportParams,
};

export const SearchBarInFilterViewLargeMobile = {
  args: SearchBarInFilterView.args,
  parameters: mobileLargeViewportParams,
};

export const SearchBarInFilterViewTablet = {
  args: SearchBarInFilterView.args,
  parameters: tabletViewportParams,
};




/*
export const SmallSearchViews = () => ({
    components: { SmallSearchBarView },
    template: `
    <v-row >
        <v-col class="py-1">
            <SmallSearchBarView
                        labelText="Search for something"
                        :searchTerm="searchTerm"
                        buttonText="SEARCH"
                        hasButton
                        :searchCount='0'
                        compactLayout
                        @clicked="onClick"
                        @searchCleared="onClear"
                          />
        </v-col>
        <v-col class="py-1">
            <SmallSearchBarView
                        labelText="Search for something"
                        :searchTerm="searchTerm"
                        buttonText="SEARCH"
                        :searchCount='0'
                        compactLayout
                        @clicked="onClick"
                        @searchCleared="onClear"
                          />
        </v-col>

        <v-col cols="12" class="py-1">
          <v-row>
            <v-col cols="6">
                <SmallSearchBarView
                            labelText="xs6 optimal for button search"
                            :searchTerm="searchTerm"
                            buttonText="SEARCH"
                            hasButton
                            showSearchCount
                            :searchCount='0'
                            compactLayout
                            @clicked="onClick"
                            @searchCleared="onClear"
                              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="py-1">
          <v-row >
            <v-col cols="6" class="px-1">
                <SmallSearchBarView
                            labelText="xs6 no button"
                            :searchTerm="searchTerm"
                            showSearchCount
                            :searchCount='123'
                            compactLayout
                            @clicked="onClick"
                            @searchCleared="onClear"
                              />
            </v-col>

            <v-col cols="6" class="px-1">
                <SmallSearchBarView
                            labelText="xs6 with compactLayout"
                            :searchTerm="searchTerm"
                            showSearchCount
                            :searchCount='12'
                            compactLayout
                            @clicked="onClick"
                            @searchCleared="onClear"
                            />
            </v-col>

            <v-col cols="6" class="px-1">
                <SmallSearchBarView
                            labelText="xs6 no compactLayout"
                            :searchTerm="searchTerm"
                            showSearchCount
                            :searchCount='0'
                            @clicked="onClick"
                            @searchCleared="onClear"
                              />
            </v-col>

          </v-row>
        </v-col>

      </v-row>`,
    methods: {
        onClick(searchTerm) {
            console.log(`clicked search for "${searchTerm}"`);
        },
        onClear() {
            console.log(`cleared Search ${this.searchTerm}`);
        },
    },
    data: () => ({
      searchTerm: '',
    }),
  });
*/
