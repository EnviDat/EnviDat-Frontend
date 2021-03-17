<template>
  <v-card id="MetadataHeader"
          :dark="dark"
          :color="(showPlaceholder || (!showPlaceholder && !metadataTitle)) ? 'primary' : 'white'" >

    <div v-bind="{['style'] : $vuetify.breakpoint.mdAndUp ? dynamicCardBackground : ''}" >
      <!-- this loads the background image -->
    </div>

    <base-icon-button class="ma-2"
                      :class="{ 'mx-1' : $vuetify.breakpoint.smAndDown }"
                      style="position: absolute; top: 0px; right: 0px; z-index: 2;"
                      material-icon-name="close"
                      icon-color="primary"
                      color="primary"
                      outlined
                      tool-tip-text="Close Metadata"
                      :tool-tip-bottom="true"
                      @clicked="catchBackClicked" />

    <v-container fluid
                  class="pa-4">
    <v-row no-gutters
            style="position: relative; z-index: 1;">

      <v-col v-if="metadataTitle"
              cols="12" >
        <div class="headerTitle"
              :class="{ 'py-0': $vuetify.breakpoint.smAndDown,
                        'display-2': $vuetify.breakpoint.xlAndUp,
                        'display-1': $vuetify.breakpoint.mdAndUp,
                        'headline': $vuetify.breakpoint.smOnly,
                        'subtitle-1': $vuetify.breakpoint.xsOnly,
                      }" >
          {{ metadataTitle }}
        </div>
      </v-col>

      <v-col v-if="!metadataTitle && !showPlaceholder"
              cols="12" >
        <div class="headerTitle py-3"
              :style="`color: ${$vuetify.theme.themes.light.error}`"
              :class="{ 'display-2': $vuetify.breakpoint.lgAndUp,
                        'display-1': $vuetify.breakpoint.mdAndDown,
                        'headline': $vuetify.breakpoint.smAndDown,
                      }" >
          {{ `${NotFoundTitle} '${metadataId}'` }}
        </div>
      </v-col>

      <v-col v-if="!metadataTitle && showPlaceholder"
              cols="12" >
        <div class="skeleton skeleton-size-big skeleton-color-concrete skeleton-animation-shimmer" >
          <div class="bone bone-type-multiline bone-style-steps" />
        </div>
      </v-col>
    </v-row>

    <v-expand-transition>
    <v-row v-show="expanded"
            no-gutters >
      <v-col cols="12">

        <v-row no-gutters
                style="position: relative; z-index: 1;">

          <v-col v-if="authors"
                  cols="12"
                  class="pa-0"
                  id="authors_divier"
                  key="authors_divier" >
            <v-divider :dark="dark"
                      :class="{ 'my-1': $vuetify.breakpoint.xsOnly,
                                'my-2': $vuetify.breakpoint.smAndUp }" />
          </v-col>

          <v-col v-if="authors"
                  cols="12"
                  class="py-0"
                  id="authors"
                  key="authors" >

            <v-row no-gutters
                    style="max-height: 100px; overflow-y: auto;" >
              <v-col v-for="(author, index) in authors"
                      :key="index"
                      :class="{
                        'pa-0': $vuetify.breakpoint.mdAndUp,
                        'py-1 px-0': $vuetify.breakpoint.smAndDown,
                      }"
                      class="shrink" >

                <tag-chip-author :name="authorName(author)"
                                  :tooltipText="authorToolTipText"
                                  :asciiDead="asciiDead"
                                  :authorPassedInfo="authorPassedInfo"
                                  @clicked="catchAuthorClicked(authorName(author))" />
              </v-col>
            </v-row>
          </v-col>

          <v-col v-if="!authors && showPlaceholder"
                  cols="12"
                  class="py-0"
                  id="authors_placeholder"
                  key="authors_placeholder" >
            <v-row no-gutters >
              <v-col>
                <tag-chip-placeholder v-for="n in 5"
                                      :key="n"
                                      class="headerTag" />
              </v-col>                                
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters
                style="position: relative; z-index: 1;">

          <v-col cols="12"
                  class="pa-0"
                  id="headerinfo_divier"
                  key="headerinfo_divier" >
            <v-divider :dark="dark"
                      :class="{ 'my-1': $vuetify.breakpoint.xsOnly,
                                'my-2': $vuetify.breakpoint.smAndUp }" />
          </v-col>
        </v-row>

        <v-row no-gutters
                id="headerinfos"
                key="headerinfos"
                style="position: relative; z-index: 1;">

          <v-col cols="12" sm="6" md="6" lg="3"
                class="headerInfo py-0" >
            <base-icon-label-view :text="contactName"
                                  :icon="contactIcon"
                                  icon-tooltip="Main contact"
                                  :compactLayout="$vuetify.breakpoint.xs"
                                  :align-left="$vuetify.breakpoint.smAndUp" />
          </v-col>

          <v-col cols="12" sm="6" md="6" lg="3"
                  class="headerInfo py-0" >
            <base-icon-label-view :text="contactEmail"
                                  :icon="mailIcon"
                                  icon-tooltip="Email adress of the main contact"
                                  :compactLayout="$vuetify.breakpoint.xs"
                                  :word-break="true"
                                  :align-left="$vuetify.breakpoint.smAndUp" />
          </v-col>

          <v-col cols="12" sm="6" md="6" lg="3"
                  class="headerInfo py-0" >
            <base-icon-label-view :text="doi"
                                  :url="doiUrl"
                                  :icon="doiIcon"
                                  icon-tooltip="Data Object Identifier"
                                  :compactLayout="$vuetify.breakpoint.xs"
                                  :word-break="true"
                                  :align-left="$vuetify.breakpoint.smAndUp" />
          </v-col>

          <v-col cols="12" sm="6" md="6" lg="3"
                  class="headerInfo py-0" >
            <base-icon-label-view :text="license"
                                  :icon="licenseIcon"
                                  icon-tooltip="License for the data files"
                                  :compactLayout="$vuetify.breakpoint.xs"
                                  :align-left="$vuetify.breakpoint.smAndUp" />
          </v-col>
        </v-row>

        <v-row no-gutters
                style="position: relative; z-index: 1;">

          <v-col v-if="!showPlaceholder && tags"
                  cols="12"
                  class="pa-0"
                  id="tags_divier"
                  key="tags_divier" >
            <v-divider :dark="dark"
                      :class="{ 'my-1': $vuetify.breakpoint.xsOnly,
                                'my-2': $vuetify.breakpoint.smAndUp }" />
          </v-col>

          <v-col v-if="tags"
                  cols="12"
                  class="py-0"
                  id="tags"
                  key="tags" >
            <v-row no-gutters >
              <v-col v-for="tag in slicedTags"
                      :key="tag.name"
                      class="shrink" >

                <tag-chip :name="tag.name"
                          :selectable="true"
                          class="headerTag"
                          :color="tag.color"
                          @clicked="catchTagClicked(tag.name)" />
              </v-col>

              <v-col v-if="maxTagsReached && !showTagsExpanded"
                      class="shrink" >
                <tag-chip class="headerTag shrink"
                          :name="'...'"
                          @click.native="showTagsExpanded = !showTagsExpanded" />
              </v-col>
            </v-row>
          </v-col>

          <v-col v-if="!tags && showPlaceholder"
                  cols="12"
                  class="py-0"
                  id="tags_placeholder"
                  key="tags_placeholder" >
            <v-row >
              <v-col v-for="tag in slicedTags"
                      :key="tag.name" >
              <tag-chip-placeholder v-for="n in 5"
                                    :key="n"
                                    class="headerTag" />
              </v-col>
            </v-row>
          </v-col>

        </v-row>

      </v-col>
    </v-row>
    </v-expand-transition>
    
    </v-container>

    <v-card-actions v-show="expanded"
                    style="position: absolute; bottom: 0px; right: 0px; z-index: 2;">
      <base-icon-button v-if="maxTagsReached"
                        materialIconName="expand_more"
                        color="primary"
                        :iconColor="showTagsExpanded ? 'accent' : 'primary'"
                        outlined
                        :rotateOnClick="true"
                        :rotateToggle="showTagsExpanded"
                        :tooltipText="showTagsExpanded ? 'Hide all tags' : 'Show all tags'"
                        :tooltipBottom="true"
                        @clicked="showTagsExpanded = !showTagsExpanded" />
    </v-card-actions>
  </v-card>
</template>

<script>
/**
 * MetadataHeader.vue shows the title, authors, keywords,
 * main contact, doi and license of a metadata entry.
 *
 * @summary shows the main infos the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-01-05 15:55:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import TagChip from '@/components/Cards/TagChip';
import TagChipPlaceholder from '@/components/Cards/TagChipPlaceholder';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';

import { getAuthorName } from '@/factories/authorFactory';
import TagChipAuthor from '../TagChipAuthor';

export default {
  name: 'MetadataHeader',
  components: {
    TagChip,
    TagChipAuthor,
    TagChipPlaceholder,
    BaseIconLabelView,
    BaseIconButton,
  },
  props: {
    metadataId: String,
    metadataTitle: String,
    titleImg: String,
    contactName: String,
    contactEmail: String,
    doi: String,
    license: String,
    tags: Array,
    authors: Array,
    maxTags: Number,
    showPlaceholder: Boolean,
    doiIcon: String,
    contactIcon: String,
    mailIcon: String,
    licenseIcon: String,
    expanded: {
      type: Boolean,
      default: true,
    },
    authorDeadInfo: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    showTagsExpanded: false,
    dark: false,
    blackTopToBottom: 'rgba(80,80,80, 0.1) 0%, rgba(80,80,80, 0.9) 70%',
    // whiteTopToBottom: 'rgba(255,255,255, 0.3) 0%, rgba(255,255,255, 1) 60%',
    whiteTopToBottom: 'rgba(255,255,255, 0.6) 0%, rgba(255,255,255, 0.99) 70%',
    authorToolTipText: 'Show more datasets of this author',
    NotFoundTitle: 'No metadata found for',
  }),
  computed: {
    asciiDead() {
      return this.authorDeadInfo && this.authorDeadInfo.asciiDead ? this.authorDeadInfo.asciiDead : null;
    },
    authorPassedInfo() {
      return this.authorDeadInfo && this.authorDeadInfo.authorPassedInfo ? this.authorDeadInfo.authorPassedInfo : null;
    },
    maxTagsReached() {
      return this.tags ? this.tags.length >= this.maxTags : false;
    },
    slicedTags() {
      if (!this.tags) {
        return false;
      }

      if (this.showTagsExpanded) {
        return this.tags;
      }

      return this.tags.slice(0, this.maxTags);
    },
    dynamicCardBackground() {
      const gradient = this.dark ? this.blackTopToBottom : this.whiteTopToBottom;

      let style = `position: absolute; top: 0px; right: 0px;
                    height: 100%; width: 100%;
                    background-image: linear-gradient(0deg, ${gradient});
                    background-position: center, center; background-size: cover;
                    background-repeat: initial;
                    z-index: 0;`;

      if (this.titleImg) {
        style += `background-image: linear-gradient(0deg, ${gradient}), url(${this.titleImg});
        filter: blur(2px);`;
      }

      return style;
    },
    doiUrl() {
      return this.doi ? `https://www.doi.org/${this.doi}` : null;
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$emit('checkSize');
    });
  },
  methods: {
    // expandFinished() {
    //   console.log('finished');
    // },
    catchTagClicked(tagId) {
      this.$emit('clickedTag', tagId);
    },
    catchAuthorClicked(authorName) {
      this.$emit('clickedAuthor', authorName);
    },
    catchBackClicked() {
      this.$emit('clickedBack');
    },
    iconFlip(icon) {
      const iconflip = this.dark ? `${icon}_w` : icon;
      return iconflip;
    },
    authorName: getAuthorName,
  },
};
</script>

<style scoped>

  .headerTitle {
    font-family: 'Baskervville', serif !important;
    font-weight: 400;
    opacity: 1;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
  }

  .headerInfo {
    font-family: 'Baskervville', serif !important;
    font-weight: 400;
    opacity: 0.85;
    line-height: 1rem;
  }

  .headerInfo img,
  .headerInfo > .envidatIcon {
    opacity: 0.85;
  }

  .headerTag {
    opacity: 0.85;
  }

</style>
