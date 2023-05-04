/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-10-07 13:12:18
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import EditOrganization from '@/modules/user/components/EditOrganization.vue';

import testOrganizations from './js/organizations';
import { envidatViewportParameters } from './js/envidatViewports';


export default {
  title: '9 Editing Metadata / Edit Organization',
  decorators: [],
  parameters: {
    ...envidatViewportParameters,
  },
};

const Template = (args, { argTypes }) => ({
  components: { EditOrganization },
  props: Object.keys(argTypes),
  template: '<EditOrganization v-bind="$props"  />',
});

export const Empty = Template.bind({});

export const Normal = Template.bind({});
Normal.args = {
  organizationId: testOrganizations[0].id,
  userOrganizations: testOrganizations,
}

export const SingleOrganizationCase = Template.bind({});
SingleOrganizationCase.args = {
  // organizationId: testOrganizations[0].id,
  userOrganizations: [testOrganizations[1]],
}
