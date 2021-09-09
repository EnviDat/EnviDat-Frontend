<template>
  <v-container fluid
                class="pa-0"
                id="EditDataAndResources" >

    <v-row >
      <v-col cols="6" >
        <v-row v-if="selectedResource" >
          <v-col >
            <EditResource :genericProps="selectedResource"
                          @closeClicked="catchEditResourceClose"
                          @saveResource="catchSaveResourceClose" />
          </v-col>
        </v-row>

        <v-row v-if="!selectedResource" >
          <v-col>
            <v-card class="pa-0">
              <EditDropResourceFiles @createResources="createResourceFromFiles" />

              <EditPasteResourceUrl @createResources="createResourceFromUrl" />
            </v-card>

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
 * Last modified  : 2021-08-17 16:19:08
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  CANCEL_EDITING_RESOURCE,
  SAVE_EDITING_RESOURCE,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_RESOURCES,
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
  eventBus,
} from '@/factories/eventBus';


import { initializeLocalResource } from '@/factories/metaDataFactory';
import { enhanceElementsWithStrategyEvents } from '@/factories/strategyFactory';

import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts';
import EditMetadataResources from '@/modules/user/components/EditMetadataResources';
import EditDropResourceFiles from '@/modules/user/components/EditDropResourceFiles';
import EditPasteResourceUrl from '@/modules/user/components/EditPasteResourceUrl';
import EditResource from '@/modules/user/components/EditResource';


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
    selectedResource() {
      let selectedRes = null;
      const res = this.genericProps?.resources;

      if (res?.length > 0) {
        const selected = res.filter(r => r.isSelected);

        if (selected?.length > 0) {
          selectedRes = selected[0];
        }
      }

      return selectedRes;
    },
  },
  methods: {
    createResourceFromUrl(url) {
      // console.log(`createResourceFromUrl ${url}`);

      const metadataId = this.getMetadataId();

      this.initResource(metadataId, null, url);
    },
    createResourceFromFiles(files) {
      // console.log(`createResourceFromFiles ${files}`);
      const metadataId = this.getMetadataId();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        this.initResource(metadataId, file, null, i === files.length - 1);
      }

    },
    getMetadataId() {
      const metadataId = this.genericProps?.metadataId || `local_MetadataId_${this.localResCounter}`;
      this.localResCounter++;
      return metadataId;
    },
    catchEditResourceClose() {
      eventBus.$emit(CANCEL_EDITING_RESOURCE, this.selectedResource);
    },
    catchSaveResourceClose() {
      eventBus.$emit(SAVE_EDITING_RESOURCE, this.selectedResource);
    },
    initResource(metadataId, file, url, autoSelect = true) {
      const newRes = initializeLocalResource(metadataId, file, url);

      enhanceElementsWithStrategyEvents([newRes], SELECT_EDITING_RESOURCE_PROPERTY, true);

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_RESOURCES,
        data: newRes,
      });

      if (autoSelect) {
        this.$nextTick(() => {
          eventBus.$emit(SELECT_EDITING_RESOURCE, newRes.id);
        });
      }
    },
  },
  data: () => ({
    EDIT_METADATA_RESOURCES_TITLE,
    localResCounter: 0,
  }),
};
</script>

<style scoped>

</style>
