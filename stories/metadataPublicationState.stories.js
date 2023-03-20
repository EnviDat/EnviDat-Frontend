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

 import MetadataStateChip from '@/components/Chips/MetadataStateChip.vue';


 export default {
   title: '10 Chips / MetadataStateChip',
   component: MetadataStateChip,
   decorators: [],
   parameters: {},
 };

 const states = [
   'draft', 'unpublished', 'pending', 'published',
 ];

 export const MetadataStateAllStates = () => ({
   components: { MetadataStateChip },
   template: `
     <div>
       <v-row v-for="(state, index) in states"
              :key="index">
         <v-col >
           {{ state }} state
         </v-col>
         <v-col>
           <MetadataStateChip :state="state" />
         </v-col>
       </v-row>
     </div>
   `,
   data: () => ({
     states,
   }),
 })

 /*
 const Template = (args, {argTypes}) => ({
   components: { MetadataStateChip },
   props: Object.keys(argTypes),
   // template: '<MetadataStateChip v-bind="$props" />',
 });


 export const MetadataStateDraft = Template.bind({});
 MetadataStateDraft.args = {
   state: 'draft',
   showOnHover: false,
 }

 export const MetadataStateUnpublished = Template.bind({});
 MetadataStateUnpublished.args = {
   state: 'unpublished',
   showOnHover: false,
 }

 export const MetadataStatePending = Template.bind({});
 MetadataStatePending.args = {
   state: 'pending',
   showOnHover: false,
 }

 export const MetadataStatePublished = Template.bind({});
 MetadataStatePublished.args = {
   state: 'published',
   showOnHover: false,
 }
 */
