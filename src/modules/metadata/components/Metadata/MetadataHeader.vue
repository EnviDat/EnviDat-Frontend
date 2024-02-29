<template>
  <v-card id="MetadataHeader"
          :dark="dark"
          :color="(showPlaceholder || !hasContent) ? 'primary' : 'transparent'"  >

    <div id="headerBackground"
         :style="dynamicCardBackground" >
      <!-- this loads the background image -->
    </div>

    <base-icon-button 
      v-if="showCloseButton"
      class="metadataHeaderCloseButton ma-2"
      :class="{ 'mx-1' : $vuetify.display.smAndDown }"
      style="position: absolute; top: 0; right: 0; z-index: 2;"
      :icon="mdiClose"
      icon-color="primary"
      color="primary"
      outlined
      tooltip-text="Close metadata view"
      tooltip-bottom
      @clicked="catchBackClicked" 
    />

    <base-icon-button 
      v-if="showEditButton"
      class="metadataHeaderEditButton ma-2"
      :class="{ 'mx-1' : $vuetify.display.smAndDown }"
      style="position: absolute; top: 0; right: 46px; z-index: 2;"
      :icon="mdiPencil"
      icon-color="black"
      color="accent"
      tooltip-text="Edit metadata"
      tooltip-bottom
      @clicked="catchEditClicked"
    />

    <v-container fluid class="pa-4">
      <v-row no-gutters style="position: relative; z-index: 1;">
        <v-col v-if="hasContent" cols="12" >
          <div class="headerTitle"
                :style="`line-height: ${$vuetify.display.xs ? '1.5rem' : ''};`"
                :class="{ 'py-0': $vuetify.display.smAndDown,
                          'display-2': $vuetify.display.xlOnly,
                          'text-h4': $vuetify.display.mdAndUp,
                          'headline': $vuetify.display.smOnly,
                          'subtitle-1': $vuetify.display.xs,
                        }" >
            {{ metadataTitle }}
          </div>
        </v-col>

        <v-col v-if="!metadataTitle && !showPlaceholder"
                cols="12" >
          <div class="headerTitle py-3"
                :style="`color: ${$vuetify.theme.themes.light.colors.error}`"
                :class="{ 'display-2': $vuetify.display.lgAndUp,
                          'text-h4': $vuetify.display.mdAndDown,
                          'headline': $vuetify.display.smAndDown,
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

          <!-- author list -->
          <v-row no-gutters
                  style="position: relative; z-index: 1;">

            <v-col v-if="authors"
                    cols="12"
                    class="pa-0"
                    id="authors_divier"
                    key="authors_divier" >
              <v-divider :dark="dark"
                        :class="{ 'my-1': $vuetify.display.xs,
                                  'my-2': $vuetify.display.smAndUp }" />
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
                          'pa-0': $vuetify.display.mdAndUp,
                          'py-1 px-0': $vuetify.display.smAndDown,
                        }"
                        class="flex-grow-0" >

                  <TagChipAuthor :name="authorName(author)"
                                  :tooltipText="authorToolTipText"
                                  :asciiDead="asciiDead"
                                  :authorPassedInfo="authorPassedInfo"
                                  isSmall
                                @clicked="catchAuthorClicked(authorGivenName(author), authorLastName(author))" />
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
                            :class="{ 'my-1': $vuetify.display.xs,
                                      'my-2': $vuetify.display.smAndUp }" />
                </v-col>
              </v-row>

              <v-row no-gutters >
                <v-col v-for="n in 5"
                        :key="n"
                        class="flex-grow-0 mr-1" >
                  <tag-chip-placeholder class="headerTag" />
                </v-col>
              </v-row>

            </v-col>
          </v-row>

          <!-- divier -->
          <v-row no-gutters
                  style="position: relative; z-index: 1;">

            <v-col cols="12"
                    class="pa-0"
                    id="headerinfo_divier"
                    key="headerinfo_divier" >
              <v-divider :dark="dark"
                        :class="{ 'my-1': $vuetify.display.xs,
                                  'my-2': $vuetify.display.smAndUp }" />
            </v-col>
          </v-row>

          <!-- info list row number 1 -->
          <v-row v-if="!showPlaceholder && metadataTitle"
                  no-gutters
                  id="headerinfos"
                  key="headerinfos"
                  style="position: relative; z-index: 1;">

            <v-col cols="12"
                  sm="3"
                  class="headerInfo py-1 py-sm-0" >

              <v-tooltip bottom>
                <template v-slot:activator="{ props }">

                  <v-row no-gutters
                        v-bind="props"
                        align="center">
                    <v-col class="flex-grow-0 pr-2">
                      <v-icon class="envidatIcon material-icons"
                              :class="$vuetify.display.xs ? 'small' : ''"
                              color="black">manage_accounts</v-icon>
                    </v-col>
                    <v-col>
                      {{ contactName }}
                    </v-col>
                  </v-row>
                </template>

                <span>{{ contactToolTipText }}</span>
              </v-tooltip>

            </v-col>

            <v-col cols="12"
                  sm="6"
                  lg="3"
                  class="headerInfo py-1 py-sm-0" >

              <v-tooltip bottom>
                <template v-slot:activator="{ props }">
                  <v-row no-gutters
                        v-bind="props"
                      align="center">
                    <v-col class="flex-grow-0 pr-2">
                      <v-icon class="envidatIcon material-icons"
                              :class="$vuetify.display.xs ? 'small' : ''"
                              color="black">fingerprint</v-icon>
                    </v-col>
                    <v-col>
                      <a :href="doiUrl" target="_blank">{{ doi }}</a>
                    </v-col>
                  </v-row>

                </template>

                <span>{{ doiToolTipText }}</span>
              </v-tooltip>

            </v-col>

            <v-col v-if="hasContent"
                  cols="12"
                  sm="6"
                  lg="3"
                  class="headerInfo py-1 py-sm-0" >

              <v-tooltip bottom>
                <template v-slot:activator="{ props }">

                  <v-row no-gutters
                        v-bind="props"
                        align="center">
                    <v-col class="flex-grow-0 pr-2">
                      <v-icon class="envidatIcon material-icons"
                              :class="$vuetify.display.xs ? 'small' : ''"
                              color="black">more_time</v-icon>
                    </v-col>
                    <v-col style="font-size: 0.9rem;">
                      {{ created }}
                    </v-col>
                  </v-row>

                </template>
                <span>{{ createTimeToolTipText }}</span>
              </v-tooltip>
            </v-col>

            <v-col v-if="hasContent && spatialInfo"
                  cols="12"
                  sm="6"
                  lg="3"
                  class="headerInfo py-1 py-sm-0" >

              <v-tooltip bottom>
                <template v-slot:activator="{ props }">

                  <v-row no-gutters
                        v-bind="props"
                        align="center">
                    <v-col class="flex-grow-0 pr-2">
                      <v-icon class="envidatIcon material-icons"
                              :class="$vuetify.display.xs ? 'small' : ''"
                              color="black">location_pin</v-icon>
                    </v-col>
                    <v-col style="font-size: 0.9rem;">
                      {{ spatialInfo }}
                    </v-col>
                  </v-row>
                </template>

                <span>{{ locationToolTipText }}</span>
              </v-tooltip>
            </v-col>

          </v-row>

          <v-row no-gutters
                class="pt-1"
                  justify="end">

            <v-col cols="12"
                  sm="3"
                  class="headerInfo py-1 py-sm-0" >

              <v-tooltip bottom>
                <template v-slot:activator="{ props }">

                  <v-row no-gutters
                        v-bind="props"
                        align="center">
                    <v-col class="flex-grow-0 pr-2">
                      <v-icon class="envidatIcon material-icons"
                              :class="$vuetify.display.xs ? 'small' : ''"
                              color="black">email</v-icon>
                    </v-col>
                    <v-col>
                      <a :href="contactEmailLowerCase ? `mailto:${contactEmailLowerCase}` : ''" target="_blank">{{ contactEmailLowerCase }}</a>
                    </v-col>
                  </v-row>
                </template>

                <span>{{ emailToolTipText }}</span>
              </v-tooltip>

            </v-col>

            <v-col>
              <!-- empty col to match the cols with row before -->
            </v-col>

            <v-col v-if="hasContent"
                  cols="12"
                  sm="6"
                  lg="3"
                  class="headerInfo py-1 py-sm-0" >

              <v-tooltip bottom>
                <template v-slot:activator="{ props }">

                  <v-row no-gutters
                        v-bind="props"
                        align="center">
                    <v-col class="flex-grow-0 pr-2">
                      <v-icon class="envidatIcon material-icons"
                              :class="$vuetify.display.xs ? 'small' : ''"
                              color="black">update</v-icon>
                    </v-col>
                    <v-col style="font-size: 0.9rem;">
                      {{ modified }}
                    </v-col>
                  </v-row>

                </template>
                <span>{{ modifyTimeToolTipText }}</span>
              </v-tooltip>

            </v-col>

            <v-col cols="12"
                  sm="3"
                  class="headerInfo py-1 py-sm-0" >

              <MetadataOrganizationChip v-if="hasContent && organization"
                                        :organization="organization"
                                        :tooltip="organizationTooltip" />

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
                        :class="{ 'my-1': $vuetify.display.xs,
                                  'my-2': $vuetify.display.smAndUp }" />
            </v-col>

            <v-col v-if="tags"
                    cols="12"
                    sm="9"
                    class="py-0"
                    id="tags"
                    key="tags" >
              <v-row no-gutters >
                <v-col v-for="tag in slicedTags"
                        :key="tag.name"
                        class="flex-grow-0" >

                  <tag-chip :name="tag.name"
                            :selectable="true"
                            class="headerTag"
                            :color="tag.color"
                            @clicked="catchTagClicked(tag.name)" />
                </v-col>

                <v-col v-if="maxTagsReached && !showTagsExpanded"
                        class="flex-grow-0" >
                  <tag-chip class="headerTag flex-grow-0"
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
                        class="flex-grow-0 mr-1" >
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
      <v-row no-gutters align="center">
        <v-col v-if="maxTagsReached" class="px-1 flex-grow-0" >
          <base-icon-button 
            :icon="mdiChevronDown"
            color="primary"
            :icon-color="showTagsExpanded ? 'accent' : 'primary'"
            outlined
            :rotated="showTagsExpanded"
            :tooltip-text="showTagsExpanded ? 'Hide all tags' : 'Show all tags'"
            tooltip-bottom
            @clicked="showTagsExpanded = !showTagsExpanded" 
          />
        </v-col>

        <v-col v-if="metadataState && showEditButton" class=" flex-grow-1 px-1" >
          <MetadataStateChip :state="metadataState" />
        </v-col>

        <v-col v-if="publicationYear"
               class="flex-grow-0 px-1" >
          <v-chip small>{{ publicationYear }}</v-chip>
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
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

import { getAuthorName, getAuthorGivenName, getAuthorLastName } from '@/factories/authorFactory';
import TagChipAuthor from '@/components/Chips/TagChipAuthor.vue';
import MetadataOrganizationChip from '@/components/Chips/MetadataOrganizationChip.vue';
import MetadataStateChip from '@/components/Chips/MetadataStateChip.vue';
import { mdiClose } from '@mdi/js';

export default {
  name: 'MetadataHeader',
  components: {
    TagChip,
    TagChipAuthor,
    TagChipPlaceholder,
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
    tags: Array,
    authors: Array,
    maxTags: Number,
    showPlaceholder: Boolean,
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
    showEditButton: {
      type: Boolean,
      default: false,
    },
    categoryColor: String,
    organization: String,
    organizationTooltip: String,
    metadataState: {
      type: String,
      default: undefined,
    },
    publicationYear: {
      type: String,
      default: undefined,
    },
    spatialInfo: {
      type: String,
      default: undefined,
    },
    created: {
      type: String,
      default: undefined,
    },
    modified: {
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
    contactToolTipText: 'Main contact',
    emailToolTipText: 'Email address of Main contact',
    doiToolTipText: 'Data Object Identifier',
    locationToolTipText: 'Location',
    createTimeToolTipText: 'Time of creation',
    modifyTimeToolTipText: 'Time of last modification',
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
    catchAuthorClicked(authorGivenName, authorLastName) {
      this.$emit('clickedAuthor', authorGivenName, authorLastName);
    },
    catchBackClicked() {
      this.$emit('clickedBack');
    },
    catchEditClicked() {
      this.$emit('clickedEdit');
    },
    iconFlip(icon) {
      return this.dark ? `${icon}_w` : icon;
    },
    authorName: getAuthorName,
    authorGivenName: getAuthorGivenName,
    authorLastName: getAuthorLastName,
  },
};
</script>

<style scoped>

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
