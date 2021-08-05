<template>
  <v-card id="EditMetadataResources"
          class="pa-4" >

    <v-container fluid
                  class="pa-0">
      
      <v-row >
        <v-col class="text-h5" >
          {{ EDIT_METADATA_RESOURCES_TITLE }}
        </v-col>
      </v-row>

      <v-row >
        <v-col class="text-body-1">
          {{ editingInstructions }}
        </v-col>
      </v-row>

      <v-row >
        <v-col cols="12">
          <MetadataResources :genericProps="genericProps" />
        </v-col>
      </v-row>

    </v-container>

  </v-card>
</template>

<script>
/**
 * MetadataResources.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-08-04 10:17:09
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts';
import MetadataResources from '@/modules/metadata/components/Metadata/MetadataResources';


export default {
  name: 'EditMetadataResources',
  components: {
    MetadataResources,
  },
  props: {
    genericProps: Object,
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
    editingInstructions: 'Pick a resource from the list to edit it\'s details',
    EDIT_METADATA_RESOURCES_TITLE,
  }),
};
</script>

<style scoped>

</style>
