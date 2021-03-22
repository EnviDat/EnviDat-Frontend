<template>
  <v-card raised
          id="FilterKeywordsView" >

    <v-container class="pa-2 fill-height"
                fluid >
      <v-row class="fill-height" >

        <v-col v-if="!filterExpanded"
                class="hidden-sm-and-up px-2 py-0"
                cols="12" >
          <div class="mx-3">Filter for Keywords</div>
        </v-col>

        <v-col v-if="filterExpanded || $vuetify.breakpoint.smAndUp"
                class="py-0"
                cols="12" >
          <v-row >

            <v-col class="py-0 metadataInfoIcon shrink" >
              <v-img :src="tagsIcon" height="24" width="24" />
            </v-col>

            <v-col v-if="showPlaceholder"
                    class="py-0 grow" >

              <tag-chip-placeholder v-for="n in 6"
                                    :key="n"
                                    class="envidatChip" />
            </v-col>

            <v-col v-if="!showPlaceholder"
                    class="py-0 grow" >

              <tag-chip v-for="tag in unselectedTags"
                        :key="tag.name"
                        :name="tag.name"
                        :selectable="tag.enabled"
                        :highlighted="false"
                        :closeable="false"
                        :color="tag.color"
                        @clicked="catchTagClicked($event, tag.name)" />
            </v-col>
          </v-row>
        </v-col>

        <v-col v-if="filterExpanded || $vuetify.breakpoint.smAndUp"
                class="py-0"
                cols="12" >
          <v-row >

            <v-col class="metadataInfoIcon pb-0 shrink" >
              <v-img :src="tagIcon" height="24" width="24" />
            </v-col>

            <v-col v-if="selectedTags.length > 0"
                    class="pb-0 grow" >

              <tag-chip v-for="tag in selectedTags"
                        :key="tag.name"
                        :name="tag.name"
                        :selectable="true"
                        :highlighted="true"
                        :closeable="true"
                        @clickedClose="catchTagCloseClicked($event, tag.name)"
                        @clicked="catchTagCloseClicked($event, tag.name)" />
            </v-col>

          </v-row>
        </v-col>
      </v-row>
    </v-container>

      <base-icon-button
        v-if="$vuetify.breakpoint.xsOnly"
        :count="selectedTags.length"
                        style="position: absolute; bottom: 0px; right: 0px;"
                        material-icon-name="expand_more"
                        color="secondary"
                        icon-color="secondary"
                        class="ma-1"
                        :outlined="true"
                        :is-small="true"
                        :rotate-on-click="true"
                        :rotate-toggle="filterExpanded"
                        @clicked="catchExpandClicked" />
  </v-card>
</template>

<script>
/**
 * FilterKeywordsView.vue show a two lists of tags for filterting
 * the metadata list. 1st is the avaiable tags of the current list content.
 * The 2nd is the currently selected tags for filtering.
 *
 * @summary view of two lists of tags
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2019-10-23 18:16:33
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { createTag } from '@/factories/metadataFilterMethods';

import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import TagChip from '@/components/Cards/TagChip';
import TagChipPlaceholder from '@/components/Cards/TagChipPlaceholder';

export default {
  name: 'FilterKeywordsView',
  components: {
    BaseIconButton,
    TagChip,
    TagChipPlaceholder,
  },
  props: {
    selectedTagNames: Array,
    allTags: Array,
    // expanded: Boolean,
    // expandButtonText: String,
    // expandedButtonText: String,
    showPlaceholder: Boolean,
    compactLayout: Boolean,
  },
  data: () => ({
    maxSelectedTagsTextLength: 25,
    maxUnselectedTagsTextLength: 250,
    xsTextLength: 25,
    smTextLength: 50,
    mdTextLength: 65,
    tagIcon: null,
    tagsIcon: null,
    filterExpanded: false,
  }),
  computed: {
    unselectedTags() {
      const unselectedTags = [];

      this.allTags.forEach((element) => {
        if (element.enabled && !this.mixinMethods_isTagSelected(element.name)) {
          unselectedTags.push(element);
        }
      });

      return unselectedTags;
    },
    selectedTags() {
      // always get the selected as a subset of the allTags because they are the full
      // tag JSON object
      const selecteds = [];

      if (this.selectedTagNames !== undefined && this.selectedTagNames.length > 0) {
        for (let i = 0; i < this.selectedTagNames.length; i++) {
          const element = this.selectedTagNames[i];

          selecteds.push(createTag(element, { enabled: true }));
        }
      }

      return selecteds;
    },
    maxTagNumber() {
      return this.getTagMaxAmout(this.selectedTags, this.maxSelectedTagsTextLength);
    },
    maxUnselectedTagNumber() {
      let maxTextLength = this.maxUnselectedTagsTextLength;

      if (this.$vuetify.breakpoint.xsOnly) {
        maxTextLength = this.xsTextLength;
      } else if (this.$vuetify.breakpoint.smAndDown) {
        maxTextLength = this.smTextLength;
      } else if (this.$vuetify.breakpoint.mdAndDown) {
        maxTextLength = this.mdTextLength;
      } else if (this.$vuetify.breakpoint.lgAndDown) {
        maxTextLength = this.mdTextLength;
      }

      const maxNumber = this.getTagMaxAmout(this.allTags, maxTextLength);
      const combinedMax = maxNumber - this.selectedTags.length;

      return combinedMax >= 0 ? combinedMax : 0;
    },
  },
  beforeMount: function beforeMount() {
    this.tagIcon = this.mixinMethods_getIcon('tag');
    this.tagsIcon = this.mixinMethods_getIcon('tags');
  },
  methods: {
    clearTags() {
      this.$emit('clickedClear');
    },
    isCleanTag(tagName) {
      let maxWordsPerTag = 3;

      if (this.$vuetify.breakpoint.xsOnly) {
        maxWordsPerTag = 2;
      } else if (this.$vuetify.breakpoint.smAndDown) {
        maxWordsPerTag = 20;
      }

      return tagName.split(' ').length <= maxWordsPerTag;
    },
    getTagMaxAmout(list, maxTextLength) {
      let textLength = 0;
      let numberOfTags = 0;

      if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const tag = list[i];

          if (tag) {
            textLength += tag.name.length + 1;

            if (textLength >= maxTextLength) {
              break;
            }

            numberOfTags++;
          }
        }
      }

      // console.log("numberOfTags " + numberOfTags + " " + textLength);
      return numberOfTags;
    },
    catchExpandClicked() {
      this.filterExpanded = !this.filterExpanded;
      // this.$emit('clickedExpand');
    },
    catchTagClicked(tagId) {
      this.$emit('clickedTag', tagId);
    },
    catchTagCloseClicked(tagId) {
      this.$emit('clickedTagClose', tagId);
    },
    minTagCountToBeVisible() {
      let minCount = 5;

      if (this.$vuetify.breakpoint.xsOnly) {
        minCount = 25;
      } else if (this.$vuetify.breakpoint.smAndDown) {
        minCount = 20;
      } else if (this.$vuetify.breakpoint.mdAndDown) {
        minCount = 10;
      }

      return minCount;
    },
  },
};
</script>
