<template>

  <v-container fluid
               class="pa-0"
               id="EditMetadataAuthors" >

    <v-row >
      <v-col cols="6" >
        <v-row v-if="selectedAuthor" >
          <v-col >
            <EditAuthor :genericProps="selectedAuthor"
                        @closeClicked="catchEditAuthorClose"
                        @saveAuthor="catchSaveAuthorClose"/>
          </v-col>
        </v-row>

        <v-row v-if="!selectedAuthor" >
          <v-col>
            <v-card class="pa-0">

              <EditAddExistingAuthor :genericProps="genericProps" />

              <EditAddAuthor @createAuthor="catchCreateAuthor" />
            </v-card>

          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6" >
        <EditMetadataAuthors :genericProps="genericProps" />
      </v-col>
    </v-row>

  </v-container>

<!--  <v-card id="EditMetadataAuthors"
          class="pa-4" >

    <v-container fluid
                  class="pa-0">

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
          <MetadataAuthors :genericProps="genericProps" />
        </v-col>
      </v-row>

    </v-container>

  </v-card>-->
</template>

<script>
/**
 * EditMetadataAuthors.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-09-01 11:00:41
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import { EDIT_METADATA_AUTHORS_TITLE } from '@/factories/metadataConsts';
import EditAuthor from '@/modules/user/components/EditAuthor';
import EditAddAuthor from '@/modules/user/components/EditAddAuthor';
import EditAddExistingAuthor from '@/modules/user/components/EditAddExistingAuthor';

import EditMetadataAuthors from '@/modules/user/components/EditMetadataAuthors';


import { initializeLocalAuthor } from '@/factories/authorFactory';
import { enhanceElementsWithStrategyEvents } from '@/factories/strategyFactory';
import {
  eventBus,
  EDITMETADATA_DATA_AUTHOR,
  EDITMETADATA_OBJECT_UPDATE,
  SELECT_EDITING_AUTHOR,
  SELECT_EDITING_AUTHOR_PROPERTY,
  CANCEL_EDITING_AUTHOR,
  SAVE_EDITING_AUTHOR,
} from '@/factories/eventBus';


export default {
  name: 'EditAuthors',
  components: {
    EditMetadataAuthors,
    EditAuthor,
    EditAddAuthor,
    EditAddExistingAuthor,
  },
  props: {
    genericProps: Object,
  },
  computed: {
    selectedAuthor() {
      let selectedAuthor = null;
      const authors = this.genericProps?.authors;

      if (authors?.length > 0) {
        const selected = authors.filter(r => r.isSelected);

        if (selected?.length > 0) {
          selectedAuthor = selected[0];
        }
      }

      return selectedAuthor;
    },
  },
  methods: {
    initAuthor(autoSelect = true) {
      const newAuthor = initializeLocalAuthor();

      enhanceElementsWithStrategyEvents([newAuthor], SELECT_EDITING_AUTHOR_PROPERTY);

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_AUTHOR,
        data: newAuthor,
      });

      if (autoSelect) {
        this.$nextTick(() => {
          eventBus.$emit(SELECT_EDITING_AUTHOR, newAuthor.email);
        });
      }
    },
    catchRemovedUsers(pickedUsers) {
      this.notifyChange(pickedUsers);
    },
    catchPickedUsers(pickedUsers) {
      this.notifyChange(pickedUsers);
    },
    catchEditAuthorClose() {
      eventBus.$emit(CANCEL_EDITING_AUTHOR, this.selectedAuthor);
    },
    catchSaveAuthorClose() {
      eventBus.$emit(SAVE_EDITING_AUTHOR, this.selectedAuthor);
    },
    catchCreateAuthor() {
      this.initAuthor();
    },
    notifyChange(authors) {
      const newGenericProps = {
        ...this.genericProps,
        authors,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_AUTHOR,
        data: newGenericProps,
      });
    },
  },
  data: () => ({
    editingInstructions: 'Pick an author from the list to edit its details',
    EDIT_METADATA_AUTHORS_TITLE,
    disclaimer: `The screenshot below serves as a preview of the future component.
              Even if you can't interact, please think about the information shown and if the grouping of the information to
              edit would make sense in the context of the steps and substeps.`,
  }),
};
</script>

<style scoped>

</style>
