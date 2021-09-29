<template>
  <v-card id="EditResource"
            :key="id"
            class="pa-4" >

    <BaseIconButton id="EditResourceCloseButton"
                    class="ma-2"
                    :class="{ 'mx-1' : $vuetify.breakpoint.smAndDown }"
                    style="position: absolute; top: 0px; right: 0px; z-index: 2;"
                    material-icon-name="close"
                    icon-color="primary"
                    color="primary"
                    outlined
                    tool-tip-text="Cancel Resource Editing"
                    :tool-tip-bottom="true"
                    @clicked="$emit('closeClicked')" />

    <v-form ref="editResourceForm">

    <v-container fluid
                  class="pa-0">

      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ labels.title }}</div>
        </v-col>

        <v-col cols="12">
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row no-gutters
              class="pt-4">
        <v-col cols="12">
          <v-text-field :label="labels.resourceName"
                        ref="resourceName"
                        outlined
                        required
                        :disabled="loading"
                        :rules="[ v => !!v || `${labels.resourceName} is required`,
                                  v => (isLink && resourceName !== url) || (!isLink && !url) || `${labels.resourceName} can't be the same as the ${labels.url}`,
                                  ]"
                        v-model="resourceNameField" />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <v-textarea :label="labels.description"
                        ref="description"
                        outlined
                        auto-grow
                        :disabled="loading"
                        :rules="[ v => !!v || `${labels.description} is required` ]"
                        v-model="descriptionField"
                        />
        </v-col>
      </v-row>

      <v-row v-if="isLink"
              no-gutters>
        <v-col cols="12">
          <v-text-field :label="labels.url"
                        ref="url"
                        outlined
                        prepend-icon="link"
                        :disabled="loading"
                        :rules="[ v => !!v || `${labels.url} is required` ]"
                        v-model="urlField" />
        </v-col>
      </v-row>

      <v-row v-if="!isLink && isImage"
              no-gutters>
        <v-col cols="12">
          <v-text-field :label="labels.fileName"
                        outlined
                        readonly
                        selele
                        prepend-icon="insert_drive_file"
                        value=" " >

            <template v-slot:append
                      style="justfiy-content: flex-end;">
              <v-col >
                <v-row no-gutters class="pb-2" >{{ fileNameField }}</v-row>
                <v-row no-gutters>
                  <img ref="filePreview"
                        style="max-height: 100%; max-width: 100%;" />
                </v-row>

              </v-col>
            </template>

          </v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="!isLink && !isImage"
              no-gutters>
        <v-col cols="12">
          <v-text-field :label="labels.fileName"
                        outlined
                        readonly
                        prepend-icon="insert_drive_file"
                        v-model="fileNameField" />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field :label="labels.doi"
                        outlined
                        readonly
                        prepend-icon="fingerprint"
                        v-model="doi" />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="6"
                class="pr-4">
          <v-text-field :label="labels.format"
                        outlined
                        readonly
                        v-model="format" />
        </v-col>

        <v-col cols="6" >
          <v-text-field :label="labels.size"
                        outlined
                        readonly
                        v-model="sizeField" />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="6"
                class="pr-4">
          <v-text-field :label="labels.created"
                        outlined
                        readonly
                        v-model="created" />
        </v-col>

        <v-col cols="6">
          <v-text-field :label="labels.lastModified"
                        outlined
                        readonly
                        v-model="lastModified" />
        </v-col>
      </v-row>

      <!-- <v-row>
        <v-col cols="12">
          <div class="text-body-1">{{ labels.subInstructions }}</div>
        </v-col>
      </v-row> -->

      <v-row no-gutters
              justify="end">
        <v-col class="shrink">
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
import { getCurrentDate } from '@/factories/metaDataFactory';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_RESOURCES,
  eventBus,
} from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

import fileSizeIcon from '@/assets/icons/fileSize.png';

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
    fileName: {
      type: String,
      default: '',
    },
    file: {
      type: File,
      default: null,
    },
    url_type: {
      type: String,
      default: null,
    },
    created: {
      type: String,
      default: getCurrentDate(),
    },
    lastModified: {
      type: String,
      default: getCurrentDate(),
    },
    format: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    doi: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
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

        this.notifyChange('description', value);
      },
    },
    resourceNameField: {
      get() {
        return this.name;
      },
      set(value) {
        this.localName = value;

        this.notifyChange('name', value);
      },
    },
    fileNameField: {
      get() {
        if (this.file) {
          this.loadImagePreview(this.file);
        }
        return this.fileName;
      },
    },
    isImage() {
      return this.file?.type.includes('image');
    },
    urlField: {
      get() {
        return this.url;
      },
      set(value) {
        const newGenericProps = {
          ...this.genericProps,
          url: value,
        };

        this.notifyChange(newGenericProps);
      },
    },
    isLink() {
      return !!this.url && this.urlType !== 'upload';
    },
    sizeField: {
      get() {
        const size = this.size;

        let sizeNumber = 0;
        if (size) {
          sizeNumber = Number.parseInt(size, 10);
        }

        return this.mixinMethods_formatBytes(sizeNumber);
      },
    },
  },
  methods: {
    checkSaveButtonEnabled() {
      const nameEqualsUrl = this.isLink ? this.localName === this.url : false;
      const enabled = !!this.localName && !!this.localDescription && !nameEqualsUrl;

      if (this.isLink) {
      // validate the whole form to make sure it's
        this.$refs.editResourceForm.validate();
      }

      this.saveButtonEnabled = enabled;
    },
    notifyChange(property, value) {

      const newGenericProps = {
        ...this.$props,
        property: value,
        lastModified: getCurrentDate(),
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_RESOURCES,
        data: newGenericProps,
      });

      this.checkSaveButtonEnabled();
    },
    saveResourceClick() {
      this.$emit('saveResource');
    },
    loadImagePreview(file) {
      const vm = this;
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageRefs = vm.$refs.filePreview;
          const imageRef = imageRefs instanceof Array ? imageRefs[0] : imageRefs;
          imageRef.src = reader.result;
        };

        reader.readAsDataURL(file);
      }

    },
  },
  data: () => ({
    labels: {
      title: 'Edit Selected Resource',
      instructions: 'Change information about this resource, make sure to describe all the details so others know about this resource contains.',
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
  }),
  components: {
    BaseRectangleButton,
    BaseIconButton,
  },
};
</script>

<style scoped>


</style>
