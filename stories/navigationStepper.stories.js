/**
 * @summary story of all the Navigation components for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-07-27 16:15:05
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

// import MetadataCreationMainInfo from '@/modules/user/components/MetadataCreationMainInfo';

const steps = [
  {
    title: 'Main Info',
    icon: 'pen',
    tooltip: 'Back to the start page',
    completed: false,
    color: 'secondary',
    active: false,
    component: EditMetadataHeader,
  },
  {
    title: 'Data Info',
    icon: 'pen',
    tooltip: 'Back to the start page',
    completed: false,
    color: 'red',
    active: false,
    component: EditDescription,
  },
  {
    title: 'Related Info',
    icon: 'pen',
    tooltip: 'Back to the start page',
    completed: false,
    color: 'green',
    active: false,
    component: EditCustomFields,
  },
  {
    title: 'Publication Info',
    icon: 'pen',
    tooltip: 'Back to the start page',
    completed: false,
    color: 'orange',
    active: false,
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
                            :initialStepTitle="steps[1].title" />

      </v-col>

    </v-row>
  `,
  data: () => ({
    steps,
  }),
  methods: {
    // catchStepClick(step) {
    //   alert(`clicked ${step}`);

    //   for (let i = 0; i < steps.length; i++) {
    //     const s = steps[i];
    //     s.active = s.title === step;
    //   }
    // },
  },
// }))
// .add('Toolbar', () => ({
//   components: { TheNavigationToolbar },
//   template: `
//       <the-navigation-toolbar
//                   labelText="Search for something"
//             v-on:menuClick="onMenuClick"
//             v-on:searchClick="onSearchClick"
//             v-on:loginClick="onLoginClick"
//             />`,
//   methods,
}));
