/**
 * @summary story of all the MetadataState Chip component
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-18 13:06:31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

// import { within } from '@storybook/testing-library';
import EditPublicationStatus from '@/modules/user/components/edit/EditPublicationStatus.vue';
import { possiblePublicationStates } from '@/factories/metaDataFactory';
import { USER_ROLE_ADMIN, USER_ROLE_EDITOR } from '@/factories/userEditingValidations';
import {
  METADATA_STATE_DRAFT,
  PUBLICATION_STATE_RESERVED,
  PUBLICATION_STATE_PENDING,
  PUBLICATION_STATE_PUBLISHED,
} from '@/factories/metadataConsts';

import { mobileViewportParams, tabletViewportParams } from './js/envidatViewports';


 export default {
   title: '3 Datasets / 2 Edit / Publication Status',
   // component: don't specify here,
   // because the template needs to be a neutral component for the interaction
};

 const allStates = possiblePublicationStates;
 allStates[0] = METADATA_STATE_DRAFT;

/*
 export const SimluateWorkflow = {
   args: {
     publicationState: METADATA_STATE_DRAFT,
   },
   play: async ({ canvasElement }) => {
     const canvas = within(canvasElement);
     console.log('canvas');
     console.log(canvas);
     // const btn = canvas.getByText('Reserve');
/!*
     const btn = canvas.getByLabelText('Reserve');
     console.log('btn');
     console.log(btn);
*!/
   },
 }
*/

const Template = (args, {argTypes}) => ({
  components: { EditPublicationStatus },
  template: `<EditPublicationStatus v-bind="editPublicationProps"
                                     @clicked="catchClicked" />`,
  props: Object.keys(argTypes),
  methods: {
    catchClicked(event) {
      console.log(event);
      this.loading = true;

      setTimeout(() => {
        const index = this.allStates.findIndex((value) => value === this.state);
        if (index < this.allStates.length) {
          this.message = `Successfully ${ this.successMessageMap.get(this.state) }`;

          setTimeout(() => {
            this.message = '';
            this.messageDetails = '';
          }, 3000);

          this.state = this.allStates[index + 1];
        }

        if (this.state === 'pub_pending') {
          if (this.userRole === USER_ROLE_EDITOR) {
            setTimeout(() => {
              this.doi = '10.16904/envidat.402';
              this.state = this.allStates[this.allStates.length - 1];
            }, 3000);
          }
        }

        this.messageDetails = '';
        this.loading = false;
      }, 1000);
    },
  },
  computed: {
    editPublicationProps() {
      return {
        publicationState: this.state,
        loading: this.loading,
        doi: this.doi,
        userRole: this.userRole,
        message: this.message,
        messageDetails: this.messageDetails,
      };
    },
  },
  data: () => ({
    allStates,
    doi: '',
    state: METADATA_STATE_DRAFT,
    loading: false,
    message: '',
    messageDetails: '',
    successMessageMap: new Map([
        [METADATA_STATE_DRAFT, 'Reserved a DOI'],
        [PUBLICATION_STATE_RESERVED, 'Requested publication'],
        [PUBLICATION_STATE_PENDING, 'Requested publication'],
        [PUBLICATION_STATE_PUBLISHED, 'Published Dataset '],
      ]),
    }),
  });


export const DOIWorkflowInteraction = Template.bind({});
DOIWorkflowInteraction.args = {
  userRole: USER_ROLE_EDITOR,
}

export const DOIWorkflowInteractionAdmin = Template.bind({});
DOIWorkflowInteractionAdmin.args = {
  userRole: USER_ROLE_ADMIN,
}

export const DOIWorkflowInteractionMobile = Template.bind({});
DOIWorkflowInteractionMobile.args = DOIWorkflowInteraction.args;
DOIWorkflowInteractionMobile.parameters = mobileViewportParams;

export const DOIWorkflowInteractionTablet = Template.bind({});
DOIWorkflowInteractionTablet.args = DOIWorkflowInteraction.args;
DOIWorkflowInteractionTablet.parameters = tabletViewportParams;
