<template>
  <v-card id="EditMetadataResources"
          class="pa-4" >

<!--    <v-container fluid
                 class="pa-0">-->

      <v-row >
        <v-col class="text-h5" >
          {{ EDIT_METADATA_AUTHORS_TITLE }}
        </v-col>
      </v-row>

      <v-row >
        <v-col class="text-body-1">
          {{ editingInstructions }}
        </v-col>
      </v-row>

      <v-row >
        <v-col cols="12">
          <MetadataAuthors :genericProps="metadataAuthorsObject" />
        </v-col>
      </v-row>

<!--    </v-container>-->

  </v-card>

</template>

<script>
/**
 * EditMetadataAuthors.vue shows all the authors of a metadata entry in a list to select
 * them for editing
 *
 * @summary shows the authors the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-09-01 11:00:41
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import { EDIT_METADATA_AUTHORS_TITLE } from '@/factories/metadataConsts';
import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors';

export default {
  name: 'EditMetadataAuthors',
  components: {
    MetadataAuthors,
  },
  props: {
    authors: {
      type: Array,
      default: () => [],
    },
    authorDetailsConfig: {
      type: Object,
      default: () => {},
    },
    authorDeadInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    metadataAuthorsObject() {
      return {
        authors: this.authors,
        authorDetailsConfig: this.authorDetailsConfig,
        authorDeadInfo: this.authorDeadInfo,
        emptyText: 'No author has been added yet. Select authors in the dropdown or create a new author.',
        emptyTextColor: 'grey',
      };
    },
  },
  methods: {
  },
  data: () => ({
    editingInstructions: 'Select an author from the list to edit it\'s details',
    EDIT_METADATA_AUTHORS_TITLE,
  }),
};
</script>

<style scoped>

</style>
