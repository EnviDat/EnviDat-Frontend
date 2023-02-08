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

import {
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader.vue';
import EditDescription from '@/modules/user/components/EditDescription.vue';
import EditCustomFields from '@/modules/user/components/EditCustomFields.vue';
import EditPublicationInfo from '@/modules/user/components/EditPublicationInfo.vue';
import EditFunding from '@/modules/user/components/EditFunding.vue';
import EditRelatedPublications from '@/modules/user/components/EditRelatedPublications.vue';
import EditRelatedDatasets from '@/modules/user/components/EditRelatedDatasets.vue';
import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder.vue';
import EditKeywords from '@/modules/user/components/EditKeywords.vue';
import MetadataCreationRelatedInfo from '@/modules/user/components/MetadataCreationRelatedInfo.vue';

import EditDataInfo from '@/modules/user/components/EditDataInfo.vue';
import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout.vue';
import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody.vue';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications.vue';

import { getTagColor, sortObjectArray } from '@/factories/metaDataFactory';
import { getPopularTags } from '@/factories/metadataFilterMethods';

import {
  createAuthors,
  getFullAuthorsFromDataset,
  extractAuthorsMap,
} from '@/factories/authorFactory';

import storyTags from '@/modules/metadata/store/metadataTags';
import categoryCards from '@/store/categoryCards';
import metadataset from './js/metadata';
import { METADATA_EDITING } from './storybookFolder';

const unFormatedMetadataCards = metadataset;
const tagsFromDatasets = getPopularTags(metadataset, '', 1);

for (let i = 0; i < tagsFromDatasets.length; i++) {
  const tag = tagsFromDatasets[i];
  tag.color = getTagColor(categoryCards, tag.name);
}


function getKeywordsSource(tagsSource, catCards) {

  const keywordsArray = [...tagsSource];

  for (let i = 0; i < keywordsArray.length; i++) {
    keywordsArray[i].color = getTagColor(catCards, keywordsArray[i].name);
  }

  return keywordsArray;
}

const storyTags5 = getKeywordsSource(storyTags, categoryCards).slice(0, 5);

const placeholderKeywordsGenericProps = {
  // keywordsSource: tagsFromDatasets,
  metadataCardTitle: 'A Mostly Glorious Title',
  metadataCardSubtitle: 'My metadata description is pleasant to read.',
  existingKeywords: tagsFromDatasets,
  componentTitle: 'Metadata Keywords',
  disclaimer: 'Please note that the screenshot below will serve as a template for the future component.',
};


const metadataCards = [];

for (let i = 0; i < unFormatedMetadataCards.length; i++) {
  const el = unFormatedMetadataCards[i];
  el.author = createAuthors(el);
  metadataCards.push(el);
}


const authorsMap = extractAuthorsMap(metadataCards);
const authors = getFullAuthorsFromDataset(authorsMap, metadataCards[1]);

let existingAuthors = Object.values(authorsMap);
existingAuthors = sortObjectArray(existingAuthors, 'lastName');


export default {
  title: `${METADATA_EDITING} / Main Infos`,
  decorators: [],
  parameters: {},
};

export const EditingKeywordsPlaceholder = () => ({
    components: { EditKeywords, EditDataInfo, MetadataCreationRelatedInfo },
    template: `
    <v-col>

      <v-row>
        EditKeywords with Placeholder
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditKeywords v-bind="genericProps" />
        </v-col>
      </v-row>

      <v-row>
        EditKeywords with prefilled keywords
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditKeywords v-bind="genericProps"
                        :keywords="storyTags5"
          />
        </v-col>
      </v-row>

      <v-row>
        EditDataInfo with Placeholder
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataInfo v-bind="genericProps" />
        </v-col>
      </v-row>

      <v-row>
        MetadataCreationRelatedInfo with Placeholder
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MetadataCreationRelatedInfo v-bind="genericProps" />
        </v-col>
      </v-row>

    </v-col>
    `,
    data: () => ({
      genericProps: placeholderKeywordsGenericProps,
      storyTags5,
    }),
  });

export const EditRelatedDatasetsViews = () => ({
    components: { EditRelatedDatasets },
    template: `
    <v-col>

      <v-row>
        Edit Related Datasets fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditRelatedDatasets v-bind="genericProps" 
                                :allDatasets="allDatasets" />
        </v-col>
      </v-row>


      <v-row>
        Edit Related Datasets fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditRelatedDatasets v-bind="genericPropsFilled"
                                :allDatasets="allDatasets" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
        eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    mounted() {
        this.genericProps.relatedDatasetsText = this.relatedDatasetsText;
        this.genericPropsFilled.relatedDatasetsText = this.relatedDatasetsText2;
    },
    beforeDestroy() {
        eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
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
})

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
    mounted() {
      this.genericPropsFilled.relatedPublicationsText = this.textareaContent;
    },
    beforeDestroy() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    methods: {
      editComponentsChanged(updateObj) {
          console.log(updateObj);
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
        textareaContent: `# Why user stories?
&nbsp;
User Stories can help you to constantly improve the value of
your product, estimate development efforts in an appropriate way and prioritize
feature development during the MVP and post-MVP stages.
&nbsp;
# How user stories
&nbsp;
## 1. Step think about "Who" - type of user
&nbsp;
Try to omit using such a role as simply
“the user”. It can be applied to any person - from your customers to admins -
and, therefore, it doesn’t reflect the personality of particular target groups,
the way they interact with the application. You can create personas.
&nbsp;
## 2. Step think about the "What" - function, UI & UX
&nbsp;
Define what functionality each user expects. How she’s going to interact with the app.
&nbsp;
## 3. Step think about the "Why" - added value
&nbsp;
It should either improve the UX, increase retention rates,
shorten users’ journey to the issue solution or whatever. Each Story should
contribute something to the general goal of your product. `,
      genericProps: {
        relatedPublicationsText: '* wsl:21835 wsl%3A22390 \n * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 ',
        id: '1',
/*
      labelTextarea: 'Related Publications',
      subtitlePreview: 'Preview',
      showPlaceholder: false,
      isVerticalLayout: true,
*/
      },
      genericPropsFilled: {
        id: '2',
        labelTextarea: 'Related Publications',
        subtitlePreview: 'Preview',
        showPlaceholder: false,
        relatedPublicationsText: '* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A22390\r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 \r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A30382',
      },
    }),
  });

export const GenericTextAreaPreviewPublications = () => ({
    components: { GenericTextareaPreviewLayout, MetadataPublications },
    template: `
    <v-col>

      <v-row>
        Generic Textarea Preview Layout unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GenericTextareaPreviewLayout v-bind="genericProps"
                                        @changedText="catchChangedText($event)" >
            <metadata-publications v-bind="publicationsObject" />
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

      <v-row>
        Generic Textarea Preview Layout filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
         <GenericTextareaPreviewLayout v-bind="genericPropsFilled"
                                        @changedText="catchChangedFilledText($event)" >
            <metadata-publications v-bind="filledPublicationsObject" />
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

    </v-col> `,
    mounted() {
      this.genericPropsFilled.publications.text = this.genericPropsFilled.textareaContent;
    },
    methods: {
      catchChangedText(value) {
        this.genericProps = {
          ...this.genericProps,
          relatedPublicationsText: value,
        };
      },
      catchChangedFilledText(value) {
        this.genericPropsFilled = {
          ...this.genericPropsFilled,
          relatedPublicationsText: value,
        };
      },
    },
    computed: {
      publicationsObject() {
        return {
            text: this.genericProps.relatedPublicationsText,
        };
      },
      filledPublicationsObject() {
        return {
            text: this.genericPropsFilled.relatedPublicationsText,
        };
      },
    },
    data: () => ({
      genericProps: {
        id: '1',
        columns: '',
        labelTextarea: 'Related Publications',
        relatedPublicationsText: '',
        subtitlePreview: 'Preview',
        isVerticalLayout: true,
      },
      genericPropsFilled: {
        id: '2',
        columns: '',
        labelTextarea: 'Related Publications',
        textareaContent: `# Why user stories?
&nbsp;
User Stories can help you to constantly improve the value of
your product, estimate development efforts in an appropriate way and prioritize
feature development during the MVP and post-MVP stages.
&nbsp;
# How user stories
&nbsp;
## 1. Step think about "Who" - type of user
&nbsp;
Try to omit using such a role as simply
“the user”. It can be applied to any person - from your customers to admins -
and, therefore, it doesn’t reflect the personality of particular target groups,
the way they interact with the application. You can create personas.
&nbsp;
## 2. Step think about the "What" - function, UI & UX
&nbsp;
Define what functionality each user expects. How she’s going to interact with the app.
&nbsp;
## 3. Step think about the "Why" - added value
&nbsp;
It should either improve the UX, increase retention rates,
shorten users’ journey to the issue solution or whatever. Each Story should
contribute something to the general goal of your product. `,
        subtitlePreview: 'Preview',
        publications: {
          text: '',
        },
      },
    }),
  });

export const EditImagePlaceholderView = () => ({
    components: { EditImgPlaceholder },
    template: `
    <v-col>

      <v-row>
        Generic Placeholder without a given image, generic placeholder image should show up
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditImgPlaceholder :title="componentTitle"
                              :disclaimer="disclaimer"
                              />

        </v-col>
      </v-row>

    </v-col> `,
    methods: {
    },
    computed: {
    },
    data: () => ({
      componentTitle: 'Test of the Edit Image Placeholder',
      disclaimer: 'Please note that the screenshot below will serve as a template for the future component.',
    }),
  });

export const GenericTextareaPreviewMetadataBodyView = () => ({
    components: { GenericTextareaPreviewLayout, MetadataBody },
    template: `
    <v-col>

      <v-row>
        Generic Textarea Preview Layout Metadata Body unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GenericTextareaPreviewLayout  v-bind="genericProps"  >
            <metadata-body v-bind="genericProps" />
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

      <v-row>
        Generic Textarea Preview Layout Metadata Body filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
         <GenericTextareaPreviewLayout  v-bind="genericPropsFilled"  >
            <metadata-body v-bind="genericPropsFilled" />
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

    </v-col> `,
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    mounted() {
        this.genericPropsFilled.body.text = this.genericPropsFilled.textareaContent;
    },
    beforeDestroy() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    methods: {
      editComponentsChanged(updateObj) {
        if (updateObj.data.id === this.genericProps.id) {
          this.genericProps = updateObj.data;
          this.genericProps.body.text = this.genericProps.textareaContent;
        }
        if (updateObj.data.id === this.genericPropsFilled.id) {
          this.genericPropsFilled = updateObj.data;
          this.genericPropsFilled.body.text = this.genericPropsFilled.textareaContent;
        }
      },
    },
    computed: {
    },
    data: () => ({
      genericProps: {
        id: '1',
        columns: '',
        labelTextarea: 'Larry Label',
        textareaContent: '',
        subtitlePreview: 'Preview',
        showPlaceholder: false,
        body: {
          text: '',
        },
      },
      genericPropsFilled: {
        id: '2',
        columns: '',
        labelTextarea: 'Larry Label',
        textareaContent: `# Why user stories?
&nbsp;
User Stories can help you to constantly improve the value of
your product, estimate development efforts in an appropriate way and prioritize
feature development during the MVP and post-MVP stages.
&nbsp;
# How user stories
&nbsp;
## 1. Step think about "Who" - type of user
&nbsp;
Try to omit using such a role as simply
“the user”. It can be applied to any person - from your customers to admins -
and, therefore, it doesn’t reflect the personality of particular target groups,
the way they interact with the application. You can create personas.
&nbsp;
## 2. Step think about the "What" - function, UI & UX
&nbsp;
Define what functionality each user expects. How she’s going to interact with the app.
&nbsp;
## 3. Step think about the "Why" - added value
&nbsp;
It should either improve the UX, increase retention rates,
shorten users’ journey to the issue solution or whatever. Each Story should
contribute something to the general goal of your product. `,
        subtitlePreview: 'Preview',
        showPlaceholder: false,
        body: {
          text: '',
        },
      },
    }),
  });

export const EditPublicationInfoView = () => ({
    components: { EditPublicationInfo },
    template: `
    <v-col>

      <v-row>
        Edit Publication Info fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditPublicationInfo />
        </v-col>
      </v-row>

       <v-row>
        Edit Publication Info fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditPublicationInfo v-bind="genericPropsFilled" />
        </v-col>
      </v-row>

    </v-col> `,
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    methods: {
      editComponentsChanged(updateObj) {
        this.genericPropsFilled = updateObj.data;
      },
    },
    data: () => ({
      genericPropsFilled: {
        id: 1,
      },
    }),
  });

export const EditFundingView = () => ({
  components: { EditFunding },
  template: `
    <v-col>

      <v-row>
        Edit Funding fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditFunding />
        </v-col>
      </v-row>

       <v-row>
        Edit Funding fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditFunding v-bind="genericPropsFilled" />
        </v-col>
      </v-row>

    </v-col> `,
  created() {
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  methods: {
    editComponentsChanged(updateObj) {
//      if (updateObj.data.id === this.genericPropsFilled.id) {
        this.genericPropsFilled.funders = updateObj.data.funders;
//      }
    },
  },
  data: () => ({
    genericPropsFilled: {
      id: 1,
      funders: [
        {
          institution: 'WSL',
          grantNumber: 'XYZ',
          institutionUrl: 'https://www.wsl.ch',
        },
        {
          institution: 'NSF',
          grantNumber: '123',
          institutionUrl: 'https://www.superduper.ch',
        },
      ],
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
    beforeDestroy() {
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
      genericProps: [
        {
          field0: {
            fieldName: 'SubProject',
            content: 'Projectx',
          },
        },
        {
          field1: {
            fieldName: 'Game',
            content: 'Gloomhaven',
          },
        },
        {
          field2: {
            fieldName: 'Drink',
            content: 'Prosecco',
          },
        },
        {
          field3: {
            fieldName: '',
            content: '',
          },
        },
        {
          field4: {
            fieldName: '',
            content: '',
          },
        },
      ],
    }),
  });

export const EditMetadataHeaderViews = () => ({
    components: { EditMetadataHeader },
    template: `
    <v-col>

      <v-row>
        Edit Metadata Header fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataHeader v-bind="emptyFirstGenericProps" />
        </v-col>
      </v-row>


      <v-row>
        Edit Metadata Header fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataHeader v-bind="genericProps" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    methods: {
      editComponentsChanged(updateObj) {
        // this.emptyFirstGenericProps = updateObj.data;
        if (updateObj.data?.id === this.emptyFirstGenericProps.id) {
          this.emptyFirstGenericProps = updateObj.data;
        }
        if (updateObj.data?.id === this.genericProps.id) {
          this.genericProps = updateObj.data;
        }
      },
    },
    data: () => ({
      emptyFirstGenericProps: {
        id: '1',
        existingAuthors,
        metadataTitle: '',
        contactEmail: '',
        contactGivenName: '',
        contactSurname: '',
        existingEnviDatUsers: authors,
      },
      genericProps: {
        id: '2',
        existingAuthors,
        metadataTitle: 'My Glorious Title',
        contactEmail: 'sarah@smith.com',
        contactGivenName: 'Sarah',
        contactSurname: 'Miller',
      },
    }),
  });

export const EditMetadataDescriptionViews = () => ({
    components: { EditDescription },
    template: `
     <v-col>

      <v-row>
        Edit Description textarea unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDescription />
        </v-col>
      </v-row>


      <v-row>
        Edit Description textarea filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDescription :description="genericProps.description" />
        </v-col>
      </v-row>


    </v-col>
    `,
    computed: {
      genericProps() {
        return {
          description: `# Why user stories?
&nbsp;
User Stories can help you to constantly improve the value of
your product, estimate development efforts in an appropriate way and prioritize
feature development during the MVP and post-MVP stages.
&nbsp;
# How user stories
&nbsp;
## 1. Step think about "Who" - type of user
&nbsp;
Try to omit using such a role as simply
“the user”. It can be applied to any person - from your customers to admins -
and, therefore, it doesn’t reflect the personality of particular target groups,
the way they interact with the application. You can create personas.
&nbsp;
## 2. Step think about the "What" - function, UI & UX
&nbsp;
Define what functionality each user expects. How she’s going to interact with the app.
&nbsp;
## 3. Step think about the "Why" - added value
&nbsp;
It should either improve the UX, increase retention rates,
shorten users’ journey to the issue solution or whatever. Each Story should
contribute something to the general goal of your product. `,
        };
      },
    },
});
