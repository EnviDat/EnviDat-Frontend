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
   title: '10 Chips / EditPublicationStatus',
   component: EditPublicationStatus,
   decorators: [],
   parameters: {},
   argTypes: { onClick: { action: 'clicked' } },
 };


 const Template = (args, {argTypes}) => ({
   components: { EditPublicationStatus },
   props: Object.keys(argTypes),
   template: '<EditPublicationStatus v-bind="$props"  />',
 });


 export const PublicationStatus = Template.bind({});

 PublicationStatus.args = {
   publicationState: 'draft',
   loading: false,
 }
