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


    <v-form ref="editResourceForm">
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


        <v-row no-gutters class="pt-4">
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

        <v-row no-gutters>
          <v-col cols="12">
            <v-textarea
              :label="labels.description"
              ref="description"
              outlined
              auto-grow
              :disabled="loading"
              v-model="descriptionField"
              :error-messages="validationErrors.description"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
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
                        :disabled="loading"
                        :value="urlField"
                        :error-messages="validationErrors.url"
            />

            <v-text-field v-if="!isLongUrl"
                          :label="isLink ? labels.url : labels.fileName"
                          outlined
                          readonly
                          :disabled="loading"
                          :value="urlField"
                          :error-messages="validationErrors.url"
            />

          </v-col>
        </v-row>

        <v-row no-gutters
              class="pt-3">
          <v-col class="pr-4">
            <v-text-field
              :label="labels.format"
              outlined
              readonly
              :prepend-icon="isLink ? 'link' : 'insert_drive_file'"
              :disabled="loading"
              :value="format"
            />
          </v-col>

          <v-col class="pr-4">
            <v-text-field
              :label="labels.size"
              outlined
              readonly
              :disabled="loading"
              :value="sizeField"
            />
          </v-col>

          <v-col class="pr-4">
            <v-text-field
              :label="labels.created"
              outlined
              readonly
              :disabled="loading"
              :value="readableCreated"
            />
          </v-col>

          <v-col >
            <v-text-field
              :label="labels.lastModified"
              outlined
              readonly
              :disabled="loading"
              :value="readableLastModified"
            />
          </v-col>
        </v-row>

        <v-row no-gutters
               class="pt-3 ">
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
            <BaseIconSwitch :active="isSameOrganizationField"
                            :disabled="!editingRestrictingActive"
                            materialIconName="home_filled"
                            :tooltipText="isSameOrganizationField ? labels.isRestrictedInfo : labels.isPublicInfo"
                            @clicked="isSameOrganizationField = !isSameOrganizationField"
            />
          </v-col>

          <v-col >
            {{ isSameOrganizationField ? labels.restrictedSameOrganizationInfo : labels.restrictedNotSameOrganizationInfo }}
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
          <v-col>
            <v-text-field
                :label="labels.isRestrictedAllowedUsersInfo"
                outlined
                hide-details
                prepend-icon="lock_person"
                :disabled="loading"
                v-model="allowedUsersField"
            />
          </v-col>

        </v-row>


<!--
        <v-row v-if="isRestrictedField"
               no-gutters
               class="px-2 pt-3"
               align="center">

          <v-col class="shrink pl-1 pr-4">
            <BaseIconSwitch :active="isSameOrganizationField"
                            materialIconName="home_filled"
                            :tooltipText="isSameOrganizationField ? labels.isRestrictedInfo : labels.isPublicInfo"
                            @clicked="isSameOrganizationField = !isSameOrganizationField"
            />
          </v-col>

          <v-col >
            {{ isSameOrganizationField ? labels.restrictedSameOrganizationInfo : labels.restrictedNotSameOrganizationInfo }}
          </v-col>
        </v-row>

        <v-row v-if="isSameOrganizationField"
               no-gutters
               class="px-2 pt-3">
          <v-col >
            {{ !!allowedUsersField ? labels.restrictedAllowedUsersInfo : labels.restrictedNotAllowedUsersInfo }}
          </v-col>
        </v-row>

        <v-row v-if="isSameOrganizationField"
               no-gutters
               class="px-2 pt-3">
          <v-col >
            <v-text-field
                :label="labels.isRestrictedAllowedUsersInfo"
                outlined
                hide-details
                prepend-icon="lock_person"
                :disabled="loading"
                v-model="allowedUsersField"
            />
          </v-col>

        </v-row>
-->


<!--
        <v-row>
          <v-col>
            getRestrictedObject: {{ getRestrictedObject() }}
          </v-col>
          <v-col>
            writeRestrictionLvl: {{ writeRestrictionLvl }}
          </v-col>
        </v-row>
-->

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
    </v-form>
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

import fileSizeIcon from '@/assets/icons/fileSize.png';
import { getValidationMetadataEditingObject, isFieldValid, isObjectValid } from '@/factories/userEditingValidations';
import { formatDateTimeToCKANFormat } from '@/factories/mappingFactory';
import { formatDate } from '@/factories/metaDataFactory';
import { renderMarkdown } from '@/factories/stringFactory';

import notFoundImg from '@/modules/user/assets/imageNotFound.jpg';

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
    restricted: {
      type: Object,
      default: undefined,
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
      set(value) {
        const valid = this.validateField('url', value);

        this.checkSaveButtonEnabled(valid);
      },
    },
    sizeField: {
      get() {
        const size = this.size;
        if (!size) {
          return '';
        }

        let sizeNumber = 0;
        if (size) {
          sizeNumber = Number.parseInt(size.toString(), 10);
        }

        return this.mixinMethods_formatBytes(sizeNumber);
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

        return restrictionLvl || this.publicAccessLevelValue;
      },
    },
    isPublicField: {
      get() {
        const level = this.previews.restrictedLevel !== null ? this.previews.restrictedLevel : this.accessRestrictionLvl;
        return level === this.publicAccessLevelValue; // && !this.hasAllowedUsersField;
      },
      set(value) {
        this.previews.restrictedLevel = value ? this.publicAccessLevelValue : this.anyOrganizationAccessLevelValue;

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
    sharedSecret() {
      let sharedSecret;

      if (this.restricted) {

        if (typeof this.restricted === 'string') {

          let restrictedObj = {};
          try {
            restrictedObj = JSON.parse(this.restricted);
          } catch (e) {
            console.error(`Error while parsing allowedUsers info: ${e}`);
          }

          sharedSecret = restrictedObj.sharedSecret || restrictedObj.shared_secret;
        } else {
          sharedSecret = this.restricted.sharedSecret || this.restricted.shared_secret;
        }
      }

      return sharedSecret;
    },
    hasAllowedUsersField: {
      get() {
        return this.previews.hasAllowedUsers !== null ? this.previews.hasAllowedUsers : !!this.allowedUsers;
      },
      set(value) {
        this.previews.hasAllowedUsers = value;
        this.previews.restrictedLevel = value ? this.sameOrganizationAccessLevelValue : this.anyOrganizationAccessLevelValue;
        this.checkSaveButtonEnabled(true);
      },
    },
    allowedUsersField: {
      get() {
        return this.previews.allowedUsers !== null ? this.previews.allowedUsers : this.allowedUsers;
      },
      set(value) {
        this.previews.allowedUsers = value;
      },
    },
    isSameOrganizationField: {
      get() {
        const level = this.previews.restrictedLevel !== null ? this.previews.restrictedLevel : this.accessRestrictionLvl;
        return level === this.sameOrganizationAccessLevelValue;

/*
        if (this.previews.isSameOrganization !== null) {
          return this.previews.isSameOrganization;
        }

        return this.accessRestrictionLvl === this.sameOrganizationAccessLevelValue;
*/
      },
      set(value) {
        this.previews.isSameOrganization = value;
        this.previews.restrictedLevel = value ? this.sameOrganizationAccessLevelValue : this.anyOrganizationAccessLevelValue;
        this.checkSaveButtonEnabled(true);
      },
    },
    sharedSecretField: {
      get() {
        return this.previews.sharedSecret !== null ? this.previews.sharedSecret : this.sharedSecret;
      },
    },
    writeRestrictionLvl() {
      if (this.isPublicField) {
        return this.publicAccessLevelValue;
      }

/*
      if ((this.hasAllowedUsersField && this.allowedUsersField) || this.isSameOrganizationField) {
        return this.sameOrganizationAccessLevelValue;
      }
*/

      if (this.isSameOrganizationField) {
        return this.sameOrganizationAccessLevelValue;
      }

      return this.anyOrganizationAccessLevelValue;
    },
    openAccessDetails() {
      const text = this.isPublicField ? this.labels.openAccessInstructions : this.labels.openAccessPreferedInstructions;

      return renderMarkdown(text);
    },
    restrictedDetails() {

      if (this.hasAllowedUsersField && !this.isSameOrganizationField) {
        return this.labels.isRestrictedAllowedUsersInfo;
      }

      if (this.hasAllowedUsersField && this.isSameOrganizationField) {
        return `${this.labels.isRestrictedAllowedUsersInfo} and ${this.labels.isSameOrganizationInfo}`;
      }

      if (this.isSameOrganizationField) {
        return this.labels.isSameOrganizationInfo;
      }

      return this.labels.isRestrictedInfo;
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
  },
  methods: {
    checkSaveButtonEnabled(validField) {
      if (!validField) {
        this.saveButtonEnabled = false;
        return;
      }

      // not test the preview fields to ensure the content of both fields is valid
      // to show the save button
      const descriptionAndNameValid = isObjectValid(['description', 'name'], {
        description: this.descriptionField,
        name: this.resourceNameField,
      }, this.validations, this.validationErrors);

      this.saveButtonEnabled = descriptionAndNameValid;
    },
    getRestrictedJSONString() {
      const obj = {
        allowedUsers: this.allowedUsersField || '',
        level: this.writeRestrictionLvl,
        sharedSecret: this.sharedSecretField || '',
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
          const imageRef = imageRefs instanceof Array ? imageRefs[0] : imageRefs;
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
    validateField(property, value) {
      return isFieldValid(
          property,
          value,
          this.validations,
          this.validationErrors,
      );
    },
    clearPreviews() {
      this.previews.name = null;
      this.previews.description = null;
      this.previews.restrictedLevel = null;
      this.previews.hasAllowedUsers = null;
      this.previews.allowedUsers = null;
      this.previews.isSameOrganization = null;
      this.previews.sharedSecret = null;
    },
  },
  data: () => ({
    previews: {
      name: null,
      description: null,
      restrictedLevel: null,
      hasAllowedUsers: null,
      allowedUsers: null,
      isSameOrganization: null,
      sharedSecret: null,
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
      format: 'File format',
      restricted: 'Access restrictions',
      openAccessInstructions: 'Resource is Open Access, great!',
      openAccessPreferedInstructions: 'Resource is **NOT** Open Access! \n EnviDat recommends Open Access to research data! Please make your data available to everyone unless it really contains sensitive data.',
      restrictedInstructions: 'Restricted Access is not available for editing yet. Please contact the EnviDat team (<a mailto="envidat@wsl.ch">envidat@wsl.ch</a>) if a resource can not be publicly accessed.',
      isPublicInfo: 'Resource openly accessible to everyone',
      isNotPublicInfo: 'Resource has restricted accessibility',
      isRestrictedInfo: 'Resource is only accessible to users which are signed in',
      isRestrictedAllowedUsersInfo: 'Grant specific users access',
      isSameOrganizationInfo: 'Resource is accessible to users in the same organization as the dataset',
      restrictedAllowedUsersInfo: 'Access is restricted to the following users',
      restrictedNotAllowedUsersInfo: 'Access is not restricted on a per user basis',
      restrictedSameOrganizationInfo: 'Access is restricted to users in the same organization as the dataset is',
      restrictedNotSameOrganizationInfo: 'Access is not restricted based on the users assigend organization',
      editingRestrictingUnavailableInfo: 'Editing the accessibility of resources is not available at the moment. Please contact the EnviDat team if you need to make changes.',
    },
    saveButtonEnabled: false,
    fileSizeIcon,
    validationErrors: {
      name: null,
      description: null,
      url: null,
    },
    publicAccessLevelValue: 'public',
    sameOrganizationAccessLevelValue: 'same_organization',
    anyOrganizationAccessLevelValue: 'any_organization',
    notFoundImg,
  }),
  components: {
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
</style>
