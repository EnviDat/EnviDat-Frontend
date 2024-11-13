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

import EditOrganization from '@/modules/user/components/edit/EditOrganization.vue';

import { getReadOnlyFieldsObject } from '@/factories/mappingFactory';
import testOrganizations from './js/organizations';

const editingReadOnlyObj = getReadOnlyFieldsObject('published');

export default {
  title: '3 Dataset / 2 Edit / Organization',
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
  organizationId: testOrganizations[0].id,
  userOrganizations: [testOrganizations[0]],
}

export const MultipleOrganizations = Template.bind({});
MultipleOrganizations.args = {
  organizationId: testOrganizations[0].id,
  userOrganizations: testOrganizations,
}

export const EditingSingleOrganizationReadOnly = Template.bind({});
EditingSingleOrganizationReadOnly.args = {
  organizationId: testOrganizations[2].id,
  userOrganizations: [testOrganizations[2]],
  readOnlyFields: editingReadOnlyObj.readOnlyFields,
  readOnlyExplanation: editingReadOnlyObj.explanation,
}

export const EditingMultipleOrganizationsReadOnly = Template.bind({});
EditingMultipleOrganizationsReadOnly.args = {
  organizationId: testOrganizations[2].id,
  userOrganizations: testOrganizations,
  readOnlyFields: editingReadOnlyObj.readOnlyFields,
  readOnlyExplanation: editingReadOnlyObj.explanation,
}
