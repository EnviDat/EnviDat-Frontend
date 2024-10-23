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
import {METADATA_STATE_INVISILBE} from '@/factories/metadataConsts';

export default {
  title: '9 Editing Metadata / Edit Publication Infos',
  component: EditPublicationInfo,
};

const Template = {
  render: (args, { argTypes }) => ({
    components: { EditPublicationInfo },
    props: Object.keys(argTypes),
    template: '<EditPublicationInfo v-bind="genericPropsFilled" />',
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeUnmount() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    mounted() {
      this.genericPropsFilled = this.$props;
    },
    methods: {
      editComponentsChanged(updateObj) {
        console.log('EditPublicationInfo EDITMETADATA_OBJECT_UPDATE event', updateObj);
        this.genericPropsFilled = {
          ...this.genericPropsFilled,
          ...updateObj.data,
        };
      },
    },
    data: () => ({
      genericPropsFilled: {},
    }),
  }),
};

export const EmptyPublicationComponent = {
  ...Template,
  args: {},
};

export const FilledPublicationComponent = {
  ...Template,
  args: {
    id: 1,
    doi: 'test',
    visibilityState: METADATA_STATE_INVISILBE,
    publicationYear: '2020',
    publisher: 'EnviDat',
  },
}
