<template>
  <v-menu transition="slide-y-transition" bottom offset-y id="UserMenu">
    <template v-slot:activator="{ props }">
      <div v-bind="props">
        <UserAvatar
          style="cursor: pointer"
          :size="size"
          :nameInitials="nameInitials"
          :emailHash="emailHash"
        />
      </div>
    </template>
    <v-list>
      <template v-for="(item, i) in navItems">
        <v-list-item
          :key="i"
          @click="menuClick(item)"
          :prepend-icon="item.icon"
          :title="item.title"
          v-if="item.show"
        >
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
/**
 * User Profile Menu Navigation
 *
 * @summary User Menu
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 14:18:32
 * Last modified  : 2020-08-25 14:31:13
 */
import { mapState } from 'vuex';
import UserAvatar from '@/components/Layouts/UserAvatar.vue';
import { getNameInitials } from '@/factories/authorFactory';

import {
  ACTION_OLD_USER_SIGNOUT,
  ACTION_USER_SIGNOUT_REVOKE_TOKEN,
  SIGNIN_USER_ACTION,
  USER_SIGNIN_NAMESPACE,
  USER_SIGNOUT,
} from '@/modules/user/store/userMutationsConsts';

import { LANDING_PATH, USER_SIGNOUT_PATH } from '@/router/routeConsts';

export default {
  name: 'UserMenu',
  props: {
    userObject: Object,
    navItems: Array,
    size: {
      type: Number,
      default: 28,
    },
  },
  components: {
    UserAvatar,
  },
  computed: {
    ...mapState(['config']),
    nameInitials() {
      return getNameInitials(this.userObject);
    },
    emailHash() {
      return this.userObject?.emailHash;
    },
    userDashboardConfig() {
      return this.config?.userDashboardConfig || {};
    },
    useTokenSignin() {
      return this.userDashboardConfig?.useTokenSignin || false;
    },
  },
  methods: {
    async menuClick(item) {
      if (item?.path === USER_SIGNOUT_PATH) {
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

        await this.$store.dispatch(
          `${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`,
          {
            action,
            commit: true,
            mutation: USER_SIGNOUT,
          },
        );

        if (this.$route.path !== LANDING_PATH) {
          await this.$router?.push(LANDING_PATH);
        }

        return;
      }

      this.$emit('userMenuItemClick', item);
    },
  },
  data: () => ({}),
};
</script>

<style lang="scss" scoped></style>
