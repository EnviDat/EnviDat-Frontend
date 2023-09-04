<template>
  <v-card
    :id="`resourceCard_${id}`"
    :color="cardColor"
    class="metadataResourceCard"
    :class="isSelected ? 'highlighted' : ''"
    style="height: 100%;"
    :loading="loading"
  >
    <template v-slot:progress>
      <v-progress-linear color="accent" indeterminate />
    </template>

    <v-card-title class="text-h5 resourceHeadline white--text">
      {{ resourceName }}
    </v-card-title>

    <v-card-text
      class="pt-0 white--text"
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
            v-if="
              showFullDescription ||
                (!showFullDescription && !maxDescriptionLengthReached)
            "
            class="readableText resourceCardText heightAndScroll"
            :style="
              `scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`
            "
          >
            <div v-html="markdownText"></div>
          </v-col>

          <v-col
            v-if="!showFullDescription && maxDescriptionLengthReached"
            class="readableText resourceCardText"
          >
            {{ markdownTextTruncated }}
          </v-col>

          <!-- <v-col v-if="maxDescriptionLengthReached && !showFullDescription"
                  style="width: 30px;"
                  class="shrink"
                  align-self="end" >

            <base-icon-button material-icon-name="expand_more"
                              iconColor="accent"
                              color="accent"
                              outlined
                              tooltipText="Show full description"
                              @clicked="showFullDescription = !showFullDescription" />
          </v-col> -->
        </v-row>

        <v-row v-if="!showFullDescription" no-gutters>
          <v-col>
            <v-divider :dark="dark" class="my-2" />
          </v-col>
        </v-row>

        <v-row v-if="!showFullDescription" no-gutters>
          <v-col class="resourceInfo">
            <base-icon-label-view
              v-if="doi"
              :text="doi"
              :label="doiIcon ? '' : 'DOI:'"
              :icon="doiIcon"
              icon-tooltip="Data Object Identifier"
              :align-left="twoColumnLayout"
            />

            <base-icon-label-view
              v-if="format"
              :text="format"
              :label="extensionIcon ? '' : 'File format:'"
              :icon="extensionIcon"
              icon-tooltip="Format of the file"
              :align-left="twoColumnLayout"
            />

            <base-icon-label-view
              v-if="size"
              :text="formatedBytes"
              :label="fileSizeIcon ? '' : 'File size:'"
              :icon="fileSizeIcon"
              icon-tooltip="Filesize"
              :align-left="twoColumnLayout"
            />

            <base-icon-label-view
              v-if="created"
              :text="readableCreated"
              :label="dateCreatedIcon ? '' : 'Created at:'"
              :icon="dateCreatedIcon"
              icon-tooltip="Date of file creation"
              :align-left="twoColumnLayout"
            />

            <base-icon-label-view
              v-if="lastModified"
              :text="readableLastModified"
              :label="lastModifiedIcon ? '' : 'Modified at:'"
              :icon="lastModifiedIcon"
              icon-tooltip="Date of last modification"
              :align-left="twoColumnLayout"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions
      class="ma-0 pa-2"
      style="position: absolute; bottom: 0; right: 55px;"
    >
      <base-icon-button v-if="maxDescriptionLengthReached"
                        :class="isProtected ? 'mr-2' : ''"
                        material-icon-name="expand_more"
                        :iconColor="showFullDescription ? 'primary' : 'accent'"
                        color="accent"
                        :fillColor="showFullDescription ? $vuetify.theme.themes.light.accent : ''"
                        outlined
                        :rotateOnClick="true"
                        :rotateToggle="showFullDescription"
                        :tooltipText="
                          showFullDescription
                            ? 'Hide full description'
                            : 'Show full description'
                        "
                        @clicked="showFullDescription = !showFullDescription"
      />
    </v-card-actions>

    <v-container
      v-if="showGenericOpenButton && !isProtected"
      class="pa-2"
      style="position: absolute; right: 0; width: 55px;"
      :style="`${genericOpenButtonBottom ? 'bottom: 55px;' : 'top: 0;'}`"
    >
      <v-row>
        <v-col cols="12">
          <base-icon-button
            :materialIconName="openButtonIcon"
            iconColor="black"
            color="accent"
            :isElevated="true"
            :tooltipText="openButtonTooltip"
            @clicked="$emit('openButtonClicked')"
          />
        </v-col>
      </v-row>
    </v-container>

    <v-container
      class="pa-2"
      style="position: absolute; bottom: 0; right: 0; width: 55px;"
    >
      <v-row v-if="!isProtected">
        <v-col cols="12">
          <base-icon-button
            :materialIconName="isFile ? 'file_download' : 'link'"
            iconColor="black"
            color="accent"
            :isElevated="true"
            :tooltipText="isFile ? 'Download file' : 'Open link'"
            :url="url"
            :disabled="!downloadActive"
          />
        </v-col>
      </v-row>

      <v-row v-if="isProtected">
        <v-col>
          <div
            class="fabMenu fabPosition elevation-2 ma-2 pl-2 pt-2"
            :class="downloadActive ? 'fabMenuHover' : 'fabMenuDisabled'"
          >
            <v-icon
              class="pl-1 pt-1"
              :class="downloadActive ? 'iconCircle' : ''"
              :disabled="!downloadActive"
              >shield</v-icon
            >

            <div
              v-if="downloadActive"
              class="pt-2 lockedText black--text protectedLink"
            >
              <p v-html="protectedText"></p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
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
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView.vue';
import { renderMarkdown,stripMarkdown } from '@/factories/stringFactory';
import { formatBytes, formatDate } from '@/factories/metaDataFactory';

export default {
  name: 'ResourceCard',
  components: {
    BaseIconLabelView,
    BaseIconButton,
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
    dark: Boolean,
    doiIcon: String,
    fileSizeIcon: String,
    dateCreatedIcon: String,
    lastModifiedIcon: String,
    isProtected: Boolean,
    fileExtensionIcon: Object,
    metadataContact: String,
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
      default: 'preview',
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
  },
  data: () => ({
    maxDescriptionLength: 175,
    showFullDescription: false,
    audioFormats: ['mp3', 'wav', 'wma', 'ogg'],
  }),
  computed: {
    readableCreated() {
      return formatDate(this.created) || this.created;
    },
    readableLastModified() {
      return formatDate(this.lastModified) || this.lastModified;
    },
    resourceName() {
      if (!this.name && !!this.url) {
        const splits = this.url.split('/');
        return splits[splits.length - 1];
      }

      return this.name ? this.name : 'Unnamed resource';
    },
    scrollbarColorFront() {
      return this.$vuetify
        ? this.$vuetify.theme.themes.light.highlight
        : 'auto';
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
          return `${strippedMarkdown.substring(
            0,
            this.maxDescriptionLength,
          )}...`;
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

      return formatBytes(sizeNumber);
    },
    isLink() {
      return (
        this.format &&
        (this.format.toLowerCase() === 'link' ||
          this.format.toLowerCase() === 'url')
      );
    },
    isFile() {
      let isFile =
        !this.format ||
        !(
          this.format.toLowerCase() === 'link' ||
          this.format.toLowerCase() === 'url'
        );

      if (isFile && this.url) {
        const splits = this.url.split('/');
        const lastPart = splits[splits.length - 1];
        isFile = lastPart.includes('.');
      }

      return isFile;
    },
    maxDescriptionLengthReached() {
      return (
        this.description && this.description.length > this.maxDescriptionLength
      );
    },
    protectedText() {
      if (this.restrictedUrl && this.restrictedUrl.length > 0) {
        return `This resource is protected <a href="${this.restrictedUrl}" target="_blank" rel="noopener noreferrer" >login via the legacy UI to get access</a>.`;
      }

      return `Could not load the resource, please contact ${this.metadataContact} for getting access or envidat@wsl.ch for support.`;
    },
    extensionIcon() {
      if (this.$store) {
        if (this.audioFormats.includes(this.format)) {
          return this.mixinMethods_getIcon('Audio');
        }

        let extIcon = this.mixinMethods_getIconFileExtension(this.format);

        if (!extIcon && this.format.toLowerCase() === 'url') {
          extIcon = this.linkIcon;
        }

        if (extIcon) {
          return extIcon;
        }

        return this.mixinMethods_getIcon('file');
      }

      if (this.fileExtensionIcon) {
        return this.lookupExtensionIcon;
      }

      return null;
    },
    lookupExtensionIcon() {
      const lookUp = `file${this.format.toLowerCase()}`;
      let icon = this.fileExtensionIcon[`./${lookUp}`];

      if (!icon && this.audioFormats.includes(this.format)) {
        icon = this.fileExtensionIcon['./fileAudio'];
      }

      if (!icon) {
        icon = this.fileExtensionIcon['./file'];
      }

      // console.log(`icon ${icon}`);
      return icon;
    },
  },
  methods: {},
};
</script>

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
  /* transition: .1s; */
}

.fabMenuDisabled {
  opacity: 0.5;
  background-color: grey !important;
}

.fabMenuHover:hover,
.fabMenuHover:active {
  background: #fff;
  min-width: 160px;
  min-height: 160px;
  width: 100%;
  height: 100%;
  border-radius: 3px 3px;
  display: inherit;
}

.fabMenuHover:hover .v-icon,
.fabMenuHover:active .v-icon {
  border: 1px solid grey;
  border-radius: 50%;
  padding: 0 4px 4px 0;
}

.lockedText {
  display: none;
  opacity: 0;
}

.fabMenuHover:hover .lockedText,
.fabMenuHover:active .lockedText {
  display: inherit;
  opacity: 1;
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
