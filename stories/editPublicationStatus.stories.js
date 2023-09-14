/**
 * @summary story of all the MetadataState Chip component
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-18 13:06:31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import EditPublicationStatus from '@/modules/user/components/edit/EditPublicationStatus.vue';
import { USER_ROLE_ADMIN, USER_ROLE_EDITOR, USER_ROLE_MEMBER } from '@/factories/userEditingValidations';

export default {
  title: '9 Editing Metadata / Edit Publication Status',
  component: EditPublicationStatus,
};

export const Draft = {
  args: {
    userRole: USER_ROLE_EDITOR,
  },
};

export const Reserved = {
  args: {
    ...Draft.args,
    publicationState: 'reserved',
  },
};

export const ReservedLoading = {
  args: {
    ...Reserved.args,
    loading: true,
  },
};

export const Pending = {
  args: {
    ...Draft.args,
    publicationState: 'pub_pending',
  },
};

export const PendingAdmin = {
  args: {
    publicationState: 'pub_pending',
    userRole: USER_ROLE_ADMIN,
  },
};
export const Published = {
  args: {
    ...Draft.args,
    publicationState: 'published',
    doi: '10.16904/envidat.402',
  },
};

export const NoRightsDraft = {
  args: {
    publicationState: 'draft',
    userRole: USER_ROLE_MEMBER,
  },
};

export const NoRightsReserved = {
  args: {
    ...Reserved.args,
    userRole: USER_ROLE_MEMBER,
  },
};

export const NoRightsPending = {
  args: {
    ...Pending.args,
    userRole: USER_ROLE_MEMBER,
  },
};

export const NoRightsPublished = {
  args: {
    ...Published.args,
    userRole: USER_ROLE_MEMBER,
  },
};
