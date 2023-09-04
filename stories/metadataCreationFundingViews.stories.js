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

import EditFunding from '@/modules/user/components/EditFunding.vue';

export default {
  title: '9 Editing Metadata / Funding Infos',
  decorators: [],
  parameters: {},
};


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
