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
  component: EditFunding,
};

export const EditFundingEmpty = {
  args: {},
  parameters: {},
}

export const EditFundingData = {
  render: (args) => ({
    components: {EditFunding},
    template: '<EditFunding v-bind="args"></EditFunding>',
    data: () => ({args}),
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    methods: {
      editComponentsChanged(updateObj) {
        setTimeout(() => {
          this.args.funders = updateObj.data.funders;
        }, 2000);
      },
    },
  }),
  args: {
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
  parameters: {},
}

export const EditFundingDataScrollable = {
  args: {
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
          institutionUrl: 'https://ethz.ch/de.html',
        },
        {
          institution: 'EDF',
          grantNumber: '987633',
          institutionUrl: 'https://envidat.ch',
        },
        {
          institution: 'LLD',
          grantNumber: '5578',
          institutionUrl: 'https://whiterisk.ch/en/conditions',
        },
        {
          institution: 'NDEA',
          grantNumber: '4567',
          institutionUrl: 'https://www.natural-hazards.ch',
        },
        {
          institution: 'COPOL',
          grantNumber: '348999',
          institutionUrl: 'https://www.lfi.ch/en',
        },
        {
          institution: 'LUN',
          grantNumber: '34555555',
          institutionUrl: 'https://www.waldwissen.net/de/',
        },
      ],
  },
  parameters: {},
}