<template>
  <v-container fluid
                class="pa-0"
                id="EditDataAndResources" >
    
    <v-row >
      <v-col cols="6" >
        <v-row v-if="selectedResource" >
          <v-col >
            <EditResource :genericProps="selectedResource" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <EditDropResourceFiles @createResources="createResourceFromFiles" />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-h5">
            {{ spacerText }}
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <EditPasteResourceUrl @createResources="createResourceFromUrl" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6" >
        <EditMetadataResources :genericProps="genericProps" />
      </v-col>
    </v-row>

  </v-container>

</template>

<script>
/**
 * EditDataAndResources.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-08-04 16:55:23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  // SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
  // eventBus,
} from '@/factories/eventBus';


import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts';
import EditMetadataResources from '@/modules/user/components/EditMetadataResources';
import EditDropResourceFiles from '@/modules/user/components/EditDropResourceFiles';
import EditPasteResourceUrl from '@/modules/user/components/EditPasteResourceUrl';
import EditResource from '@/modules/user/components/EditResource';

import { enhanceResourcesStrategyEvents } from '@/factories/strategyFactory';


export default {
  name: 'EditDataAndResources',
  components: {
    EditMetadataResources,
    EditDropResourceFiles,
    EditPasteResourceUrl,
    EditResource,
  },
  props: {
    genericProps: Object,
  },
  computed: {
    resources() {
      const res = this.mixinMethods_getGenericProp('resources', []);

      if (res.length > 0) {
        enhanceResourcesStrategyEvents(res, SELECT_EDITING_RESOURCE_PROPERTY);
      }

      return res;
    },
    selectedResource() {
      const id = this.mixinMethods_getGenericProp('selectionId', -1);
      let selectedRes = null;

      if (id !== -1) {
        const res = this.resources;

        if (res?.length > 0) {
          const selected = res.filter(r => r.id === id);

          if (selected?.length > 0) {
            selectedRes = selected[0];
          }
        }
      }

      return selectedRes;
    },
  },
  methods: {
    createResourceFromUrl(url) {
      console.log(`createResourceFromUrl ${url}`);
    },
    createResourceFromFiles(files) {
      console.log(`createResourceFromFiles ${files}`);
    },
  },
  data: () => ({
    spacerText: 'Or',
    EDIT_METADATA_RESOURCES_TITLE,
  }),
};
</script>

<style scoped>

</style>
