<template>
  <v-card elevation="8" id="FilterKeywordsView">
    <v-container class="pa-2 fill-height" fluid>
      <v-row class="fill-height" :no-gutters="$vuetify.display.smAndUp">
        <v-col v-if="!filterExpanded" class="hidden-sm-and-up px-2" cols="12">
          <div class="mx-3">Filter for Keywords</div>
        </v-col>

        <v-col v-if="filterExpanded || $vuetify.display.smAndUp" cols="12">
          <v-row>
            <v-col class="metadataInfoIcon flex-grow-0">
              <BaseIcon :icon="mdiPaletteSwatch" color='black' />
            </v-col>

            <v-col v-if="showPlaceholder" class="flex-grow-1 pl-0">
              <v-row no-gutters >
                <v-col v-for="n in 6"
                       :key="n"
                       class="flex-grow-0"
                >
                  <TagChipPlaceholder class="envidatChip" />
                </v-col>
              </v-row>
            </v-col>

            <v-col v-if="!showPlaceholder" class="flex-grow-1 pl-0">
              <TagChip
                v-for="tag in unselectedTags"
                :key="tag.name"
                :name="tag.count ? `${tag.name} (${tag.count})` : tag.name"
                :selectable="tag.enabled"
                :highlighted="false"
                :closeable="false"
                :color="tag.color"
                @clicked="catchTagClicked(tag.name)"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col
          v-if="filterExpanded || $vuetify.display.smAndUp"
          class="pt-1"
          cols="12"
        >
          <v-row>
            <v-col class="metadataInfoIcon flex-grow-0">
              <BaseIcon :icon="mdiTagMultiple" color='black' />
            </v-col>

            <v-col v-if="selectedTags.length > 0" class="flex-grow-1 pl-0">
              <tag-chip
                v-for="tag in selectedTags"
                :key="tag.name"
                :name="tag.name"
                :selectable="true"
                :highlighted="true"
                :closeable="true"
                @clickedClose="catchTagCloseClicked(tag.name)"
                @clicked="catchTagCloseClicked(tag.name)"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <BaseIconButton
      v-if="$vuetify.display.xs"
      :count="selectedTags.length"
      style="position: absolute; bottom: 0; right: 0;"
      :icon="mdiChevronDown"
      outline-color="secondary"
      icon-color="secondary"
      class="ma-1"
      outlined
      small
      :rotated="filterExpanded"
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
import { mdiChevronDown, mdiPaletteSwatch, mdiTagMultiple } from '@mdi/js';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import TagChip from '@/components/Chips/TagChip.vue';
import TagChipPlaceholder from '@/components/Chips/TagChipPlaceholder.vue';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import { createTag } from '@/factories/keywordsFactory';
import { isTagSelected } from '@/factories/metaDataFactory';

export default {
  name: 'FilterKeywordsView',
  components: {
    BaseIcon,
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
    mdiChevronDown,
    mdiPaletteSwatch,
    mdiTagMultiple,
    maxSelectedTagsTextLength: 25,
    maxUnselectedTagsTextLength: 250,
    xsTextLength: 25,
    smTextLength: 50,
    mdTextLength: 65,
    filterExpanded: false,
  }),
  computed: {
    unselectedTags() {
      if (!this.allTagWithMax){
        return [];
      }

      const topList = this.allTagWithMax;
      return topList.filter((element) => element.enabled && !isTagSelected(element.name, this.selectedTagNames));
/*
      const unselectedTags = [];

      this.allTags.forEach(element => {
        if (element.enabled && !isTagSelected(element.name, this.selectedTagNames)) {
          unselectedTags.push(element);
        }
      });

      return unselectedTags;
*/
    },
    selectedTags() {
      // always get the selected as a subset of the allTags because they are the full
      // tag JSON object
      const selecteds = [];

      if (this.selectedTagNames !== undefined
          && this.selectedTagNames.length > 0) {

        for (let i = 0; i < this.selectedTagNames.length; i++) {
          const element = this.selectedTagNames[i];

          selecteds.push(createTag(element, { enabled: true }));
        }
      }

      return selecteds.toSpliced(0, this.maxTagNumber(this.selectedTagNames));
    },
    allTagWithMax() {
      return this.allTags?.toSpliced(0, this.maxTagNumber(this.minTagCountToBeVisible));
    },
    maxUnselectedTagNumber() {
      let maxTextLength = this.maxUnselectedTagsTextLength;

      if (this.$vuetify.display.xs) {
        maxTextLength = this.xsTextLength;
      } else if (this.$vuetify.display.smAndDown) {
        maxTextLength = this.smTextLength;
      } else if (this.$vuetify.display.mdAndDown) {
        maxTextLength = this.mdTextLength;
      } else if (this.$vuetify.display.lgAndDown) {
        maxTextLength = this.mdTextLength;
      }

      const maxNumber = this.getTagMaxAmount(this.allTags, maxTextLength);
      const combinedMax = maxNumber - this.selectedTags.length;

      return combinedMax >= 0 ? combinedMax : 0;
    },
    minTagCountToBeVisible() {
      let minCount = 5;

      if (this.$vuetify.display.xs) {
        minCount = 25;
      } else if (this.$vuetify.display.smAndDown) {
        minCount = 20;
      } else if (this.$vuetify.display.mdAndDown) {
        minCount = 10;
      }

      return minCount;
    },
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

      if (this.$vuetify.display.xs) {
        maxWordsPerTag = 2;
      } else if (this.$vuetify.display.smAndDown) {
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
