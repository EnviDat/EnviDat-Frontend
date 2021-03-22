<template>
  <v-card class="pa-0 signInGrid" >

    <v-img :src="signInPic"
            max-height="500"
            style="border-bottom-left-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 0px;" />

    <v-container fluid class="pa-4">

      <v-row>
        <v-col class="display-2">
          {{ title }}
        </v-col>
      </v-row>

      <v-row v-if="signedIn">
        <v-col cols="12"
                class="text-md-h6 text-xs-body-1"
                :style="`background-color: ${signedInColor};`" >
          {{ alreadSignInText + signedInEmail }}
        </v-col>
      </v-row>

      <v-row v-if="!signedIn">
        <v-col cols="12"
                class="text-md-h6 text-xs-body-1" >
          {{ instructionsText }}
        </v-col>
      </v-row>

      <form class="enviDatForm">
        <v-row id="emailRow" >
          <v-col>

            <v-text-field v-model="email"
                          :error-messages="emailErrors"
                          label="E-mail"
                          required
                          @input="$v.email.$touch()"
                          @blur="$v.email.$touch()" />
          </v-col>
        </v-row>

        <v-row v-if="email && emailErrors.length <= 0"
                id="tokenRow"
                align="center"
                no-gutters >

          <v-col cols="12"
                  md="4"
                  class="text-md-h6 text-xs-body-1" >
            {{ requestTokenText }}
          </v-col>

          <v-col cols="12"
                  md="8"
                  class="pt-0">
            <v-text-field v-model="key"
                          :error-messages="keyErrors"
                          :counter="keyLength"
                          label="Token"
                          required
                          clearable
                          clear-icon="clear"
                          @input="$v.key.$touch()"
                          @blur="$v.key.$touch()" />
          </v-col>
        </v-row>

        <v-row v-if="formInvalid || showError"
                id="errorTextRow"
                :style="`background-color: ${errorColor};`" >
          <v-col cols="12"
                  class="body-1">
            {{ formErrorText }}
          </v-col>
        </v-row>

        <v-row v-if="!key || !keyErrors"
                id="tokenButtonRow" >

          <v-col v-if="!signedIn"
                  cols="12"
                  md="4">

            <v-row no-gutters >
              <v-col v-if="requestSuccess"
                      cols="12"
                      class="caption" >
                {{ `${requestSentText} ${email}. ${requestSentText2}` }}
              </v-col>

              <v-col cols="12"
                      :class="requestSuccess ? 'pt-3' : ''" >
                <v-btn color="primary"
                        :loading="requestLoading"
                        @click="catchRequestToken">
                  {{ tokenButtonText }}
                </v-btn>
              </v-col>

            </v-row>
          </v-col>

        </v-row>

        <v-row id="signinButtonRow" >

          <v-col v-if="signedIn">
            <v-btn color="secondary"
                    @click="catchSignOut">
              {{ signoutButtonText }}
            </v-btn>
          </v-col>

          <v-col v-if="!signedIn && !$v.$invalid">
            <v-btn color="primary"
                    :loading="signInLoading && !signInSuccess"
                    @click="catchSignIn">
              {{ signinButtonText}}
            </v-btn>
          </v-col>

        </v-row>
      </form>

    </v-container>

  </v-card>

</template>


<script>
/**
 * LoginView.vue provides the users with login form with email and token
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
    showError: Boolean,
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
    emailErrors() {
      const backendErr = this.backendErrors.email;
      const errors = backendErr ? [backendErr] : [];

      if (!this.$v.email.$dirty) return errors;

      if (!this.$v.email.email) {
        errors.push('Must be valid e-mail');
      }
      if (!this.$v.email.required) {
        errors.push('E-mail is required');
      }

      return errors;
    },
    keyErrors() {
      const backendErr = this.backendErrors.key;
      const errors = backendErr ? [backendErr] : [];

      if (!this.$v.key.$dirty) return errors;

      if (!this.$v.key.minLength || !this.$v.key.maxLength) {
        errors.push(`Key must be ${this.keyLength} characters long`);
      }
      
      if (!this.$v.key.required) {
        errors.push('Key is required.');
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
      if (this.showError && this.errorField) {
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
    },
    key: '',
    formInvalid: false,
    keyLength,
    requestTokenText: 'Do you have a token to sign in?',
    requestSentText: 'The token was sent to ',
    requestSentText2: 'Please check your e-mail address.',
    title: 'Sign in',
    alreadSignInText: 'You are already signed in as ',
    instructionsText: 'Sign into EnviDat with your e-mail address and the token which will be sent by e-mail.',
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
