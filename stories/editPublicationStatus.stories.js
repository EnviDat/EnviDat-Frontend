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
import {
  PUBLICATION_STATE_DRAFT,
  PUBLICATION_STATE_RESERVED,
  PUBLICATION_STATE_PENDING,
  PUBLICATION_STATE_PUBLISHED,
} from '@/factories/metadataConsts';

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
    publicationState: PUBLICATION_STATE_RESERVED,
    doi: '10.16904/envidat.402',
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
    ...Reserved.args,
    publicationState: PUBLICATION_STATE_PENDING,
  },
};

export const PendingAdmin = {
  args: {
    ...Reserved.args,
    publicationState: PUBLICATION_STATE_PENDING,
    userRole: USER_ROLE_ADMIN,
  },
};
export const Published = {
  args: {
    ...Draft.args,
    publicationState: PUBLICATION_STATE_PUBLISHED,
    doi: '10.16904/envidat.402',
  },
};

export const NoRightsDraft = {
  args: {
    publicationState: PUBLICATION_STATE_DRAFT,
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
