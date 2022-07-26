
/**
 * @summary story for editing users elements for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-25 12:21:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import EditUserProfile from '@/modules/user/components/edit/EditUserProfile.vue';
import authorCollection from '../public/testdata/authorCollection.json';
import { METADATA_EDITING } from './storybookFolder';

const keys = Object.keys(authorCollection);
const user1 =  authorCollection[keys[1]];
const user2 =  authorCollection[keys[2]];


export default {
  title: `${METADATA_EDITING} / User Profile`,
  decorators: [],
  parameters: {},
};

export const EditUserViews = () => ({
  components: { EditUserProfile },
  template: `
    <v-row >

      <v-col cols="6">
        empty Edit User Profile
        <EditUserProfile />
      </v-col>

      <v-col cols="6">
        {{ user1.fullName + ' Edit User Profile' }}
        <EditUserProfile :first-name="user1.firstName"
                          :last-name="user1.lastName"
                          :email="user1.email"
                          />
      </v-col>

      <v-col cols="6">
        {{ user2.fullName + ' Edit User Profile in loading state' }}
        <EditUserProfile :first-name="user2.firstName"
                         :last-name="user2.lastName"
                         :email="user2.email"
                         :loading="true"
        />
      </v-col>

      <v-col cols="6">
        {{ user2.fullName + ' Edit User Profile with errors' }}
        <EditUserProfile :first-name="user2.firstName"
                         :last-name="user2.lastName"
                         :email="user2.email"
                         error="Validation Error"
                         error-details="Some Validation Error Text"
        />
      </v-col>

    </v-row>
    `,
  data: () => ({
    user1,
    user2,
  }),
});
