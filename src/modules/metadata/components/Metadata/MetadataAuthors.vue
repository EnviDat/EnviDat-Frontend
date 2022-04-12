<template>
  <v-card id="MetadataAuthors"
          ref="MetadataAuthors">

    <v-card-title class="title metadata_title">
      {{ METADATA_AUTHORS_TITLE }}
    </v-card-title>

    <v-card-text v-if="showPlaceholder && !hasAuthors"
                  class="pa-2 pt-0" >
      <v-container fluid
                    class="pa-0" >
        <v-row no-gutters >
          <v-col v-for="n in 2"
                    :key="n"
                    cols="12" sm="6"
                    class="pa-2" >

            <author-card-placeholder />

          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-text v-if="showAuthors && !showPlaceholder && hasAuthors"
                  class="pa-2 pt-0" >
      <v-container fluid
                    :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
                    class="pa-0 heightAndScroll" >

        <v-row no-gutters >

          <v-col v-for="author in authors"
                  :key="author.fullName"
                  cols="12" sm="6"
                  class="pa-2" >

            <slot name="editingAuthors"
                  :author="author"
                  />

            <AuthorCard v-if="!hasEditingAuthorsSlot"
                        :author="author"
                        :authorDetailsConfig="authorDetailsConfig"
                        :asciiDead="authorDeadInfo ? authorDeadInfo.asciiDead : ''"
                        :authorPassedInfo="authorDeadInfo ? authorDeadInfo.authorPassedInfo : ''"
                        :showGenericOpenButton="author.openEvent ? true : false"
                        :openButtonTooltip="author.openButtonTooltip"
                        :openButtonIcon="author.openButtonIcon"
                        :isSelected="author.isSelected"
                        :loading="author.loading"
                        @openButtonClicked="catchOpenClick(author.openEvent, author.openProperty)" >

              <template v-if="hasDataCredits(author.currentDataCredits)"
                        #dataCreditCurrentDataset >
                <DataCreditLayout class="px-0 py-1 readableText"
                                  :dataCredit="author.currentDataCredits"
                                  :badgesLabel="AUTHORS_DATACREDIT_CONTRIBUTION_CURRENT"
                                  noCreditslabel="AUTHORS No data credit declarations for this dataset"
                                  iconColor="white"
                                  badgeColor="#384753"
                                  :dark="true" />

              </template>

            </AuthorCard>

          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-text v-if="!showPlaceholder && !hasAuthors"
                  :style="`color: ${emptyTextColor};`"
                  class="pa-4 pt-0" >
      {{ emptyText }}
    </v-card-text>


  </v-card>
</template>

<script>
/**
 * MetadataAuthors.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-10-20 15:21:51
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  AUTHORS_DATACREDIT_CONTRIBUTION_CURRENT,
  METADATA_AUTHORS_TITLE,
} from '@/factories/metadataConsts';

import AuthorCard from '@/modules/metadata/components/AuthorCard';
import AuthorCardPlaceholder from '@/modules/metadata/components/AuthorCardPlaceholder';
import { eventBus } from '@/factories/eventBus';
import DataCreditLayout from '@/components/Layouts/DataCreditLayout';

export default {
  name: 'MetadataAuthors',
  components: {
    AuthorCard,
    AuthorCardPlaceholder,
    DataCreditLayout,
  },
  props: {
    genericProps: Object,
    showPlaceholder: Boolean,
  },
  mounted() {
    const options = this.options || {};

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        this.showAuthors = true;
      }
    }, options);

    this.observer.observe(this.$el);
  },
  destroyed() {
    this.observer.disconnect();
    this.showAuthors = false;
  },
  computed: {
    hasEditingAuthorsSlot() {
      // console.log(this.$slots);
      // console.log(this.$scopedSlots);
      return !!this.$scopedSlots.editingAuthors;
    },
    authors() {
      return this.mixinMethods_getGenericProp('authors');
    },
    authorDetailsConfig() {
      return this.mixinMethods_getGenericProp('authorDetailsConfig', {});
    },
    authorDeadInfo() {
      return this.mixinMethods_getGenericProp('authorDeadInfo', {});
    },
    hasAuthors() {
      return this.authors && this.authors.length > 0;
    },
    emptyTextColor() {
      return this.mixinMethods_getGenericProp('emptyTextColor', 'red');
    },
    emptyText() {
      return this.mixinMethods_getGenericProp('emptyText', 'No authors found for this dataset.');
    },
    scrollbarColorFront() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.highlight : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  methods: {
    hasDataCredits(dataCredits) {
      if (!dataCredits) {
        return false;
      }

      return Object.keys(dataCredits).length > 0;
    },
    catchOpenClick(event, eventProperty) {
      eventBus.$emit(event, eventProperty);
    },
  },
  data: () => ({
    showAuthors: false,
    checkedGenericProps: false,
    observer: null,
    METADATA_AUTHORS_TITLE,
    AUTHORS_DATACREDIT_CONTRIBUTION_CURRENT,
  }),
};
</script>

<style scoped>

  .heightAndScroll {
    max-height: 750px;
    overflow-y: auto !important;
    scrollbar-width: thin;
  }

</style>
