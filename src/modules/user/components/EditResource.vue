<template>
  <v-card id="EditResource" :key="id" :loading="loadingColor" class="pa-0">

    <BaseIconButton class="editResourceCloseButton ma-2" :class="{ 'mx-1': $vuetify.display.smAndDown }"
                    style="position: absolute; top: 0; right: 0; z-index: 2" :icon="mdiClose" icon-color="primary"
                    outline-color="primary"
                    outlined tooltip-text="Cancel Resource Editing"
                    tooltip-bottom
                    @clicked="$emit('closeClicked')" />


    <div class="pa-3">
      <v-row>
        <v-col cols="6" class="text-h5 d-flex align-center">
          <BaseIcon v-if="isDataPrivate" color="black" :icon="mdiLock" />
          <BaseIcon v-if="isDataDeprecated" color="black" :icon="mdiCancel" />
          <span class="pl-2" >{{ labels.title }}</span>
        </v-col>

        <v-col v-if="message">
          <BaseStatusLabelView status="check" statusColor="success" :statusText="message"
            :expandedText="messageDetails" />
        </v-col>

        <v-col v-if="error">
          <BaseStatusLabelView status="error" statusColor="error" :statusText="error" :expandedText="errorDetails" />
        </v-col>
      </v-row>

      <div class="pa-1">
        <v-alert type="info" border variant="outlined" >{{ labels.instructions }}</v-alert>

        <v-row id="resourceName" no-gutters class="pt-4">
          <v-col cols="12">
            <v-text-field
              :label="labels.resourceName"
              ref="resourceName"
              required
              :disabled="loading"
              v-model="resourceNameField"
              :error-messages="validationErrors.name" />

          </v-col>
        </v-row>

        <v-row id="description" no-gutters class="pt-2">
          <v-col cols="12">
            <v-textarea
              :label="labels.description"
              auto-grow
              :disabled="loading"
              v-model="descriptionField"
              :error-messages="validationErrors.description"
            />
          </v-col>
        </v-row>

        <v-row id="resourceUrl" no-gutters class="pt-2">
          <v-col
            v-if="showImagePreview"
            cols="4"
            class="pt-3 pb-4 pr-4 flex-grow-0 flex-shrink-1"
          >
            <div
              v-if="loadingImagePreview"
              class="skeleton skeleton-animation-shimmer"
              style="height: 100%; width: 100%; "
            >
              <div
                style="width: 100%; min-height: 100%; "
                class="bone bone-type-image"
              ></div>
            </div>

            <v-img
              v-show="!imagePreviewError"
              :src="urlField"
              ref="filePreview"
              style="max-height: 100%; max-width: 100%; cursor: pointer;"
              @click="catchImageClick"
              @error="catchImageLoadError"
              @load="loadingImagePreview = false"
              alt="resource image preview"
            />

            <div v-if="imagePreviewError" class="imagePreviewErrorContainer">
              <v-img
                id="curtain"
                :src="notFoundImg"
                style="max-height: 100%; max-width: 100%; opacity: 0.25;"
                alt="resource image could not be loaded!"
              />

              <div id="backdrop" class="pa-4 text-body-1">
                Image preview could not be loaded!
              </div>

            </div>
          </v-col>

          <v-col :class="showImagePreview ? 'pt-3 pb-4' : ''">
            <v-textarea
              v-if="isLongUrl"
              :label="isLink ? labels.url : labels.fileName"
              outlined
              auto-grow
              readonly
              dense
              hide-details
              :disabled="loading"
              v-model="urlField"
              :error-messages="validationErrors.url"
            />
            <v-text-field
              v-if="!isLongUrl"
              :label="isLink ? labels.url : labels.fileName"
              outlined
              readonly
              dense
              hide-details
              :disabled="loading"
              v-model="urlField"
              :error-messages="validationErrors.url"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <BaseIconSwitch
              :active="isDataDeprecated"
              :disabled="!editingRestrictingActive"
              :icon="mdiCancel"
              class="mt-2"
              :tooltipText="labels.dataDeprecatedSwitchTooltip"
              @clicked="isDataDeprecated = !isDataDeprecated"
              :label="labels.dataDeprecatedSwitchLabel"
            />
          </v-col>

          <v-col v-show="isDataDeprecated">
            {{ labels.dataDeprecatedSwitchInfo }}
          </v-col>
        </v-row>

        <v-row id="format" no-gutters class="pt-5">

          <v-col cols="12" md="6" class="pr-md-4">

            <v-row no-gutters>
              <v-col class="flex-grow-0 pt-2">
                <BaseIcon color="gray" :icon="fileFormatIcon"></BaseIcon>
              </v-col>

              <v-col class="pl-4">
                <v-text-field
                  :label="labels.format" hide-details="auto" :disabled="loading"
                  @blur="formatField = $event.target.value"
                  :model-value="formatField" :error-messages="validationErrors.format" />
              </v-col>
            </v-row>
          </v-col>

          <v-col id="size" cols="12" md="6" class="pt-2 pt-md-0">

            <v-row no-gutters>
              <v-col class="flex-grow-0 pt-2">
                <BaseIcon color="gray" :icon="fileSizeIcon"></BaseIcon>
              </v-col>

              <v-col class="pl-4">
                <v-text-field
                  :label="labels.size" hide-details="auto" :disabled="!isLink || loading"
                  :model-value="isLink ? sizeField : sizeFieldText"
                  :error-messages="validationErrors.size"
                  @blur="sizeField = $event.target.value"
                />
              </v-col>
              <v-col class="px-2">
                <v-select
                  :items="labels.sizeFormatList"
                  v-model="sizeFormatField"
                  label="File size format"
                  hide-details="auto"
                  :disabled="!isLink || loading" :error-messages="validationErrors.sizeFormat" />
              </v-col>
            </v-row>


          </v-col>
        </v-row>

        <v-row id="dates" no-gutters align="center" class="pt-3">

          <v-col cols="12" md="6" class="pr-md-4">
            <v-text-field
              :label="labels.created" :prepend-icon="mdiCalendarRange" readonly hide-details
              :disabled="loading" :model-value="readableCreated" />
          </v-col>

          <v-col cols="12" md="6" class="pt-2 pt-md-0">
            <v-text-field
              :label="labels.lastModified" :prepend-icon="mdiUpdate" readonly hide-details
              :disabled="loading" :model-value="readableLastModified" />
          </v-col>
        </v-row>

        <div class="text-h6 mt-6">Data access</div>

        <div class="pa-1">
          <v-expand-transition>
            <v-alert v-if="isDataPrivate" type="warning" >
              <div v-html="openAccessDetails"></div>
            </v-alert>
          </v-expand-transition>

          <BaseIconSwitch
            :active="isDataPrivate"
            :disabled="!editingRestrictingActive"
            :icon="isDataPrivate ? mdiLock : mdiLockOpen"
            class="mt-2"
            :tooltipText="labels.dataAccessSwitchTooltip"
            @clicked="isDataPrivate = !isDataPrivate"
            :label="labels.dataAccessSwitchLabel" />


          <BaseIconSwitch
            v-if="isDataPrivate"
            :active="hasAllowedUsers"
            :disabled="!editingRestrictingActive"
            :icon="mdiAccountGroup"
            class="mt-2"
            :tooltipText="labels.hasAllowedUsersSwitchTooltip"
            @clicked="hasAllowedUsers = !hasAllowedUsers"
            :label="labels.hasAllowedUsersSwitchLabel"
          />

          <v-row
            v-if="isDataPrivate && hasAllowedUsers"
            no-gutters
            class="px-2 pt-3"
          >
            <v-col cols="12" class="pt-2">
              <BaseUserPicker
                :users="envidatUserNameStrings"
                :pickerLabel="labels.restrictedAllowedUsersInfo"
                multiplePick
                :prependIcon="mdiKey"
                userTagsCloseable
                :placeholder="labels.allowedUsersTypingInfo"
                :preSelected="preSelectedAllowedUsers"
                @removedUsers="changeAllowedUsers"
                @pickedUsers="changeAllowedUsers"
              />
            </v-col>
          </v-row>

          <v-row v-if="!editingRestrictingActive" class="py-2">
            <v-col>
              <v-alert type="warning" >{{ labels.editingRestrictingUnavailableInfo }}</v-alert>
            </v-col>
          </v-row>

          <v-row v-if="checkUppercaseValue" class="py-2">
            <v-col>
              <v-alert type="info" >{{
                labels.editingWarningUppercaseExtension
              }}</v-alert>
            </v-col>
          </v-row>

          <v-row no-gutters class="pt-4" justify="end">
            <v-col class="flex-grow-0">
              <!-- prettier-ignore -->
              <BaseRectangleButton
                  :disabled="!saveButtonEnabled"
                  :loading="loading"
                  :buttonText="labels.createButtonText"
                @clicked="saveResourceClick" />
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
/**
 * @summary Show all textfields for a resource
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_DATA_RESOURCE,
  eventBus,
} from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch.vue';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
  isObjectValidCheckAllProps,
} from '@/factories/userEditingValidations';

import { formatDateTimeToCKANFormat } from '@/factories/mappingFactory';
import { renderMarkdown } from '@/factories/stringFactory';
import {getFileIcon, getIcon} from '@/factories/imageFactory';

import notFoundImg from '@/modules/user/assets/imageNotFound.jpg';
import {
  getAllowedUsersString,
  getAllowedUserNames,
  getUserAutocompleteList,
  ACCESS_LEVEL_SAMEORGANIZATION_VALUE,
  ACCESS_LEVEL_PUBLIC_VALUE,
} from '@/factories/userEditingFactory';
import {
  mdiAccount,
  mdiCalendarRange,
  mdiClose,
  mdiKey,
  mdiLock,
  mdiLockOpen,
  mdiUpdate,
  mdiCancel,
  mdiAccountGroup,
} from '@mdi/js';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import { formatDate } from '@/factories/dateFactory';


export default {
  name: 'EditResource',
  props: {
    id: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    urlType: {
      type: String,
      default: null,
    },
    created: {
      type: String,
      default: undefined,
    },
    lastModified: {
      type: String,
      default: undefined,
    },
    format: {
      type: String,
      default: '',
    },
    mimetype: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    previewUrl: {
      type: String,
      default: '',
    },
    doi: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: undefined,
    },
    sizeFormat: {
      type: String,
      default: undefined,
    },
    restricted: {
      type: Object,
      default: undefined,
    },
    envidatUsers: {
      type: Array,
      default: () => [],
    },
    deprecated: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    messageDetails: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    errorDetails: {
      type: String,
      default: null,
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
    userEditMetadataConfig: {
      type: Object,
      default: undefined,
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  mounted() {},
  computed: {
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    editingRestrictingActive() {
      return this.userEditMetadataConfig?.editingRestrictingActive || false;
    },
    descriptionField: {
      get() {
        return this.previews.description !== null
          ? this.previews.description
          : this.description;
      },
      set(value) {
        this.previews.description = value;

        const valid = this.validateField('description', value);

        this.checkSaveButtonEnabled(valid);
      },
    },
    resourceNameField: {
      get() {
        return this.previews.name !== null ? this.previews.name : this.name;
      },
      set(value) {
        this.previews.name = value;

        const nameEqualsUrl = this.isLink ? value === this.url : false;

        if (nameEqualsUrl) {
          this.validationErrors.name =
            'Resource name can not be the same as the link.';
          this.checkSaveButtonEnabled(false);
          return;
        }

        const valid = this.validateField('name', value);

        this.checkSaveButtonEnabled(valid);
      },
    },
    urlField: {
      get() {
        if (this.url && this.showImagePreview) {
          this.loadImagePreview(this.url);
        }
        return this.url;
      },
    },
    sizeField: {
      get() {
        return this.previews.size !== null ? this.previews.size : this.size;
      },
      set(value) {
        const valid = this.validateField('size', value);

        if (valid) {
          this.previews.size = value;
        }

        this.checkSaveButtonEnabled(valid);
      },
    },
    sizeFieldText: {
      get() {
        const size = this.sizeField;

        const multiplier = this.getFileSizeFormatIndex(size);

        return `${(size / 1024 ** multiplier).toFixed(2)}`;
      },
    },
    sizeFormatField: {
      get() {
        if (this.isLink) {
          return this.previews.sizeFormat !== null
            ? this.previews.sizeFormat
            : this.sizeFormat;
        }

        return this.previews.sizeFormat !== null
          ? this.previews.sizeFormat
          : this.getFileSizeFormat(this.size);
      },
      set(value) {
        const valid = this.validateField('sizeFormat', value);

        if (valid) {
          this.previews.sizeFormat = value;
        }

        this.checkSaveButtonEnabled(valid);
      },
    },
    formatField: {
      get() {
        const pFormat = this.previews.format;

        const formatString = pFormat || this.format || '';
        return formatString.toLowerCase();
      },
      set(value) {
        const valid = this.validateField('format', value);
        if (valid) {
          this.previews.format = value;
        }
        this.checkSaveButtonEnabled(valid);
      },
    },
    checkUppercaseValue() {
      // shows a warning message if the form receives an uppercase character in the file name
      return /[A-Z]/.test(this.resourceNameField);
    },
    accessRestrictionLvl: {
      get() {
        let restrictionLvl;

        if (this.restricted) {
          if (typeof this.restricted === 'string') {
            let restrictedObj = {};
            try {
              restrictedObj = JSON.parse(this.restricted);
            } catch (e) {
              console.error(`Error while parsing restricted info: ${e}`);
            }
            restrictionLvl = restrictedObj.level;
          } else {
            restrictionLvl = this.restricted.level;
          }
        }

        return restrictionLvl || ACCESS_LEVEL_PUBLIC_VALUE;
      },
    },
    isDataPrivate: {
      get() {
        const level =
          this.previews.restrictedLevel !== null
            ? this.previews.restrictedLevel
            : this.accessRestrictionLvl;
        return level !== ACCESS_LEVEL_PUBLIC_VALUE; // && !this.hasAllowedUsers;
      },
      set(value) {
        this.previews.restrictedLevel = value
          ? ACCESS_LEVEL_SAMEORGANIZATION_VALUE
          : ACCESS_LEVEL_PUBLIC_VALUE;

        this.checkSaveButtonEnabled(true);
      },
    },
    isDataDeprecated: {
      get() {
        return this.previews.deprecated !== null
          ? this.previews.deprecated
          : this.deprecated;
      },
      set(value) {
        this.previews.deprecated = value;
        this.checkSaveButtonEnabled(true);
      },
    },
    allowedUsers() {
      let users;

      if (this.restricted) {
        if (typeof this.restricted === 'string') {
          let restrictedObj = {};
          try {
            restrictedObj = JSON.parse(this.restricted);
          } catch (e) {
            console.error(`Error while parsing allowedUsers info: ${e}`);
          }

          users = restrictedObj.allowedUsers || restrictedObj.allowed_users;
        } else {
          users = this.restricted.allowedUsers || this.restricted.allowed_users;
        }
      }

      return users;
    },
    hasAllowedUsers: {
      get() {
        return this.previews.hasAllowedUsers !== null
          ? this.previews.hasAllowedUsers
          : !!this.allowedUsers;
      },
      set(value) {
        this.previews.hasAllowedUsers = value;
        this.checkSaveButtonEnabled(true);
      },
    },
    allowedUsersField: {
      get() {
        return this.previews.allowedUsers !== null
          ? this.previews.allowedUsers
          : this.allowedUsers;
      },
      set(value) {
        this.previews.allowedUsers = value;
        this.checkSaveButtonEnabled(true);
      },
    },
    writeRestrictionLvl() {
      if (this.isDataPrivate) {
        return ACCESS_LEVEL_SAMEORGANIZATION_VALUE;
      }
      return ACCESS_LEVEL_PUBLIC_VALUE;
    },
    envidatUserNameStrings() {
      return getUserAutocompleteList(this.envidatUsers);
    },
    preSelectedAllowedUsers() {
      // match with the user.name but make sure the fullname or display_name is shown
      return getAllowedUserNames(this.allowedUsersField, this.envidatUsers);
    },
    openAccessDetails() {
      return renderMarkdown(this.labels.openAccessPreferedInstructions);
    },
    readableCreated() {
      return formatDate(this.created) || this.created;
    },
    readableLastModified() {
      return formatDate(this.lastModified) || this.lastModified;
    },
    isImage() {
      return this.mimetype?.includes('image') || false;
    },
    isLink() {
      return this.urlType !== 'upload';
    },
    showImagePreview() {
      if (!this.isImage) {
        return false;
      }

      const mimeSplits = this.mimetype.split('/');
      const urlSplits = this.url.split('.');

      if (mimeSplits.length <= 0 || urlSplits.length <= 0) {
        return false;
      }

      const mimeExt = mimeSplits[mimeSplits.length - 1];
      const urlExt = urlSplits[urlSplits.length - 1];
      if (mimeExt === 'jpeg') {
        return urlExt === 'jpg' || urlExt === 'jpeg';
      }
      return mimeExt === urlExt;
    },
    isLongUrl() {
      return this.url?.length > 100;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_RESOURCE);
    },
    fileFormatIcon() {
      return getFileIcon(this.formatField);
    },
  },
  methods: {
    getFileSizeFormat(size) {
      return this.labels.sizeFormatList[this.getFileSizeFormatIndex(size)];
    },
    getFileSizeFormatIndex(size) {
      if (!size) {
        return null;
      }

      let convertedSized = size / 1024;
      let index = 0;

      while (convertedSized > 1) {
        convertedSized /= 1024;
        index++;
      }

      return index;
    },
    checkSaveButtonEnabled(validField) {
      if (!validField) {
        this.saveButtonEnabled = false;
        return;
      }

      // not test the preview fields to ensure the content of both fields is valid
      // to show the save button
      const objectToValidate = {
        description: this.descriptionField,
        name: this.resourceNameField,
        format: this.formatField,
        size: this.sizeField || 0,
        sizeFormat: this.sizeFormatField,
      };

      this.saveButtonEnabled = isObjectValidCheckAllProps(
        objectToValidate,
        this.validations,
        this.validationErrors,
      );
    },
    saveResourceClick() {
      const ckanIsoFormat = formatDateTimeToCKANFormat(new Date());

      const newResourceProps = {
        id: this.id,
        description: this.descriptionField,
        name: this.resourceNameField,
        lastModified: ckanIsoFormat,
        restricted: {
          allowedUsers: this.hasAllowedUsers
            ? this.allowedUsersField || ''
            : '',
          level: this.writeRestrictionLvl,
          sharedSecret: '',
        },
        deprecated: this.isDataDeprecated,
        format: this.formatField.toLowerCase(),
        // don't set the "size" directly because this is done
        // via the file upload
        resourceSize: {
          sizeValue: this.isLink ? this.sizeField.toString() : '',
          sizeUnits: this.isLink ? this.sizeFormatField.toLowerCase() : '',
        },
      };

      this.$emit('saveResource', newResourceProps);
    },
    loadImagePreview(url) {
      this.imagePreviewError = null;
      this.loadingImagePreview = true;
      const vm = this;

      this.$nextTick(() => {
        try {
          const imageRefs = vm.$refs.filePreview;
          const imageRef =
            imageRefs instanceof Array ? imageRefs[0] : imageRefs;
          imageRef.$el.src = url;
        } catch (e) {
          vm.imagePreviewError = e;
          vm.loadingImagePreview = false;

          console.error(`Loading image preview failed: ${e}`);
        }
      });
    },
    catchImageClick() {
      this.$emit('previewImageClicked', this.url);
    },
    catchImageLoadError(event) {
      this.imagePreviewError = event;
      this.loadingImagePreview = false;
    },
    changeAllowedUsers(pickedUserNames) {
      this.allowedUsersField = getAllowedUsersString(
        pickedUserNames,
        this.envidatUsers,
      );
    },
    validateField(property, value) {
      return isFieldValid(
        property,
        value,
        this.validations,
        this.validationErrors,
      );
    },
    clearPreviews() {
      const keys = Object.keys(this.previews);
      keys.forEach(key => {
        this.previews[key] = null;
      });
    },
  },
  data: () => ({
    mdiCancel,
    mdiKey,
    mdiAccount,
    mdiLock,
    mdiLockOpen,
    mdiClose,
    mdiCalendarRange,
    mdiUpdate,
    mdiAccountGroup,
    previews: {
      name: null,
      description: null,
      restrictedLevel: null,
      hasAllowedUsers: null,
      allowedUsers: null,
      format: null,
      size: null,
      sizeFormat: null,
      deprecated: null,
    },
    isExtensionUppercase: false,
    loadingImagePreview: false,
    imagePreviewError: null,
    labels: {
      title: 'Edit Selected Resource',
      instructions:
        'Include an apt name and description others will understand',
      subInstructions: 'For files larger then 5GB contact the EnviDat team.',
      createButtonText: 'Save Resource',
      description: 'Resource description',
      resourceName: 'Name of the resource',
      fileName: 'File',
      url: 'Link',
      created: 'Created at',
      lastModified: 'Last modified time',
      size: 'File size',
      sizeFormatList: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
      format: 'File format',
      openAccessPreferedInstructions:
        'Resource is **NOT** Open Access!\nPlease make your data available to everyone unless it contains sensitive data.\nData is **always** accessible by people in the same organization.',
      dataAccessSwitchLabel: 'Data is private',
      dataAccessSwitchTooltip:
        'If the resource is private, only signed in users from the same organization have access',
      hasAllowedUsersSwitchLabel: 'Grant specific users access',
      hasAllowedUsersSwitchTooltip:
        'Grant access to a specific list of users even if the resource is marked as private',
      allowedUsersTypingInfo:
        'Start typing the name in the text field to search for an EnviDat user.',
      restrictedAllowedUsersInfo:
        'Additional access is granted to the following users',
      editingRestrictingUnavailableInfo:
        'Editing the accessibility of resources is not available at the moment. Please contact the EnviDat team if you need to make changes.',
      editingWarningUppercaseExtension:
        'EnviDat automatically converts filename/extension to lowercase. To preserve uppercase extensions (e.g., .R), please upload a compressed (.zip) version of your file.',
      dataDeprecatedSwitchLabel: 'Data is deprecated',
      dataDeprecatedSwitchTooltip:
        'Deprecated resources are grayed out and at the bottom of the list',
      dataDeprecatedSwitchInfo:
        'Deprecated resources are grayed out and at the bottom of the list. Make sure you provide an updated replacement!',
    },
    saveButtonEnabled: false,
    fileSizeIcon: getIcon('fileSize'),
    validationErrors: {
      name: null,
      description: null,
      url: null,
      format: null,
      size: null,
      sizeFormat: null,
    },
    notFoundImg,
  }),
  components: {
    BaseUserPicker,
    BaseRectangleButton,
    BaseIconButton,
    BaseIconSwitch,
    BaseIcon,
    BaseStatusLabelView,
  },
};
</script>

<style scoped>
.imagePreviewErrorContainer {
  display: grid;
}

#backdrop,
#curtain {
  grid-area: 1/1;
}

.customIcon {
  opacity: 0.5;
}
</style>
