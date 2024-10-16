<template>
  <v-card class="authorCard pa-0"
          id="AuthorCard"
          :class="cardClass"
          :style="dynamicCardBackground"
          :loading="loadingColor">

    <v-container fluid
                 class="pa-4">

      <v-row no-gutters
             class="pb-3">

        <v-col class="flex-grow-1 py-0">
          <div class="authorTitle"
               :class="dark ? 'text-white' : 'text-black'">
            {{ author.firstName }}
          </div>
        </v-col>

        <v-col v-if="authorIsDead"
               class="flex-grow-0 py-0">

          <v-tooltip location='bottom'>
            <template v-slot:activator="{ props }">
              <BaseIcon 
                v-bind="props"
                :icon="mdiTimerSandComplete"
                small
                class='pr-2'
              />
            </template>

            {{ authorPassedInfo }}
          </v-tooltip>
        </v-col>

        <v-col class="py-0"
               cols="12">
          <div class="authorTitle"
               :class="dark ? 'text-white' : 'text-black'">
            {{ authorIsDead ? author.lastName.replace(`(${asciiDead})`, '') : author.lastName }}
          </div>
        </v-col>
      </v-row>

      <v-row v-if="authorDetailsConfig.showDatasetCount"
             no-gutters
             class="py-1 readableText"
             align="center"
             justify="space-between">

        <v-col cols="6"
               :class="dark ? 'text-white' : 'text-black'">
          {{ dataCountLabel }}
        </v-col>

        <v-col class="flex-grow-0 py-0"
               style="max-height: 36px;">

          <BaseIconButton 
            class="ma-0"
            :icon="mdiMagnify"
            :outline-color="dark ? 'white' : darkColor"
            :icon-color="dark ? 'white' : darkColor"
            outlined
            :tooltip-text="`Search for the datasets of ${author.firstName} ${author.lastName}`"
            @clicked="catchSearchAuthor(author)"
          />

          <v-badge :color="dark ? 'white' : darkColor"
                   overlap
                   style="position:relative; top: -20px; right: -2px;"
                   :content="author.datasetCount || 0">
          </v-badge>
        </v-col>
      </v-row>

      <slot name="dataCreditCurrentDataset" />

      <DataCreditLayout
        v-if="authorDetailsConfig.showDataCredits && !hideDataCredit"
        :totalDataCredits="author.totalDataCredits"
        :badgesLabel="dataCreditBadgeLabel"
        :iconColor="dark ? 'white' : 'black'"
        :badgeColor="dark ? 'white' : darkColor"
        :dark="dark"
      />

      <v-row v-if="authorDetailsConfig.showDataCreditScore"
             no-gutters
             class="py-1 readableText"
             justify="space-between"
             align="center">

        <v-col class="flex-grow-1"
               :class="dark ? 'text-white' : 'text-black'">
          {{ dataScoreLabel }}
        </v-col>

        <v-col class="flex-grow-0">
          <v-tooltip location='bottom'>
            <template v-slot:activator="{ props }">
              <BaseIcon v-bind="props"
                        :color="dark ? 'white' : 'black'"
                        :icon="mdiInformationOutline"
              />
            </template>

            {{ dataCreditScoreInfo }}
          </v-tooltip>
        </v-col>

        <v-col class="flex-grow-0 pl-2">
          <div :style="`background-color: ${ dark ? whiteColor : darkColor };`"
               class="dataCreditScore elevation-5">

            <div :style="bigCountStyling"
                 :class="dark ? 'text-black' : 'text-white'">
              {{ dataCreditScore }}
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row
        v-if="authorDetailsConfig.showAuthorInfos"
        no-gutters
        class="pt-1 readableText"
        align="center"
      >
        <v-col class="flex-grow-1 pr-5" @click="infosExpanded = !infosExpanded">
          <v-divider :dark="dark" />
        </v-col>

        <v-col class="flex-grow-0">
          <BaseIconButton 
            :icon="infosExpanded ? mdiChevronDown : mdiChevronLeft"
            :icon-color="dark ? 'white' : darkColor"
            :outline-color="dark ? 'white' : darkColor"
            outlined
            class="ma-0 badgesIcon"
            @clicked="infosExpanded = !infosExpanded"
          />
        </v-col>
      </v-row>

      <v-row
        v-if="authorDetailsConfig.showAuthorInfos && infosExpanded"
        class="pa-0 readableText"
        no-gutters
        align="start"
      >
        <v-col class="pa-1" sm="12" cols="12">
          <v-row no-gutters>
            <DataCreditLayout
              v-if="authorDetailsConfig.showDataCredits && hideDataCredit"
              :totalDataCredits="author.totalDataCredits"
              :badgesLabel="dataCreditBadgeLabel"
              :iconColor="dark ? 'white' : 'black'"
              :badgeColor="dark ? 'white' : darkColor"
              :dark="dark"
            />
          </v-row>
        </v-col>

        <v-col class="pa-1" sm="6" cols="12">
          <v-row no-gutters>
            <v-col
              cols="12"
              class="authorInfoLabel py-0"
              :class="dark ? 'text-white' : 'text-black'"
            >
              {{ emailLabel }}
            </v-col>

            <v-col
              cols="12"
              class="authorInfo py-0"
              :class="dark ? 'text-white' : 'text-black'"
            >
              <a :href="`mailto:${author.email}`">
                {{ author.email }}
              </a>
            </v-col>
          </v-row>
        </v-col>

        <v-col class="pa-1" sm="6" cols="12" v-if="author?.identifier">
          <v-row no-gutters>

            <v-col
              cols="12"
              class="authorInfoLabel py-0"
              :class="dark ? 'text-white' : 'text-black'"
            >
              {{ idLabel }}
            </v-col>

            <v-col
              cols="12"
              class="authorInfo py-0"
              :class="dark ? 'text-white' : 'text-black'"
            >
              <a
                v-if="
                  (author.identifierType &&
                    author.identifierType === 'orcid') ||
                    isOrcId(author.identifier)
                "
                :href="
                  `https://orcid.org/${formatIdentifier(author.identifier)}`
                "
                rel="noopener noreferrer"
                target="_blank"
              >
                {{ formatIdentifier(author.identifier) }}
              </a>
              <div v-else>{{ formatIdentifier(author.identifier) }}</div>
            </v-col>
          </v-row>
        </v-col>

        <v-col class="pa-1" sm="6" cols="12" v-if="author.affiliation">
          <v-row no-gutters>
            <v-col cols="12"
                   class="authorInfoLabel py-0"
                   :class="dark ? 'text-white' : 'text-black'">
              {{ affiliationLabel }}
            </v-col>

            <v-col cols="12"
                   class="authorInfo py-0"
                   :class="dark ? 'text-white' : 'text-black'">
              {{ author.affiliation }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-container
      v-if="showGenericOpenButton"
      class="ma-2 pa-0"
      style="position: absolute; top: 0; right: 0; width: 40px;"
    >
      <v-row>
        <v-col cols="12">

          <base-icon-button 
            :icon="openButtonIcon"
            icon-color="black"
            color="accent"
            :disabled="loading"
            elevated
            :tooltip-text="openButtonTooltip"
            @clicked="$emit('openButtonClicked')"
          />

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

import DataCreditLayout from '@/components/Layouts/DataCreditLayout.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import {
  getLevelProgress,
  getDataCreditLevel,
  getAuthorName,
} from '@/factories/authorFactory';
import {
  mdiChevronDown,
  mdiChevronLeft,
  mdiFileEye,
  mdiInformationOutline,
  mdiMagnify,
  mdiTimerSandComplete,
} from '@mdi/js';

// checkout skeleton
// https://github.com/ToxicJojo/SkeletonPlaceholder

export default {
  name: 'AuthorCard',
  props: {
    author: Object,
    asciiDead: String,
    authorPassedInfo: String,
    authorDetailsConfig: {
      type: Object,
      default: () => ({
        showAuthorInfos: true,
        showDataCredits: true,
        showDataCreditScore: true,
        showDatasetCount: true,
      }),
    },
    showGenericOpenButton: {
      type: Boolean,
      default: false,
    },
    hideDataCredit: {
      type: Boolean,
      default: false,
    },
    openButtonTooltip: String,
    openButtonIcon: {
      type: String,
      default: mdiFileEye,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    overrideAuthorInfosExpanded: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // this.setLevelProgress();
    this.infosExpanded = this.overrideAuthorInfosExpanded;
  },
  computed: {
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
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
    cardClass() {
      return {
        accentLink: this.dataCreditLevel > 2,
        highlighted: this.isSelected || this.author?.isSelected,
      };
    },
    dark() {
      return this.dataCreditLevel >= 6;
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

        if (this.author.totalDataCredits) {
          const counts = Object.values(this.author.totalDataCredits);

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
      let style = `width: ${this.dataCreditSize * 0.55}px; height: ${this
        .dataCreditSize * 0.55}px;`;

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
      let from = 0;
      let to = 0;

      if (this.dataCreditLevel > 0) {
        from = this.dataCreditLevel - 1;
        to = this.dataCreditLevel - 1;
      }

      const color = this.colorPalette[from];
      const toColor = this.colorPaletteTo[to];

      return `background-image: linear-gradient(310deg, ${color} 10%, ${toColor} 45%);
              background-position: center, center; background-size: cover;`;
    },
    authorIsDead() {
      if (!this.asciiDead) {
        return false;
      }

      return (
        this.author?.firstName?.includes(this.asciiDead) ||
        this.author?.lastName?.includes(this.asciiDead) ||
        false
      );
    },
  },
  methods: {
    setLevelProgress() {
      const max = 2160;

      let style = `stroke-dashoffset: ${((100 - this.levelProgress) / 100) * max};
                   stroke: ${this.$vuetify.theme.themes.light.colors.accent} !important;`;

      this.$refs.progressFill.setAttribute('style', style);

      style = `stroke: ${this.dataCreditLevelColor} !important;`;
      this.$refs.progressTrack.setAttribute('style', style);
    },
    isOrcId(id) {
      if (!id) {
        return false;
      }

      return id.match(
        /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/g,
      );
    },
    formatIdentifier(id) {
      if (!id) {
        return '';
      }

      if (id.includes('https://')) {
        const splits = id.split('/');
        return splits[splits.length - 1];
      }

      return id;
    },
    dataCreditsCount(credit) {
      return this.author.totalDataCredits
        ? this.author.totalDataCredits[credit]
        : '';
    },
    catchSearchAuthor(author) {
      const fullName = getAuthorName(author);
      this.$emit('catchSearchAuthor', fullName);
    },
    verticalLineStyle(color) {
      return `border-left: thick solid ${color}`;
    },
  },
  data: () => ({
    mdiFileEye,
    mdiInformationOutline,
    mdiTimerSandComplete,
    mdiChevronDown,
    mdiChevronLeft,
    mdiMagnify,
    dataScoreLabel: AUTHORS_DATACREDIT_SCORE,
    dataCountLabel: AUTHORS_PUBLISHED_DATACOUNT,
    dataCreditScoreInfo:
      'Data Credit Score: represents the dedication of an author to publish data and declare how on their involvement was in a dataset.',
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
    colorPalette: [
      'rgb(226, 242, 124)',
      'rgb(158, 219, 129)',
      'rgb(0, 191, 173)',
      'rgb(8, 135, 124)',
      'rgb(153, 88, 209)',
      'rgb(55, 55, 55)',
    ],
    colorPaletteTo: [
      'rgba(226, 242, 124, 0.4)',
      'rgba(158, 219, 129, 0.4)',
      'rgba(0, 191, 173, 0.4)',
      'rgba(8, 135, 124, 0.4)',
      'rgba(153, 88, 209, 0.4)',
      'rgba(55, 55, 55, 0.4)',
    ],
    // colorsPalette: ['#E2F27C', '#9EDB81', '#00BFAD', '#08877C', '#111111'],
  }),
  components: {
    BaseIcon,
    DataCreditLayout,
    BaseIconButton,
  },
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

.progress .track,
.progress .fill {
  stroke-width: 65;
  transform: translate(290px, 800px) rotate(-120deg);
}

.progress .track {
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

.progress .value,
.progress .text {
  /* fill: 'black'; */
  text-anchor: middle;
}

.progress .value {
  font-size: 500px;
}

.highlighted {
  box-shadow: #71c5bd 0 0 5px 5px !important;
}
</style>
