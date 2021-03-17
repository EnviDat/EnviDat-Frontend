<template>
  <v-card :style="fixedHeight ? 'height: 304px;' : ''"
          id="MetadataCitation" >

    <v-card-title class="title metadata_title pa-4">
      {{ METADATA_CITATION_TITLE }}
    </v-card-title>

    <v-card-text v-if="citationText"
                  class="readableText px-4 py-0"
                  style="font-style: italic; "
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
                  class="shrink py-1 px-2" >

            <base-rectangle-button margin-class="citationButton"
                                    color="secondary"
                                    :button-text="link.text"
                                    :tool-tip-text="link.tooltipText"
                                    material-icon-name="assignment"
                                    :is-small="true"
                                    icon-color="white"
                                    :url="link.url" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>

    <v-card-text v-if="showPlaceholder && !citationText"
                  class="pa-4 pt-0">
      <div class="skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer">
        <div class="bone bone-type-multiline bone-style-paragraph" />
      </div>
    </v-card-text>

    <v-card-text v-if="!showPlaceholder && !citationText"
                  :style="`color: ${emptyTextColor};`"
                  class="pa-4 pt-0 readableText">
      {{ emptyText }}
    </v-card-text>

    <v-card-actions v-if="showPlaceholder && !citationText"
                    class="pa-4" >
      <v-spacer />
      <div class="skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer">
        <div style="width: 128px; height: 32px;"
              class="mx-1 bone bone-type-image bone-style-rectangle" />
        <div style="width: 128px; height: 32px;"
              class="mx-1 bone bone-type-image bone-style-rectangle" />
        <div style="width: 128px; height: 32px;"
              class="mx-1 bone bone-type-image bone-style-rectangle" />
      </div>
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

import { renderMarkdown } from '@/factories/stringFactory';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import { METADATA_CITATION_TITLE } from '@/factories/metadataConsts';

export default {
  name: 'MetadataCitation',
  components: {
    BaseRectangleButton,
  },
  props: {
    genericProps: Object,
    showPlaceholder: Boolean,
  },
  data: () => ({
    METADATA_CITATION_TITLE,
  }),
  computed: {
    markdownText() {
      return renderMarkdown(this.citationText);
    },
    citationText() {
      return this.mixinMethods_getGenericProp('citationText');
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
    citationXmlLink() {
      return this.mixinMethods_getGenericProp('citationXmlLink');
    },
    citationIsoXmlLink() {
      return this.mixinMethods_getGenericProp('citationIsoXmlLink');
    },
    citationGCMDXmlLink() {
      return this.mixinMethods_getGenericProp('citationGCMDXmlLink');
    },
    citationBibtexXmlLink() {
      return this.mixinMethods_getGenericProp('citationBibtexXmlLink');
    },
    citationRisXmlLink() {
      return this.mixinMethods_getGenericProp('citationRisXmlLink');
    },
    fixedHeight() {
      return this.mixinMethods_getGenericProp('fixedHeight');
    },
    emptyTextColor() {
      return this.mixinMethods_getGenericProp('emptyTextColor', 'red');
    },
    emptyText() {
      return this.mixinMethods_getGenericProp('emptyText', 'No citation found for this dataset.');
    },
  },
};

</script>
