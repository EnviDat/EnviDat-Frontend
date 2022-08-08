<template v-slot:controlPanel>
  <v-card :style="`height: ${fixedHeight}px;`"
            id="controlPanel" >

    <v-container class="px-2 py-0 fill-height"
                    fluid> 
      <v-row align="center"
              justify="space-between"
              no-gutters>

        <v-col class="py-0"
              cols="12" sm="10" md="9" lg="9">
          <small-search-bar-view class="elevation-0"
                                  :compactLayout="compactLayout"
                                  :searchTerm="searchTerm"
                                  :showSearch="showSearch"
                                  :showSearchCount="true"
                                  :searchCount="searchCount"
                                  :isFlat="true"
                                  :fixedHeight="fixedHeight"
                                  :labelText="searchBarPlaceholder"
                                  :loading="loading"
                                  @clicked="catchSearchClicked"
                                  @searchCleared="catchSearchCleared" />
        </v-col>


<!--        <v-col>-->
<!--          <v-switch-->
<!--              v-model="switch1"-->
<!--              :label="`Switch 1: ${switch1.toString()}`"-->
<!--          ></v-switch>-->
<!--        </v-col>-->



        <v-col class="py-0 shrink" >

          <BaseIconButton style="opacity: 0.8;"
                          materialIconName="share"
                          iconColor="black"
                          isSmall
                          tooltipBottom
                          tooltipText="Copy the url to this view to the clipboard to share it."
                          @clicked="catchShareClick"
                          />

        </v-col>


<!--        <v-col class="py-0 shrink fill-height" >-->
<!--        <v-col>-->
<!--          <v-card outlined-->
<!--                  class="d-flex pa-2">-->
<!--            <v-checkbox-->
<!--                v-model="checkbox"-->
<!--                dense-->
<!--                :label="`Checkbox 1: ${checkbox.toString()}`"-->
<!--            ></v-checkbox>-->

<!--          </v-card>-->


<!--        </v-col>-->


<!--        <v-col class="py-0 ml-4">-->
<!--        TODO replace hard-coded height and fix layout of checkbox element -->
<!--        TODO handle smaller screens for checkbox element-->
        <v-col class="py-0 ml-4">
            <v-checkbox
                :style="`height: ${28}px;`"
                v-model="isAuthorSearch"
                dense
                :flat="true"
                :label="`Author Search`"
            ></v-checkbox>
<!--          @change="catchAuthorSearch"-->
        </v-col>



        <v-col class="hidden-xs-only py-0 fill-height" >
          <list-control-toggle :style="`height: ${fixedHeight}px;`"
                                :controls="controlsActive"
                                :enabledControls="enabledControls"
                                :flat="true"
                                @controlsChanged="catchControlClick" />
        </v-col>
      </v-row>


<!--      <v-row align="center"-->
<!--             justify="space-between"-->
<!--             no-gutters>-->
<!--        <v-col cols="12">-->
<!--            <v-switch-->
<!--                v-model="switch1"-->
<!--                :label="`Switch 1: ${switch1.toString()}`"-->
<!--            ></v-switch>-->
<!--        </v-col>-->
<!--      </v-row>-->


    </v-container>
  </v-card>
</template>

<script>
/**
 * MetadataList.vue uses the FilterKeywordView, FilterMapView and the ControlPanelView
 * to create a List of metadata cards which can be filtered via the mentioned
 * filtering components.
 *
 * @summary filterable list of metadata cards
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-07 11:40:00
 * Last modified  : 2020-07-07 11:44:32
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import SmallSearchBarView from '@/components/Filtering/SmallSearchBarView';
import ListControlToggle from '@/components/Filtering/ListControlToggle';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import { BROWSE_PATH } from '@/router/routeConsts';
import { mapGetters } from 'vuex';import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

export default {
  name: 'MetadataList',
  props: {
    compactLayout: Boolean,
    fixedHeight: Number,
    controlsActive: Array,
    enabledControls: Array,
    loading: Boolean,
    showSearch: Boolean,
    searchTerm: String,
    searchCount: Number,
    searchBarPlaceholder: String,
  },
  components: {
    SmallSearchBarView,
    ListControlToggle,
    BaseIconButton,
  },
  data: () => ({
    // switch1: true,
    isAuthorSearch: false,
  }),
  methods: {
    // catchAuthorSearch(isAuthorSearch) {
    //
    //   console.log(this.isAuthorSearch);
    //
    //   // TODO possibly emit isAuthorSearch and send to smallsearchbarview, adjust method in that component
    //   // this.$emit('isAuthorSearch', isAuthorSearch);
    //
    //   // console.log('EXECUTED: catchAuthorSearch()');
    //   //
    //   // console.log(this.searchTerm);
    //
    //   // const query = {
    //   //   givenName: authorGivenName,
    //   //   lastName: authorLastName,
    //   //   // isAuthorSearch: true,   // TODO determine if isAuthorSearch boolean is needed
    //   // };
    //   //
    //   // this.$router.push({
    //   //   path: BROWSE_PATH,
    //   //   query,
    //   // });
    //
    // },
    // TODO try instead emitting query object or search to authorSearch(queryObj) in BrowsePage.vue
    // TODO check previous version of catchSearchClicked
    catchSearchClicked(search) {

      console.log(`SEARCH TERM  ${this.searchTerm}`);

      // TODO check if this is still needed
      // this.$emit('searchClick', search, this.isAuthorSearch);
      // this.$emit('searchClick', search);

      // TODO add condition that author search is selected
      if (this.isAuthorSearch) {

        // console.log(search);
        // console.log(`this.isAuthorSearch ${this.isAuthorSearch}`);

        const searchSplit = search.split(' ')
        console.log(searchSplit);

        const givenNameSearchParameter = searchSplit[0];

        let lastNameSearchParameter = '';
        if (searchSplit.length > 1) {
          lastNameSearchParameter = searchSplit[searchSplit.length -1]
        }

        // TODO write computed properties that check given and last name search parameters against current state
        // TODO (see BrowsePage.vue for example) before pushing to browse page
        // Push query to browse path if it is not identical to current query name keys
        if (givenNameSearchParameter !== this.givenNameAuthorSearch || lastNameSearchParameter !== this.lastNameAuthorSearch) {

          const query = {
            givenName: givenNameSearchParameter,
            lastName: lastNameSearchParameter,
          };

          console.log(query);

          this.$router.push({
            path: BROWSE_PATH,
            query,
          });
        }

      } else if (search !== this.searchTerm) {
          console.log('NOT AUTHOR SEARCH')
          this.$emit('searchClick', search);
      }

      // else {
      //   console.log('NOT AUTHOR SEARCH')
      //   this.$emit('searchClick', search);
      // }



    },
    catchSearchCleared() {
      this.$emit('searchCleared');
    },
    catchControlClick(number) {
      this.$emit('controlsChanged', number);
    },
    catchShareClick() {
      const url = `${process.env.VUE_APP_ENVIDAT_PROXY}/#${this.$route.fullPath}`;

      navigator.clipboard.writeText(url);
    },
  },
  computed: {
    ...mapGetters({
      givenNameAuthorSearch: `${METADATA_NAMESPACE}/givenNameAuthorSearch`,
      lastNameAuthorSearch: `${METADATA_NAMESPACE}/lastNameAuthorSearch`,
    }),
  },
};

</script>
