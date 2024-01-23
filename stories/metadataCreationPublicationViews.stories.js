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

import EditPublicationInfo from '@/modules/user/components/edit/EditPublicationInfo.vue';
import { PUBLICATION_STATE_DRAFT } from '@/factories/metadataConsts';

export default {
  title: '9 Editing Metadata / Edit Publication Infos',
  decorators: [],
  parameters: {},
};

export const EditPublicationInfoView = () => ({
    components: { EditPublicationInfo },
    template: `
    <v-col>

      <v-row>
        Edit Publication Info fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditPublicationInfo />
        </v-col>
      </v-row>

       <v-row>
        Edit Publication Info fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditPublicationInfo v-bind="genericPropsFilled" />
        </v-col>
      </v-row>

    </v-col> `,
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeUnmount() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    methods: {
      editComponentsChanged(updateObj) {
        this.genericPropsFilled = {
          ...this.genericPropsFilled,
          ...updateObj.data,
        };
      },
    },
    data: () => ({
      genericPropsFilled: {
        id: 1,
        doi: 'test',
        publicationState: PUBLICATION_STATE_DRAFT,
        publicationYear: '2020',
        publisher: 'EnviDat',
      },
    }),
  });
