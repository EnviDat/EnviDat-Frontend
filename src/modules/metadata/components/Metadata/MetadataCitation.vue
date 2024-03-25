<template>
  <v-card :style="fixedHeight ? 'height: 304px;' : ''"
          id="MetadataCitation" >

    <v-card-title class="text-h6 metadata_title pa-4">
      {{ METADATA_CITATION_TITLE }}
    </v-card-title>

    <v-card-text v-if="!showPlaceholder && citationText"
                  class="readableText px-4 py-0"
                  v-html="markdownText" >

    </v-card-text>

    <v-card-actions v-if="!showPlaceholder && citationText"
                    class="pa-4 pt-0">
      <v-container class="pa-0"
                    fluid >
        <v-row justify="end"
                no-gutters>

          <v-col v-for="link in citationLinks"
                  :key="link.text"
                  class="flex-grow-0 py-1 px-2" >

            <base-rectangle-button margin-class="citationButton"
                                    color="secondary"
                                    :button-text="link.text"
                                    :tooltipText="link.tooltipText"
                                    :icon="mdiClipboardText"
                                    :is-small="true"
                                    icon-color="white"
                                    :url="link.url" />
          </v-col>

          <v-col class="flex-grow-0 py-1 px-2">
            <base-rectangle-button margin-class="citationButton"
                                   color="secondary"
                                   button-text="Copy"
                                   tooltipText="Copy citation text to your clipboard"
                                   :icon="mdiContentCopy"
                                   :is-small="true"
                                   icon-color="white"
                                   @clicked="catchClipboardCopy"
            />
          </v-col>

        </v-row>
      </v-container>
    </v-card-actions>

    <v-card-text v-if="showPlaceholder && !citationText"
                  class="pa-4 pt-0">
      <v-skeleton-loader type='paragraph' color='gray' />
    </v-card-text>

    <v-card-text v-if="!showPlaceholder && !citationText"
                  :style="`color: ${emptyTextColor};`"
                  class="pa-4 pt-0 readableText">
      {{ emptyText }}
    </v-card-text>

    <v-card-actions v-if="showPlaceholder && !citationText"
                    class="pa-4 pt-0" >
      <v-spacer />
      <v-skeleton-loader type='button' color='gray' width='100' />
      <v-skeleton-loader type='button' color='gray' width='100' />
      <v-skeleton-loader type='button' color='gray' width='100' />
    </v-card-actions>
  </v-card>
</template>

<script>
/**
 * MetadataCitation.vue shows the citation and buttons
 * to download different xml formatted version of the citation.
 *
 * @summary shows the citation of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-01-05 15:16:29
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import {
  renderMarkdown,
  stripHTML,
} from '@/factories/stringFactory';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { METADATA_CITATION_TITLE } from '@/factories/metadataConsts';
import { mdiClipboard, mdiClipboardText, mdiContentCopy } from '@mdi/js';

export default {
  name: 'MetadataCitation',
  components: {
    BaseRectangleButton,
  },
  props: {
    citationText: {
      type: String,
      default: undefined,
    },
    citationXmlLink: {
      type: String,
      default: undefined,
    },
    citationIsoXmlLink: {
      type: String,
      default: undefined,
    },
    citationGCMDXmlLink: {
      type: String,
      default: undefined,
    },
    citationBibtexXmlLink: {
      type: String,
      default: undefined,
    },
    citationRisXmlLink: {
      type: String,
      default: undefined,
    },
    fixedHeight: {
      type: Boolean,
      default: false,
    },
    emptyTextColor: {
      type: String,
      default: 'red',
    },
    emptyText: {
      type: String,
      default: 'No citation found for this dataset.',
    },
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    METADATA_CITATION_TITLE,
    mdiClipboard,
    mdiClipboardText,
    mdiContentCopy,
  }),
  computed: {
    markdownText() {
      return renderMarkdown(this.citationText, false);
    },
    citationLinks() {
      return [{
        text: 'DataCite',
        tooltipText: 'Download DataCite XML citation',
        url: this.citationXmlLink,
      },
      {
        text: 'ISO 19139',
        tooltipText: 'Download ISO XML citation',
        url: this.citationIsoXmlLink,
      },
      {
        text: 'GCMD DIF',
        tooltipText: 'Download GCMD XML citation',
        url: this.citationGCMDXmlLink,
      },
      {
        text: 'BibTex',
        tooltipText: 'Download BibTex XML citation',
        url: this.citationBibtexXmlLink,
      },
      {
        text: 'RIS',
        tooltipText: 'Download RIS XML citation',
        url: this.citationRisXmlLink,
      },
      ];
    },
  },
  methods: {
    catchClipboardCopy() {
      navigator.clipboard.writeText(stripHTML(this.citationText));
    },
  },
};

</script>
