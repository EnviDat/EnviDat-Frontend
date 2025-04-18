<template>
  <v-container
    fluid
    id="SigninPage"
    key="SigninPage"
    tag="article"
    class="pa-0"
  >
    <v-row no-gutters>
      <v-col>
        <signinView
          :prefilledEmail="prefilledEmail"
          :prefilledKey="prefilledKey"
          :signInLoading="signInLoading"
          :signInSuccess="signInSuccess"
          :signedIn="user !== null"
          :signedInEmail="user ? user.email : null"
          :requestLoading="requestLoading"
          :requestSuccess="requestSuccess"
          :disclaimerText="disclaimerText"
          :disclaimerPoints="disclaimerPoints"
          :formErrorText="errorText"
          :errorFieldText="errorFieldText"
          :errorField="errorField"
          :wslSigninEnabled="wslSigninEnabled"
          @requestToken="catchRequestToken"
          @emailSignIn="submitDataAndSignIn"
          @azureAdSignIn="submitDataAndSignIn"
          @signOut="catchSignOut"
          @openDashboard="catchOpenDashboard"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * Login Page
 *
 * @summary Login page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 14:18:32
 * Last modified  : 2020-08-19 17:58:07
 */

import { mapState } from 'vuex';

import { eventBus, SHOW_REDIRECT_DASHBOARD_DIALOG } from '@/factories/eventBus';
import {
  ACTION_API_TOKEN_AZURE,
  ACTION_OLD_GET_USER_CONTEXT,
  ACTION_OLD_REQUEST_TOKEN,
  ACTION_USER_SIGNIN_TOKEN,
  ACTION_OLD_USER_SIGNOUT,
  SIGNIN_USER_ACTION,
  GET_USER_CONTEXT,
  REQUEST_TOKEN,
  USER_SIGNIN_NAMESPACE,
  USER_SIGNOUT,
  VALIDATION_ERROR,
  ACTION_GET_USER_CONTEXT_TOKEN,
  ACTION_RESET_TOKEN,
  ACTION_OLD_USER_SIGNIN,
  USER_SIGNIN,
  ACTION_USER_SIGNOUT_REVOKE_TOKEN,
} from '@/modules/user/store/userMutationsConsts';
import { USER_DASHBOARD_PATH } from '@/router/routeConsts';

import SigninView from './SigninView.vue';

export default {
  name: 'SigninPage',

  components: {
    SigninView,
  },
  beforeMount() {
    this.checkUserSignedIn();
  },
  computed: {
    ...mapState(['config']),
    ...mapState(USER_SIGNIN_NAMESPACE, [
      'userLoading',
      'signInLoading',
      'signInSuccess',
      'requestLoading',
      'requestSuccess',
      'user',
      'errorType',
      'errorField',
      'errorFieldText',
    ]),
    signinPageConfig() {
      return this.config?.signinPageConfig || {};
    },
    disclaimerText() {
      return this.signinPageConfig?.disclaimerText || '';
    },
    disclaimerPoints() {
      return this.signinPageConfig?.disclaimerPoints || [];
    },
    wslSigninEnabled() {
      return this.signinPageConfig?.wslSigninEnabled || false;
    },
    userDashboardConfig() {
      return this.config?.userDashboardConfig || {};
    },
    dashboardRedirect() {
      return this.userDashboardConfig?.dashboardRedirect || false;
    },
    useTokenSignin() {
      return this.userDashboardConfig?.useTokenSignin || false;
    },
    prefilledEmail() {
      return this.$route.query.email;
    },
    prefilledKey() {
      return this.$route.query.key;
    },
    errorText() {
      if (this.errorFieldText) {
        if (this.errorType === VALIDATION_ERROR) {
          return `A field was filled incorrectly: ${this.errorFieldText}`;
        }

        return `Error: ${this.errorFieldText}. If you're unable to sign in please contact the EnviDat team.`;
      }

      return '';
    },
  },
  methods: {
    checkUserSignedIn() {
      let action = ACTION_GET_USER_CONTEXT_TOKEN;
      if (this.config?.userDashboardConfig && !this.useTokenSignin) {
        action = ACTION_OLD_GET_USER_CONTEXT;
      }

      this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`, {
        action,
        commit: true,
        mutation: GET_USER_CONTEXT,
      });
    },
    async submitDataAndSignIn(email, keyOrToken, isAzure = false) {
      let action;

      if (isAzure) {
        action = ACTION_API_TOKEN_AZURE;
      } else {
        action = this.useTokenSignin
          ? ACTION_USER_SIGNIN_TOKEN
          : ACTION_OLD_USER_SIGNIN;
      }

      let bodyParams;
      if (action !== ACTION_API_TOKEN_AZURE) {
        bodyParams = { email, key: keyOrToken };
      } else {
        bodyParams = { email, token: keyOrToken };
      }

      await this.$store.dispatch(
        `${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`,
        {
          action,
          body: bodyParams,
          commit: true,
          mutation: USER_SIGNIN,
        },
      );

      // the SIGNIN_USER_ACTION action (if useTokenSignin = true) makes an additional
      // call within the action with the token

      if (!this.useTokenSignin && !this.errorField && !this.errorFieldText) {
        // Get user context via the old login
        await this.$store.dispatch(
          `${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`,
          {
            action: ACTION_OLD_GET_USER_CONTEXT,
            commit: true,
            mutation: GET_USER_CONTEXT,
          },
        );
      }

      // Then redirect with context set
      this.redirectToDashboardIfAllowed();
    },
    redirectToDashboardIfAllowed() {
      if (this.dashboardRedirect) {
        eventBus.emit(SHOW_REDIRECT_DASHBOARD_DIALOG);

        this.$router.replace('/');
      } else {
        this.$router.push(USER_DASHBOARD_PATH);
      }
    },
    catchRequestToken(email) {
      const action = this.useTokenSignin
        ? ACTION_RESET_TOKEN
        : ACTION_OLD_REQUEST_TOKEN;

      this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`, {
        action,
        body: { email },
        commit: true,
        mutation: REQUEST_TOKEN,
      });
    },
    catchSignOut() {
      let action = this.useTokenSignin
        ? ACTION_USER_SIGNOUT_REVOKE_TOKEN
        : ACTION_OLD_USER_SIGNOUT;

      // In case where useTokenSignIn===false, but Azure login is used
      const ckanCookie = `; ${document.cookie}`
        .split('; ckan-beaker=')
        .pop()
        .split(';')[0];
      if (action === ACTION_OLD_USER_SIGNOUT && !ckanCookie) {
        action = ACTION_USER_SIGNOUT_REVOKE_TOKEN;
      }

      this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`, {
        action,
        commit: true,
        mutation: USER_SIGNOUT,
      });
    },
    catchOpenDashboard() {
      this.redirectToDashboardIfAllowed();
    },
  },
  data: () => ({}),
};
</script>

<style lang="scss" scoped></style>
