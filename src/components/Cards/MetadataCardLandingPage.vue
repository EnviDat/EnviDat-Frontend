<template>
    <v-card
      ripple
      @mouseover="hover = true"
      @mouseleave="hover = false"
      class="fill-height elevation-10 rounded-xl"
      :dark="false"
    >
      {{ modeData }}
      <!-- :style="{ backgroundColor: categoryColor }" -->
      <!-- <v-card-title primary-title class="pa-0"> -->

      <v-container class="fill-height category-card">
        <v-card
          class="pa-3 fill-height elevation-0 rounded-xl d-flex flex-column bgcCard"
        >
          <v-chip
            class="outlined flat pa-0 mb-4 d-flex aling-center justify-center"
            style="width: 100%; max-width: 150px;"
            size="x-large"
            :color="categoryColor"
          >
            <span class="text-subtitle-1 font-weight-bold">Category</span>
          </v-chip>
          <v-row class="category-title" no-gutters>
            <v-col class="pa-0" cols="12">
              <span class="text-h6 font-weight-bold">{{ truncatedTitle }}</span>
            </v-col>
          </v-row>
          <v-row class="category-subtitle pt-3" no-gutters>
            <v-col class="pa-0">
              {{ truncatedSubtitle }}
            </v-col>
          </v-row>
        </v-card>
        <v-row class="category-action">
          <v-col class="d-flex justify-space-between pa-6">
            <!-- class="primary" -->
            <!-- <v-icon style="width: 36px; height: 36px;" :color="categoryColor">
                forest
              </v-icon> -->
            <span class="text-body-1"> 10/10/2024</span>
            <v-btn rounded="xl" :color="'secondary'" @click="cardClick"
              >View</v-btn
            >
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

  //    import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

  //   import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

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
      modeData: Object,
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

        if (this.titleImg && this.$vuetify.breakpoint.mdAndUp) {
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
          (this.isCompactLayout &&
            this.title?.length > this.compactTitleLength) ||
          (!this.isCompactLayout &&
            !this.flatLayout &&
            this.title?.length > this.titleLength)
        );
      },
      isCompactLayout() {
        return this.compactLayout || this.$vuetify.breakpoint.smAndDown;
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
        const maxLength = 50;

        if (this.title?.length > maxLength) {
          return `${this.title.substring(0, maxLength)}...`;
        }

        return this.title;
      },

      truncatedSubtitle() {
        const maxLength = 200;
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

        return this.modeData.icons[keys[0]];
      },
    },
    created() {},
    methods: {
      darkenHex(hex, percent) {
        if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
          return hex;
        }

        let hexValue = hex.substring(1);
        if (hexValue.length === 3) {
          hexValue = hexValue
            .split('')
            .map(x => x + x)
            .join('');
        }
        const r = parseInt(hexValue.substring(0, 2), 16);
        const g = parseInt(hexValue.substring(2, 4), 16);
        const b = parseInt(hexValue.substring(4, 6), 16);

        const factor = 1 - Math.max(0, Math.min(100, percent)) / 100;

        const newR = Math.round(r * factor);
        const newG = Math.round(g * factor);
        const newB = Math.round(b * factor);

        const clampedR = Math.min(255, Math.max(0, newR));
        const clampedG = Math.min(255, Math.max(0, newG));
        const clampedB = Math.min(255, Math.max(0, newB));

        const newHex = `#${[clampedR, clampedG, clampedB]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('')}`;

        return newHex;
      },
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
      //   BaseIconButton,
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
  .category-card {
    display: grid;
    grid-template-rows: minmax(200px, auto) 20px;
  }
  .category-title {
    grid-row-start: 1;
  }
  .category-subtitle {
    grid-row-start: 2;
  }
  .category-action {
    grid-row-start: 3;
  }
  </style>
