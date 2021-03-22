<template >

  <v-menu transition="slide-y-transition"
          bottom
          offset-y
          id="UserMenu" >
    <template v-slot:activator="{ on, attrs }">
      
      <div v-bind="attrs"
            v-on="on" >
        <user-avatar :size="28"
                      :nameInitials="nameInitials"
                      :emailHash="userObject ? userObject.email_hash : null" />
      </div>                    

    </template>
    <v-list>
      <v-list-item v-for="(item, i) in navItems"
                    :key="i"
                    @click="menuClick(item)" >
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
import UserAvatar from '@/components/Layouts/UserAvatar';

import { getNameInitials } from '@/factories/authorFactory';

import { USER_SIGNOUT_PATH } from '@/router/routeConsts'; 
import {
  USER_NAMESPACE,
  FETCH_USER_DATA,
  USER_SIGNOUT,
  ACTION_USER_SIGNOUT,
} from '@/modules/user/store/userMutationsConsts';

export default {
  name: 'UserMenu',
  props: {
    userObject: Object,
    navItems: Array,
  },
  components: {
    UserAvatar,
  },
  computed: {
    nameInitials() {
      return getNameInitials(this.userObject);
    },
  },
  methods: {
    menuClick(item) {
      if (item?.path === USER_SIGNOUT_PATH) {
        this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`,
          {
            action: ACTION_USER_SIGNOUT,
            commit: true,
            mutation: USER_SIGNOUT,
          });
        return;
      }

      this.$emit('userMenuItemClick', item);
    },
  },
  data: () => ({
  }),
};
</script>


<style lang="scss" scoped>

</style>
