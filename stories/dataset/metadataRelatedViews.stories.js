/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-09-06 15:11:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { EDITMETADATA_OBJECT_UPDATE, eventBus } from '@/factories/eventBus';

import EditRelatedPublications from '@/modules/user/components/EditRelatedPublications.vue';
import EditRelatedDatasets from '@/modules/user/components/EditRelatedDatasets.vue';
import EditCustomFields from '@/modules/user/components/EditCustomFields.vue';
import EditRelatedInfo from '@/modules/user/components/EditRelatedInfo.vue';

import storyTags from '@/modules/metadata/store/metadataTags';

import categoryCards from '@/store/categoryCards';
import { getPopularTags, getTagColor } from '@/factories/keywordsFactory';

import metadataset from '@/../stories/js/metadata';

const unFormatedMetadataCards = metadataset;
const tagsFromDatasets = getPopularTags(metadataset, '', 1);

for (let i = 0; i < tagsFromDatasets.length; i++) {
  const tag = tagsFromDatasets[i];
  tag.color = getTagColor(categoryCards, tag.name);
}

function getKeywordsSource(tagsSource) {
  const keywordsArray = [...tagsSource];

  for (let i = 0; i < keywordsArray.length; i++) {
    keywordsArray[i].color = getTagColor(categoryCards, keywordsArray[i].name);
  }

  return keywordsArray;
}

const storyTags5 = getKeywordsSource(storyTags).slice(0, 5);

const placeholderKeywordsGenericProps = {
  metadataCardTitle: 'A Mostly Glorious Title',
  metadataCardSubtitle: 'My metadata description is pleasant to read.',
  existingKeywords: tagsFromDatasets,
  componentTitle: 'Metadata Keywords',
  disclaimer: 'Please note that the screenshot below will serve as a template for the future component.',
};

export default {
  title: '3 Datasets / 2 Edit / Related',
  decorators: [],
  parameters: {},
};

export const EditRelatedDatasetsViews = () => ({
  components: { EditRelatedDatasets },
  template: `
    <v-col>

      <v-row>
        <v-col cols="6">
        Edit Related Datasets fields unfilled
        </v-col>
      </v-row>

      <v-row class="py-3" >
        <v-col cols="6">
          <EditRelatedDatasets v-bind="genericProps"
                                :allDatasets="allDatasets" />
        </v-col>

        <v-col cols="6">
          <EditRelatedDatasets v-bind="genericPropsFilled"
                                :allDatasets="allDatasets" />
        </v-col>
      </v-row>

    </v-col>
    `,
  created() {
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  mounted() {
    this.genericProps.relatedDatasetsText = this.relatedDatasetsText;
    this.genericPropsFilled.relatedDatasetsText = this.relatedDatasetsText2;
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  methods: {
    editComponentsChanged(updateObj) {
      if (updateObj.data.id === this.genericProps.id) {
        this.genericProps = updateObj.data;
        // this.genericProps.publications.text = this.genericProps.textareaContent;
      }
      if (updateObj.data.id === this.genericPropsFilled.id) {
        this.genericPropsFilled = updateObj.data;
        // this.genericPropsFilled.relatedPublicationsText = this.genericPropsFilled.relatedPublicationsText;
      }
    },
  },
  data: () => ({
    relatedDatasetsText: '',
    relatedDatasetsText2: `https://www.envidat.ch/#/metadata/total_basal_area-2
            https://www.envidat.ch/#/metadata/salvage_logging_star-186
        `,
    allDatasets: unFormatedMetadataCards,
    genericProps: {
      relatedDatasetsText: '',
      id: '1',
    },
    genericPropsFilled: {
      id: '2',
      relatedDatasetsText: '',
    },
  }),
});

export const EditRelatedPublicationViews = () => ({
  components: { EditRelatedPublications },
  template: `
    <v-col>

      <v-row>
        Edit Related Publications fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditRelatedPublications v-bind="genericProps" />
        </v-col>
      </v-row>


      <v-row>
        Edit Related Publications fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditRelatedPublications v-bind="genericPropsFilled" />
        </v-col>
      </v-row>

    </v-col>
    `,
  created() {
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  methods: {
    editComponentsChanged(updateObj) {
      if (updateObj.data.id === this.genericProps.id) {
        this.genericProps = updateObj.data;
        // this.genericProps.publications.text = this.genericProps.textareaContent;
      }
      if (updateObj.data.id === this.genericPropsFilled.id) {
        // this.genericPropsFilled = updateObj.data;
        this.genericPropsFilled.relatedPublicationsText = updateObj.data;
      }
    },
  },
  data: () => ({
    genericProps: {
      relatedPublicationsText: '', // * wsl:21835 wsl%3A22390 \n * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 ',
      id: '1',
    },
    genericPropsFilled: {
      id: '2',
      labelTextarea: 'Related Publications',
      subtitlePreview: 'Preview',
      showPlaceholder: false,
      relatedPublicationsText:
        'Random text with __markdown__ [https://www.google.com](https://www.google.com) \n * wsl:21835 wsl%3A22390 \n * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 ',
      // relatedPublicationsText: '* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A22390\r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 \r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A30382',
    },
  }),
});

export const EditCustomFieldViews = () => ({
  components: { EditCustomFields },
  template: `
    <v-col>

      <v-row>
        Edit Custom Fields fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditCustomFields v-bind="emptyFirstGenericProps" />
        </v-col>
      </v-row>

       <v-row>
        Edit Custom Fields fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditCustomFields v-bind="genericProps" />
        </v-col>
      </v-row>

    </v-col> `,
  created() {
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  methods: {
    editComponentsChanged(updateObj) {
      if (updateObj.data?.length === this.genericProps.length) {
        this.genericProps = updateObj.data;
      }
      if (updateObj.data?.length === this.emptyFirstGenericProps.length) {
        this.emptyFirstGenericProps = updateObj.data;
      }
    },
  },
  data: () => ({
    emptyFirstGenericProps: {},
    genericProps: {
      customFields: [
        {
          fieldName: 'SubProject',
          content: 'Projectx',
        },
        {
          fieldName: 'Game',
          content: 'Gloomhaven',
        },
      ],
    },
  }),
});

export const EditRelatedInfoStep = () => ({
  components: { EditRelatedInfo },
  template: `
    <v-col>

      <v-row>
        EditRelatedInfo with Placeholder
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditRelatedInfo v-bind="genericProps" />
        </v-col>
      </v-row>

    </v-col>
    `,
  data: () => ({
    genericProps: placeholderKeywordsGenericProps,
    storyTags5,
  }),
});
