<template>
  <v-card ripple
          hover
          style="height: 100%;"
          @click.native="cardClick" >
          
    <!-- <v-card-title primary-title class="pa-0"> -->

    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col >

          <v-img :style="headerImageStyle"
                  :height="flatLayout ? '55px' : $vuetify.breakpoint.smAndDown ? '90px' : '115px'" >

            <div v-if="!maxTitleLengthReached || $vuetify.breakpoint.xsOnly"
                class="pa-4 headline mb-0"
                :class="titleClass" >
              {{ truncatedTitle }}
            </div>

            <v-tooltip v-if="maxTitleLengthReached && !$vuetify.breakpoint.xsOnly"
                        bottom >
              <template v-slot:activator="{ on }">
                <div v-on="on"
                      class="pa-4 headline mb-0"
                      :class="titleClass" >
                  {{ truncatedTitle }}
                </div>
              </template>

              <span>{{ title }}</span>
            </v-tooltip>
          </v-img>
        </v-col>
      </v-row>
    </v-container>
    <!-- </v-card-title> -->

    <v-card-text py-2 
                  :class="{['cardText'] : $vuetify.breakpoint.mdAndUp,
                        ['compactText'] : flatLayout || $vuetify.breakpoint.smAndDown,
                        ['pr-5'] : flatLayout,
                  }" >

      <v-container fluid class="pa-0 fill-height" >
      <v-row v-if="!compactLayout"
              no-gutters >
        <v-col cols="12" >
          {{ truncatedSubtitle }}
        </v-col>
      </v-row>

      <v-row >
        <v-col cols="12">
          <v-spacer></v-spacer>
        </v-col>
      </v-row>

      <v-row v-if="tags"
              no-gutters >
        <v-col v-for="(tag, index) in tags.slice (0, maxTagNumber)"
                :key="index"
                class="shrink" >

            <tag-chip class="py-0"
                      :name="tag.name"
                      :selectable="true"
                      :color="tag.color"
                      @clicked="catchTagClicked($event, tag.name)" />

        </v-col>
        <v-col v-if="maxTagsReached"
                class="shrink" >
            <tag-chip class="py-0"
                      name="..." />

        </v-col>
      </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions class="ma-0 py-0 px-2"
                    style="position: absolute; bottom: 0px; right: 5px;" >

      <v-container fluid class="pa-0">        
      <v-row >
        <v-col v-if="modeData"
                class="pa-1" >
          <base-icon-button isFlat
                              isSmall
                              color="transparent"
                              :disabled="true"
                              :customIcon="modeEntryIcon" />
        </v-col>

        <v-col class="pa-1" >
          <base-icon-count-view :count="resourceAmount"
                                :icon-string="fileIconString" />
        </v-col>
      </v-row>
      </v-container>

    </v-card-actions>
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
 * Last modified  : 2019-11-20 14:31:57
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import remark from 'remark';
import strip from 'strip-markdown';

import TagChip from '@/components/Cards/TagChip';
import BaseIconCountView from '@/components/BaseElements/BaseIconCountView';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import { getModeData } from '@/factories/modeFactory';

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
  components: {
    TagChip,
    BaseIconCountView,
    BaseIconButton,
  },
  props: {
    id: String,
    title: String,
    subtitle: String,
    name: String,
    restricted: Boolean,
    unpublished: Boolean,
    // favourit: Boolean,
    tags: Array,
    titleImg: String,
    dark: Boolean,
    resourceCount: Number,
    flatLayout: Boolean,
    compactLayout: Boolean,
    fileIconString: String,
    lockedIconString: String,
    unlockedIconString: String,
    categoryColor: String,
    mode: String,
  },
  computed: {
    headerImageStyle() {
      const topBorderStyle = 'border-top-left-radius: 4px; border-top-right-radius: 4px; ';
      const imgStyle = !this.flatLayout ? this.dynamicCardBackground : `background-color: ${this.categoryColor}; `;

      return `${topBorderStyle} ${imgStyle}`;
    },
    dynamicCardBackground() {
      const gradient = this.dark ? this.blackTopToBottom : this.whiteTopToBottom;

      if (this.titleImg && this.$vuetify.breakpoint.mdAndUp) {
        return `background-image: linear-gradient(0deg, ${gradient}), url(${this.titleImg});
                background-position: center, center;
                background-size: cover; background-repeat: initial; `;
      }

      return `background-color: ${this.categoryColor}`;
    },
    maxTagsReached() {
      return this.tags !== undefined && this.tags.length > this.maxTagNumber;
    },
    maxTagNumber() {
      let textLength = 0;
      let numberOfTags = 0;

      if (this.tags !== undefined) {
        for (let i = 0; i < this.tags.length; i++) {
          if (this.tags[i].name !== undefined) {
            textLength += this.tags[i].name.length + 1;

            if ((this.flatLayout && textLength >= this.flatTagtextLength)
              || ((this.compactLayout || this.$vuetify.breakpoint.smAndDown) && textLength >= this.compactTagtextLength)
              || textLength >= this.tagtextLength) {
              break;
            }

            numberOfTags++;
          }
        }
      }

      return numberOfTags;
    },
    maxTitleLengthReached() {
      return (this.flatLayout && this.title.length > this.flatTagtextLength)
      || ((this.compactLayout || this.$vuetify.breakpoint.smAndDown) && this.title.length > this.compactTitleLength)
      || this.title.length > this.titleLength;
    },
    truncatedTitle() {
      let maxLength = this.titleLength;

      if (this.flatLayout) {
        maxLength = this.flatTitleLength;
      } else if (this.compactLayout || this.$vuetify.breakpoint.smAndDown) {
        maxLength = this.compactTitleLength;
      }

      if (this.title !== undefined && this.maxTitleLengthReached) {
        return `${this.title.substring(0, maxLength)}...`;
      }

      return this.title;
    },
    truncatedSubtitle() {
      let maxLength = this.descriptionLength;

      if (this.flatLayout) {
        maxLength = this.flatDescriptionLength;
      } else if (this.compactLayout || this.$vuetify.breakpoint.smAndDown) {
        maxLength = this.compactDescriptionLength;
      }

      if (this.subtitle !== undefined) {
        const strippedFile = remark().use(strip).processSync(this.subtitle);
        const cleanSubtitle = strippedFile.contents;
        if (cleanSubtitle) {
          return `${cleanSubtitle.substring(0, maxLength)}...`;
        }
      }

      return '';
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
        // smallScreenTitle: this.compactLayout || this.$vuetify.breakpoint.xsOnly,
        smallScreenTitle: this.$vuetify.breakpoint.xsOnly,
        compactTitle: this.compactLayout || this.$vuetify.breakpoint.smOnly,
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
  created() {
  },
  methods: {
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
  data: () => ({
    singleLineCss: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
    show: false,
    showDataText: 'SHOW DATA',
    titleLength: 100,
    compactTitleLength: 115,
    flatTitleLength: 120,
    descriptionLength: 280,
    compactDescriptionLength: 130,
    flatDescriptionLength: 500,
    tagtextLength: 100,
    compactTagtextLength: 60,
    flatTagtextLength: 170,
    blackTopToBottom: 'rgba(20,20,20, 0.1) 0%, rgba(20,20,20, 0.9) 60%',
    whiteTopToBottom: 'rgba(255,255,255, 0.7) 0%, rgba(255,255,255, 0.99) 70%',
  }),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


  .card .card__media {
    /* Fallback if the background images don't work */
    background: #00695c; /* Old Browsers */
    background: -webkit-linear-gradient(top,#00695c,#00897b); /*Safari 5.1-6*/
    background: -o-linear-gradient(top,#00695c,#00897b); /*Opera 11.1-12*/
    background: -moz-linear-gradient(top,#00695c,#00897b); /*Fx 3.6-15*/
    background: linear-gradient(to bottom, #00695c, #00897b); /*Standard*/
  }

  .black_title{
    color: rgba(0,0,0,.87) !important;
  }

  .white_title{
    color: rgba(255,255,255,.9) !important;
  }

  .headline {
    font-size: 18px !important;
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


</style>
