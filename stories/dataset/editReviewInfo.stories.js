/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-09-06 15:11:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import EditReviewInfo from '@/modules/user/components/edit/EditReviewInfo.vue';
import {
  PUBLICATION_STATE_DRAFT,
  PUBLICATION_STATE_RESERVED,
  PUBLICATION_STATE_PENDING,
  PUBLICATION_STATE_PUBLISHED,
} from '@/factories/metadataConsts';

export default {
  title: '3 Datasets / 2 Edit / Blind Review Infos',
  component: EditReviewInfo,
};

const Template = {
  render: (args, { argTypes }) => ({
    components: { EditReviewInfo },
    props: Object.keys(argTypes),
    template: '<EditReviewInfo v-bind="genericPropsFilled" />',
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeUnmount() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    mounted() {
      this.genericPropsFilled = this.$props;
    },
    methods: {
      editComponentsChanged(updateObj) {

        this.genericPropsFilled = {
          ...this.genericPropsFilled,
          loading: true,
        };

        console.log('EditPublicationInfo EDITMETADATA_OBJECT_UPDATE event', this.genericPropsFilled);

        setTimeout(() => {

          this.genericPropsFilled = {
            ...this.genericPropsFilled,
            ...updateObj.data,
            loading: false,
          };

          console.log('EditPublicationInfo EDITMETADATA_OBJECT_UPDATE event', this.genericPropsFilled);

        }, 1000)
      },
    },
    data: () => ({
      genericPropsFilled: {},
    }),
  }),
};

export const Empty = {
  ...Template,
  args: {
    doi: 'test1',
    publicationState: PUBLICATION_STATE_RESERVED,
  },
};

export const EmptyDraft = {
  ...Template,
  args: {
    doi: 'test1',
    publicationState: PUBLICATION_STATE_DRAFT,
  },
};

export const EmptyAndPending = {
  ...Template,
  args: {
    publicationState: PUBLICATION_STATE_PENDING,
  },
};

export const EmptyAndDisabled = {
  ...Template,
  args: {
    publicationState: PUBLICATION_STATE_PUBLISHED,
  },
};

export const FilledAndActive = {
  ...Template,
  args: {
    datasetId: '595',
    doi: 'test2',
    isBlindReview: true,
    publicationState: PUBLICATION_STATE_RESERVED,
  },
}

export const FilledAndNotActive = {
  ...Template,
  args: {
    ...FilledAndActive.args,
    isBlindReview: false,
  },
}

export const FilledWithLoading = {
  ...Template,
  args: {
    datasetId: '595',
    doi: 'test2',
    loading: true,
    isBlindReview: true,
    publicationState: PUBLICATION_STATE_RESERVED,
  },
}


