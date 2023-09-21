<template>
  <v-card
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="fill-height"
    :dark="false"
    @click.native="cardClick"
  >
    <!-- <v-card-title primary-title class="pa-0"> -->

    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col>
          <v-img
            :style="headerImageStyle"
            :height="
              flatLayout
                ? '55px'
                : $vuetify.display.smAndDown
                ? '90px'
                : '115px'
            "
          >
            <div
              v-if="!maxTitleLengthReached || $vuetify.display.xsOnly"
              class="pa-4 metadataTitle mb-0"
              :class="titleClass"
            >
              {{ truncatedTitle }}
            </div>

            <v-tooltip
              v-if="maxTitleLengthReached && !$vuetify.display.xsOnly"
              bottom
            >
              <template v-slot:activator="{ on }">
                <div
                  v-on="on"
                  class="pa-4 metadataTitle mb-0"
                  :class="titleClass"
                >
                  {{ truncatedTitle }}
                </div>
              </template>

              <span>{{ title }}</span>
            </v-tooltip>
          </v-img>
        </v-col>
      </v-row>
    </v-container>

    <v-card-text
      v-if="showCardBody"
      :class="{
        cardText: $vuetify.display.mdAndUp,
        compactText: flatLayout || $vuetify.display.smAndDown,
        'pr-5': flatLayout,
      }"
    >
      <v-container fluid class="pa-0 fill-height">
        <v-row v-if="!compactLayout" no-gutters class="pb-2">
          <v-col cols="12">
            {{ truncatedSubtitle }}
          </v-col>
        </v-row>

        <v-row v-if="tags" no-gutters>
          <v-col
            v-for="(tag, index) in tags.slice(0, maxTagNumber)"
            :key="index"
            class="flex-grow-0"
          >
            <tag-chip
              class="py-0"
              :name="tag.name || tag"
              :selectable="true"
              :color="tag.color"
              @clicked="catchTagClicked(tag.name)"
            />
          </v-col>
          <v-col v-if="maxTagsReached" class="flex-grow-0">
            <tag-chip class="py-0" name="..." />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions
      class="ma-0 pa-2"
      :style="
        `position: absolute; bottom: 0; right: 0;
                              background-color: ${
                                showCardBody ? 'white' : 'transparent'
                              };
                              border-radius: 10px;`
      "
    >
      <v-container v-if="showCardBody" class="pa-0">
        <v-row v-if="state" class="pb-1" no-gutters justify="end">
          <v-col class="cardIcons flex-grow-0">
            <MetadataStateChip :state="state" :showOnHover="!hover" />
          </v-col>
        </v-row>

        <!--
        <v-row v-if="organization"
               class="pb-1"
               no-gutters
               justify="end">
          <v-col class="cardIcons flex-grow-0" >
            <MetadataOrganizationChip :organization="organization"
                                      :tooltip="organizationTooltip"
                                      :showOnHover="showOrganizationOnHover === true || (showOrganizationOnHover === undefined && !hover)"
                                      @organizationClicked="$emit('organizationClicked', $event)" />
          </v-col>
        </v-row>
-->

        <v-row v-if="modeData" no-gutters justify="end">
          <v-col class="cardIcons flex-grow-0">
            <base-icon-button
              isFlat
              isSmall
              color="transparent"
              :disabled="true"
              :customIcon="modeEntryIcon"
            />
          </v-col>
        </v-row>

        <v-row no-gutters justify="end">
          <v-col class="cardIcons flex-grow-0">
            <base-icon-count-view
              :count="resourceAmount"
              :icon-string="fileIconString"
            />
          </v-col>
        </v-row>

        <v-row v-if="geoJSONIcon" no-gutters justify="end">
          <v-col class="cardIcons flex-grow-0">
            <BaseIconLabelView :icon="geoJSONIcon" />
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="!showCardBody" class="pa-0">
        <v-row no-gutters class="justify-end">
          <v-col v-if="role" class="pl-1 flex-grow-0">
            <UserRoleChip :role="role" />
          </v-col>
          <v-col v-if="state" class="pl-1 flex-grow-0">
            <MetadataStateChip :state="state" :showOnHover="!hover" />
          </v-col>

          <v-col v-if="organization" class="pl-1 flex-grow-0">
            <MetadataOrganizationChip
              :organization="organization"
              :tooltip="organizationTooltip"
              :showOnHover="
                showOrganizationOnHover === true ||
                  (showOrganizationOnHover === undefined && !hover)
              "
              @organizationClicked="$emit('organizationClicked', $event)"
            />
          </v-col>

          <v-col v-if="modeData" class="pl-1 flex-grow-0 cardIcons">
            <base-icon-button
              isFlat
              isSmall
              color="transparent"
              :disabled="true"
              :customIcon="modeEntryIcon"
            />
          </v-col>

          <v-col class="pl-3 flex-grow-0 cardIcons">
            <base-icon-count-view
              :count="resourceAmount"
              :icon-string="fileIconString"
            />
          </v-col>

          <v-col v-if="geoJSONIcon" class="pl-1 flex-grow-0 cardIcons">
            <BaseIconLabelView :icon="geoJSONIcon" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>

    <v-container
      v-if="showGenericOpenButton"
      class="ma-2 pa-0"
      style="position: absolute; top: 0; right: 0; width: 30px;"
    >
      <v-row>
        <v-col cols="12">
          <base-icon-button
            :materialIconName="openButtonIcon"
            iconColor="black"
            color="accent"
            :isElevated="true"
            :isSmall="true"
            :tooltipText="openButtonTooltip"
            @clicked="$emit('openButtonClicked')"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * MetaDataCard.vue creates a card with a header image, title, keywords and preview description.
 * When clicked its emits the 'clickedEvent' event, also the clickedTag can be emitted.
 *
 * @summary card with img, title, keywords and preview description
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2021-01-06 11:37:52
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIconCountView from '@/components/BaseElements/BaseIconCountView.vue';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView.vue';
import MetadataOrganizationChip from '@/components/Chips/MetadataOrganizationChip.vue';
import MetadataStateChip from '@/components/Chips/MetadataStateChip.vue';
import TagChip from '@/components/Chips/TagChip.vue';
import UserRoleChip from '@/components/Chips/UserRoleChip.vue';
import { getModeData } from '@/factories/modeFactory';
import { stripMarkdown } from '@/factories/stringFactory';

// Header Sleek design
// https://codepen.io/GeorgeGedox/pen/NQrxrY

// checkout possible transition animation
// https://codepen.io/balapa/pen/embYYB
// https://codepen.io/zavoloklom/pen/eNaEBM

// this one maybe for the guided content scrolling
// https://codepen.io/pgreg/pen/EDoFB

// Card design #2 probably only the header would be doable?
// https://codepen.io/marlenesco/pen/NqOozj

// Card opening animation
// https://codepen.io/luizotcarvalho/pen/yyQNRO

// check multi line truncation via css (only works with one-colored background)
// http://hackingui.com/front-end/a-pure-css-solution-for-multiline-text-truncation/

export default {
  name: 'MetadataCard',
  props: {
    id: String,
    title: String,
    subtitle: String,
    name: String,
    restricted: Boolean,
    favourit: Boolean,
    tags: {
      type: Array,
      default: null,
    },
    titleImg: String,
    dark: Boolean,
    resourceCount: Number,
    flatLayout: Boolean,
    compactLayout: Boolean,
    fileIconString: String,
    lockedIconString: String,
    unlockedIconString: String,
    geoJSONIcon: String,
    categoryColor: String,
    mode: String,
    showGenericOpenButton: {
      type: Boolean,
      default: false,
    },
    openButtonTooltip: String,
    openButtonIcon: {
      type: String,
      default: 'preview',
    },
    state: {
      type: String,
      default: '',
    },
    organization: {
      type: String,
      default: '',
    },
    organizationTooltip: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    showOrganizationOnHover: {
      type: Boolean,
      default: undefined,
    },
  },
  computed: {
    showCardBody() {
      return !!this.tags || !this.compactLayout;
    },
    headerImageStyle() {
      let topBorderStyle =
        'border-top-left-radius: 4px; border-top-right-radius: 4px; ';
      if (!this.showCardBody) {
        topBorderStyle = 'border-radius: 4px; ';
      }
      const imgStyle = !this.flatLayout
        ? this.dynamicCardBackground
        : `background-color: ${this.categoryColor}; `;

      return `${topBorderStyle} ${imgStyle}`;
    },
    dynamicCardBackground() {
      const gradient = this.dark
        ? this.blackTopToBottom
        : this.whiteTopToBottom;

      if (this.titleImg && this.$vuetify.display.mdAndUp) {
        return `background-image: linear-gradient(0deg, ${gradient}), url(${this.titleImg});
                background-position: center, center;
                background-size: cover; background-repeat: initial; `;
      }

      return `background-color: ${this.categoryColor}; `;
    },
    maxTagsReached() {
      return this.tags && this.tags.length > this.maxTagNumber;
    },
    maxTagNumber() {
      let numberOfTags = 0;

      if (!this.tags) {
        return numberOfTags;
      }

      let textLength = 0;

      for (let i = 0; i < this.tags.length; i++) {
        const name = this.tags[i].name || this.tags[i];

        textLength += name.length + 1;

        if (
          this.flatAndMaxReached(textLength) ||
          this.compactAndMaxReached(textLength) ||
          (!this.isCompactLayout &&
            !this.flatLayout &&
            textLength >= this.tagtextLength)
        ) {
          break;
        }

        numberOfTags++;
      }

      return numberOfTags;
    },
    maxTitleLengthReached() {
      return (
        (this.flatLayout && this.title?.length > this.flatTagtextLength) ||
        (this.isCompactLayout && this.title?.length > this.compactTitleLength) ||
        (!this.isCompactLayout &&
          !this.flatLayout &&
          this.title?.length > this.titleLength)
      );
    },
    isCompactLayout() {
      return this.compactLayout || this.$vuetify.display.smAndDown;
    },
    maxTitleLength() {
      let maxLength = this.titleLength;

      if (this.flatLayout) {
        maxLength = this.flatTitleLength;
      } else if (this.isCompactLayout) {
        maxLength = this.compactTitleLength;
      }

      return maxLength;
    },
    truncatedTitle() {
      const maxLength = this.maxTitleLength;

      if (this.title?.length > maxLength) {
        return `${this.title.substring(0, maxLength)}...`;
      }

      return this.title;
    },
    maxDescriptionLength() {
      let maxLength = this.descriptionLength;

      if (this.flatLayout) {
        maxLength = this.flatDescriptionLength;
      } else if (this.isCompactLayout) {
        maxLength = this.compactDescriptionLength;
      }

      return maxLength;
    },
    truncatedSubtitle() {
      const maxLength = this.maxDescriptionLength;
      const cleanSubtitle = stripMarkdown(this.subtitle, true);

      if (cleanSubtitle?.length > maxLength) {
        return `${cleanSubtitle.substring(0, maxLength)}...`;
      }

      return cleanSubtitle;
    },
    isRestricted() {
      return this.restricted;
      // return this.restricted &&
      // (this.restricted.allowed_users !== undefined || this.restricted.level !== 'public');
    },
    userHasAccess() {
      if (!this.isRestricted) {
        return false;
      }

      const userAccess = this.restricted.allowed_users;
      const accessLvl = this.restricted.level;

      return userAccess || accessLvl;
    },
    resourceAmount() {
      if (this.resourceCount) {
        return this.resourceCount;
      }

      return 0;
    },
    titleClass() {
      return {
        black_title: !this.dark,
        white_title: this.dark,
        // smallScreenTitle: this.compactLayout || this.$vuetify.display.xsOnly,
        smallScreenTitle: this.$vuetify.display.xsOnly,
        compactTitle: this.compactLayout || this.$vuetify.display.smOnly,
      };
    },
    modeEntryIcon() {
      const keys = Object.keys(this.modeData.icons);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (this.tags.findIndex(t => t.name === key.toUpperCase()) >= 0) {
          return this.modeData.icons[key];
        }
      }

      return Object.values(this.modeData.icons)[0];
    },
    modeData() {
      if (!this.mode) return null;

      return getModeData(this.mode);
    },
  },
  created() {},
  methods: {
    flatAndMaxReached(textLength) {
      return this.flatLayout && textLength >= this.flatTagtextLength;
    },
    compactAndMaxReached(textLength) {
      return this.isCompactLayout && textLength >= this.compactTagtextLength;
    },
    cardClick() {
      let detailParam = this.name;
      if (!detailParam) {
        detailParam = this.id; // fallback id in url isn't too nice
      }
      this.$emit('clickedEvent', detailParam);
    },
    favouritClicked() {
      this.$emit('clickedFavourit', this.id);
    },
    catchTagClicked(tagId) {
      this.$emit('clickedTag', tagId);
    },
  },
  components: {
    TagChip,
    BaseIconCountView,
    BaseIconLabelView,
    BaseIconButton,
    MetadataStateChip,
    MetadataOrganizationChip,
    UserRoleChip,
  },
  data: () => ({
    hover: false,
    singleLineCss:
      'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
    show: false,
    showDataText: 'SHOW DATA',
    titleLength: 100,
    compactTitleLength: 115,
    flatTitleLength: 120,
    descriptionLength: 280,
    compactDescriptionLength: 130,
    flatDescriptionLength: 600,
    tagtextLength: 100,
    compactTagtextLength: 160,
    flatTagtextLength: 70,
    blackTopToBottom: 'rgba(20,20,20, 0.1) 0%, rgba(20,20,20, 0.9) 60%',
    whiteTopToBottom: 'rgba(255,255,255, 0.6) 0%, rgba(255,255,255, 0.99) 70%',
  }),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card .card__media {
  /* Fallback if the background images don't work */
  background: #00695c; /* Old Browsers */
  background: -webkit-linear-gradient(top, #00695c, #00897b); /*Safari 5.1-6*/
  background: -o-linear-gradient(top, #00695c, #00897b); /*Opera 11.1-12*/
  background: -moz-linear-gradient(top, #00695c, #00897b); /*Fx 3.6-15*/
  background: linear-gradient(to bottom, #00695c, #00897b); /*Standard*/
}

.black_title {
  color: rgba(0, 0, 0, 0.87) !important;
}

.white_title {
  color: rgba(255, 255, 255, 0.9) !important;
}

.metadataTitle {
  /* font-family: "Baskervville", serif !important; */
  font-size: 1.2rem !important;
  line-height: 1.2rem !important;
}

.compactTitle {
  font-size: 17px !important;
}

.smallScreenTitle {
  font-size: 14px !important;
}

.compactText {
  line-height: 1.2em !important;
}

.cardText {
  font-size: 14px !important;
  opacity: 0.75;
  line-height: 1.2em !important;
  overflow: hidden;
}

.cardIcons {
  opacity: 0.5;
}
</style>
