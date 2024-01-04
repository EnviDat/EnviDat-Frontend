<template>
  <v-menu transition="slide-y-transition" bottom offset-y id="UserMenu">
    <template v-slot:activator="{ on, props }">
      <div v-bind="props" v-on="on">
        <UserAvatar :size="size"
                    :nameInitials="nameInitials"
                    :emailHash="emailHash"/>
      </div>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, i) in navItems"
        :key="i"
        @click="menuClick(item)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
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
  ACTION_USER_SIGNOUT,
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
        const action = this.useTokenSignin ? ACTION_USER_SIGNOUT_REVOKE_TOKEN : ACTION_USER_SIGNOUT;

        await this.$store.dispatch(`${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`, {
          action,
          commit: true,
          mutation: USER_SIGNOUT,
        });

        await this.$router?.push(LANDING_PATH);

        return;
      }

      this.$emit('userMenuItemClick', item);
    },
  },
  data: () => ({}),
};
</script>

<style lang="scss" scoped></style>
