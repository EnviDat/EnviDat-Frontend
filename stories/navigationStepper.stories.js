/**
 * @summary story of all the Navigation components for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-07-28 17:25:37
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
import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader';
import EditDescription from '@/modules/user/components/EditDescription';
import EditCustomFields from '@/modules/user/components/EditCustomFields';

import MetadataCreationMainInfo from '@/modules/user/components/MetadataCreationMainInfo';

const componentToStateMapping = {
  EDITMETADATA_MAIN_HEADER: EditMetadataHeader,
  EDITMETADATA_MAIN_DESCRIPTION: EditDescription,
  EDITMETADATA_CUSTOMFIELDS: EditCustomFields,
};

function getStepToUpdate(eventName, steps) {
  if (!steps) {
    return null;
  }

  const cKeys = Object.keys(componentToStateMapping);
  const filteredKeys = cKeys.filter(k => k === eventName);
  const compKey = filteredKeys[0] || null;

  if (compKey) {

    const comp = componentToStateMapping[compKey];

    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      if (s?.component?.name === comp?.name) {
        return s;
      }
      
      if (s?.detailSteps) {
        return getStepToUpdate(eventName, s.detailSteps);
      }
    }
  }

  return null;
}

const mainDetailSteps = [
  {
    title: 'Basic Info',
    completed: false,
    component: EditMetadataHeader,
    genericProps: {
      body: {
        text: '',
      },
    },
  },
  {
    title: 'Description',
    completed: false,
    component: EditDescription,
  },
  {
    title: 'Keywords',
    completed: false,
    component: EditCustomFields,
  },
  {
    title: 'Authors',
    completed: false,
    component: EditDescription,
  },
];

const steps = [
  {
    title: 'Main Info',
    completed: false,
    color: 'secondary',
    component: MetadataCreationMainInfo,
    detailSteps: mainDetailSteps,
  },
  {
    title: 'Data Info',
    completed: false,
    color: 'red',
    component: EditDescription,
    genericProps: {
      body: {
        text: '',
      },
    },
  },
  {
    title: 'Related Info',
    completed: false,
    color: 'green',
    component: EditCustomFields,
  },
  {
    title: 'Publication Info',
    completed: false,
    color: 'orange',
    component: EditDescription,
  },
];

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
    steps,
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
