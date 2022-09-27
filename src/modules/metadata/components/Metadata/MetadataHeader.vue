<template>
  <v-card id="MetadataHeader"
          :dark="dark"
          :color="(showPlaceholder || !hasContent) ? 'primary' : 'transparent'"  >

    <div id="headerBackground"
         :style="dynamicCardBackground" >
      <!-- this loads the background image -->
    </div>

    <base-icon-button id="MetadataHeaderCloseButton"
                      v-if="showCloseButton"
                      class="ma-2"
                      :class="{ 'mx-1' : $vuetify.breakpoint.smAndDown }"
                      style="position: absolute; top: 0; right: 0; z-index: 2;"
                      material-icon-name="close"
                      icon-color="primary"
                      color="primary"
                      outlined
                      tooltipText="Close metadata view"
                      :tooltipBottom="true"
                      @clicked="catchBackClicked" />

    <v-container fluid
                  class="pa-4">
    <v-row no-gutters
            style="position: relative; z-index: 1;">

      <v-col v-if="hasContent"
              cols="12" >
        <div class="headerTitle"
              :style="`line-height: ${$vuetify.breakpoint.xsOnly ? '1.5rem' : ''};`"
              :class="{ 'py-0': $vuetify.breakpoint.smAndDown,
                        'display-2': $vuetify.breakpoint.xlOnly,
                        'text-h4': $vuetify.breakpoint.mdAndUp,
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
                        'text-h4': $vuetify.breakpoint.mdAndDown,
                        'headline': $vuetify.breakpoint.smAndDown,
                      }" >
          {{ `${NotFoundTitle} '${metadataId}'` }}
        </div>
      </v-col>

      <v-col v-if="!metadataTitle && showPlaceholder"
              cols="12" >
        <div class="skeleton skeleton-size-big skeleton-color-concrete skeleton-animation-shimmer" >
          <div class="bone bone-type-text bone-style-steps" />
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
                    :style="`max-height: ${authorTagsMaxHeight}px; overflow-y: auto;`" >
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

              <v-col cols="12"
                      class="pa-0"
                      id="authors_placeholder_divier"
                      key="authors_placeholder_divier" >
                <v-divider :dark="dark"
                          :class="{ 'my-1': $vuetify.breakpoint.xsOnly,
                                    'my-2': $vuetify.breakpoint.smAndUp }" />
              </v-col>
            </v-row>

            <v-row no-gutters >
              <v-col v-for="n in 5"
                      :key="n"
                      class="shrink mr-1" >
                <tag-chip-placeholder class="headerTag" />
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

        <v-row v-if="!showPlaceholder && metadataTitle"
                no-gutters
                id="headerinfos"
                key="headerinfos"
                style="position: relative; z-index: 1;">

          <v-col cols="6" lg="3"
                class="headerInfo py-0" >
            <BaseIconLabelView :text="contactName"
                                  :label="licenseIcon ? '' : 'Main Contact:'"
                                  :icon="contactIcon"
                                  icon-tooltip="Main contact"
                                  :compactLayout="$vuetify.breakpoint.xs"
                                  :align-left="true" />
          </v-col>

          <v-col cols="6" lg="3"
                  class="headerInfo py-0" >
            <BaseIconLabelView :text="contactEmailLowerCase"
                                  :label="mailIcon ? '' : 'Contact Email:'"
                                  :icon="mailIcon"
                                  icon-tooltip="Email address of the main contact"
                                  :compactLayout="$vuetify.breakpoint.xs"
                                  :word-break="true"
                                  :align-left="true" />
          </v-col>

          <v-col cols="6" lg="3"
                  class="headerInfo py-0" >
            <BaseIconLabelView :text="doi"
                                  :label="doiIcon ? '' : 'DOI:'"
                                  :url="doiUrl"
                                  :icon="doiIcon"
                                  icon-tooltip="Data Object Identifier"
                                  :compactLayout="$vuetify.breakpoint.xs"
                                  :word-break="true"
                                  :align-left="true" />
          </v-col>

          <v-col cols="6" lg="3"
                  class="headerInfo py-0" >
            <BaseIconLabelView :text="license"
                                  :label="licenseIcon ? '' : 'License:'"
                                  :icon="licenseIcon"
                                  icon-tooltip="License for the data files"
                                  :compactLayout="$vuetify.breakpoint.xs"
                                  :align-left="true" />
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

          <v-col v-if="showPlaceholder"
                  cols="12"
                  class="py-0"
                  id="tags_placeholder"
                  key="tags_placeholder" >

            <v-row no-gutters >
              <v-col v-for="n in 5"
                      :key="n"
                      class="shrink mr-1" >
                <tag-chip-placeholder class="headerTag" />
              </v-col>
            </v-row >
          </v-col>

        </v-row>

      </v-col>
    </v-row>
    </v-expand-transition>

    </v-container>

    <v-card-actions v-show="expanded"
                    class="orgaChipFullWidth"
                    style="position: absolute; bottom: 0; right: 0; z-index: 2;">
      <v-row no-gutters
              align="center">

        <v-col v-if="maxTagsReached"
               class="px-1" >
          <base-icon-button materialIconName="expand_more"
                            color="primary"
                            :iconColor="showTagsExpanded ? 'accent' : 'primary'"
                            outlined
                            :rotateOnClick="true"
                            :rotateToggle="showTagsExpanded"
                            :tooltipText="showTagsExpanded ? 'Hide all tags' : 'Show all tags'"
                            :tooltipBottom="true"
                            @clicked="showTagsExpanded = !showTagsExpanded" />

        </v-col>

        <v-col v-if="metadataState"
               class="px-1" >
          <MetadataStateChip :state="metadataState"
                              :showOnHover="metadataState === 'published'" />

        </v-col>

        <v-col v-if="hasContent"
          class="px-1" >
          <MetadataOrganizationChip :organization="organization"
                                    :tooltip="organizationTooltip" />

        </v-col>

      </v-row>

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
 * Last modified  : 2021-07-27 17:28:23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import TagChip from '@/components/Chips/TagChip.vue';
import TagChipPlaceholder from '@/components/Chips/TagChipPlaceholder.vue';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

import { getAuthorName } from '@/factories/authorFactory';
import TagChipAuthor from '@/components/Chips/TagChipAuthor.vue';
import MetadataOrganizationChip from '@/components/Chips/MetadataOrganizationChip.vue';
import MetadataStateChip from '@/components/Chips/MetadataStateChip.vue';

export default {
  name: 'MetadataHeader',
  components: {
    TagChip,
    TagChipAuthor,
    TagChipPlaceholder,
    BaseIconLabelView,
    BaseIconButton,
    MetadataOrganizationChip,
    MetadataStateChip,
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
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    categoryColor: String,
    organization: String,
    organizationTooltip: String,
    metadataState: {
      type: String,
      default: undefined,
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
    authorTagsMaxHeight: 75,
  }),
  computed: {
    hasContent() {
      return this.metadataTitle && !this.showPlaceholder;
    },
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
      } else {
        style += `background-color: ${this.cateoryColor};`;
      }

      return style;
    },
    doiUrl() {
      return this.doi ? `https://www.doi.org/${this.doi}` : null;
    },
    contactEmailLowerCase() {
      return this.contactEmail?.toLowerCase() || '';
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
      return this.dark ? `${icon}_w` : icon;
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

  .orgaChipFullWidth .organizationChip {
    max-width: unset !important;
    opacity: 0.85;
  }

</style>
