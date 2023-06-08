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

import { getReadOnlyFieldsObject } from '@/factories/mappingFactory';
import testOrganizations from './js/organizations';

const editingReadOnlyObj = getReadOnlyFieldsObject('published');

export default {
  title: '9 Editing Metadata / Edit Organization',
  component: EditOrganization,
};

const Template = (args, { argTypes }) => ({
  components: { EditOrganization },
  props: Object.keys(argTypes),
  template: '<EditOrganization v-bind="$props"  />',
});

export const Empty = Template.bind({});
Empty.args = {
  userOrganizations: testOrganizations,
}

export const SingleOrganization = Template.bind({});
SingleOrganization.args = {
  organization: testOrganizations[0].id,
  userOrganizations: [testOrganizations[0]],
}

export const MultipleOrganizations = Template.bind({});
MultipleOrganizations.args = {
  organization: testOrganizations[0].id,
  userOrganizations: testOrganizations,
}

export const EditingSingleOrganization = Template.bind({});
EditingSingleOrganization.args = {
  organization: testOrganizations[2].id,
  userOrganizations: [testOrganizations[2]],
  readOnlyFields: editingReadOnlyObj.readOnlyFields,
  readOnlyExplanation: editingReadOnlyObj.explanation,
}

export const EditingMultipleOrganizations = Template.bind({});
EditingMultipleOrganizations.args = {
  organization: testOrganizations[2].id,
  userOrganizations: testOrganizations,
  readOnlyFields: editingReadOnlyObj.readOnlyFields,
  readOnlyExplanation: editingReadOnlyObj.explanation,
}
