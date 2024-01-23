<template>
  <v-container fluid>
    <v-card class="pa-0"
            :class="$vuetify.display.mdAndUp ? 'signInGrid' : 'signInGridMobile'"
            id="signInGrid">

      <v-img
        :src="signInPic"
        :max-height="$vuetify.display.mdAndUp ? '700' : '100'"
        :style="$vuetify.display.mdAndUp
          ? 'border-bottom-left-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 0;'
          : 'border-top-right-radius: 4px; border-top-left-radius: 4px;'"
      />

      <v-container fluid class="pa-4">
        <v-row>
          <v-col class="text-h3">
            {{ title }}
          </v-col>
        </v-row>

        <v-row v-if="signedIn" >
          <v-col
            cols="12"
            class="text-h6"
            :style="`background-color: ${$vuetify.theme.themes.light.highlight};`"
          >
            {{ signedInText + signedInEmail }}
          </v-col>
        </v-row>

        <v-row v-if="!signedIn" >
          <v-col cols="12" class="text-h6">
            {{ emailSignInInstructions }}
          </v-col>
        </v-row>

        <form v-if="!signedIn"
              class="enviDatForm pl-2">
          <v-row id="emailRow"
                 align="center">
            <v-col cols="12" md="9">
              <v-text-field
                v-model="email"
                :error-messages="backendErrors.email"
                label="Email"
                @input="isEmailValid()"
                @keyup.enter="catchRequestToken"
                tabindex="0"
              />
            </v-col>

            <v-col
              v-hide="!email || !emailAddressIsValid"
              cols="12"
              md="3"
              id="tokenButton"
            >
              <v-btn
                color="primary"
                :loading="tokenRequestLoading"
                @click="catchRequestToken"
                tabindex="0"
              >
                {{ tokenButtonText }}
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-if="requestSuccess && email">
            <v-col cols="12" class="text-caption">
              {{ `${requestSentText} ${email}. ${requestSentText2}` }}
            </v-col>
          </v-row>

          <v-row
            v-hide="!email || !emailAddressIsValid"
            id="tokenRow"
            align="center"
            justify="space-between"
            class="pt-4"
          >
            <v-col cols="12" md="4" class="flex-grow-0 text-h6">
              {{ requestTokenText }}
            </v-col>

            <v-col cols="12" md="5" class="pt-0">
              <v-text-field
                v-model="key"
                :error-messages="backendErrors.key"
                :counter="keyLength"
                label="Token"
                clearable
                clear-icon="clear"
                @input="isTokenValid()"
                @keyup.enter="catchEmailSignIn"
                tabindex="0"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-btn
                v-show="key && keyAddressIsValid"
                color="primary"
                :loading="signInRequestLoading"
                @click="catchEmailSignIn"
                tabindex="0"
              >
                {{ signinButtonText }}
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-if="wslSigninEnabled"
            id="wslEmailRow"
            align="center"
            v-hide="!email || !emailAddressIsWsl"
          >
            <v-col cols="12" md="9"
                   class="text-h8">
              {{ azureSignInInstructions }}
            </v-col>

            <v-col cols="12" md="3"
                   id="tokenButton">
              <BaseRectangleButton
                color="secondary"
                :button-text="azureButtonText"
                :custom-icon="wslLogo"
                :loading="tokenRequestLoading"
                custom-icon-whiten
                custom-icon-space
                @clicked="catchAzureAdSignIn"
              />
            </v-col>
          </v-row>

          <v-row
            v-if="formErrorText"
            id="errorTextRow"
            :style="`background-color: ${$vuetify.theme.themes.light.errorHighlight};`"
            class="mt-4"
          >
            <v-col cols="12" class="text-body-1">
              {{ formErrorText }}
            </v-col>
          </v-row>
        </form>

        <v-row v-if="signedIn"
               id="signinButtonRow"
                class="pl-2">
          <v-col class="flex-grow-0">
            <BaseRectangleButton
              color="primary"
              :button-text="dashboardButtonText"
              @clicked="catchOpenDashboard"
            />
          </v-col>

          <v-col class="flex-grow-0">
            <!--
          <v-btn color="secondary"
                 outlined
                 @click="catchSignOut">
            {{ signoutButtonText }}
          </v-btn>
-->

            <BaseRectangleButton
              color="secondary"
              :button-text="signoutButtonText"
              is-outlined
              @clicked="catchSignOut"
            />
          </v-col>
        </v-row>

        <v-row v-if="disclaimerText"
               class="pt-4">
          <v-col>
            <v-card class="pa-4">

              <v-row >
                <v-col cols="12" class="text-h6">
                  {{ disclaimerTitleText }}
                </v-col>
              </v-row>

              <v-row >
                <v-col cols="12" class="text-subtitle-1">
                  <span v-html="disclaimerText" />
                </v-col>
              </v-row>

              <v-row v-if="disclaimerPoints">
                <v-col cols="12" class="pl-6 text-body-2">
                  <li v-for="point in disclaimerPoints" :key="point">
                    <span v-html="point" />
                  </li>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

  </v-container>
</template>

<script>
/**
 * SigninView.vue provides the users with login form with email and token
 *
 * @summary login form with email and token
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 14:13:35
 * Last modified  : 2020-08-19 09:29:12
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import * as yup from 'yup';

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { isFieldValid } from '@/factories/userEditingValidations';
import signInPic from '@/modules/user/assets/signin.jpg';

const keyLength = 32;

export default {
  name: 'SigninView',
  props: {
    prefilledEmail: String,
    prefilledKey: String,
    signInLoading: Boolean,
    signInSuccess: Boolean,
    signedIn: Boolean,
    signedInEmail: String,
    requestLoading: Boolean,
    requestSuccess: Boolean,
    disclaimerText: String,
    disclaimerPoints: Array,
    formErrorText: String,
    errorField: String,
    errorFieldText: String,
    wslSigninEnabled: Boolean,
  },
  beforeMount() {
    this.email = this.prefilledEmail || '';
    this.key = this.prefilledKey;
  },
  computed: {
    emailAddressIsValid() {
      return (!this.signedIn && !this.backendErrors.email) || false;
    },
    emailAddressIsWsl() {
      return this.emailAddressIsValid
        && ( this.email.endsWith('@wsl.ch') || this.email.endsWith('@slf.ch') );
    },
    keyAddressIsValid() {
      return !this.signedIn && !this.backendErrors.key;
    },
    tokenRequestLoading() {
      return this.requestLoading || this.signInRequestLoading;
    },
    signInRequestLoading() {
      return this.signInLoading && !this.signInSuccess;
    },
    tokenButtonText() {
      return this.requestSuccess ? 'Get another token' : 'Request token';
    },
    wslLogo() {
      return this.mixinMethods_getIcon('wslLogo');
    },
    yupValidations: () =>
      yup.object().shape({
        email: yup
          .string()
          .email('Email must be a valid email address')
          .required('Email is required'),
        key: yup
          .string()
          .nullable()
          .required('Token is required')
          .min(32, 'Token must be 32 characters')
          .max(32, 'Token must be 32 characters'),
      }),
  },
  methods: {
    isEmailValid(value) {
      if (value) {
        this.email = value;
      }
      return isFieldValid(
        'email',
        this.email,
        this.yupValidations,
        this.backendErrors,
      );
    },
    isTokenValid(value) {
      if (value) {
        this.key = value;
      }
      return isFieldValid(
        'key',
        this.key,
        this.yupValidations,
        this.backendErrors,
      );
    },
    catchRequestToken() {
      if (this.isEmailValid(this.email)) {
        this.$emit('requestToken', this.email);
      }
    },
    catchEmailSignIn() {
      if (this.isTokenValid(this.key) && this.isEmailValid(this.email)) {
        this.$emit('emailSignIn', this.email, this.key);
      }
    },
    async catchAzureAdSignIn() {
      const accessToken = await this.$msal.getAccessToken();
      this.$emit('azureAdSignIn', this.email, accessToken, true);
    },
    catchSignOut() {
      this.$emit('signOut');
    },
    catchOpenDashboard() {
      this.$emit('openDashboard');
    },
  },
  watch: {
    errorField() {
      if (this.errorField) {
        this.backendErrors[this.errorField] = this.errorFieldText;
      }
    },
  },
  data: () => ({
    signinButtonText: 'Sign In',
    signoutButtonText: 'Sign Out',
    dashboardButtonText: 'Goto Dashboard',
    email: '',
    backendErrors: {
      email: '',
      key: '',
      error: '',
    },
    key: '',
    formInvalid: false,
    keyLength,
    requestTokenText: 'Do you have a token to sign in?',
    disclaimerTitleText: 'Disclaimer',
    requestSentText: 'The token was sent to ',
    requestSentText2: 'Please check your email address.',
    title: 'Sign in',
    signedInText: 'You are signed in as ',
    emailSignInInstructions:
      'Sign into EnviDat with your email address and the token which will be sent by email.',
    azureSignInInstructions:
      'WSL staff may sign in using their email and password (LAP password) instead:',
    azureButtonText: 'WSL Sign in',
    signInPic,
  }),
  components: {
    BaseRectangleButton,
  },
};
</script>

<style lang="scss" scoped>
.signInGrid {
  display: grid;
  grid-template-columns: 1fr 3fr;
}

.signInGridMobile {
  display: grid;
}
</style>
