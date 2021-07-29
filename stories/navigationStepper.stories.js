/**
 * @summary story of all the Navigation components for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-07-28 17:32:17
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

// /* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  eventBus,
} from '@/factories/eventBus';

import NavigationStepper from '@/components/Navigation/NavigationStepper';
import MetadataCreationMainInfo from '@/modules/user/components/MetadataCreationMainInfo';

import {
  metadataCreationSteps,
  mainDetailSteps,
  getStepToUpdate,
} from '@/modules/user/components/MetadataCreationSteps';


storiesOf('5 Navigation / Navigation Stepper', module)
  .add('Navigation Stepper', () => ({
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
    eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  data: () => ({
    steps: metadataCreationSteps,
  }),
  methods: {
    getStepToUpdate,
    editComponentsChanged(updateObj) {
      console.log(`got update on ${ JSON.stringify(updateObj.object)} with data ${JSON.stringify(updateObj.data)}`);
      // this.editState[updateObj.object] = updateObj.data;
      // console.log(`got update on ${this.editState}`);

      this.updateSteps(updateObj.object, updateObj.data);
    },
    updateSteps(eventName, newGenericProps) {
      const stepToUpdate = this.getStepToUpdate(eventName, this.steps);
      stepToUpdate.genericProps = newGenericProps;
    },
  },
}))
.add('Main Info Stepper', () => ({
  components: {
    MetadataCreationMainInfo,
  },
  template: `
  <v-row>
    <v-col cols="12">
      <MetadataCreationMainInfo :steps="mainDetailSteps"
                                :initialStepTitle="mainDetailSteps[0].title"
                                stepColor="highlight" />


    </v-col>

  </v-row>
  `,
  created() {
    eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.logChanges);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.logChanges);
  },
  data: () => ({
    mainDetailSteps,
  }),
  methods: {
    logChanges(updateObj) {
      console.log(`got update on ${updateObj.object} with data ${updateObj.data}`);
    },
  },
}));
