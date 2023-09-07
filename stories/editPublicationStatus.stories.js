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

export default {
  title: '9 Editing Metadata / Edit Publication Status',
  component: EditPublicationStatus,
};

export const PublicationDraft = {};

export const PublicationReserved = {
  args: {
    publicationState: 'reserved',
  },
};

export const PublicationReservedLoading = {
  args: {
    ...PublicationReserved.args,
    loading: true,
  },
};

export const PublicationPending = {
  args: {
    publicationState: 'pub_pending',
  },
};

export const PublicationPublished = {
  args: {
    publicationState: 'published',
    doi: '10.16904/envidat.402',
  },
};

export const PublicationDraftNoRights = {
  args: {
    ...PublicationDraft.args,
    readOnlyFields: ['publicationStatus'],
    readOnlyExplanation: 'Only dataset owners and admins can change the publication status',
  },
};

export const PublicationReservedNoRights = {
  args: {
    ...PublicationReserved.args,
    readOnlyFields: ['publicationStatus'],
    readOnlyExplanation: 'Only dataset owners and admins can change the publication status',
  },
};
