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


import UserOrganizationInfo from '@/components/Cards/UserOrganizationInfo.vue';
import { getNameInitials } from '@/factories/authorFactory';
import authorCollection from './testdata/authorCollection.json';


export default {
  title: '7 User / User Elements',
  decorators: [],
  parameters: {
  },
};

export const UserOrganizationInfoViews = () => ({
  components: { UserOrganizationInfo },
  template: `
    <v-row >

      <v-col >
        <UserOrganizationInfo  />
      </v-col>

      <v-col >
        <UserOrganizationInfo isCollaborator />
      </v-col>


      <v-col v-for="(author, index) in authors()"
             :key="index" >
        <UserOrganizationInfo :userName="author.fullName"
                              :email="index > 0 ? author.email : null"
                              :nameInitials="index > 1 ? getNameInitials(author) : null"
                              :emailHash="index > 2 ? '7e6b6dca84df35a663ba4518360095a8' : null"
                              :organizationRoles="roleArray(index)"
        />
      </v-col>

    </v-row>
    `,
  computed: {
    organizationRoles() {
      if (!this.userOrganizationRoles) {
        return null;
      }

      const roles = [];
      const keys = Object.keys(this.userOrganizationRoles);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        roles.push ({
          organization: key,
          role: this.userOrganizationRoles[key],
        });
      }

      return roles;
    },
  },
  methods: {
    authors() {
      const items = Object.values(this.authorCollection);
      return items.splice(2, 4);
    },
    getNameInitials,
    roleArray(index) {
      return this[`organizationRoles${index}`];
    },
  },
  data: () => ({
    authorCollection,
    organizationRoles0: [{
        organization: 'GIS',
        role: 'member',
      },
    ],
    organizationRoles1: [{
      organization: 'WSL',
      role: 'admin',
    },
    ],
    organizationRoles2: [
      {
        organization: 'GIS',
        role: 'member',
      },
      {
        organization: 'WSL',
        role: 'admin',
      },
    ],
    organizationRoles3: [{
      organization: 'SLF',
      role: 'editor',
    },
    {
      organization: 'EnviDat',
      role: 'sysadmin',
    },
    {
      organization: 'LWF',
      role: 'collaborator',
    },
    {
      organization: 'GIS',
      role: 'member',
    },
    {
      organization: 'WSL',
      role: 'admin',
    },
  ],
/*
    userOrganizationRoles: {
      'GIS': 'member',
      'SLF': 'admin',
      'WSL': 'editor',
    },
*/
  }),
});
