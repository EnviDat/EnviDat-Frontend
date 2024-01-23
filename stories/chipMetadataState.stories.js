/**
 * @summary story of all the MetadataState Chip component
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import MetadataStateChip from '@/components/Chips/MetadataStateChip.vue';
import { possibleVisibilityStates } from '@/factories/metaDataFactory';
import { METADATA_STATE_DRAFT, METADATA_STATE_INVISILBE, METADATA_STATE_VISILBE } from '@/factories/metadataConsts';


export default {
    title: '10 Chips / MetadataStateChip',
    component: MetadataStateChip,
    decorators: [],
    parameters: {},
};

const states = possibleVisibilityStates;

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

const Template = (args, {argTypes}) => ({
    components: { MetadataStateChip },
    props: Object.keys(argTypes),
    template: `
     <v-container fluid>
       <v-row>
        <MetadataStateChip v-bind="$props" />
       </v-row>

       <v-row class="pt-4">
         <v-col class="flex-grow-0">
            Show on Hover enabled:
         </v-col>

         <v-col>
            <MetadataStateChip v-bind="$props" show-on-hover />
         </v-col>
       </v-row>
     </v-container>
   `,
});


export const Draft = Template.bind({});
Draft.args = {
    state: METADATA_STATE_DRAFT,
}

export const Hidden = Template.bind({});
Hidden.args = {
    state: METADATA_STATE_INVISILBE,
}


export const Visible = Template.bind({});
Visible.args = {
    state: METADATA_STATE_VISILBE,
}
