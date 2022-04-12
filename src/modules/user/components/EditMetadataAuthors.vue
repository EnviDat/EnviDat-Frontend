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

    <!--
                    :showGenericOpenButton="author.openEvent ? true : false"
                    :openButtonTooltip="author.openButtonTooltip"
                    :openButtonIcon="author.openButtonIcon"
                    :isSelected="author.isSelected"
                    :loading="author.loading"
                    @openButtonClicked="catchOpenClick(author.openEvent, author.openProperty)"
    -->

      <v-row >
        <v-col cols="12">
          <MetadataAuthors :genericProps="metadataAuthorsObject" >
            <template #editingAuthors="{ author }" >

              <AuthorCard :author="author"
                          :authorDetailsConfig="authorDetailsConfig"
                          :asciiDead="authorDeadInfo ? authorDeadInfo.asciiDead : ''"
                          :authorPassedInfo="authorDeadInfo ? authorDeadInfo.authorPassedInfo : ''"
                          >

                <template #dataCreditCurrentDataset >
                  <DataCreditLayout class="px-0 py-1 readableText"
                                    :dataCredit="author.currentDataCredits"
                                    :badgesLabel="AUTHORS_DATACREDIT_CONTRIBUTION_CURRENT"
                                    :noCreditslabel="`No data credit set yet, how did ${author.fullName} contribute to this datasets?`"
                                    iconColor="white"
                                    badgeColor="#384753"
                                    :dark="true" />

                </template>

              </AuthorCard>
            </template>
          </MetadataAuthors>
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
import {
  AUTHORS_DATACREDIT_CONTRIBUTION_CURRENT,
  EDIT_METADATA_AUTHORS_TITLE,
} from '@/factories/metadataConsts';
import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors';
import AuthorCard from '@/modules/metadata/components/AuthorCard';
import DataCreditLayout from '@/components/Layouts/DataCreditLayout';

export default {
  name: 'EditMetadataAuthors',
  components: {
    MetadataAuthors,
    AuthorCard,
    DataCreditLayout,
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
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
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
    AUTHORS_DATACREDIT_CONTRIBUTION_CURRENT,
  }),
};
</script>

<style scoped>

</style>
