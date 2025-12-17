<template>
  <v-card
    :id="`resourceListCard_${id}`"
    class="rounded pa-0 fill-height"
    :loading="loadingColor"
    :color="deprecated ? 'grey' : undefined"
  >
    <v-card-title
      class="text-h5 resourceHeadline pa-4"
      :class="{
        'text-white': !dark,
        'text-black': dark,
      }"
    >
      <v-row no-gutters justify="start">
        <v-col v-if="deprecated" class="flex-grow-0 pr-2">
          <BaseIcon color="white" :icon="mdiCancel"></BaseIcon>
        </v-col>
        <v-col style="text-wrap: balance" cols="7" md="9">
          {{ resourceName }}
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text class="pt-0 mt-2 pb-5 pb-md-3">
      <v-container class="pa-0" fluid>
        <v-row no-gutters class="resourceInfo">
          <v-col v-if="isProtected" class="py-1">
            <v-tooltip
              text="This resource is private, request access with the link on the yellow button"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" density="compact" :prepend-icon="mdiLock">Private Resource</v-chip>
              </template>
            </v-tooltip>
          </v-col>

          <v-col v-if="doi" class="py-1">
            <v-tooltip :text="EDIT_METADATA_DOI_LABEL" location="bottom">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" density="compact" :prepend-icon="mdiFingerprint">{{ doi }}</v-chip>
              </template>
            </v-tooltip>
          </v-col>

          <v-col v-if="format" class="py-1">
            <v-tooltip :text="formatedBytes ? 'Resource type and size' : 'Resource type'" location="bottom">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" density="compact" class="pl-1">
                  <template #prepend>
                    <BaseIcon :icon="extensionFileIcon" color="black" class="mr-1" />
                  </template>

                  <template #default>
                    {{ formatedBytes ? `${format} - ${formatedBytes}` : format }}
                  </template>
                </v-chip>
              </template>
            </v-tooltip>
          </v-col>

          <v-col v-if="created" class="py-1">
            <v-tooltip text="Date of resource creation" location="bottom">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" density="compact" :prepend-icon="mdiTimerPlusOutline">{{
                  readableCreated
                }}</v-chip>
              </template>
            </v-tooltip>
          </v-col>

          <v-col v-if="lastModified" class="py-1">
            <v-tooltip text="Date of last modification" location="bottom">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" density="compact" :prepend-icon="mdiUpdate">{{ readableLastModified }}</v-chip>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <PreviewTabLayout
      :description="description"
      :deprecated="deprecated"
      :isProtected="isProtected"
      :resource="{ ...$props }"
      :previewComponent="previewComponent"
    />
    <v-card-actions class="ma-0" style="position: absolute; top: 0; right: 0; z-index: 2">
      <v-row no-gutters justify="end">
        <v-col v-if="!isProtected" class="pa-2">
          <BaseRectangleButton
            :button-text="isFile ? 'Download' : 'Open Link'"
            :icon="isFile ? mdiDownload : mdiLink"
            icon-color="white"
            @clicked="trackDownload(url, resourceName)"
            color="primary"
            elevated
            :tooltip-text="isFile ? 'Download resource' : 'Open link'"
            :url="url"
            :disabled="!downloadActive"
          />
        </v-col>

        <v-col v-if="isProtected">
          <div
            class="fabMenu fabPosition elevation-5 ma-4"
            :class="downloadActive ? 'fabMenuHover' : 'fabMenuDisabled'"
            style="top: 0"
          >
            <BaseIcon :icon="mdiLock" color="grey-darken-3" />
            <div v-if="downloadActive" class="pt-2 lockedText text-black protectedLink">
              <p v-html="protectedText"></p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-actions>
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
  mdiChartBar,
  mdiChevronDown,
  mdiDownload,
  mdiFile,
  mdiFileDocumentCheckOutline,
  mdiFingerprint,
  mdiLink,
  mdiLock,
  mdiMonitorEye,
  mdiShield,
  mdiTimerPlusOutline,
  mdiUpdate,
} from '@mdi/js';

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import { formatBytes, getResourceName } from '@/factories/resourceHelpers';
import { EDIT_METADATA_DOI_LABEL, RESOURCE_FORMAT_LINK } from '@/factories/metadataConsts';
import { getFileIcon } from '@/factories/imageFactory';
import { trackDownload } from '@/utils/matomoTracking';
import { formatDate } from '@/factories/dateFactory';
import { chartPreviewData } from '@/modules/charts/middelware/chartServiceLayer';
import PreviewTabLayout from '@/modules/metadata/components/ResourcePreviews/PreviewTabLayout.vue';

export default {
  name: 'ResourceListCard',
  components: {
    BaseRectangleButton,
    PreviewTabLayout,
    BaseIcon,
  },
  props: {
    id: String,
    doi: String,
    name: String,
    description: String,
    url: String,
    restrictedUrl: String,
    created: String,
    lastModified: String,
    size: Number,
    format: String,
    twoColumnLayout: Boolean,
    height: String,
    s3Bucket: {
      type: Boolean,
      default: true,
    },
    dark: {
      type: Boolean,
      default: true,
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
    previewComponent: {
      type: Object,
      default: undefined,
    },
  },
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
      return this.loading;
    },
    isDownloaded() {
      return this.numberOfDownload > 0;
    },
    computedCardColor() {
      return this.deprecated ? 'grey' : this.$vuetify.theme.themes.light.colors[this.cardColor];
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
    formatedBytes() {
      if (!this.size) return '';

      let sizeNumber = this.size;

      if (typeof this.size === 'number') {
        sizeNumber = Number.parseInt(this.size, 10);
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
    protectedText() {
      if (this.restrictedUrl && this.restrictedUrl.length > 0) {
        return `This resource is private <a href="${this.restrictedUrl}" target="_blank" rel="noopener noreferrer" >login via the legacy UI to get access</a>.`;
      }

      return `Could not load the resource, please contact ${this.metadataContact} for getting access or envidat@wsl.ch for support.`;
    },
  },
  methods: {
    trackDownload,
  },
  watch: {
    format() {
      if (this.format === RESOURCE_FORMAT_LINK) {
        this.extensionFileIcon = mdiLink;
      } else if (this.format === 'nead') {
        this.extensionFileIcon = this.mdiFile;
      } else {
        this.extensionFileIcon = getFileIcon(this.format);
      }
    },
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
    mdiFile,
    audioFormats: ['mp3', 'wav', 'wma', 'ogg'],
    EDIT_METADATA_DOI_LABEL,
    chartPreviewTooltip: 'Visualize the data',
    chartPreviewData,
    extensionFileIcon: undefined,
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
