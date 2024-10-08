<template>
  <v-card raised id="FilterKeywordsView">
    <v-container class="pa-2 fill-height" fluid>
      <v-row class="fill-height" :no-gutters="$vuetify.breakpoint.smAndUp">
        <v-col v-if="!filterExpanded" class="hidden-sm-and-up px-2" cols="12">
          <div class="mx-3">Filter for Keywords</div>
        </v-col>

        <v-col v-if="filterExpanded || $vuetify.breakpoint.smAndUp" cols="12">
          <v-row>
            <v-col class="metadataInfoIcon shrink">
              <v-icon size="24px" color="black">style</v-icon>
            </v-col>

            <v-col v-if="showPlaceholder" class="grow pl-0">
              <tag-chip-placeholder
                v-for="n in 6"
                :key="n"
                class="envidatChip"
              />
            </v-col>

            <v-col v-if="!showPlaceholder" class="grow pl-0">
              <tag-chip
                v-for="tag in tagList"
                :key="tag.name"
                :name="tag.count ? `${tag.name} (${tag.count})` : tag.name"
                :selectable="tag.enabled"
                :highlighted="tag.active"
                :closeable="tag.active"
                :color="tag.color"
                @clickedClose="catchTagCloseClicked(tag.name)"
                @clicked="tag.active ? catchTagCloseClicked(tag.name) : catchTagClicked(tag.name)"
              />
            </v-col>
          </v-row>
        </v-col>

      </v-row>
    </v-container>

    <base-icon-button
      v-if="$vuetify.breakpoint.xsOnly"
      :count="selectedTags.length"
      style="position: absolute; bottom: 0; right: 0;"
      material-icon-name="expand_more"
      color="secondary"
      icon-color="secondary"
      class="ma-1"
      :outlined="true"
      :is-small="true"
      :rotate-on-click="true"
      :rotate-toggle="filterExpanded"
      @clicked="catchExpandClicked"
    />
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
 * Last modified  : 2021-01-07 08:31:30
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import TagChip from '@/components/Chips/TagChip.vue';
import TagChipPlaceholder from '@/components/Chips/TagChipPlaceholder.vue';

import { createTag } from '@/factories/keywordsFactory';

export default {
  name: 'FilterKeywordsSingleView',
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
    tagList() {
      const mergedTags = [...this.selectedTags, ...this.unselectedTags];
      return mergedTags.filter((item, pos, self) => self.findIndex(v => v.name === item.name) === pos);
    },
    selectedTags() {
      // always get the selected as a subset of the allTags because they are the full
      // tag JSON object
      const selecteds = [];

      if (this.selectedTagNames?.length > 0) {

        for (let i = 0; i < this.selectedTagNames.length; i++) {
          const element = this.selectedTagNames[i];

          selecteds.push(createTag(element, { enabled: true, active: true }));
        }
      }

      // return selecteds.toSpliced(0, this.maxTagNumber(this.selectedTagNames));
      return selecteds;
    },
    unselectedTags() {
      if (!this.allTagWithMax){
        return [];
      }

      if(!this.selectedTagNames || this.selectedTagNames.length <= 0) {
        return this.allTagWithMax;
      }

      const topList = this.allTagWithMax;
      return topList.filter((element) => element.enabled && this.selectedTagNames.indexOf(element.name) >= 0);
    },
    allTagWithMax() {
      return this.allTags?.toSpliced(0, this.maxTagNumber(this.minTagCountToBeVisible));
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

      const maxNumber = this.getTagMaxAmount(this.allTags, maxTextLength);
      const combinedMax = maxNumber - this.selectedTags.length;

      return combinedMax >= 0 ? combinedMax : 0;
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
  beforeMount() {
    this.tagIcon = this.mixinMethods_getIcon('tag');
    this.tagsIcon = this.mixinMethods_getIcon('tags');
  },
  methods: {
    maxTagNumber(list) {
      return this.getTagMaxAmount(list, this.minTagCountToBeVisible);
    },
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
    getTagMaxAmount(list, maxTextLength) {
      let textLength = 0;
      let numberOfTags = 0;

      if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const tag = list[i];
          const tagName = tag?.name ? tag.name : tag;

          if (tagName) {
            textLength += tagName.length + 1;

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

  },
};
</script>
