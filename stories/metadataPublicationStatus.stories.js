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


 export default {
   title: '9 Editing Metadata / Edit Publication Status',
   component: EditPublicationStatus,
   decorators: [],
};


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

