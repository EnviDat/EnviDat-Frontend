<template>
    <v-card class="authorCard pa-4"
            :class="dataCreditLevel > 2 ? 'accentLink' : ''"
            :style="dynamicCardBackground"
            @click.native="cardClick" >

      <v-container fluid
                    class="pa-0" >

        <v-row no-gutters
                class="pb-3">

          <v-col class="grow py-0" >
            <div class="authorTitle"
                  :class="dark ? 'white--text' : 'black--text'" >
              {{ author.firstName }}
            </div>
          </v-col>

          <v-col v-if="authorIsDead"
                  class="shrink py-0" >

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on"
                        dark
                        :class="dark ? 'white--text' : 'black--text'">
                  hourglass_empty
                </v-icon>
              </template >

              {{ authorPassedInfo }}
            </v-tooltip>

          </v-col>

          <v-col class="py-0"
                  cols="12" >
            <div class="authorTitle"
                  :class="dark ? 'white--text' : 'black--text'" >
              {{ authorIsDead ? author.lastName.replace(`(${asciiDead})`, '') : author.lastName }}
            </div>
          </v-col>

        </v-row>

        <v-row no-gutters
                class="py-1 readableText"
                align="center"
                justify="space-between" >

          <v-col cols="6"
                  :class="dark ? 'white--text' : 'black--text'" >
            {{ dataCountLabel }} 
          </v-col>

          <v-col class="shrink py-0"                  
                  style="max-height: 36px;">

            <base-icon-button class="ma-0"
                              material-icon-name="search"
                              :iconColor="dark ? 'white' : darkColor"
                              outlined
                              :color="dark ? 'white' : darkColor"
                              :tooltipText="`Search for the datasets of ${author.firstName} ${author.lastName}`"
                              @clicked="catchSearchAuthor(author.fullName)" />

            <v-badge :color="dark ? 'white' : darkColor"                    
                      overlap
                      style="top: -25px; right: -2px;">
              <span slot="badge"
                    :class="!dark ? 'white--text' : 'black--text'" >
                    {{ author.datasetCount }}
              </span>
            </v-badge>

          </v-col>
        </v-row>

        <data-credit-layout v-if="authorDetailsConfig.showDataCredits"
                            class="px-0 py-1 readableText"
                            :dataCredit="author.dataCredit"
                            :badgesLabel="dataCreditBadgeLabel"
                            :iconColor="dark ? 'white' : 'black'"
                            :badgeColor="dark ? 'white' : darkColor"
                            :dark="!dark" />

        <v-row v-if="authorDetailsConfig.showDataCreditScore"
                no-gutters
                class="py-1 readableText"
                justify="space-between"
                align="center" >

          <v-col class="grow" 
                  :class="dark ? 'white--text' : 'black--text'" >
            {{ dataScoreLabel }}
          </v-col>

          <v-col class="shrink" >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on"
                        class="badgesIcon"
                        dark
                        :class="dark ? 'white--text' : 'black--text'">
                  info_outline
                </v-icon>
              </template>

              {{ dataCreditScoreInfo }}
            </v-tooltip>
          </v-col>

          <v-col class="shrink pl-2" >
            <div :style="`background-color: ${ !this.dark ? darkColor : whiteColor };`"
                  class="dataCreditScore elevation-5">

              <div :style="bigCountStyling"
                  :class="!this.dark ? 'white--text' : 'black--text'" >
                {{ dataCreditScore }}
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row v-if="authorDetailsConfig.showAuthorInfos"
                no-gutters
                class="pt-1 readableText"
                align="center" >

          <v-col class="grow pr-5" @click="infosExpanded = !infosExpanded">
            <v-divider :dark="dark" />
          </v-col>

          <v-col class="shrink" >
            <v-btn icon
                    :color="dark ? 'white' : 'black'"
                    outlined
                    class="ma-0 badgesIcon"
                    @click="infosExpanded = !infosExpanded">
              <v-icon> {{ infosExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_left' }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row  v-if="authorDetailsConfig.showAuthorInfos && infosExpanded"
                class="pa-0 readableText"
                no-gutters
                align="start">

          <v-col v-if="author.email && !authorIsDead"
                  class="pa-1"
                  cols="6" >
            <v-row no-gutters>
              <v-col cols="12" 
                      class="authorInfoLabel py-0"
                      :class="dark ? 'white--text' : 'black--text'" >
                {{ emailLabel }}
              </v-col>

              <v-col cols="12" 
                      class="authorInfo py-0"
                      :class="dark ? 'white--text' : 'black--text'" >
                <a :href="`mailto:${author.email}`" >
                  {{ author.email }}
                </a>
              </v-col>
            </v-row>
          </v-col>

          <v-col v-if="author.id && author.id.identifier"
                  class="pa-1"
                  cols="6" >
            <v-row no-gutters>
              <v-col cols="12" 
                      class="authorInfoLabel py-0"
                      :class="dark ? 'white--text' : 'black--text'" >
                {{ author.id.type ? author.id.type : idLabel }}
              </v-col>

              <v-col cols="12" 
                      class="authorInfo py-0"
                      :class="dark ? 'white--text' : 'black--text'" >

                <a v-if="(author.id.type && author.id.type === 'orcid') || isOrcId(formatIdentifier(author.id.identifier))"
                    :href="`https://orcid.org/${formatIdentifier(author.id.identifier)}`"
                    rel="noopener noreferrer"
                    target="_blank" >
                  {{ formatIdentifier(author.id.identifier) }}
                </a>
                <div v-else>{{ formatIdentifier(author.id.identifier) }}</div>

              </v-col>
            </v-row>
          </v-col>

          <v-col v-if="author.affiliation"
                  class="pa-1"
                  cols="6">
            <v-row no-gutters>
              <v-col cols="12" 
                      class="authorInfoLabel py-0"
                      :class="dark ? 'white--text' : 'black--text'" >
                {{ affiliationLabel }}
              </v-col>

              <v-col cols="12" 
                      class="authorInfo py-0"
                      :class="dark ? 'white--text' : 'black--text'" >
                {{ author.affiliation }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>

      </v-container>

      <!-- <div id="wrapper"
            style="position: absolute; top: 0; right: 0;"
            class="pa-4">

        <svg class="progress"
              :data-progress="levelProgress"
              x="0px" y="0px"
              viewBox="0 0 776 628">

          <path ref="progressTrack"
                class="track"
                viewBox="0 0 500 500"
                d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z">
          </path>

          <path ref="progressFill"
                class="fill"
                d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z">
          </path>
          
          <text class="value"
                style="fill: white;"
                x="50%" y="73%">
            {{ dataCreditLevel }}
          </text>
        </svg>
      </div> -->

    </v-card>

</template>


<script>
import {
  AUTHORS_PUBLISHED_DATACOUNT,
  AUTHORS_DATACREDIT_CONTRIBUTION,
  AUTHORS_DATACREDIT_SCORE,
} from '@/factories/metadataConsts';

import DataCreditLayout from '@/components/Layouts/DataCreditLayout';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import { BROWSE_PATH } from '@/router/routeConsts';
import {
  getLevelProgress,
  getDataCreditLevel,
} from '@/factories/authorFactory';

// checkout skeleton
// https://github.com/ToxicJojo/SkeletonPlaceholder

export default {
  name: 'AuthorCard',
  components: {
    DataCreditLayout,
    BaseIconButton,
  },
  props: {
    author: Object,
    asciiDead: String,
    authorPassedInfo: String,
    authorDetailsConfig: {
      type: Object,
      default: () => ({
        showAuthorInfos: true,
        showDatatCredits: true,
        showDataCreditScore: true,
      }),
    },
  },
  mounted() {
    // this.setLevelProgress();
  },
  computed: {
    // getDataCreditLevel(currentScore) {
    //   const entires = this.authorDataCreditLevels;

    //   for (let i = 0; i < entires.length; i++) {
    //     const scoreLvl = entires[i];
    //     if (currentScore >= scoreLvl.score) {
    //       return scoreLvl.lvl;
    //     }
    //   }

    //   return 0;
    // },
    dark() {
      return this.dataCreditLevel >= 6;
    },
    dataCredits() {
      return this.author && this.author.dataCredit ? Object.keys(this.author.dataCredit) : [];
    },
    dataCreditLevel() {
      return getDataCreditLevel(this.dataCreditScore);
    },
    dataCreditLevelColor() {
      return this.colorPalette[this.dataCreditLevel];
    },
    levelProgress() {
      return getLevelProgress(this.dataCreditScore);
    },
    dataCreditScore() {
      let score = 0;

      if (this.author) {
        // a dataset counts two points
        score = this.author.datasetCount * 2;

        if (this.author.dataCredit) {
          const counts = Object.values(this.author.dataCredit);

          for (let i = 0; i < counts.length; i++) {
            const creditCount = counts[i];
            score += creditCount;
            if (creditCount > 0) {
              // add +4 for every dataCredit made so it gives
              // least 5 points for each datacredit
              score += 4;
            }
          }
        }
      }

      return score;
    },
    bigCountStyling() {
      let style = `width: ${this.dataCreditSize}px; height: ${this.dataCreditSize}px; line-height: 42px; `;

      if (this.dataCreditScore >= 100) {
        style = `${style}position: relative; top: 3px;`;
      }

      return style;
    },
    smallCountStyling() {
      let style = `width: ${this.dataCreditSize * 0.55}px; height: ${this.dataCreditSize * 0.55}px;`;

      if (this.dataCreditScore >= 100) {
        style = `${style}position: relative; top: 3px;`;
      }

      return style;
    },
    dataCreditSize() {
      let minSize = 45;

      if (this.dataCreditScore >= 100) {
        minSize = 50;
      }

      return minSize;
    },
    dynamicCardBackground() {
      if (this.dataCreditLevel === 0) {
        return 'background-color: #fff';
      }

      const color = this.colorPalette[this.dataCreditLevel - 1];
      const toColor = this.colorPaletteTo[this.dataCreditLevel - 1];

      return `background-image: linear-gradient(45deg, ${color} 10%, ${toColor} 90%);
              background-position: center, center; background-size: cover;`;
    },
    authorIsDead() {
      return this.asciiDead && this.author.fullName ? this.author.fullName.match(this.asciiDead) : false;
    },
  },
  methods: {
    setLevelProgress() {
      const max = 2160;
      let style = `stroke-dashoffset: ${((100 - this.levelProgress) / 100) * max}; stroke: ${this.$vuetify.theme.themes.light.accent} !important;`;
      this.$refs.progressFill.setAttribute('style', style);
      style = `stroke: ${this.dataCreditLevelColor} !important;`;
      this.$refs.progressTrack.setAttribute('style', style);
    },
    isOrcId(id) {
      return id.match(RegExp(/^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/g));
    },
    formatIdentifier(id) {
      if (id.includes('https://')) {
        const splits = id.split('/');
        return splits[splits.length - 1];
      }

      return id;
    },
    dataCreditsCount(credit) {
      return this.author.dataCredit ? this.author.dataCredit[credit] : '';
    },
    cardClick() {
    },
    catchSearchAuthor(search) {
      this.mixinMethods_additiveChangeRoute(BROWSE_PATH, search);
    },
    verticalLineStyle(color) {
      return `border-left: thick solid ${color}`;
    },
  },
  data: () => ({
    dataScoreLabel: AUTHORS_DATACREDIT_SCORE,
    dataCountLabel: AUTHORS_PUBLISHED_DATACOUNT,
    dataCreditScoreInfo: 'Data Credit Score: represents the dedication of an author to publish data and declare how on their involvement was in a dataset.',
    dataCreditBadgeLabel: AUTHORS_DATACREDIT_CONTRIBUTION,
    emailLabel: 'Email',
    affiliationLabel: 'Affiliation',
    idLabel: 'Identifier',
    blackTopToBottom: 'rgba(20,20,20, 0.1) 0%, rgba(20,20,20, 0.9) 60%',
    whiteTopToBottom: 'rgba(255,255,255, 0.6) 0%, rgba(255,255,255, 0.99) 70%',
    infosExpanded: false,
    // darkColor: '#231F20',
    darkColor: '#384753',
    whiteColor: '#EFEFEF',
    colorPalette: ['rgb(226, 242, 124)', 'rgb(158, 219, 129)', 'rgb(0, 191, 173)', 'rgb(8, 135, 124)', 'rgb(153, 88, 209)', 'rgb(17, 17, 17)'],
    colorPaletteTo: ['rgba(226, 242, 124, 0.4)', 'rgba(158, 219, 129, 0.4)', 'rgba(0, 191, 173, 0.4)', 'rgba(8, 135, 124, 0.4)', 'rgba(153, 88, 209, 0.4)', 'rgba(17, 17, 17, 0.4)'],
    // colorsPalette: ['#E2F27C', '#9EDB81', '#00BFAD', '#08877C', '#111111'],
  }),
};
</script>

<style scoped>

  div.v-card__title {
    position: relative;
    z-index: 10;
  }

  .dataCreditScore {
    border-radius: 50% !important;
    text-align: center;
    font-size: 28px !important;
    /* font-weight: bold !important; */
    position: relative;
    z-index: 1;
    /* border-style: solid; */
  }

  .authorCard {
    border-radius: 20px;
    line-height: 1rem;
  }

  .accentLink a {
    color: #FFD740;
  }

  .authorTitle {
    margin: 0;
    padding: 0;
    line-height: 2.5rem;
    word-break: break-word;
    font-size: 34px !important;
    font-weight: 400 !important;
    font-family: 'Raleway', serif !important;
  }

  .subheading {
    font-size: 14px !important;
  }

  .badgesIcon {
    opacity: 0.75;
  }

  .authorInfoLabel {
    opacity: 0.65;
  }

  .progress {
    width: 40px;
    height: 40px;
  }
  .progress .track, .progress .fill{
    stroke-width: 65;
    transform: translate(290px, 800px)rotate(-120deg);
  }
  .progress .track{
    /* stroke: rgb(56, 71, 83); */
    fill: rgb(56, 71, 83);
  }
  .progress .fill {
    fill: rgba(56, 71, 83, 0);
    stroke-linecap: round;
    stroke-dasharray: 2160;
    stroke-dashoffset: 2160;
    transition: stroke-dashoffset 1s;
  }

  .progress .value, .progress .text {
    fill: 'black';
    text-anchor: middle;
  }
  .progress .value {
    font-size: 500px;
  }

</style>
