<template>
  <v-card
    :id="`resourceCard_${id}`"
    :color="computedCardColor"
    :class="isSelected ? 'highlighted' : ''"
    :style="{ height: useAutoHeight ? 'auto' : '100%' }"
    :loading="loadingColor"
  >
    <v-card-title
      class="text-h5 resourceHeadline pt-4"
      :class="{
        'text-white': !dark,
        'text-black': dark,
      }"
    >
      <v-row no-gutters justify="start">
        <v-col v-if="isProtected" class="flex-grow-0 pr-2">
          <BaseIcon color="grey-darken-3" :icon="mdiLock"></BaseIcon>
        </v-col>
        <v-col v-if="deprecated" class="flex-grow-0 pr-2">
          <BaseIcon color="white" :icon="mdiCancel"></BaseIcon>
        </v-col>
        <v-col style="text-wrap: balance">
          {{ resourceName }}
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text
      class="pt-0 mt-2"
      :class="{
        'pb-5': !showFullDescription,
        'pb-10': showFullDescription,
        'pr-2': showFullDescription,
        'pb-md-3': !showFullDescription,
        'pb-md-10': showFullDescription,
      }"
    >
      <v-container class="pa-0" fluid>
        <v-row no-gutters>
          <v-col
            v-if="showFullDescription || (!showFullDescription && !maxDescriptionLengthReached)"
            class="readableText heightAndScroll"
            :class="{
              'text-white': !dark,
              'text-black': dark,
            }"
            :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
          >
            <div class="resourceCardText" v-html="markdownText" />
          </v-col>

          <v-col v-if="!showFullDescription && maxDescriptionLengthReached" class="readableText resourceCardText">
            {{ markdownTextTruncated }}
          </v-col>
        </v-row>

        <v-row v-if="!showFullDescription" no-gutters>
          <v-col>
            <v-divider :dark="dark" class="mt-4 mb-2" />
          </v-col>
        </v-row>

        <v-row v-if="!showFullDescription" no-gutters class="resourceInfo">
          <v-col v-if="isProtected" cols="12" class="py-1">
            <BaseIconLabelView
              text="This resource is private"
              :icon="mdiLock"
              :light="dark"
              :dark="!dark"
              class="mb-1"
            />
          </v-col>

          <v-col v-if="canDataViz" cols="12" class="py-1">
            <v-row no-gutters style="opacity: 1 !important" align="center">
              <v-col class="flex-grow-1">
                <SparkChart :data="chartPreviewData" />
              </v-col>

              <v-col class="flex-grow-0">
                <BaseIconButton
                  :icon="mdiChartBar"
                  icon-color="black"
                  color="accent"
                  elevated
                  :tooltip-text="chartPreviewTooltip"
                  @clicked="$emit('openButtonClicked')"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col v-if="doi" cols="12" class="py-1">
            <BaseIconLabelView
              :text="doi"
              :icon="mdiFingerprint"
              :icon-tooltip="EDIT_METADATA_DOI_LABEL"
              :light="dark"
              :dark="!dark"
              class="mb-1"
            />
          </v-col>

          <v-col v-if="format" cols="12" class="py-1">
            <BaseIconLabelView
              :text="formatedBytes ? `${format} - ${formatedBytes}` : format"
              :icon="extensionIcon"
              :icon-tooltip="formatedBytes ? 'Resource type and size' : 'Resource type'"
              :light="dark"
              :dark="!dark"
            />
          </v-col>

          <v-col v-if="created" cols="12" class="py-1">
            <BaseIconLabelView
              :text="readableCreated"
              :icon="mdiTimerPlusOutline"
              icon-tooltip="Date of resource creation"
              :light="dark"
              :dark="!dark"
              class="mb-1"
            />
          </v-col>

          <v-col v-if="lastModified" cols="12" class="py-1">
            <BaseIconLabelView
              :text="readableLastModified"
              :icon="mdiUpdate"
              icon-tooltip="Date of last modification"
              :light="dark"
              :dark="!dark"
              class="mb-1"
            />

            <!-- <base-icon-label-view
              v-if="isDownloaded"
            />
          </v-col>

          <v-col v-if="isDownloaded"
                 cols="12"
                 class="py-1"
          >
             <base-icon-label-view
              :text="'Number of Downloads: ' + String(numberOfDownload)"
              material-icon-name="download"
              icon-tooltip="Number of downloads"
              dark
              class="mb-1"
            /> -->
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-container
      v-if="showGenericOpenButton && !isProtected"
      class="pa-4"
      :style="`z-index: 999; position: absolute; right: 0; width: 68px; ${genericButtonYPos}`"
    >
      <v-row>
        <v-col cols="12">
          <BaseIconButton
            :icon="openButtonIcon"
            icon-color="black"
            color="white"
            elevated
            :tooltip-text="openButtonTooltip"
            :disabled="!downloadActive"
            @clicked="$emit('openButtonClicked')"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- it's not possible to always use directly v-card-actions
    because for the S3 bucket file list, the list should appear
    beneath the icon buttons, there the wrapper with the relative positioning -->
    <v-container fluid :style="`position: ${isEnvicloudUrl ? 'relative' : 'initial'}`" class="py-0">
      <!-- moved inside the relative container for resolve the issue of positioning -->
      <v-card-actions class="ma-0" style="position: absolute; bottom: 0; right: 0; width: 120px; z-index: 2">
        <v-row no-gutters justify="end">
          <v-col v-if="maxDescriptionLengthReached" cols="6" class="pa-2">
            <BaseIconButton
              :icon="mdiChevronDown"
              :icon-color="showFullDescription ? 'primary' : 'accent'"
              :color="showFullDescription ? 'accent' : 'black'"
              :outlined="true"
              outline-color="accent"
              elevated
              :rotated="showFullDescription"
              :tooltipText="showFullDescription ? 'Hide full description' : 'Show full description'"
              @clicked="showFullDescription = !showFullDescription"
            />
          </v-col>

          <v-col v-if="!isProtected" cols="6" class="pa-2">
            <!-- New version with S3 Component -->
            <BaseIconButton
              :icon="isFile ? mdiDownload : mdiLink"
              icon-color="black"
              @clicked="trackDownload(url, resourceName)"
              color="accent"
              elevated
              :tooltip-text="isFile ? 'Download resource' : 'Open link'"
              :url="url"
              :disabled="!downloadActive"
            />
          </v-col>

          <v-col v-if="isProtected" cols="6">
            <div
              class="fabMenu fabPosition elevation-5 ma-4"
              :class="downloadActive ? 'fabMenuHover' : 'fabMenuDisabled'"
            >
              <BaseIcon :icon="mdiShield" color="grey-darken-3" />
              <div v-if="downloadActive" class="pt-2 lockedText text-black protectedLink">
                <p v-html="protectedText"></p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-container>

    <v-card-text v-if="isEnvicloudUrl && !isProtected" class="pa-4 pt-0">
      <v-divider />

      <S3Tree dark :url="url" @loadingChanged="catchLoadingChanged" @changeAutoHeight="catchChangeHeight" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
/**
 * ResourceCard.vue create a card with a download link to a specific resource of a dataset.
 *
 * @summary card with download link of file or link to another downlaod
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-08-18 10:46:54
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  mdiCancel,
  mdiChevronDown,
  mdiDownload,
  mdiFingerprint,
  mdiLink,
  mdiLock,
  mdiMonitorEye,
  mdiShield,
  mdiTimerPlusOutline,
  mdiUpdate,
  mdiFileDocumentCheckOutline,
  mdiChartBar,
} from '@mdi/js';

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView.vue';

import S3Tree from '@/modules/s3/components/S3Tree.vue';
import SparkChart from '@/components/Charts/SparkChart.vue';

import { renderMarkdown, stripMarkdown } from '@/factories/stringFactory';
import { formatBytes, getResourceName } from '@/factories/resourceHelpers';
import { EDIT_METADATA_DOI_LABEL, RESOURCE_FORMAT_LINK } from '@/factories/metadataConsts';
import { getFileIcon } from '@/factories/imageFactory';

import { trackDownload } from '@/utils/matomoTracking';

import { formatDate } from '@/factories/dateFactory';
import { chartPreviewData } from '@/modules/charts/middelware/chartServiceLayer';

export default {
  name: 'ResourceCard',
  components: {
    SparkChart,
    BaseIcon,
    BaseIconLabelView,
    BaseIconButton,
    S3Tree,
  },
  props: {
    id: String,
    doi: String,
    name: String,
    /*
    autoHeight: Boolean,
*/
    description: String,
    url: String,
    restrictedUrl: String,
    created: String,
    lastModified: String,
    size: Number,
    sizeFormat: String,
    format: String,
    twoColumnLayout: Boolean,
    height: String,
    s3Bucket: {
      type: Boolean,
      default: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    isProtected: Boolean,
    metadataContact: String,
    deprecated: Boolean,
    numberOfDownload: Number,
    downloadActive: {
      type: Boolean,
      default: true,
    },
    showGenericOpenButton: {
      type: Boolean,
      default: false,
    },
    genericOpenButtonBottom: {
      type: Boolean,
      default: false,
    },
    openButtonTooltip: String,
    openButtonIcon: {
      type: String,
      default: mdiMonitorEye,
    },
    cardColor: {
      type: String,
      default: 'primary',
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    loading: Boolean,
    sparkChartLabels: {
      type: Array,
      required: false,
      default: undefined,
    },
    canDataViz: Boolean,
  },
  mounted() {},
  beforeUnmount() {
    // reset store before unmount the component
  },
  computed: {
    loadingColor() {
      if (this.loadingResource) {
        return 'accent';
      }

      return undefined;
    },
    loadingResource() {
      return this.loading || this.isLoadingS3Tree;
    },
    isEnvicloudUrl() {
      const urlToCheck = this.url;
      return urlToCheck.includes('envicloud');
    },
    isDownloaded() {
      return this.numberOfDownload > 0;
    },
    computedCardColor() {
      return this.deprecated ? 'grey' : this.cardColor;
    },
    readableCreated() {
      return formatDate(this.created) || this.created;
    },
    readableLastModified() {
      return formatDate(this.lastModified) || this.lastModified;
    },
    resourceName() {
      return getResourceName(this);
    },
    scrollbarColorFront() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.colors.highlight : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
    markdownText() {
      if (!this.description) {
        return '';
      }

      return renderMarkdown(this.description.trim());
    },
    markdownTextTruncated() {
      if (!this.description) {
        return '';
      }

      if (this.maxDescriptionLengthReached) {
        const strippedMarkdown = stripMarkdown(this.description.trim());

        if (strippedMarkdown) {
          return `${strippedMarkdown.substring(0, this.maxDescriptionLength)}...`;
        }

        return '';
      }

      return this.description.trim();
    },
    formatedBytes() {
      if (!this.size) return '';

      let sizeNumber = this.size;

      if (typeof this.size === 'number') {
        sizeNumber = Number.parseInt(this.size, 10);
      }

      if (this.sizeFormat) {
        return `${sizeNumber} ${this.sizeFormat}`;
      }

      return formatBytes(sizeNumber);
    },

    isLink() {
      return (
        this.format && (this.format.toLowerCase() === 'link' || this.format.toLowerCase() === RESOURCE_FORMAT_LINK)
      );
    },
    isFile() {
      let isFile =
        !this.format || !(this.format.toLowerCase() === 'link' || this.format.toLowerCase() === RESOURCE_FORMAT_LINK);

      if (isFile && this.url) {
        const splits = this.url.split('/');
        const lastPart = splits[splits.length - 1];
        isFile = lastPart.includes('.');
      }

      return isFile;
    },
    maxDescriptionLengthReached() {
      return this.description && this.description.length > this.maxDescriptionLength;
    },
    protectedText() {
      if (this.restrictedUrl && this.restrictedUrl.length > 0) {
        return `This resource is protected <a href="${this.restrictedUrl}" target="_blank" rel="noopener noreferrer" >login via the legacy UI to get access</a>.`;
      }

      return `Could not load the resource, please contact ${this.metadataContact} for getting access or envidat@wsl.ch for support.`;
    },
    genericButtonYPos() {
      if (this.genericOpenButtonBottom) {
        return this.isEnvicloudUrl ? 'bottom: 0;' : 'bottom: 52px';
      }

      return 'top: 0;';
    },
    extensionIcon() {
      return getFileIcon(this.format);
    },
  },
  methods: {
    catchLoadingChanged(isLoading) {
      this.isLoadingS3Tree = isLoading;
    },
    catchChangeHeight(useAutoHeight) {
      this.useAutoHeight = useAutoHeight;
    },
    trackDownload,
  },
  data: () => ({
    mdiChartBar,
    mdiShield,
    mdiChevronDown,
    mdiDownload,
    mdiLink,
    mdiFingerprint,
    mdiLock,
    mdiTimerPlusOutline,
    mdiUpdate,
    mdiFileDocumentCheckOutline,
    mdiCancel,
    maxDescriptionLength: 175,
    showFullDescription: false,
    audioFormats: ['mp3', 'wav', 'wma', 'ogg'],
    EDIT_METADATA_DOI_LABEL,
    chartPreviewTooltip: 'Visualize the data',
    chartPreviewData,
    isLoadingS3Tree: false,
    useAutoHeight: false,
  }),
};
</script>

<style lang="scss" scoped>
.fabPosition {
  position: absolute;
  bottom: 0;
  right: 0;
}

.fabMenu {
  width: 48px;
  height: 48px;
  background-color: #ffd740;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fabMenuDisabled {
  opacity: 0.5;
  background-color: grey !important;
}

.fabMenuHover:hover,
.fabMenuHover:active {
  background: #fff;
  color: black !important;
  min-width: 160px;
  min-height: 160px;
  width: 100%;
  height: 100%;
  border-radius: 3px 3px;
  display: inherit;
  padding: 8px;

  a {
    color: rgb(var(--v-theme-primary)) !important;
  }

  .lockedText {
    display: inherit;
    opacity: 1;
  }
}
</style>

<style>
.resourceCardText p a {
  color: #ffd740 !important;
}
.resourceCardText img {
  width: 100%;
  height: auto;
}
</style>

<style scoped>
.resourceHeadline {
  line-height: 1.5rem;
}

.black_title {
  color: rgba(0, 0, 0, 0.87) !important;
}

.white_title {
  color: rgba(255, 255, 255, 0.9) !important;
}

.heightAndScroll {
  max-height: 400px;
  overflow-y: auto !important;
  scrollbar-width: thin;
}

.lockedText {
  display: none;
  opacity: 0;
}

.resourceInfo {
  font-size: 12px !important;
  line-height: 0.8rem !important;
  opacity: 0.9;
}

.protectedLink {
  font-size: 12px;
  overflow: hidden;
}

.highlighted {
  box-shadow: #ffd740 0 0 5px 5px !important;
}
</style>
