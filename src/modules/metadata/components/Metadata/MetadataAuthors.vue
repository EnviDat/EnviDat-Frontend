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
                    class="pa-0 heightAndScroll" >

        <v-row no-gutters >

          <v-col v-for="author in authors"
                  :key="author.fullName"
                  cols="12" sm="6"
                  class="pa-2" >

            <author-card :author="author"
                          :authorDetailsConfig="authorDetailsConfig"
                          :asciiDead="authorDeadInfo ? authorDeadInfo.asciiDead : ''"
                          :authorPassedInfo="authorDeadInfo ? authorDeadInfo.authorPassedInfo : ''" />

          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-text v-if="!showPlaceholder && !hasAuthors"
                  :style="`color: ${emptyTextColor};`"
                  class="pa-4 pt-0 readableText" >
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
  METADATA_AUTHORS_TITLE,
} from '@/factories/metadataConsts';

import AuthorCard from '@/modules/metadata/components/AuthorCard';
import AuthorCardPlaceholder from '@/modules/metadata/components/AuthorCardPlaceholder';

export default {
  name: 'MetadataAuthors',
  components: {
    AuthorCard,
    AuthorCardPlaceholder,
  },
  props: {
    genericProps: Object,
    showPlaceholder: Boolean,
    authorDeadInfo: Object,
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
  data: () => ({
    showAuthors: false,
    checkedGenericProps: false,
    observer: null,
    METADATA_AUTHORS_TITLE,
  }),
  computed: {
    authors() {
      return this.mixinMethods_getGenericProp('authors');
    },
    authorDetailsConfig() {
      return this.mixinMethods_getGenericProp('authorDetailsConfig', {});
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
  },
  methods: {
  },
};
</script>

<style scoped>

  .heightAndScroll {
    max-height: 750px;
    overflow-y: auto !important;
    scrollbar-width: thin;
  }

</style>
