<template>
  <v-card id="EditResource"
            class="pa-4">

    <BaseIconButton id="EditResourceCloseButton"
                    class="ma-2"
                    :class="{ 'mx-1' : $vuetify.breakpoint.smAndDown }"
                    style="position: absolute; top: 0px; right: 0px; z-index: 2;"
                    material-icon-name="close"
                    icon-color="primary"
                    color="primary"
                    outlined
                    tool-tip-text="Close Metadata"
                    :tool-tip-bottom="true"
                    @clicked="$emit('closeClicked')" />

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
                        outlined
                        required
                        v-model="resourceName" />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <v-textarea :label="labels.description"
                        outlined
                        auto-grow
                        v-model="description"
                        />
        </v-col>
      </v-row>

      <v-row v-if="isLink"
              no-gutters>
        <v-col cols="12">
          <v-text-field :label="labels.url"
                        outlined
                        readonly
                        prepend-icon="link"
                        v-model="url" />
        </v-col>
      </v-row>

      <v-row v-if="!isLink"
              no-gutters>
        <v-col cols="12">
          <v-text-field :label="labels.fileName"
                        outlined
                        readonly
                        prepend-icon="insert_drive_file"
                        v-model="fileName" />
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
          <!-- <div style="width: 24px; height: 24px;" >
            <BaseIconLabelView :icon="fileSizeIcon"
                                icon-tooltip="Filesize" />
          </div> -->

          <v-text-field :label="labels.size"
                        outlined
                        readonly
                        v-model="size" />
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
          <BaseRectangleButton :disabled="createButtonDisabled"
                                :buttonText="labels.createButtonText"
                                @clicked="createButtonClick" />
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
 * Last modified  : 2021-08-05 10:53:04
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import { formatDate } from '@/factories/metaDataFactory';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_RESOURCES,
  eventBus,
} from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView';

import fileSizeIcon from '@/assets/icons/fileSize.png';

export default {
  name: 'EditResource',
  props: {  
    genericProps: Object,
  },
  computed: {
    description: {
      get() {
        return this.mixinMethods_getGenericProp('description', '');
      },
      set(value) {
        const newGenericProps = {
          ...this.genericProps,
          description: value,
        };

        this.notifyChange(newGenericProps);
      },
    },
    resourceName: {
      get() {
        return this.mixinMethods_getGenericProp('name', '');
      },
      set(value) {
        const newGenericProps = {
          ...this.genericProps,
          name: value,
        };

        this.notifyChange(newGenericProps);
      },
    },
    fileName: {
      get() {
        return this.mixinMethods_getGenericProp('fileName', '');
      },
      // set(value) {
      //   const newGenericProps = {
      //     ...this.genericProps,
      //     fileName: value,
      //   };

      //   this.notifyChange(newGenericProps);
      // },
    },
    url: {
      get() {
        return this.mixinMethods_getGenericProp('url', '');
      },
      // set(value) {
      //   const newGenericProps = {
      //     ...this.genericProps,
      //     url: value,
      //   };

      //   this.notifyChange(newGenericProps);
      // },
    },
    urlType: {
      get() {
        return this.mixinMethods_getGenericProp('url_type', null);
      },
    },
    isLink() {
      return this.url && this.urlType !== 'upload';
    },
    lastModified: {
      get() {
        let date = this.mixinMethods_getGenericProp('lastModified', null);

        if (!date) {
          date = formatDate(new Date().toISOString());
        }

        return date;
      },
    },
    created: {
      get() {
        let date = this.mixinMethods_getGenericProp('created', null);

        if (!date) {
          date = formatDate(new Date().toISOString());
        }

        return date;
      },
    },
    format: {
      get() {
        return this.mixinMethods_getGenericProp('format', '');
      },
      // set(value) {
      //   const newGenericProps = {
      //     ...this.genericProps,
      //     format: value,
      //   };

      //   this.notifyChange(newGenericProps);
      // },
    },
    size: {
      get() {
        return this.mixinMethods_getGenericProp('size', 'unknown');
      },
      // set(value) {
      //   const newGenericProps = {
      //     ...this.genericProps,
      //     size: value,
      //   };

      //   this.notifyChange(newGenericProps);
      // },
    },
    doi: {
      get() {
        return this.mixinMethods_getGenericProp('doi', '');
      },
      // set(value) {
      //   const newGenericProps = {
      //     ...this.genericProps,
      //     doi: value,
      //   };

      //   this.notifyChange(newGenericProps);
      // },
    },
  },
  methods: {
    checkCreateButtonDisabled() {
      this.createButtonDisabled = this.files?.length <= 0;
    },
    notifyChange(newGenericProps) {
      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_RESOURCES,
        data: newGenericProps,
      });
    },
    createButtonClick() {
      this.$emit('createResources', this.files);
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
      fileName: 'Name of the file',
      url: 'Link',
      created: 'Create at',
      lastModified: 'Last modified time',
      size: 'File size',
      format: 'File format',
    },
    files: [],
    createButtonDisabled: true,
    fileSizeIcon,
  }),
  components: {
    BaseRectangleButton,
    BaseIconButton,
    BaseIconLabelView,
  },  
};
</script>

<style scoped>


</style>
