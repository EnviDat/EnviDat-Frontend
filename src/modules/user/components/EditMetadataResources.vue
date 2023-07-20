<template>
  <v-card id="EditMetadataResources" class="pa-4">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col class="text-h5">
          {{ EDIT_METADATA_RESOURCES_TITLE }}
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-body-1">
          {{ editingInstructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <MetadataResources :genericProps="metadataResourcesGenericProps" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditMetadataResources.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-08-18 17:07:21
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts';
import MetadataResources from '@/modules/metadata/components/Metadata/MetadataResources.vue';

export default {
  name: 'EditMetadataResources',
  components: {
    MetadataResources,
  },
  props: {
    resources: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.fileSizeIcon = this.mixinMethods_getIcon('fileSize') || '';
    this.fileIcon = this.mixinMethods_getIcon('file') || '';
    this.dateCreatedIcon = this.mixinMethods_getIcon('dateCreated') || '';
    this.lastModifiedIcon = this.mixinMethods_getIcon('dateModified') || '';
  },
  computed: {
    metadataResourcesGenericProps() {
      return {
        resources: this.resources,
        fileSizeIcon: this.fileSizeIcon,
        fileIcon: this.fileIcon,
        dateCreatedIcon: this.dateCreatedIcon,
        lastModifiedIcon: this.lastModifiedIcon,
        emptyText:
          'No resources has been added yet. Upload a file or provide a link to a resource.',
        emptyTextColor: 'grey',
      };
    },
  },
  methods: {},
  data: () => ({
    editingInstructions: 'Pick a resource from the list to edit its details',
    EDIT_METADATA_RESOURCES_TITLE,
    fileSizeIcon: null,
    fileIcon: null,
    dateCreatedIcon: null,
    lastModifiedIcon: null,
  }),
};
</script>

<style scoped></style>
