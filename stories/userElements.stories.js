/* eslint-disable object-curly-newline */
// noinspection JSUnusedGlobalSymbols

/**
 * @summary story of SigninPage sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-25 12:21:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import { getNameInitials } from '@/factories/authorFactory';

import UserAvatar from '@/components/Layouts/UserAvatar';
import UserCard from '@/components/Cards/UserCard';
import UserMenu from '@/modules/user/components/UserMenu';
import MetadataCube from '@/components/BaseElements/MetadataCube';

import authorCollection from '../public/testdata/authorCollection.json';

const userMenuItems = [
  { title: 'dashboard', icon: 'dashboard', toolTip: 'My Dashboard', active: false, path: 'dashboard', pageName: 'UserDashboard' },
  { title: 'profile', icon: 'edit', toolTip: 'Edit profile', active: false, path: 'profile', pageName: 'EditProfile' },
];

export default {
  title: '7 User / User Elements',
  decorators: [],
  parameters: {
    // disable the snapshots for the MicroCharts because they pull in recent data and
    // will change almost everytime
    chromatic: { disableSnapshot: false },
  },
};

export const UserMenuViews = () => ({
  components: { UserMenu },
  template: `
    <v-row >

      <v-col class="shrink">
        <UserMenu :navItems="userMenuItems" />
      </v-col>

    </v-row>
    `,
  data: () => ({
    userMenuItems,
  }),
});

export const UserAvatarViews = () => ({
  components: { UserAvatar },
  template: `
    <v-row >

      <v-col >
        <UserAvatar :size="32" />
      </v-col>

      <v-col >
        <UserAvatar />
      </v-col>

      <v-col >
        <UserAvatar :size="64" />
      </v-col>

      <v-col >
        <UserAvatar :size="128" />
      </v-col>

      <v-col >
        <UserAvatar :size="32" nameInitials="DH" />
      </v-col>

      <v-col >
        <UserAvatar nameInitials="DH" />
      </v-col>

      <v-col >
        <UserAvatar :size="64" nameInitials="DH" />
      </v-col>

      <v-col >
        <UserAvatar :size="128" nameInitials="DH" />
      </v-col>

      <v-col >
        <UserAvatar :size="32"
                    emailHash="7e6b6dca84df35a663ba4518360095a8"  />
      </v-col>

      <v-col >
        <UserAvatar
                    emailHash="7e6b6dca84df35a663ba4518360095a8"  />
      </v-col>

      <v-col >
        <UserAvatar :size="64"
                    emailHash="7e6b6dca84df35a663ba4518360095a8"  />
      </v-col>

      <v-col >
        <UserAvatar :size="128"
                    emailHash="7e6b6dca84df35a663ba4518360095a8"  />
      </v-col>

      <v-col >
        <UserAvatar :size="32"
                    defaultGavatar="robohash"
                    emailHash="7e6b6d1213f35a663ba4518360095a8" />
      </v-col>

      <v-col >
        <UserAvatar defaultGavatar="identicon"
                    emailHash="7e6b6dca2344df35a663ba4518360095a8" />
      </v-col>

      <v-col >
        <UserAvatar :size="64"
                    defaultGavatar="robohash"
                    emailHash="7e6b6dca84df351234518360095a8" />
      </v-col>

      <v-col >
        <UserAvatar :size="128"
                    defaultGavatar="identicon"
                    emailHash="4c6104f35821eb25ef16742fc23eb13e"
                    nameInitials="KP" />
      </v-col>

      <v-col >
        <UserAvatar :size="32"
                    nameInitials="II"
                    emailHash="b4fbef7455319e3124fbb0a1622902f3" />
      </v-col>

      <v-col >
        <UserAvatar nameInitials="II"
                    emailHash="b4fbef7455319e3124fbb0a1622902f3" />
      </v-col>

      <v-col >
        <UserAvatar :size="64"
                    nameInitials="II"
                    emailHash="b4fbef7455319e3124fbb0a1622902f3" />
      </v-col>

      <v-col >
        <UserAvatar :size="128"
                    nameInitials="II"
                    emailHash="b4fbef7455319e3124fbb0a1622902f3" />
      </v-col>

    </v-row>
  `,
});

export const UserCardViews = () => ({
  components: { UserCard },
  template: `
    <v-row >

      <v-col v-for="(author, index) in authors()"
              :key="index" >
        <UserCard :userName="author.fullName"
                  :email="index > 0 ? author.email : null"
                  :name-initials="index > 1 ? getNameInitials(author) : null"
                  :emailHash="index > 2 ? '7e6b6dca84df35a663ba4518360095a8' : null"
                  :datasetCount="author.datasetCount"
                  />
      </v-col>

    </v-row>
    `,
  methods: {
    authors() {
      const items = Object.values(this.authorCollection);
      return items.splice(2, 4);
    },
    getNameInitials,
  },
  data: () => ({
    authorCollection,
  }),
});


export const MetadataCubeViews = () => ({
  components: { MetadataCube },
  template: `
    <v-row>
      <v-col cols="12">
        <MetadataCube  />
      </v-col>

      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="12">
            <MetadataCube :positionOffset="20" color="green" />
          </v-col>
          <v-col cols="12">
            <MetadataCube :positionOffset="20" color="yellow" />
          </v-col>
          <v-col cols="12">
            <MetadataCube :positionOffset="20" color="red" />
          </v-col>
          <v-col cols="12">
            <MetadataCube :positionOffset="20" color="blue" />
          </v-col>
        </v-row>
      </v-col>

    </v-row>
  `,
  methods: {
  },
  data: () => ({
  }),
});