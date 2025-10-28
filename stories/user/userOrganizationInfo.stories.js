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
import { createAuthor, getNameInitials } from '@/factories/authorFactory';
import {
  USER_ROLE_ADMIN,
  USER_ROLE_COLLABORATOR,
  USER_ROLE_EDITOR,
  USER_ROLE_MEMBER,
  USER_ROLE_SYSTEM_ADMIN,
} from '@/factories/userEditingValidations';

import authorCollection from '@/../stories/testdata/authorCollection.json';

const authors = Object.values(authorCollection);
const author1 = createAuthor(authors[0]);
const author2 = createAuthor(authors[1]);
const author3 = createAuthor(authors[2]);

export default {
  title: '7 User / UserOrganizationInfo',
  component: UserOrganizationInfo,
};

export const Empty = {};

export const EmptyCollaborator = {
  args: {
    isCollaborator: true,
  },
};

export const AuthorRoleMember = {
  args: {
    userName: author1.fullName,
    email: author1.email,
    nameInitials: getNameInitials(author1),
    organizationRoles: [
      {
        organization: 'GIS',
        role: USER_ROLE_MEMBER,
      },
    ],
  },
};

export const AuthorRoleAdmin = {
  args: {
    userName: author2.fullName,
    email: author2.email,
    nameInitials: getNameInitials(author2),
    organizationRoles: [
      {
        organization: 'WSL',
        role: USER_ROLE_ADMIN,
      },
    ],
  },
};

export const AuthorRolesMixed = {
  args: {
    userName: author3.fullName,
    email: author3.email,
    emailHash: '7e6b6dca84df35a663ba4518360095a8',
    nameInitials: getNameInitials(author3),
    organizationRoles: [
      {
        organization: 'SLF',
        role: USER_ROLE_EDITOR,
      },
      {
        organization: 'EnviDat',
        role: USER_ROLE_SYSTEM_ADMIN,
      },
      {
        organization: 'LWF',
        role: USER_ROLE_COLLABORATOR,
      },
      {
        organization: 'GIS',
        role: USER_ROLE_MEMBER,
      },
      {
        organization: 'WSL',
        role: USER_ROLE_ADMIN,
      },
    ],
  },
};
