
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
import UserCard from '@/components/Cards/UserCard.vue';
import { getNameInitials } from '@/factories/authorFactory';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import FlipLayout from '@/components/Layouts/FlipLayout.vue';
import {
  EDIT_USER_PROFILE_EVENT,
  eventBus,
} from '@/factories/eventBus';
import authorCollection from './testdata/authorCollection.json';

const keys = Object.keys(authorCollection);
const user1 =  authorCollection[keys[1]];
const user2 =  authorCollection[keys[2]];


export default {
  title: '9 Editing Metadata / User Profile',
  component: EditUserProfile,
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
        <EditUserProfile :firstName="user1.firstName"
                          :lastName="user1.lastName"
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
                         email-hash="7e6b6dca84df35a663ba4518360095a8"
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

export const UserCardEditingViews = () => ({
  components: {
    EditUserProfile,
    UserCard,
    BaseIconButton,
    FlipLayout,
  },
  template: `
    <v-row >

      <v-col cols="6">
        FlipLayout with autoButtonFlip true
      </v-col>

      <v-col cols="6">
        <FlipLayout :height="height"
                    :width="height"
                    :autoButtonFlip="true" >

          <template v-slot:front>
            <UserCard :height="height"
                      :width="height"
                      :userName="author.firstName + ' ' + author.lastName"
                      :email="author.email"
            />
          </template>

          <template v-slot:back>
            <EditUserProfile :height="height"
                             :minWidth="height"
                             :showPreview="false"
                             :firstName="author.firstName"
                             :lastName="author.lastName"
                             :email="author.email"
            />
          </template>

        </FlipLayout>
      </v-col>

      <v-col cols="6">
        FlipLayout loading
      </v-col>

      <v-col cols="6">
        <FlipLayout :height="height"
                    :width="height"
                    :autoButtonFlip="true" >

          <template v-slot:front>
            <UserCard :height="height"
                      :width="height"
                      :userName="author.firstName + ' ' + author.lastName"
                      :nameInitials="getNameInitials(author)"
                      :email="author.email"
                      :loading="true"
            />
          </template>

          <template v-slot:back>
            <EditUserProfile :height="height"
                             :minWidth="height"
                             :showPreview="false"
                             :firstName="author.firstName"
                             :lastName="author.lastName"
                             :email="author.email"
                             :loading="true"
            />
          </template>

        </FlipLayout>
      </v-col>


      <v-col cols="6">
        FlipLayout with autoButtonFlip false
      </v-col>

      <v-col cols="6">
        <FlipLayout :height="height"
                    :width="height" >

          <template v-slot:front>
            <UserCard :height="height"
                      :width="height"
                      :userName="author.firstName + ' ' + author.lastName"
                      :nameInitials="getNameInitials(author)"
                      :email="author.email"
                      email-hash="7e6b6dca84df35a663ba4518360095a8"
            />
          </template>

          <template v-slot:back>
            <EditUserProfile :height="height"
                             :minWidth="height"
                             :showPreview="false"
                             :firstName="author.firstName"
                             :lastName="author.lastName"
                             :email="author.email"
            />
          </template>

        </FlipLayout>
      </v-col>

    </v-row>
    `,
  created() {
    eventBus.on(EDIT_USER_PROFILE_EVENT, this.authorChanged);
  },
  beforeUnmount() {
    eventBus.off(EDIT_USER_PROFILE_EVENT, this.authorChanged);
  },
  computed: {
    author() {
      return this.user1;
    },
  },
  methods: {
    authorChanged(userObject) {
      console.log('authorChanged');
      console.log(userObject);

      this.user1.firstName = userObject.data.firstName;
      this.user1.lastName = userObject.data.lastName;
      this.user1.email = userObject.data.email;
    },
    getNameInitials,
  },
  data: () => ({
    height: 350,
    user1,
  }),
});
