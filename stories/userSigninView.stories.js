/* eslint-disable object-curly-newline */
/**
 * @summary story of SigninPage sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import SigninView from '@/modules/user/components/SigninView.vue';

import authorCollection from './testdata/authorCollection.json';

const methods = {
  authors() {
    const items = Object.values(authorCollection);
    return items.splice(2, 4);
  },
};

export default {
  title: '7 User / SignIn',
  component: SigninView,
};

export const Empty = {};

export const EmailEntered = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
  },
};

export const EmailEnteredRequestLoading = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    requestLoading: true,
  },
};

export const EmailEnteredRequestSuccess = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    requestSuccess: true,
  },
};

export const EmailAndKeyEntered = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    requestSuccess: true,
    prefilledKey: '01234567890123456789012345678901',
  },
};

export const EmailAndKeyEnteredRequestSuccess = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    requestSuccess: true,
    prefilledKey: '01234567890123456789012345678901',
  },
};

export const EmailAndKeyEnteredLoading = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    signInLoading: true,
    prefilledKey: '01234567890123456789012345678901',
  },
};

export const SigninFinishedSuccessful = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    signedIn: true,
  },
};

export const SigninFinishedError = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    signedIn: true,
    error: '',
  },
};

/*
export const SignInViews = () => ({
    components: { SigninView },
    template: `
    <v-row >
      <v-col cols="12">
        <Signin-view />
      </v-col>

      <v-col cols="12">
        <Signin-view prefilledEmail="dominik.haas@wsl.ch" requestLoading />
      </v-col>

      <v-col cols="12">
        <Signin-view prefilledEmail="dominik.haas@wsl.ch" :requestSuccess="true" />
      </v-col>

      <v-col cols="12">
        <Signin-view prefilledEmail="dominik.haas@wsl.ch" prefilledKey="01234567890123456789012345678901" />
      </v-col>

      <v-col cols="12">
        <Signin-view prefilledEmail="dominik.haas@wsl.ch" prefilledKey="01234567890123456789012345678901" signInLoading />
      </v-col>

      <v-col cols="12">
        <Signin-view signedInEmail="dominik.haas@wsl.ch" signedIn  />
      </v-col>

    </v-row>
    `,
    methods,
  });
*/
