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

import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder.vue';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout.vue';
import MetadataDescription from '@/modules/metadata/components/Metadata/MetadataDescription.vue';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications.vue';

export default {
  title: '3 Datasets / 2 Edit / GenericTextAreas',
  decorators: [],
  parameters: {},
};

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
                                        placeholderTextarea ="Use a PID here"
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
        relatedPublicationsText: this.genericProps.textareaContent,
      };
    },
    filledPublicationsObject() {
      return {
        relatedPublicationsText: this.genericPropsFilled.textareaContent,
      };
    },
  },
  data: () => ({
    genericProps: {
      id: '1',
      columns: '',
      labelTextarea: 'Related Publications',
      textareaContent: '',
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
  methods: {},
  computed: {},
  data: () => ({
    componentTitle: 'Test of the Edit Image Placeholder',
    disclaimer: 'Please note that the screenshot below will serve as a template for the future component.',
  }),
});

export const GenericTextareaPreviewMetadataDescriptionView = () => ({
  components: { GenericTextareaPreviewLayout, MetadataDescription },
  template: `
    <v-col>

      <v-row>
        Generic Textarea Preview Layout Metadata Body unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GenericTextareaPreviewLayout  v-bind="genericProps"  >
            <MetadataDescription v-bind="genericProps" />
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

      <v-row>
        Generic Textarea Preview Layout Metadata Body filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
         <GenericTextareaPreviewLayout  v-bind="genericPropsFilled"  >
            <MetadataDescription v-bind="genericPropsFilled" />
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>

    </v-col> `,
  created() {
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  mounted() {
    this.genericPropsFilled.text = this.genericPropsFilled.textareaContent;
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  methods: {
    editComponentsChanged(updateObj) {
      if (updateObj.data.id === this.genericProps.id) {
        this.genericProps = updateObj.data;
        this.genericProps.text = this.genericProps.textareaContent;
      }
      if (updateObj.data.id === this.genericPropsFilled.id) {
        this.genericPropsFilled = updateObj.data;
        this.genericPropsFilled.text = this.genericPropsFilled.textareaContent;
      }
    },
  },
  computed: {},
  data: () => ({
    genericProps: {
      id: '1',
      columns: '',
      labelTextarea: 'Larry Label',
      textareaContent: '',
      subtitlePreview: 'Preview',
      showPlaceholder: false,
      text: '',
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
      text: '',
    },
  }),
});
