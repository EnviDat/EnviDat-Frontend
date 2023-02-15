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
                    @clicked="$emit('closeClicked')" />


    <v-form ref="editResourceForm">
      <v-container fluid class="pa-4">

        <template slot="progress">
          <v-progress-linear color="primary" indeterminate />
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
                  class="pt-3 pb-4 px-4">
            <v-img :src="urlField"
                   ref="filePreview"
                   style="max-height: 100%; max-width: 100%; cursor: pointer;"
                   @click="catchImageClick"
                   alt="resource image preview"/>
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

            <v-text-field v-else
                          :label="isLink ? labels.url : labels.fileName"
                          outlined
                          readonly
                          :disabled="loading"
                          :value="urlField"
                          :error-messages="validationErrors.url"
              />

          </v-col>
        </v-row>

<!--
        <v-row v-if="!isLink && !isImage"
               no-gutters>
          <v-col cols="12">
            <v-text-field
              :label="labels.fileName"
              outlined
              readonly
              prepend-icon="insert_drive_file"
              v-model="fileNameField"
            />
          </v-col>
        </v-row>
-->

<!--
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              :label="labels.doi"
              outlined
              readonly
              prepend-icon="fingerprint"
              :value="doi"
            />
          </v-col>
        </v-row>
-->

        <v-row no-gutters>
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

        <!-- <v-row>
        <v-col cols="12">
          <div class="text-body-1">{{ labels.subInstructions }}</div>
        </v-col>
      </v-row> -->

        <v-row no-gutters justify="end">
          <v-col class="shrink">
            <!-- prettier-ignore -->
            <BaseRectangleButton :disabled="!saveButtonEnabled"
                                 :loading="loading"
                                 :buttonText="labels.createButtonText"
                                 @clicked="saveResourceClick" />
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

import fileSizeIcon from '@/assets/icons/fileSize.png';
import { getValidationMetadataEditingObject, isFieldValid, isObjectValid } from '@/factories/userEditingValidations';
import { formatDateTimeToCKANFormat } from '@/factories/mappingFactory';
import { formatDate } from '@/factories/metaDataFactory';

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
/*
    fileName: {
      type: String,
      default: '',
    },
*/
    file: {
      type: File,
      default: null,
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
  },
  mounted() {
    this.localName = this.resourceNameField;
    this.localDescription = this.descriptionField;
  },
  computed: {
    descriptionField: {
      get() {
        return this.description;
      },
      set(value) {
        this.localDescription = value;

        const valid = this.validateField('description', value);

        this.checkSaveButtonEnabled(valid);
      },
    },
    resourceNameField: {
      get() {
        return this.name;
      },
      set(value) {
        this.localName = value;

        const nameEqualsUrl = this.isLink ? this.localName === this.url : false;

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
        if (this.file) {
          this.loadImagePreview(this.file);
        }
        return this.url;
      },
      set(value) {
        const valid = this.validateField('url', value);

        this.checkSaveButtonEnabled(valid);
      },
    },
    fileNameField: {
      get() {
        return this.file;
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
          sizeNumber = Number.parseInt(size, 10);
        }

        return this.mixinMethods_formatBytes(sizeNumber);
      },
    },
    readableCreated() {
      return formatDate(this.created) || this.created;
    },
    readableLastModified() {
      return formatDate(this.lastModified) || this.lastModified;
    },
    isImage() {
      return this.file?.type.includes('image') || this.mimetype?.includes('image') || false;
    },
    isPreviewUrl() {
      return this.previewUrl !== '';
    },
    isLink() {
      return !!this.url && this.urlType !== 'upload';
    },
    showImagePreview() {
      return !this.isLink && this.isImage;
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

      // not test the local fields to ensure the content of both fields is valid
      // to show the save button
      const descriptionAndNameValid = isObjectValid(['description', 'name'], {
        description: this.localDescription,
        name: this.localName,
      }, this.validations, this.validationErrors);

      this.saveButtonEnabled = descriptionAndNameValid;
    },
    saveResourceClick() {

      const ckanIsoFormat = formatDateTimeToCKANFormat(new Date());

      const newGenericProps = {
        ...this.$props,
        lastModified: ckanIsoFormat,
      };

      this.$emit('saveResource', newGenericProps);
    },
    loadImagePreview(file) {
      const vm = this;
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageRefs = vm.$refs.filePreview;
          const imageRef =
            imageRefs instanceof Array ? imageRefs[0] : imageRefs;
          imageRef.src = reader.result;
        };

        reader.readAsDataURL(file);
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
  },
  data: () => ({
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
    },
    saveButtonEnabled: false,
    fileSizeIcon,
    localDescription: '',
    localName: '',
    validationErrors: {
      name: null,
      description: null,
      url: null,
    },
  }),
  components: {
    BaseRectangleButton,
    BaseIconButton,
  },
};
</script>

<style scoped></style>
