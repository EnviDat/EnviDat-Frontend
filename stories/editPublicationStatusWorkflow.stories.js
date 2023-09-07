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

import { within } from '@storybook/testing-library';
import EditPublicationStatus from '@/modules/user/components/edit/EditPublicationStatus.vue';
import { possiblePublicationStates } from '@/factories/metaDataFactory';
import { mobileViewportParams, tabletViewportParams } from './js/envidatViewports';


 export default {
   title: '9 Editing Metadata / Edit Publication Status',
   component: EditPublicationStatus,
};

 const allStates = possiblePublicationStates;
 allStates[0] = 'draft';

 export const SimluateWorkflow = {
   args: {
     publicationState: 'draft',
   },
   play: async ({ canvasElement }) => {
     const canvas = within(canvasElement);
     console.log('canvas');
     console.log(canvas);
     // const btn = canvas.getByText('Reserve');
/*
     const btn = canvas.getByLabelText('Reserve');
     console.log('btn');
     console.log(btn);
*/
   },
 }

const Template = (args, {argTypes}) => ({
  components: { EditPublicationStatus },
  template: `<EditPublicationStatus v-bind="$props"
                                     @clicked="catchClicked" />`,
  props: Object.keys(argTypes),
  methods: {
    catchClicked(event) {
      // console.log(event);
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
          setTimeout(() => {
            this.state = this.allStates[this.allStates.length - 1];
          }, 3000);
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
        message: this.message,
        messageDetails: this.messageDetails,
      };
    },
  },
  data: () => ({
    allStates,
    state: 'draft',
    loading: false,
    message: '',
    messageDetails: '',
    successMessageMap: new Map([
        ['draft', 'Reserved a DOI'],
        ['reserved', 'Requested publication'],
        ['pub_pending', 'Requested publication'],
        ['published', 'Published Dataset '],
      ]),
    }),
  });


export const DOIWorkflowInteraction = Template.bind({});

export const DOIWorkflowInteractionMobile = Template.bind({});
DOIWorkflowInteractionMobile.parameters = mobileViewportParams;

export const DOIWorkflowInteractionTablet = Template.bind({});
DOIWorkflowInteractionTablet.parameters = tabletViewportParams;
