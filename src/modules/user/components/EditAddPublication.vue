<template>
  <v-container fluid
               id="EditAddPublication"
               class="pa-0"
  >

    <v-row>
      <v-col >
        <div class="text-subtitle-1"
             v-html="labels.cardInstructions">

        </div>
      </v-col>
    </v-row>

    <v-row no-gutters
            align="center"
            align-content="center"
            class="pt-4"
            :dense="dense">
      <v-col >
        <v-text-field
            v-model="pidField"
            :label="labels.pId"
            :dense="dense"
            :disabled="!!doiField"
            outlined
            hide-details
            prepend-icon="account_circle"
        />
      </v-col>

      <v-col class="text-h6 px-4 shrink" >
        Or
      </v-col>

      <v-col>
        <v-text-field
            v-model="doiField"
            :label="labels.dataObjectIdentifier"
            :dense="dense"
            :disabled="!!pidField"
            outlined
            hide-details
            prepend-icon="fingerprint"
        />
  <!--
            @change="doiField = $event"
            @input="validateProperty('doi', $event)"
        :readonly="mixinMethods_isFieldReadOnly('doi')"
        :hint="mixinMethods_readOnlyHint('doi')"
        :error-messages="validationErrors.doi"
  -->

      </v-col>

      <v-col class="pl-4 ">
        <BaseIconButton material-icon-name="add"
                        :fillColor="$vuetify.theme.themes.light.primary"
                        icon-color="white"
                        :is-small="dense"
                        @clicked="addClick"
        />

      </v-col>
    </v-row>


    <v-row no-gutters
           class="pt-4">
      <v-col >
        <BaseStatusLabelView status-icon="question_mark"
                             :show-expand-icon="true"
          />
      </v-col>
    </v-row>

    <v-row no-gutters
          class="pt-4">
      <v-col >
        <div class="text-subtitle-1"
             v-html="labels.subtitlePreview">

        </div>
      </v-col>
    </v-row>

    <v-row no-gutters
            class="pt-2">
      <v-col >
        <v-card class="pa-4">
          <BaseCitationView v-bind="citationViewProps" />
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>


<script>
/**
 * EditAddPublication.vue shows a text field for the PID or the DOI and gives a preview
 * of the publication
 *
 * @summary shows a widget to add publications
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import { EDIT_METADATA_ADD_PUBLICATION_TITLE } from '@/factories/metadataConsts';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';


export default {
  name: 'EditAddPublication',
  props: {
    pid: {
      type: String,
      default: undefined,
    },
    doi: {
      type: String,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    abstract: {
      type: String,
      default: undefined
    },
    citation: {
      type: String,
      default: undefined
    },
    doiUrl: {
      type: String,
      default: undefined
    },
  },
  computed: {
    pidField: {
      get() {
        return this.previewPID !== null ? this.previewPID : this.pid;
      },
      set(value) {

        this.previewPID = value;
      },
    },
    doiField: {
      get() {
        return this.previewDOI !== null ? this.previewDOI : this.doi;
      },
      set(value) {

        this.previewDOI = value;
      },
    },
    citationViewProps() {
      return {
        doi: this.doiField,
        doiUrl: this.doiUrl,
        citation: this.citation,
        abstract: this.abstract,
      };
    },
  },
  methods: {
    addClick() {
      this.$emit('addClicked', {
        pid: this.pidField,
        doi: this.doiField,
      });
    },
  },
  data: () => ({
    previewPID: null,
    previewDOI: null,
    editingProperty: 'relatedPublicationsText',
    labels: {
      title: EDIT_METADATA_ADD_PUBLICATION_TITLE,
      cardInstructions: 'Add DORA permantant Id (PID) or a Data Object Identifer (DOI).',
      subtitlePreview: 'Preview Publications resolved via DORA',
      pId: 'Permant Id',
      doi: 'Data Object Identifier',
    },
    validationErrors: {
      relatedPublicationsText: null,
    },
  }),
  components: {
    BaseIconButton,
    BaseStatusLabelView,
  },
};


</script>
