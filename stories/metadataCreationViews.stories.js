/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-09-01 17:47:50
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';

import {
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader';
import EditDescription from '@/modules/user/components/EditDescription';
import EditCustomFields from '@/modules/user/components/EditCustomFields';
import EditPublicationInfo from '@/modules/user/components/EditPublicationInfo';
import EditRelatedPublications from '@/modules/user/components/EditRelatedPublications';
import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder';
import EditKeywords from '@/modules/user/components/EditKeywords';
import MetadataCreationRelatedInfo from '@/modules/user/components/MetadataCreationRelatedInfo';

import EditDataInfo from '@/modules/user/components/EditDataInfo';
import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout';
// import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout';
import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody';
// import MetadataCitation from '@/modules/metadata/components/Metadata/MetadataCitation';
// import MetadataDetails from '@/modules/metadata/components/Metadata/MetadataDetails';
// import MetadataLocation from '@/modules/metadata/components/Metadata/MetadataLocation';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications';
// import MetadataFunding from '@/modules/metadata/components/Metadata/MetadataFunding';
// import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors';

// import doiIcon from '@/assets/icons/doi.png';
// import mailIcon from '@/assets/icons/mail.png';
// import contactIcon from '@/assets/icons/contact2.png';
// import licenseIcon from '@/assets/icons/license.png';

// import {
//   createHeader,
//   createBody,
// } from '@/factories/metaDataFactory';

// metadata gets enhance in the storybook config
// import metadata from './js/metadata';

// const smallHeader = createHeader(metadata[0], true);
// const largeHeader = createHeader(metadata[1], false);

// const body1 = createBody(metadata[0]);
// const body2 = createBody(metadata[1]);

// export const methods = {
//   onCardClick: action('clicked on card'),
//   onTagClick: action('clicked on tag'),
// };

const placeholderKeywordsGenericProps = {
  componentTitle: 'Metadata Keywords',
  disclaimer: 'Please note that the screenshot below will serve as a template for the future component.',
};


storiesOf('8 Metadata Creation Views / Main Info', module)
  .add('Editing Placeholder Images', () => ({
    components: { EditKeywords, EditDataInfo, MetadataCreationRelatedInfo },
    template: `
    <v-col>

      <v-row>
        EditKeywords with Placeholder
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditKeywords :genericProps="genericProps" />
        </v-col>
      </v-row>
      
      <v-row>
        EditDataInfo with Placeholder
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataInfo :genericProps="genericProps" />
        </v-col>
      </v-row>
      
      <v-row>
        MetadataCreationRelatedInfo with Placeholder
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MetadataCreationRelatedInfo :genericProps="genericProps" />
        </v-col>
      </v-row>      

    </v-col>
    `,
    data: () => ({
      genericProps: placeholderKeywordsGenericProps,
    }),
  }))
  .add('Edit Related Publications', () => ({
    components: { EditRelatedPublications },
    template: `
    <v-col>

      <v-row>
        Edit Related Publications fields unfilled 
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditRelatedPublications :genericProps="genericProps" />
        </v-col>
      </v-row>


      <v-row>
        Edit Related Publications fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditRelatedPublications :genericProps="genericPropsFilled" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    mounted() {
      this.genericPropsFilled.publications.text = this.genericPropsFilled.textareaContent;
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
      genericProps: {
        id: '1',
        labelTextarea: 'Related Publications',
        relatedPublicationsText: '',
        subtitlePreview: 'Preview',
        showPlaceholder: false,
      },
      genericPropsFilled: {         
                id: '2',
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
                showPlaceholder: false,
                publications: {
                  text: '',
                },
      },
    }),
  }))
  .add('Generic Textarea Preview Publications', () => ({
    components: { GenericTextareaPreviewLayout, MetadataPublications },
    template: `
    <v-col>

      <v-row>
        Generic Textarea Preview Layout unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GenericTextareaPreviewLayout :genericProps="genericProps"
                                        @changedText="catchChangedText($event)" >
            <metadata-publications :genericProps="publicationsObject" />              
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

      <v-row>
        Generic Textarea Preview Layout filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
         <GenericTextareaPreviewLayout :genericProps="genericPropsFilled"
                                        @changedText="catchChangedFilledText($event)" >
            <metadata-publications :genericProps="filledPublicationsObject" />            
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

    </v-col> `,
    mounted() {
        this.genericPropsFilled.publications.text = this.genericPropsFilled.textareaContent;
    },
    methods: {
      catchChangedText(value) {
        const newRelatedPublications = {
          ...this.genericProps,
          relatedPublicationsText: value,
        };

        this.genericProps = newRelatedPublications;
      },
      catchChangedFilledText(value) {
        const newRelatedPublications = {
          ...this.genericPropsFilled,
          relatedPublicationsText: value,
        };

        this.genericPropsFilled = newRelatedPublications;
      },
    },  
    computed: {
      publicationsObject() {
        return {
          publications: {
            text: this.genericProps.relatedPublicationsText,
          },
        };
      },
      filledPublicationsObject() {
        return {
          publications: {
            text: this.genericPropsFilled.relatedPublicationsText,
          },
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
  }))
  .add('Edit Image Placeholder', () => ({
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
  }))
  .add('Generic Textarea Preview Metadata Body', () => ({
    components: { GenericTextareaPreviewLayout, MetadataBody },
    template: `
    <v-col>

      <v-row>
        Generic Textarea Preview Layout Metadata Body unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GenericTextareaPreviewLayout  :genericProps="genericProps"  >          
            <metadata-body :genericProps="genericProps" />              
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

      <v-row>
        Generic Textarea Preview Layout Metadata Body filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
         <GenericTextareaPreviewLayout  :genericProps="genericPropsFilled"  >           
            <metadata-body :genericProps="genericPropsFilled" />            
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

    </v-col> `,
    created() {
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    mounted() {
        this.genericPropsFilled.body.text = this.genericPropsFilled.textareaContent;
    },
    beforeDestroy() {
      eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
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
  }))
  .add('Edit Publication Info', () => ({
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
          <EditPublicationInfo :genericProps="genericPropsFilled" />
        </v-col>
      </v-row>

    </v-col> `,
    created() {
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    methods: {
      // TODO find a way to have filled in example generate more rows
      editComponentsChanged(updateObj) {
        if (updateObj.data.id === this.genericPropsFilled.id) {
          this.genericPropsFilled = updateObj.data;
        }
      },
    },  
    data: () => ({
      genericPropsFilled: {
          id: 1,
          funders: [
            { 
              organization: 'WSL', 
              grantNumber: 'XYZ',
              link: 'https://www.wsl.ch',
            },
           { 
                organization: 'NSF', 
                grantNumber: '123',
                link: 'https://www.superduper.ch',
            },
            
          ],
      },    
    }), 
  }))
  .add('Edit Custom Fields', () => ({
    components: { EditCustomFields },
    template: `
    <v-col>

      <v-row>
        Edit Custom Fields fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditCustomFields :genericProps="emptyFirstGenericProps" />
        </v-col>
      </v-row>

       <v-row>
        Edit Custom Fields fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditCustomFields :genericProps="genericProps" />
        </v-col>
      </v-row>

    </v-col> `,
    created() {
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
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
      emptyFirstGenericProps: [],
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
  }))
.add('Edit Metadata Header', () => ({
    components: { EditMetadataHeader },
    template: `
    <v-col>

      <v-row>
        Edit Metadata Header fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataHeader :genericProps="emptyFirstGenericProps" />
        </v-col>
      </v-row>


      <v-row>
        Edit Metadata Header fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
         
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    methods: {
      editComponentsChanged(updateObj) {
        if (updateObj.data.id === this.genericProps.id) {
          this.genericProps = updateObj.data;
        }
        if (updateObj.data.id === this.emptyFirstGenericProps.id) {
          this.emptyFirstGenericProps = updateObj.data;
        }
      },
    },  
    data: () => ({
      emptyFirstGenericProps: {
        id: '1',
        metadataTitle: '',
        contactEmail: '',
        contactGivenName: '',
        contactSurname: '',
      },
      genericProps: {
        id: '2',
        metadataTitle: 'My Glorious Title',
        contactEmail: 'sarah@smith.com',
        contactGivenName: 'Sarah',
        contactSurname: 'Smith',
      },
    }),
  }))
.add('Edit Metadata Description', () => ({
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
          <EditDescription :genericProps="genericProps" />
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
}));
