/**
 * @summary story of all the Navigation components for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-07-28 09:08:14
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

// /* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import NavigationStepper from '@/components/Navigation/NavigationStepper';
import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader';
import EditDescription from '@/modules/user/components/EditDescription';
import EditCustomFields from '@/modules/user/components/EditCustomFields';

import MetadataCreationMainInfo from '@/modules/user/components/MetadataCreationMainInfo';

const mainDetailSteps = [
  {
    title: 'Basic Info',
    completed: false,
    component: EditMetadataHeader,
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
  data: () => ({
    steps,
  }),
  methods: {
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
  data: () => ({
    mainDetailSteps,
  }),
  methods: {
  },
}));
