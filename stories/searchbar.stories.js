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

// /* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import SearchBarView from '@/modules/home/components/SearchBarView.vue';
import SmallSearchBarView from '../src/components/Filtering/SmallSearchBarView.vue';


storiesOf('4 Filtering / SearchBarView', module)
  .add('basic', () => ({
    components: { SearchBarView },
    template: `
    <search-bar-view labelText="Search for something"
                    buttonText="SEARCH"
                    hasButton
                    @clicked="onClick"
                    @searchCleared="onClear" />`,
    methods: {
      onClick(searchTerm) {
        action(`clicked search for "${searchTerm}"`);
      },
      onClear() {
        action('cleared Search')(this.searchTerm = '');
      },
    },
    data: () => ({
      searchTerm: '',
    }),
  }))
  .add('small', () => ({
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
      onClick(search) {
        action(`clicked search for "${search}"`);
      },
      onClear() {
        action('cleared Search')(this.searchTerm = '');
      },
    },
    data: () => ({
      searchTerm: '',
    }),
  }));
