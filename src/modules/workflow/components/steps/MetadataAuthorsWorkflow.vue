<template>
  <v-card id="MetadataAuthors" ref="MetadataAuthors" class="rounded-lg mt-lg-6">
    <v-card-title class="py-4">
      <v-row no-gutters>
        <v-row class="mb-2">
          <v-col>
            <div style="font-size: 1rem" class="font-weight-bold">
              {{ METADATA_AUTHORS_TITLE }}
            </div>
          </v-col>
        </v-row>

        <v-col v-if="showFullscreenButton && hasAuthors" class="flex-grow-0">
          <BaseIconButton
            :icon="mdiArrowExpandAll"
            outlined
            outline-color="secondary"
            icon-color="black"
            @clicked="triggerFullscreen"
          />
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="showPlaceholder" class="pa-2 pt-0">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col v-for="n in 2" :key="n" cols="12" sm="6" class="pa-2">
            <author-card-placeholder />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-text v-if="showAuthors && !showPlaceholder && hasAuthors" class="pa-2 pt-0">
      <v-container fluid class="pa-0 heightAndScroll" :style="containerStyle">
        <v-row no-gutters>
          <v-col v-for="author in authors" :key="author.fullName" cols="12" v-bind="listLayout" class="pa-2">
            <slot name="editingAuthors" v-bind="author" />

            <AuthorCard
              v-if="!hasEditingAuthorsSlot"
              :author="author"
              :hideDataCredit="true"
              :authorDetailsConfig="authorDetailsConfig"
              :showGenericOpenButton="!!author.openEvent"
              :openButtonTooltip="author.openButtonTooltip"
              :openButtonIcon="author.openButtonIcon"
              :isSelected="author.isSelected"
              :loading="author.loading"
              :overrideAuthorInfosExpanded="!showFullscreenButton"
              @openButtonClicked="catchOpenClick(author.openEvent, author.openProperty)"
              @catchSearchAuthor="catchAuthorSearchClick(author.fullName)"
            >
              <template v-if="hasDataCredits(author.dataCredit)" #dataCreditCurrentDataset>
                <ActiveDataCredits
                  class="px-0 py-1 readableText"
                  :dataCredit="author.dataCredit"
                  :instruction="AUTHORS_DATACREDIT_CONTRIBUTION_CURRENT"
                  :authorName="author.fullName"
                />
              </template>
            </AuthorCard>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-text v-if="!showPlaceholder && !hasAuthors" :style="`color: ${emptyTextColor};`" class="pa-4 pt-0">
      {{ emptyText }}
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * MetadataAuthors.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the authors of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-10-20 15:21:51
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mdiArrowExpandAll } from '@mdi/js';
import { defineAsyncComponent, markRaw } from 'vue';
import { AUTHORS_DATACREDIT_CONTRIBUTION_CURRENT, METADATA_AUTHORS_TITLE } from '@/factories/metadataConsts';

import AuthorCard from '@/modules/metadata/components/AuthorCard.vue';
import AuthorCardPlaceholder from '@/modules/metadata/components/AuthorCardPlaceholder.vue';
import { AUTHOR_SEARCH_CLICK, eventBus, INJECT_GENERIC_COMPONENT } from '@/factories/eventBus';
import ActiveDataCredits from '@/modules/user/components/edit/ActiveDataCredits.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

const MetadataAuthorsAsync = defineAsyncComponent(
  () => import('@/modules/metadata/components/Metadata/MetadataAuthors.vue'),
);

export default {
  name: 'MetadataAuthors',
  props: {
    authors: {
      type: Array,
      default: undefined, // () => [],
    },
    authorDetailsConfig: {
      type: Object,
      default: () => {},
    },
    emptyTextColor: {
      type: String,
      default: 'red',
    },
    compactList: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: 'No authors found for this dataset.',
    },
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
    showFullscreenButton: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    const options = this.options || {};

    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        this.showAuthors = true;
      }
    }, options);

    this.observer.observe(this.$el);
  },
  unmounted() {
    this.observer.disconnect();
    this.showAuthors = false;
  },
  computed: {
    containerStyle() {
      const scrollCol = `scrollbar-color: ${this.scrollbarColorFront} ${this.scrollbarColorBack};`;
      // const maxH = this.showFullscreenButton ? '750px' : '100%';
      const maxH = '750px';
      return `${scrollCol} max-height: ${maxH};`;
    },
    listLayout() {
      return this.compactList
        ? {
            sm: 6,
          }
        : {
            xl: 6,
          };
    },
    hasEditingAuthorsSlot() {
      // correct refactoring??
      // check https://v3-migration.vuejs.org/breaking-changes/slots-unification.html#_3-x-syntax
      const slotAmount = Object.values(this.$slots).length;
      return slotAmount > 0 && !!this.$slots.editingAuthors();
    },
    hasAuthors() {
      return this.authors?.length > 0;
    },
    scrollbarColorFront() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.colors.highlight : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  methods: {
    hasDataCredits(dataCredit) {
      if (!dataCredit) {
        return false;
      }

      return Object.keys(dataCredit).length > 0;
    },
    catchOpenClick(event, eventProperty) {
      eventBus.emit(event, eventProperty);
    },
    catchAuthorSearchClick(fullName) {
      eventBus.emit(AUTHOR_SEARCH_CLICK, fullName);
    },
    triggerFullscreen() {
      eventBus.emit(INJECT_GENERIC_COMPONENT, {
        asyncComponent: markRaw(MetadataAuthorsAsync),
        props: {
          ...this.$props,
          // don't show the fullscreen button again to avoid recursion
          showFullscreenButton: false,
        },
      });
    },
  },
  components: {
    ActiveDataCredits,
    AuthorCard,
    AuthorCardPlaceholder,
    BaseIconButton,
  },
  data: () => ({
    mdiArrowExpandAll,
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
