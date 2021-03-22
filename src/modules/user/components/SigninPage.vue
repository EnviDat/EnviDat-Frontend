
<template >

    <signinView :prefilledEmail="prefilledEmail"
                :prefilledKey="prefilledKey"
                :signInLoading="signInLoading"
                :signInSuccess="signInSuccess"
                :signedIn="user !== null"
                :signedInColor="$vuetify.theme.themes.light.highlight"
                :signedInEmail="user ? user.email : null"
                :requestLoading="requestLoading"
                :requestSuccess="requestSuccess"
                :formErrorText="errorText()"
                :errorFieldText="error"
                :showError="error !== null"
                :errorField="errorField"
                :errorColor="$vuetify.theme.themes.light.errorHighlight"
                @requestToken="catchRequestToken"
                @signIn="catchSignIn"
                @signOut="catchSignOut" />

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

import {
  USER_NAMESPACE,
  GET_USER_CONTEXT,
  ACTION_GET_USER_CONTEXT,
  FETCH_USER_DATA,
  USER_SIGNIN,
  ACTION_USER_SIGNIN,
  REQUEST_TOKEN,
  ACTION_REQUEST_TOKEN,
  VALIDATION_ERROR,
  USER_SIGNOUT,
  ACTION_USER_SIGNOUT,
} from '@/modules/user/store/userMutationsConsts';

import { USER_SIGNIN_PAGENAME } from '@/router/routeConsts';

import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import SigninView from './SigninView';

export default {
  name: 'SigninPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
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
    ...mapState(
      USER_NAMESPACE,
      [
        'userLoading',
        'signInLoading',
        'signInSuccess',
        'requestLoading',
        'requestSuccess',
        'user',
        'error',
        'errorType',
        'errorField',
      ],
    ),
    prefilledEmail() {
      return this.$route.query.email;
    },
    prefilledKey() {
      return this.$route.query.key;
    },
  },
  methods: {
    errorText() {
      let errMsg = 'Please make sure everything is filled correctly';

      if (this.error) {
        if (this.errorType === VALIDATION_ERROR) {
          errMsg = `A field was filled incorrectly: ${this.error}`;
        }
      }

      return errMsg;
    },
    checkUserSignedIn() {
      this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`,
        {
          action: ACTION_GET_USER_CONTEXT,
          commit: true,
          mutation: GET_USER_CONTEXT,
        });
    },
    catchSignIn(email, key) {
      this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`,
        {
          action: ACTION_USER_SIGNIN,
          body: { email, key },
          commit: true,
          mutation: USER_SIGNIN,
        });
    },
    catchRequestToken(email) {
      this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`,
        {
          action: ACTION_REQUEST_TOKEN,
          body: { email },
          commit: true,
          mutation: REQUEST_TOKEN,
        });
    },
    catchSignOut() {
      this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`,
        {
          action: ACTION_USER_SIGNOUT,
          commit: true,
          mutation: USER_SIGNOUT,
        });
    },
  },
  data: () => ({
    PageBGImage: './app_b_browsepage.jpg',
  }),
};
</script>


<style lang="scss" scoped>

</style>
