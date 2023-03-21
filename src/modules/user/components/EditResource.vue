<template>
  <v-card id="EditResource"
          :key="id"
          :loading="loading"
          class="pa-0">

    <!-- prettier-ignore -->
    <BaseIconButton id="EditResourceCloseButton"
                    class="ma-2"
                    :class="{ 'mx-1': $vuetify.breakpoint.smAndDown }"
                    style="position: absolute; top: 0; right: 0; z-index: 2"
                    material-icon-name="close"
                    icon-color="primary"
                    color="primary"
                    outlined
                    tooltipText="Cancel Resource Editing"
                    :tooltipBottom="true"
                    @clicked="$emit('closeClicked')"/>


    <v-container fluid class="pa-4">

      <template slot="progress">
        <v-progress-linear color="primary" indeterminate/>
      </template>

      <v-row>
        <v-col cols="6" class="text-h5">
          {{ labels.title }}
        </v-col>

        <v-col v-if="message">
          <BaseStatusLabelView
              statusIcon="check"
              statusColor="success"
              :statusText="message"
              :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error">
          <BaseStatusLabelView
              statusIcon="error"
              statusColor="error"
              :statusText="error"
              :expandedText="errorDetails"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-subtitle-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>


      <v-row id="resourceName"
             no-gutters class="pt-4">
        <v-col cols="12">
          <v-text-field
            :label="labels.resourceName"
            ref="resourceName"
            outlined
            required
            :disabled="loading"
            v-model="resourceNameField"
            :error-messages="validationErrors.name"
          />

<!--
          :readonly="mixinMethods_isFieldReadOnly('resourceName')"
-->

        </v-col>
      </v-row>

      <v-row id="description"
             no-gutters
              class="pt-2">
        <v-col cols="12">

          <v-textarea
            :label="labels.description"
            outlined
            auto-grow
            :disabled="loading"
            v-model="descriptionField"
            :error-messages="validationErrors.description"
          />

        </v-col>
      </v-row>

      <v-row id="resourceUrl"
             no-gutters
             class="pt-2">
        <v-col v-if="showImagePreview"
               cols="4"
               class="pt-3 pb-4 pr-4">

          <div v-show="loadingImagePreview"
               class="skeleton skeleton-animation-shimmer"
              style="height: 100%; width: 100%; "
          >
            <div style="width: 100%; min-height: 100%; "
                class="bone bone-type-image"
            ></div>
          </div>


          <v-img v-show="!loadingImagePreview && !imagePreviewError"
                 :src="urlField"
                 ref="filePreview"
                 style="max-height: 100%; max-width: 100%; cursor: pointer;"
                 @click="catchImageClick"
                 alt="resource image preview"/>

          <div v-if="!loadingImagePreview && imagePreviewError"
               class="imagePreviewErrorContainer">

            <v-img id="curtain"
                   :src="notFoundImg"
                   style="max-height: 100%; max-width: 100%; opacity: 0.25;"
                   alt="resource image could not be loaded!"/>

            <div id="backdrop"
                 class="pa-4 text-body-1">Image preview could not be loaded! </div>
          </div>


        </v-col>

        <v-col :class="showImagePreview ? 'pt-3 pb-4' : ''">
          <v-textarea v-if="isLongUrl"
                      :label="isLink ? labels.url : labels.fileName"
                      outlined
                      auto-grow
                      readonly
                      dense
                      hide-details
                      :disabled="loading"
                      :value="urlField"
                      :error-messages="validationErrors.url"
          />

          <v-text-field v-if="!isLongUrl"
                        :label="isLink ? labels.url : labels.fileName"
                        outlined
                        readonly
                        dense
                        hide-details
                        :disabled="loading"
                        :value="urlField"
                        :error-messages="validationErrors.url"
          />

        </v-col>
      </v-row>

      <v-row id="format"
             no-gutters
            class="pt-5">

        <v-col cols="12"
                md="6"
                class="pr-md-4">

          <v-row no-gutters >
            <v-col class="shrink pt-2">
              <img class="customIcon"
                   :src="fileFormatIcon"
                   width="24"
                   height="24"
                   alt="file extension icon" />
            </v-col>

            <v-col class="pl-2">
              <v-text-field
                  :label="labels.format"
                  outlined
                  dense
                  hide-details="auto"
                  :disabled="loading"
                  @change="formatField = $event"
                  :value="formatField"
                  :error-messages="validationErrors.format"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col id="size"
               cols="12"
               md="6"
               class="pt-2 pt-md-0">

          <v-row no-gutters >
            <v-col class="shrink pt-2">
              <img class="customIcon"
                   :src="fileSizeIcon"
                   width="24"
                   height="24"
                   alt="file size icon" />
            </v-col>

            <v-col class="pl-2" >
              <v-text-field
                  :label="labels.size"
                  outlined
                  dense
                  hide-details="auto"
                  :disabled="!isLink || loading"
                  @change="sizeField = $event"
                  :value="isLink ? sizeField : sizeFieldText"
                  :error-messages="validationErrors.size"
              />
            </v-col>
            <v-col class="pl-2">
              <v-select :items="labels.sizeFormatList"
                        v-model="sizeFormatField"
                        label="File size format"
                        outlined
                        dense
                        hide-details="auto"
                        :disabled="!isLink || loading"
                        :error-messages="validationErrors.sizeFormat"
              />
            </v-col>
          </v-row>


        </v-col>
      </v-row>

      <v-row id="dates"
             no-gutters
             align="center"
             class="pt-3">

        <v-col cols="12"
               md="6"
               class="pr-md-4">
          <v-text-field
            :label="labels.created"
            prepend-icon="date_range"
            outlined
            readonly
            dense
            hide-details
            :disabled="loading"
            :value="readableCreated"
          />
        </v-col>

        <v-col cols="12"
               md="6"
                class="pt-2 pt-md-0">
          <v-text-field
            :label="labels.lastModified"
            prepend-icon="update"
            outlined
            readonly
            dense
            hide-details
            :disabled="loading"
            :value="readableLastModified"
          />
        </v-col>
      </v-row>

      <v-row no-gutters
             class="pt-5 ">
        <v-col v-html="openAccessDetails">
        </v-col>
      </v-row>

      <v-row no-gutters
             class="pt-3 px-2"
             align="center">
        <v-col class="shrink pl-1 pr-4">
          <BaseIconSwitch :active="isPublicField"
                          :disabled="!editingRestrictingActive"
                          :materialIconName="isPublicField ? 'check_circle' : 'check_circle_outline'"
                          :tooltipText="isPublicField ? labels.isPublicInfo : labels.isNotPublicInfo"
                          @clicked="isPublicField = !isPublicField"
          />
        </v-col>

        <v-col>
          {{ isPublicField ? labels.isPublicInfo : labels.isNotPublicInfo }}
        </v-col>

      </v-row>

      <v-row v-if="isRestrictedField"
             no-gutters
             class="px-2 pt-3"
             align="center">

        <v-col class="shrink pl-1 pr-4">
          <BaseIconSwitch :active="hasAllowedUsersField"
                          :disabled="!editingRestrictingActive"
                          materialIconName="lock_person"
                          :tooltipText="hasAllowedUsersField ? labels.isRestrictedAllowedUsersInfo : labels.restrictedNotAllowedUsersInfo"
                          @clicked="hasAllowedUsersField = !hasAllowedUsersField"
          />
        </v-col>

        <v-col>
          {{ hasAllowedUsersField ? labels.restrictedAllowedUsersInfo : labels.restrictedNotAllowedUsersInfo }}
        </v-col>
      </v-row>

      <v-row v-if="isRestrictedField && hasAllowedUsersField"
             no-gutters
             class="px-2 pt-3">

        <v-col cols="12"
                class="pt-2">
          <BaseUserPicker :users="envidatUserNameStrings"
                          :pickerLabel="labels.isRestrictedAllowedUsersInfo"
                          multiplePick
                          prependIcon="key"
                          userTagsCloseable
                          :hint="labels.allowedUsersTypingInfo"
                          :preSelected="preSelectedAllowedUsers"
                          @removedUsers="changeAllowedUsers"
                          @pickedUsers="changeAllowedUsers"
          />
        </v-col>

      </v-row>

      <v-row v-if="!editingRestrictingActive"
             class="py-2">
        <v-col :style="`background-color: ${$vuetify.theme.themes.light.warning};`" >
          {{ labels.editingRestrictingUnavailableInfo }}
        </v-col>
      </v-row>

      <v-row no-gutters
             class="pt-4"
             justify="end">
        <v-col class="shrink">
          <!-- prettier-ignore -->
          <BaseRectangleButton :disabled="!saveButtonEnabled"
                               :loading="loading"
                               :buttonText="labels.createButtonText"
                               @clicked="saveResourceClick"/>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Show all textfields for a resource
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 16:09:39
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { EDITMETADATA_DATA_RESOURCE } from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch.vue';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';

import fileSizeIcon from '@/assets/icons/fileSize.png';
import fileIcon from '@/assets/icons/file.png';
import {
  getValidationMetadataEditingObject,
  isFieldValid,
  isObjectValidCheckAllProps,
} from '@/factories/userEditingValidations';

import { formatDateTimeToCKANFormat } from '@/factories/mappingFactory';
import { formatDate } from '@/factories/metaDataFactory';
import { renderMarkdown } from '@/factories/stringFactory';

import notFoundImg from '@/modules/user/assets/imageNotFound.jpg';
import {
  getAllowedUsersString,
  getAllowedUserNames,
  getUserAutocompleteList,
  ACCESS_LEVEL_SAMEORGANIZATION_VALUE,
  ACCESS_LEVEL_PUBLIC_VALUE,
} from '@/factories/userEditingFactory';


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
  mounted() {
  },
  computed: {
    editingRestrictingActive() {
      return this.userEditMetadataConfig?.editingRestrictingActive || false;
    },
    descriptionField: {
      get() {
        return this.previews.description !== null ? this.previews.description : this.description;
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
          this.validationErrors.name = 'Resource name can not be the same as the link.';
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
          return this.previews.sizeFormat !== null ? this.previews.sizeFormat : this.sizeFormat;
        }

        return this.previews.sizeFormat !== null ? this.previews.sizeFormat : this.getFileSizeFormat(this.size);
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
    isPublicField: {
      get() {
        const level = this.previews.restrictedLevel !== null ? this.previews.restrictedLevel : this.accessRestrictionLvl;
        return level === ACCESS_LEVEL_PUBLIC_VALUE; // && !this.hasAllowedUsersField;
      },
      set(value) {
        this.previews.restrictedLevel = value ? ACCESS_LEVEL_PUBLIC_VALUE : ACCESS_LEVEL_SAMEORGANIZATION_VALUE;

        this.checkSaveButtonEnabled(true);
      },
    },
    isRestrictedField: {
      get() {
        return !this.isPublicField;
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
    hasAllowedUsersField: {
      get() {
        return this.previews.hasAllowedUsers !== null ? this.previews.hasAllowedUsers : !!this.allowedUsers;
      },
      set(value) {
        this.previews.hasAllowedUsers = value;
        this.checkSaveButtonEnabled(true);
      },
    },
    allowedUsersField: {
      get() {
        return this.previews.allowedUsers !== null ? this.previews.allowedUsers : this.allowedUsers;
      },
      set(value) {
        this.previews.allowedUsers = value;
        this.checkSaveButtonEnabled(true);
      },
    },
    writeRestrictionLvl() {
      if (this.isPublicField) {
        return ACCESS_LEVEL_PUBLIC_VALUE;
      }

      return ACCESS_LEVEL_SAMEORGANIZATION_VALUE;
    },
    envidatUserNameStrings() {
      return getUserAutocompleteList(this.envidatUsers);
    },
    preSelectedAllowedUsers() {
      // match with the user.name but make sure the fullname or display_name is shown
      return getAllowedUserNames(this.allowedUsersField, this.envidatUsers);
    },
    openAccessDetails() {
      const text = this.isPublicField ? this.labels.openAccessInstructions : this.labels.openAccessPreferedInstructions;

      return renderMarkdown(text);
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
      // isLink ? 'link' : 'insert_drive_file'
      if (!this.$store) {
        return this.fileIcon;
      }

      return this.mixinMethods_getIconFileExtension(this.formatField) || this.fileIcon;
    },
  },
  methods: {
    getFileSizeFormat(size) {
      return this.labels.sizeFormatList[this.getFileSizeFormatIndex(size) - 1];
    },
    getFileSizeFormatIndex(size) {
      if (!size) {
        return null;
      }

      if (size < 1024) {
        return 0;
      }

      let convertedSized = size / 1024;
      let index = 0;

      while(convertedSized > 1) {
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
      }

      this.saveButtonEnabled = isObjectValidCheckAllProps(
          objectToValidate,
          this.validations, this.validationErrors);
    },
    getRestrictedJSONString() {
      const obj = {
        allowed_users: this.hasAllowedUsersField ? this.allowedUsersField || '' : '',
        level: this.writeRestrictionLvl,
        shared_secret: '',
      };

      return JSON.stringify(obj);
    },
    getResourceSizeJSONString() {

      const obj = {
        size_value: this.isLink ? this.sizeField.toString() : '',
        size_units: this.isLink ? this.sizeFormatField.toLowerCase() : '',
      };

      return JSON.stringify(obj);
    },
    saveResourceClick() {

      const ckanIsoFormat = formatDateTimeToCKANFormat(new Date());

      const newGenericProps = {
        ...this.$props,
        description: this.descriptionField,
        name: this.resourceNameField,
        lastModified: ckanIsoFormat,
        restricted: this.getRestrictedJSONString(),
        format: this.formatField.toLowerCase(),
        // don't set the "size" directly because this is done
        // via the file upload
        resourceSize: this.getResourceSizeJSONString(),
      };

      this.$emit('saveResource', newGenericProps);
    },
    loadImagePreview(url) {
      this.imagePreviewError = null;
      this.loadingImagePreview = true;
      const vm = this;
      const reader = new FileReader();

      try {
        reader.onload = () => {
          const imageRefs = vm.$refs.filePreview;
          const imageRef = (imageRefs instanceof Array) ? imageRefs[0] : imageRefs;
          imageRef.src = reader.result;
        };

        reader.readAsDataURL(url);
      } catch (e) {
        this.imagePreviewError = e;
        console.error(`Loading image preview failed: ${e}`);
      } finally {
        this.loadingImagePreview = false;
      }
    },
    catchImageClick() {
      this.$emit('previewImageClicked');
    },
    changeAllowedUsers(pickedUserNames) {
      this.allowedUsersField = getAllowedUsersString(pickedUserNames, this.envidatUsers);
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
      keys.forEach((key) => {
        this.previews[key] = null;
      });
    },
  },
  data: () => ({
    previews: {
      name: null,
      description: null,
      restrictedLevel: null,
      hasAllowedUsers: null,
      allowedUsers: null,
      format: null,
      size: null,
      sizeFormat: null,
    },
    loadingImagePreview: false,
    imagePreviewError: null,
    labels: {
      title: 'Edit Selected Resource',
      instructions:
        'Change information about this resource, make sure to describe all the details so others know what this resource contains.',
      subInstructions: 'For files larger then 5GB contact the envidat team.',
      createButtonText: 'Save Resource',
      description: 'Resource description',
      resourceName: 'Name of the resource',
      fileName: 'File',
      url: 'Link',
      created: 'Create at',
      lastModified: 'Last modified time',
      size: 'File size',
      sizeFormatList: ['KB', 'MB', 'GB', 'TB', 'PB'],
      format: 'File format',
      restricted: 'Access restrictions',
      openAccessInstructions: 'Resource is Open Access, great!',
      openAccessPreferedInstructions: 'Resource is **NOT** Open Access! \n EnviDat recommends providing "Open Access" to research data! Please make your data available to everyone without a barrier, unless it contains sensitive data.',
      isPublicInfo: 'Resource openly accessible to everyone',
      isNotPublicInfo: 'Resource has restricted accessibility, only signed in users from the same organization have access',
      isRestrictedInfo: 'Resource is only accessible to users which are signed in',
      isRestrictedAllowedUsersInfo: 'Grant specific users access',
      allowedUsersTypingInfo: 'Start typing the name in the text field to search for an envidat user.',
      isSameOrganizationInfo: 'Resource is accessible to users in the same organization as the dataset',
      restrictedAllowedUsersInfo: 'Additional access is granted to the following users',
      restrictedNotAllowedUsersInfo: 'No access is granted on a per user basis',
      editingRestrictingUnavailableInfo: 'Editing the accessibility of resources is not available at the moment. Please contact the EnviDat team if you need to make changes.',
    },
    saveButtonEnabled: false,
    fileSizeIcon,
    fileIcon,
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
  },
};
</script>

<style scoped>
.imagePreviewErrorContainer {
  display: grid;
}

#backdrop, #curtain {
  grid-area: 1/1;
}

#backdrop {  }
#curtain {  }

.customIcon {
  opacity: 0.5;
}

</style>
