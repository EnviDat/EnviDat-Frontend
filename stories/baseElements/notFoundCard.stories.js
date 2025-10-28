/**
 * @summary story of NotFoundCard
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import NotFoundCard from '@/components/Cards/NotFoundCard.vue';
import UserNotFound1 from '@/modules/user/assets/UserNotFound1.jpg';
import UserNotFound2 from '@/modules/user/assets/UserNotFound2.jpg';

export default {
  title: '1 Base / Cards /  Not Found',
  component: NotFoundCard,
};

export const Empty = {
  args: {},
};

export const NotSignedIn = {
  args: {
    title: 'Not Signed in',
    description: 'Sign in with your email address to see your datasets.',
    actionButtonText: 'Sign in',
    image: UserNotFound1,
  },
};

export const NoDatasets = {
  args: {
    title: 'No Datasets',
    description: "It seems you don't have any datasets.",
    actionDescription: 'Get started and create a new dataset',
    actionButtonText: 'New Dataset',
    image: UserNotFound2,
  },
};
