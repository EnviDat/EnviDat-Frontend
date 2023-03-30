// noinspection JSUnusedGlobalSymbols
/* eslint-disable object-property-newline */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * @summary story of all the Navigation components for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-18 13:06:31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import NavigationStepper from '@/components/Navigation/NavigationStepper.vue';
// import MetadataCreationMainInfo from '@/modules/user/components/MetadataCreationMainInfo.vue';

import {
  metadataCreationSteps,
  getStepByName,
} from '@/factories/userEditingFactory';


export default {
  title: '5 Navigation / NavigationStepper',
  decorators: [],
  parameters: {},
};

export const NavigationStepperViews = () => ({
  components: {
    NavigationStepper,
  },
  template: `
  <v-row>
    <v-col cols="12">
      <NavigationStepper :steps="steps"
                          :initialStepTitle="steps[0].title"
                          stepColor="success" />

    </v-col>

  </v-row>
  `,
  created() {
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  methods: {
    getStepByName,
    editComponentsChanged(updateObj) {
      // console.log(`got update on ${JSON.stringify(updateObj.object)} with data ${JSON.stringify(updateObj.data)}`);
      // this.editState[updateObj.object] = updateObj.data;
      // console.log(`got update on ${this.editState}`);

      this.updateSteps(updateObj.object, updateObj.data);
    },
    updateSteps(eventName, newGenericProps) {
      const stepToUpdate = this.getStepByName(eventName, this.steps);
      stepToUpdate.genericProps = newGenericProps;
    },
  },
  data: () => ({
    steps: metadataCreationSteps,
  }),
});
