<template>
  <v-card id="ResourceEditing" :key="id" :loading="loadingColor" class="pa-0" flat>
    <BaseIconButton
      class="ma-2"
      :class="{ 'mx-1': $vuetify.display.smAndDown }"
      style="position: absolute; top: 0; right: 0; z-index: 2"
      :icon="mdiClose"
      icon-color="primary"
      outline-color="primary"
      outlined
      tooltip-text="Cancel Resource Editing"
      tooltip-bottom
      @clicked="$emit('closeClicked')"
    />

    <div class="pa-3">
      <v-row>
        <v-col cols="6" class="text-h5 d-flex align-center">
          <BaseIcon v-if="isDataPrivate" color="black" :icon="mdiLock" />
          <BaseIcon v-if="isDataDeprecated" color="black" :icon="mdiCancel" />
          <span class="pl-2">{{ labels.title }}</span>
        </v-col>

        <v-col v-if="message">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>

        <v-col cols="12">
          <v-alert type="info" class="text-caption">
            {{ labels.instructions }}
          </v-alert>
        </v-col>

        <v-col v-if="error">
          <BaseStatusLabelView status="error" statusColor="error" :statusText="error" :expandedText="errorDetails" />
        </v-col>
      </v-row>

      <div class="pa-1">
        <v-row id="resourceName" no-gutters class="pt-4">
          <v-col cols="12">
            <v-text-field
              :label="labels.resourceName"
              ref="resourceName"
              required
              :disabled="loading"
              v-model="resourceNameField"
              :error-messages="validationErrors.name"
            />
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
          <v-col v-if="showImagePreview" cols="4" class="pt-3 pb-4 pr-4 flex-grow-0 flex-shrink-1">
            <div
              v-if="loadingImagePreview"
              class="skeleton skeleton-animation-shimmer"
              style="height: 100%; width: 100%"
            >
              <div style="width: 100%; min-height: 100%" class="bone bone-type-image"></div>
            </div>

            <v-img
              v-show="!imagePreviewError"
              :src="urlField"
              ref="filePreview"
              style="max-height: 100%; max-width: 100%; cursor: pointer"
              @click="catchImageClick"
              @error="catchImageLoadError"
              @load="loadingImagePreview = false"
              alt="resource image preview"
            />

            <div v-if="imagePreviewError" class="imagePreviewErrorContainer">
              <v-img
                id="curtain"
                :src="notFoundImg"
                style="max-height: 100%; max-width: 100%; opacity: 0.25"
                alt="resource image could not be loaded!"
              />

              <div id="backdrop" class="pa-4 text-body-1">Image preview could not be loaded!</div>
            </div>
          </v-col>

          <v-col :class="showImagePreview ? 'pt-3 pb-4' : ''">
            <v-textarea
              v-if="isLongUrl"
              :label="isLink ? labels.url : labels.fileName"
              variant="outlined"
              auto-grow
              :readonly="readOnlyHint('url')"
              :hint="readOnlyHint('url')"
              persistent-hint
              density="compact"
              :disabled="loading"
              v-model="urlField"
              :error-messages="validationErrors.url"
            />

            <v-text-field
              v-if="!isLongUrl"
              :label="isLink ? labels.url : labels.fileName"
              variant="outlined"
              :readonly="urlReadOnly"
              :hint="readOnlyHint('url')"
              persistent-hint
              density="compact"
              :disabled="loading"
              v-model="urlField"
              :error-messages="validationErrors.url"
            />
          </v-col>
        </v-row>

        <v-row id="format" no-gutters class="pt-5">
          <v-col cols="12" md="6" class="pr-md-4">
            <v-row no-gutters>
              <v-col class="flex-grow-0 pt-2">
                <BaseIcon color="gray" :icon="fileFormatIcon"></BaseIcon>
              </v-col>

              <v-col class="pl-3">
                <v-text-field
                  :label="labels.format"
                  hide-details="auto"
                  :disabled="loading"
                  @blur="formatField = $event.target.value"
                  :model-value="formatField"
                  :error-messages="validationErrors.format"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col id="size" cols="12" md="6" class="pt-2 pt-md-0">
            <v-row no-gutters>
              <v-col class="flex-grow-0 pt-2">
                <BaseIcon color="gray" :icon="fileSizeIcon"></BaseIcon>
              </v-col>

              <v-col class="pl-3">
                <v-text-field
                  :label="labels.size"
                  hide-details="auto"
                  :disabled="!isLink || loading"
                  :model-value="sizeField"
                  :error-messages="validationErrors.size"
                  @blur="sizeField = $event.target.value"
                />
              </v-col>
              <v-col class="px-2">
                <v-select
                  :items="sizeFormatList"
                  v-model="sizeFormatField"
                  label="File size format"
                  hide-details="auto"
                  :disabled="!isLink || loading"
                  :error-messages="validationErrors.sizeFormat"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row id="dates" no-gutters align="center" class="pt-3">
          <v-col cols="12" md="6" class="pr-md-4">
            <v-text-field
              :label="labels.created"
              :prepend-icon="mdiCalendarRange"
              :readonly="isReadOnly('createdRes')"
              :hint="readOnlyHint('createdRes')"
              persistent-hint
              :disabled="loading"
              :model-value="readableCreated"
            />
          </v-col>

          <v-col cols="12" md="6" class="pt-2 pt-md-0">
            <v-text-field
              :label="labels.lastModified"
              :prepend-icon="mdiUpdate"
              :readonly="isReadOnly('lastUpdateRes')"
              :hint="readOnlyHint('lastUpdateRes')"
              persistent-hint
              hide-details
              :disabled="loading"
              :model-value="readableLastModified"
            />
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" class="text-h6">{{ labels.dataDeprecatedTitle }}</v-col>
          <v-col cols="12">
            <BaseIconSwitch
              :active="isDataDeprecated"
              :icon="mdiCancel"
              class="mt-2"
              :tooltipText="labels.dataDeprecatedSwitchTooltip"
              @clicked="isDataDeprecated = !isDataDeprecated"
              :label="labels.dataDeprecatedSwitchLabel"
            />
          </v-col>

          <v-col cols="12">
            <v-alert :type="isDataDeprecated ? 'warning' : 'info'">
              {{ labels.dataDeprecatedSwitchInfo }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" class="text-h6">Data access</v-col>

          <v-col cols="12">
            <BaseIconSwitch
              :active="isDataPrivate"
              :disabled="!editingRestrictingActive"
              :icon="isDataPrivate ? mdiLock : mdiLockOpen"
              class="mt-2"
              :tooltipText="labels.dataAccessSwitchTooltip"
              @clicked="isDataPrivate = !isDataPrivate"
              :label="labels.dataAccessSwitchLabel"
            />
          </v-col>

          <v-col cols="12">
            <v-expand-transition>
              <v-alert v-if="isDataPrivate" type="warning">
                <div v-html="openAccessDetails"></div>
              </v-alert>
            </v-expand-transition>
          </v-col>

          <v-col cols="12">
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
          </v-col>
        </v-row>

        <v-row
          v-if="isDataPrivate && hasAllowedUsers && !editingRestrictingActiveWithMessage"
          no-gutters
          class="px-2 pt-3"
        >
          <v-col cols="12" class="pt-2">
            <div>
              <v-chip
                @click:close="removeUser(i)"
                closable
                class="mr-4 mb-4"
                :key="i"
                v-for="(user, i) in allowedUserEmails"
              >
                {{ user }}
              </v-chip>
            </div>

            <!-- <BaseUserPicker
              :users="envidatUsersPicker"
              :preSelectedNames="preSelectedAllowedUsers"
              :pickerLabel="labels.restrictedAllowedUsersInfo"
              multiplePick
              :prependIcon="mdiKey"
              userTagsCloseable
              :placeholder="labels.allowedUsersTypingInfo"
              @removedUsers="changeAllowedUsers"
              @pickedUsers="changeAllowedUsers"
            /> -->
          </v-col>
          <v-col cols="12">
            <v-text-field :rules="emailRules" v-model="allowedUserEmailInput" label="Email"></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn :disabled="!isAllowedUserEmailValid" @click="addAllowedUsers(allowedUserEmailInput)">Add</v-btn>
          </v-col>
        </v-row>

        <v-row class="mb-5" v-if="isDataPrivate && hasAllowedUsers && editingRestrictingActiveWithMessage">
          <v-col cols="12">
            <v-alert type="warning">
              <div v-html="restrictedAlertText"></div>
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-if="!editingRestrictingActive" class="py-2">
          <v-col>
            <v-alert type="warning">{{ labels.editingRestrictingUnavailableInfo }}</v-alert>
          </v-col>
        </v-row>

        <v-row no-gutters class="pt-4" :justify="isSystemAdmin ? 'space-between' : 'end'">
          <v-col v-if="isSystemAdmin" class="flex-grow-0">
            <BaseRectangleButton
              :loading="loading"
              :buttonText="labels.deleteButtonText"
              color="error"
              @clicked="() => $emit('delete')"
            />
          </v-col>
          <v-col class="flex-grow-0">
            <BaseRectangleButton
              :disabled="!saveButtonEnabled"
              :loading="loading"
              :buttonText="labels.createButtonText"
              @clicked="saveResourceClick"
            />
          </v-col>
        </v-row>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
/**
 * @summary Show all textfields for a resource
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

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

import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
// import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';

import { formatDateTimeToCKANFormat } from '@/factories/mappingFactory';
import { renderMarkdown } from '@/factories/stringFactory';
import { getFileIcon, getIconImage } from '@/factories/imageFactory';

import notFoundImg from '@/modules/user/assets/imageNotFound.jpg';
import {
  getAllowedUserNames,
  getUserAutocompleteList,
  ACCESS_LEVEL_SAMEORGANIZATION_VALUE,
  ACCESS_LEVEL_PUBLIC_VALUE,
  decodeAllowedUsersStringToEmails,
  encodeAllowedUsersEmails,
} from '@/factories/userEditingFactory';

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import { formatDate } from '@/factories/dateFactory';

import { isReadOnlyField, getReadOnlyHint } from '@/modules/workflow/utils/useReadonly';
import { RESOURCE_FORMAT_LINK } from '@/factories/metadataConsts';
import { getFileExtension } from '@/factories/fileFactory';
import { RestrictedDTO } from '@/types/dataTransferObjectsTypes';
import { getUserPickerObjects } from '@/factories/authorFactory';
import { USER_ROLE_SYSTEM_ADMIN } from '@/factories/userEditingValidations';
import { sizeFormatList } from '@/factories/resourceHelpers.ts';
import { Resource } from '@/types/modelTypes';

export default {
  //   name: 'ResourceEditing',
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
      type: String,
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
    validationErrors: {
      type: Object,
      default: () => ({}),
    },
    userEditMetadataConfig: {
      type: Object,
      default: undefined,
    },
    userRole: {
      type: String,
      default: null,
    },
  },
  emits: ['save', 'validate', 'closeClicked', 'previewImageClicked', 'delete', 'update'],
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
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
    editingRestrictingActiveWithMessage() {
      return this.userEditMetadataConfig?.editingRestrictingActiveWithMessage || false;
    },
    descriptionField: {
      get() {
        return this.previews.description !== null ? this.previews.description : this.description;
      },
      set(value) {
        this.previews.description = value;

        this.validateField('description', value);

        this.checkSaveButtonEnabled();
      },
    },
    resourceNameField: {
      get() {
        return this.previews.name !== null ? this.previews.name : this.name;
      },
      set(value) {
        this.previews.name = value;

        /*
        const nameEqualsUrl = this.isLink ? value === this.url : false;

        if (nameEqualsUrl) {
          this.validationErrors.name =
            'Resource name can not be the same as the link.';
          this.checkSaveButtonEnabled(false);
          return;
        }
*/

        this.validateField('name', value);

        this.checkSaveButtonEnabled();
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
      set(value: string) {
        this.previews.size = value;

        this.validateField('size', value);

        this.checkSaveButtonEnabled();
      },
    },
    sizeFormatField: {
      get() {
        return this.previews.sizeFormat !== null ? this.previews.sizeFormat : this.sizeFormat;
      },
      set(value) {
        this.previews.sizeFormat = value;

        this.validateField('sizeFormat', value);

        this.checkSaveButtonEnabled();
      },
    },
    formatField: {
      get() {
        const pFormat = this.previews.format;

        const formatString = pFormat || this.format || '';
        return formatString.toLowerCase();
      },
      set(value) {
        this.previews.format = value;

        this.validateField('format', value);

        this.checkSaveButtonEnabled();
      },
    },
    accessRestrictionLvl: {
      get() {
        let restrictionLvl;

        if (this.restricted) {
          if (typeof this.restricted === 'string') {
            let restrictedObj = {} as RestrictedDTO;
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
          this.previews.restrictedLevel !== null ? this.previews.restrictedLevel : this.accessRestrictionLvl;
        return level !== ACCESS_LEVEL_PUBLIC_VALUE; // && !this.hasAllowedUsers;
      },
      set(value) {
        this.previews.restrictedLevel = value ? ACCESS_LEVEL_SAMEORGANIZATION_VALUE : ACCESS_LEVEL_PUBLIC_VALUE;

        this.checkSaveButtonEnabled();
      },
    },
    isDataDeprecated: {
      get() {
        return this.previews.deprecated !== null ? this.previews.deprecated : this.deprecated;
      },
      set(value) {
        this.previews.deprecated = value;
        this.checkSaveButtonEnabled();
      },
    },
    allowedUsers() {
      let users;

      if (this.restricted) {
        if (typeof this.restricted === 'string') {
          let restrictedObj = {} as RestrictedDTO;
          try {
            restrictedObj = JSON.parse(this.restricted);
          } catch (e) {
            console.error(`Error while parsing allowedUsers info: ${e}`);
          }

          users =
            restrictedObj.allowed_users ||
            // @ts-ignore
            restrictedObj.allowedUsers;
        } else {
          users =
            this.restricted.allowed_users ||
            // @ts-ignore
            this.restricted.allowedUsers;
        }
      }

      return users;
    },
    hasAllowedUsers: {
      get() {
        return this.previews.hasAllowedUsers !== null ? this.previews.hasAllowedUsers : !!this.allowedUsers;
      },
      set(value) {
        this.previews.hasAllowedUsers = value;
        this.checkSaveButtonEnabled();
      },
    },
    allowedUsersField: {
      get() {
        return this.previews.allowedUsers !== null ? this.previews.allowedUsers : this.allowedUsers;
      },
      set(value) {
        this.previews.allowedUsers = value;
        this.checkSaveButtonEnabled();
      },
    },
    allowedUserEmails: {
      get() {
        return decodeAllowedUsersStringToEmails(this.allowedUsersField);
      },
      set(emails: string[]) {
        this.allowedUsersField = encodeAllowedUsersEmails(emails);
      },
    },
    isAllowedUserEmailValid() {
      const value = this.allowedUserEmailInput;
      if (!value) {
        return false;
      }

      return /.+@.+\..+/.test(value);
    },
    writeRestrictionLvl() {
      if (this.isDataPrivate) {
        return ACCESS_LEVEL_SAMEORGANIZATION_VALUE;
      }
      return ACCESS_LEVEL_PUBLIC_VALUE;
    },
    envidatUsersPicker() {
      const users = getUserAutocompleteList(this.envidatUsers);
      return getUserPickerObjects(users);
    },
    preSelectedAllowedUsers() {
      if (this.allowedUsersField) {
        // match with the user.name but make sure the fullName or display_name is shown
        return getAllowedUserNames(this.allowedUsersField, this.envidatUsers);
      }

      return undefined;
    },
    openAccessDetails() {
      return renderMarkdown(this.labels.openAccessPreferedInstructions);
    },
    restrictedAlertText() {
      return 'This resource is private. If you would like to add one or more specific users who will be able to download this resource, please email <b>envidat@wsl.ch</b> and we will take care of your request.';
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
    urlAndFileExtensionMatch() {
      const ext = getFileExtension(this.urlField);
      return ext === this.formatField;
    },
    urlReadOnly() {
      if (this.urlAndFileExtensionMatch) {
        return true;
      }

      if (this.formatField !== RESOURCE_FORMAT_LINK) {
        return true;
      }

      return this.isReadOnly('url');
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
    fileFormatIcon() {
      return getFileIcon(this.formatField);
    },
    isSystemAdmin() {
      return this.userRole === USER_ROLE_SYSTEM_ADMIN;
    },
  },
  methods: {
    isReadOnly(dateProperty) {
      return isReadOnlyField(dateProperty);
    },
    readOnlyHint(dateProperty) {
      return getReadOnlyHint(dateProperty);
    },

    checkSaveButtonEnabled() {
      // not test the preview fields to ensure the content of both fields is valid
      // to show the save button
      const objectToValidate = {
        description: this.descriptionField,
        name: this.resourceNameField,
        format: this.formatField,
        size: this.sizeField,
        sizeFormat: this.sizeFormatField,
      };

      this.$emit('validate', objectToValidate);

      const errorValues = Object.values(this.validationErrors);
      this.saveButtonEnabled = errorValues.every((err) => !err);
    },
    saveResourceClick() {
      const ckanIsoFormat = formatDateTimeToCKANFormat(new Date());

      const newResourceProps = {
        id: this.id,
        description: this.descriptionField,
        name: this.resourceNameField,
        lastModified: ckanIsoFormat,
        restricted: {
          allowedUsers: this.hasAllowedUsers ? this.allowedUsersField || '' : '',
          level: this.writeRestrictionLvl,
          sharedSecret: '',
        },
        deprecated: this.isDataDeprecated,
        format: this.formatField.toLowerCase(),
        size: this.sizeField,
        sizeFormat: this.sizeFormatField,
      } satisfies Resource;

      this.$emit('save', newResourceProps);
    },
    loadImagePreview(url) {
      this.imagePreviewError = null;
      this.loadingImagePreview = true;

      this.$nextTick(() => {
        try {
          const imageRefs = this.$refs.filePreview;
          const imageRef = imageRefs instanceof Array ? imageRefs[0] : imageRefs;
          imageRef.$el.src = url;
        } catch (e) {
          this.imagePreviewError = e;
          this.loadingImagePreview = false;

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
    // INFO with API user_list deactivated for security reason
    // changeAllowedUsers(pickUserEmailHash: string[]) {
    //   this.allowedUsersField = getAllowedUsersString(pickUserEmailHash, this.envidatUsers);
    //   console.log(typeof this.allowedUsersField);
    // },

    addAllowedUsers(email: string) {
      if (!/.+@.+\..+/.test(email || '')) {
        return;
      }
      const next = [...this.allowedUserEmails, email];
      this.allowedUserEmails = next;
      this.allowedUserEmailInput = null;
      this.hasAllowedUsers = true;

      const restrictedPayload = JSON.stringify({
        allowed_users: this.allowedUsersField || '',
        level: this.writeRestrictionLvl,
        shared_secret: '',
      });

      this.$emit('update', { id: this.id, restricted: restrictedPayload });
    },
    removeUser(index: number) {
      const next = this.allowedUserEmails.filter((_, i) => i !== index);
      this.allowedUserEmails = next;
      const restrictedPayload = JSON.stringify({
        allowed_users: this.allowedUsersField || '',
        level: this.writeRestrictionLvl,
        shared_secret: '',
      });
      this.$emit('update', { id: this.id, restricted: restrictedPayload });
    },
    validateField(property, value) {
      this.$emit('validate', { [property]: value });
    },
    clearPreviews() {
      const keys = Object.keys(this.previews);
      keys.forEach((key) => {
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
    allowedUserEmailInput: null,
    emailRules: [(v: string) => !v || /.+@.+\..+/.test(v) || 'Email is invalid'],
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
    sizeFormatList,
    labels: {
      title: 'Edit Selected Resource',
      instructions: 'Include an apt name and description others will understand',
      subInstructions: 'For files larger then 5GB contact the EnviDat team.',
      createButtonText: 'Save Resource',
      deleteButtonText: 'Delete Resource',
      description: 'Resource description',
      resourceName: 'Name of the resource',
      fileName: 'File',
      url: 'Link',
      created: 'Created at',
      lastModified: 'Last modified time',
      size: 'File size',
      format: 'File format',
      openAccessPreferedInstructions:
        'Resource is **NOT** Open Access!\nPlease make your data available to everyone unless it contains sensitive data.\nData is **always** accessible by people in the same organization.',
      dataAccessSwitchLabel: 'Data is private',
      dataAccessSwitchTooltip:
        'If the resource is private, only signed in users from the same organization have access',
      hasAllowedUsersSwitchLabel: 'Grant specific users access',
      hasAllowedUsersSwitchTooltip:
        'Grant access to a specific list of users even if the resource is marked as private',
      allowedUsersTypingInfo: 'Start typing the name in the text field to search for an EnviDat user.',
      restrictedAllowedUsersInfo: 'Additional access is granted to the following users',
      editingRestrictingUnavailableInfo:
        'Editing the accessibility of resources is not directly available anymore. Please contact the EnviDat team if you need a resource to have restricted access.',
      editingWarningUppercaseExtension:
        'EnviDat automatically converts filename/extension to lowercase. To preserve uppercase extensions (e.g., .R), please upload a compressed (.zip) version of your file.',
      dataDeprecatedSwitchLabel: 'Data is deprecated',
      dataDeprecatedSwitchTooltip: 'Deprecated resources are grayed out and at the bottom of the list',
      dataDeprecatedSwitchInfo:
        'Deprecated resources are grayed out and at the bottom of the list. Make sure you provide an updated replacement!',
      dataDeprecatedTitle: 'Deprecated Resource',
    },
    saveButtonEnabled: false,
    fileSizeIcon: getIconImage('fileSize'),
    notFoundImg,
  }),
  components: {
    // BaseUserPicker,
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
