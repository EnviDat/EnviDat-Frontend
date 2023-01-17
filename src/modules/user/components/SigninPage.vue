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
          :signedInColor="$vuetify.theme.themes.light.highlight"
          :signedInEmail="user ? user.email : null"
          :requestLoading="requestLoading"
          :requestSuccess="requestSuccess"
          :formErrorText="errorText"
          :errorFieldText="errorFieldText"
          :errorField="errorField"
          :errorColor="$vuetify.theme.themes.light.errorHighlight"
          @requestToken="catchRequestToken"
          @signIn="catchSignIn"
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
  ACTION_GET_USER_CONTEXT,
  ACTION_REQUEST_TOKEN,
  ACTION_API_TOKEN,
  ACTION_USER_SIGNOUT,
  FETCH_USER_DATA,
  EXCHANGE_TOKENS,
  GET_USER_CONTEXT,
  RESET_KEY,
  API_TOKEN,
  USER_SIGNIN_NAMESPACE,
  USER_SIGNOUT,
  VALIDATION_ERROR,
} from '@/modules/user/store/userMutationsConsts';
import {
  USER_DASHBOARD_PATH,
  USER_SIGNIN_PAGENAME,
} from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import SigninView from './SigninView.vue';

export default {
  name: 'SigninPage',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit(SET_CURRENT_PAGE, USER_SIGNIN_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
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
    userDashboardConfig() {
      return this.config?.userDashboardConfig || {};
    },
    dashboardRedirect() {
      return this.userDashboardConfig?.dashboardRedirect || false;
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
      this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${FETCH_USER_DATA}`, {
        action: ACTION_GET_USER_CONTEXT,
        commit: true,
        mutation: GET_USER_CONTEXT,
      });
    },
    async catchSignIn(email, key) {
      await this.$store.dispatch(
        `${USER_SIGNIN_NAMESPACE}/${EXCHANGE_TOKENS}`,
        {
          action: ACTION_API_TOKEN,
          body: { email, key },
          commit: true,
          mutation: API_TOKEN,
        },
      );

      if (!this.errorField && !this.errorFieldText) {
        // Get user context
        this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${FETCH_USER_DATA}`, {
          action: ACTION_GET_USER_CONTEXT,
          commit: true,
          mutation: GET_USER_CONTEXT,
        });
        // Then redirect with context set
        this.redirectToDashboardIfAllowed();
      }
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
      this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${EXCHANGE_TOKENS}`, {
        action: ACTION_REQUEST_TOKEN,
        body: { email },
        commit: true,
        mutation: RESET_KEY,
      });
    },
    catchSignOut() {
      this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${FETCH_USER_DATA}`, {
        action: ACTION_USER_SIGNOUT,
        commit: true,
        mutation: USER_SIGNOUT,
      });
    },
    catchOpenDashboard() {
      this.redirectToDashboardIfAllowed();
    },
  },
  data: () => ({
    PageBGImage: 'app_b_browsepage',
  }),
};
</script>

<style lang="scss" scoped></style>
