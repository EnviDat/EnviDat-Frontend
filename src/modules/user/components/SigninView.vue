<template>
  <v-card class="pa-0 signInGrid"
          id="signInGrid" >

    <v-img :src="signInPic"
            max-height="500"
            style="border-bottom-left-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 0px;" />

    <v-container fluid class="pa-4">

      <v-row>
        <v-col class="text-h3">
          {{ title }}
        </v-col>
      </v-row>

      <v-row v-if="signedIn">
        <v-col cols="12"
                class="text-h6"
                :style="`background-color: ${signedInColor};`" >
          {{ signedInText + signedInEmail }}
        </v-col>
      </v-row>

      <v-row v-if="!signedIn">
        <v-col cols="12"
                class="text-h6" >
          {{ instructionsText }}
        </v-col>
      </v-row>

      <form v-if="!signedIn"
            class="enviDatForm">
        <v-row id="emailRow"
                align="center" >
          <v-col cols="12"
                  md="9">

            <v-text-field v-model="email"
                          :error-messages="emailErrors"
                          label="Email"
                          required
                          @change="$v.email.$touch()"
                          @keyup.enter="catchRequestToken"
                          tabindex="0" />
          </v-col>

          <v-col v-if="emailAddressIsValid"
                  cols="12"
                  md="3"
                  id="tokenButton" >

            <v-btn color="primary"
                    :loading="tokenRequestLoading"
                    @click="catchRequestToken"
                    tabindex="0" >
              {{ tokenButtonText }}
            </v-btn>
          </v-col>

        </v-row>

        <v-row v-if="requestSuccess && email" >
          <v-col cols="12"
                  class="text-caption" >
            {{ `${requestSentText} ${email}. ${requestSentText2}` }}
          </v-col>
        </v-row>


        <v-row v-if="emailAddressIsValid"
                id="tokenRow"
                align="center"
                justify="space-between"
                class="pt-4" >

          <v-col cols="12"
                  md="4"
                  class="shrink text-h6" >
            {{ requestTokenText }}
          </v-col>

          <v-col cols="12"
                  md="5"
                  class="pt-0">
            <v-text-field v-model="key"
                          :error-messages="keyErrors"
                          :counter="keyLength"
                          label="Token"
                          required
                          clearable
                          clear-icon="clear"
                          @blur="$v.key.$touch()"
                          @keyup.enter="catchSignIn"
                          tabindex="0"/>
          </v-col>

          <v-col cols="12"
                  md="3" >

            <v-btn v-show="!$v.$invalid"
                    color="primary"
                    :loading="signInRequestLoading"
                    @click="catchSignIn"
                   tabindex="0" >
              {{ signinButtonText}}
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="formErrorText"
                id="errorTextRow"
                :style="`background-color: ${errorColor};`"
                class="mt-4" >
          <v-col cols="12"
                  class="text-body-1">
            {{ formErrorText }}
          </v-col>
        </v-row>

      </form>

      <v-row v-if="signedIn"
             id="signinButtonRow" >

        <v-col >
          <v-btn color="secondary"
                 outlined
                 @click="catchSignOut">
            {{ signoutButtonText }}
          </v-btn>
        </v-col>

      </v-row>

    </v-container>

  </v-card>

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
import { validationMixin } from 'vuelidate';
import {
 email,
 required,
 minLength,
 maxLength,
} from 'vuelidate/lib/validators';

import signInPic from '@/modules/user/assets/signin.jpg';

const keyLength = 32;

export default {
  components: {
  },
  props: {
    prefilledEmail: String,
    prefilledKey: String,
    signInLoading: Boolean,
    signInSuccess: Boolean,
    signedIn: Boolean,
    signedInColor: {
      type: String,
      default: 'green',
    },
    signedInEmail: String,
    requestLoading: Boolean,
    requestSuccess: Boolean,
    formErrorText: String,
    errorField: String,
    errorFieldText: String,
    errorColor: {
      type: String,
      default: 'red',
    },
  },
  beforeMount() {
    this.email = this.prefilledEmail;
    this.key = this.prefilledKey;
  },
  computed: {
    emailAddressIsValid() {
      return !this.signedIn && !this.$v.email.$invalid && this.emailErrors.length <= 0;
    },
    tokenRequestLoading() {
      return this.requestLoading || this.signInRequestLoading;
    },
    signInRequestLoading() {
      return this.signInLoading && !this.signInSuccess;
    },
    emailErrors() {
      const backendErr = this.backendErrors.email;
      const errors = backendErr ? [backendErr] : [];

      if (!this.$v.email.$dirty) return errors;

      if (!this.$v.email.email) {
        errors.push('Must be valid email');
      }
      if (!this.$v.email.required) {
        errors.push('Email is required');
      }

      return errors;
    },
    keyErrors() {
      const backendErr = this.backendErrors.key;
      const errors = backendErr ? [backendErr] : [];

      if (!this.$v.key.$dirty) return errors;

      if (!this.$v.key.minLength || !this.$v.key.maxLength) {
        errors.push(`Token must be ${this.keyLength} characters long`);
      }

      if (!this.$v.key.required) {
        errors.push('Token is required.');
      }

      return errors;
    },
    tokenButtonText() {
      return this.requestSuccess ? 'Get another token' : 'Request token';
    },
  },
  methods: {
    catchRequestToken() {
      this.$v.email.$touch();
      this.formInvalid = this.$v.email.$invalid;

      if (!this.formInvalid) {
        this.$emit('requestToken', this.email);
      }
    },
    catchSignIn() {
      this.$v.$touch();
      this.formInvalid = this.$v.$invalid;

      if (!this.formInvalid) {
        this.$emit('signIn', this.email, this.key);
      }
    },
    catchSignOut() {
      this.$emit('signOut');
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
    requestSentText: 'The token was sent to ',
    requestSentText2: 'Please check your email address.',
    title: 'Sign in',
    signedInText: 'You are signed in as ',
    instructionsText: 'Sign into EnviDat with your email address and the token which will be sent by email.',
    signInPic,
  }),
  validations: {
    email: {
      required,
      email,
    },
    key: {
      required,
      minLength: minLength(keyLength),
      maxLength: maxLength(keyLength),
    },
  },
  mixins: [validationMixin],
};
</script>

<style lang="scss" scoped>
  .signInGrid {
    display: grid;
    grid-template-columns: 1fr 3fr;
  }
</style>
