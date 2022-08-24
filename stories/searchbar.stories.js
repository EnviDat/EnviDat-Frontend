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

import SearchBarView from '@/modules/home/components/SearchBarView';
import SmallSearchBarView from '../src/components/Filtering/SmallSearchBarView';
import { FILTERING_VIEWS } from './storybookFolder';

export default {
  title: `${FILTERING_VIEWS} / SearchBarView`,
  decorators: [],
  parameters: {
  },
};

export const BasicSearchViews = () => ({
    components: { SearchBarView },
    template: `
    <search-bar-view labelText="Search for something"
                    buttonText="SEARCH"
                    hasButton
                    @clicked="onClick"
                    @searchCleared="onClear" />`,
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

export const SmallSearchViews = () => ({
    components: { SmallSearchBarView },
    template: `
    <v-row >
        <v-col class="py-1">
            <small-search-bar-view
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
            <small-search-bar-view
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
                <small-search-bar-view
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
                <small-search-bar-view
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
                <small-search-bar-view
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
                <small-search-bar-view
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
