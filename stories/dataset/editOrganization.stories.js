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

import { getReadOnlyFieldsObject } from '@/factories/userEditingValidations';
import testOrganizations from '@/../stories/js/organizations';

const editingReadOnlyObj = getReadOnlyFieldsObject('published');

export default {
  title: '3 Datasets / 2 Edit / Organization',
  component: EditOrganization,
};

export const Empty = {
  args: {
    userOrganizations: testOrganizations,
  },
}

export const SingleOrganization = {
  args: {
    organizationId: testOrganizations[0].id,
    userOrganizations: [testOrganizations[0]],
  },
}

export const SingleOrganizationOrgasNotLoaded = {
  args: {
    userOrganizations: [testOrganizations[0]],
  },
}
export const MultipleOrganizations = {
  args: {
    organizationId: testOrganizations[0].id,
    userOrganizations: testOrganizations,
  },
}

export const EditingSingleOrganizationReadOnly = {
  args: {
    organizationId: testOrganizations[2].id,
    userOrganizations: [testOrganizations[2]],
    readOnlyFields: editingReadOnlyObj.readOnlyFields,
    readOnlyExplanation: editingReadOnlyObj.explanation,
  },
}

export const EditingMultipleOrganizationsReadOnly = {
  args: {
    organizationId: testOrganizations[2].id,
    userOrganizations: testOrganizations,
    readOnlyFields: editingReadOnlyObj.readOnlyFields,
    readOnlyExplanation: editingReadOnlyObj.explanation,
  },
}
