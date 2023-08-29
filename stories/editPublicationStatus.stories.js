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

import EditPublicationStatus from '@/modules/user/components/edit/EditPublicationStatus.vue';
import { possiblePublicationStates } from '@/factories/metaDataFactory';


 export default {
   title: '9 Editing Metadata / Edit Publication Status',
   component: EditPublicationStatus,
};

 const allStates = possiblePublicationStates;
 allStates[0] = 'draft';

 const Template = (args, {argTypes}) => ({
   components: { EditPublicationStatus },
   props: Object.keys(argTypes),
   methods: {
     logEvent(event) {
       console.log(event);
     },
   },
   template: `<EditPublicationStatus v-bind="$props"
                                     @clicked="logEvent" />`,
 });

export const PublicationDraft = Template.bind({});

export const PublicationReserved = Template.bind({});
PublicationReserved.args = {
  publicationState: 'reserved',
}

export const PublicationReservedLoading = Template.bind({});
PublicationReservedLoading.args = {
  publicationState: 'reserved',
  loading: true,
}

export const PublicationPending = Template.bind({});
PublicationPending.args = {
  publicationState: 'pub_pending',
}
export const PublicationPublished = Template.bind({});
PublicationPublished.args = {
  publicationState: 'published',
}

export const PublicationDraftNoRights = Template.bind({});
PublicationDraftNoRights.args = {
  ...PublicationDraft.args,
  readOnlyFields: ['publicationStatus'],
  readOnlyExplanation: 'Only dataset owners and admins can change the publication status',
}

export const PublicationReservedNoRights = Template.bind({});
PublicationReservedNoRights.args = {
  ...PublicationReserved.args,
  readOnlyFields: ['publicationStatus'],
  readOnlyExplanation: 'Only dataset owners and admins can change the publication status',
}


export const DOIWorkflowInteraction = () => ({
  components: { EditPublicationStatus },
  template: `<EditPublicationStatus v-bind="editPublicationProps"
                                    @clicked="catchClicked" /> `,
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
})
