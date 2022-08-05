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
    catchAuthorSearch() {
      console.log(this.isAuthorSearch);
      // TODO emit isAuthorSearch and send to smallsearchbarview, adjust method in that component
    },
    catchSearchClicked(search) {
      this.$emit('searchClick', search);
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
};

</script>
