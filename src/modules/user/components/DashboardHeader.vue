<template>
  <v-card id="DashboardHeader">
    <v-container class="pa-4" fluid>
      <v-row no-gutters justify="end">
        <v-col cols="10" class="text-md-h4">
          {{ title }}
        </v-col>

        <v-col cols="2">
          <v-row no-gutters justify="end">
            <UserAvatar :nameInitials="nameInitials"
                        :emailHash="emailHash"/>
          </v-row>
        </v-col>
      </v-row>

      <v-row> </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * The header of the Dashboard
 *
 * @summary Dashboard Header
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 14:18:32
 * Last modified  : 2020-08-20 08:52:03
 */
import UserAvatar from '@/components/Layouts/UserAvatar.vue';
import {
  ACTION_OLD_USER_SIGNOUT,
  FETCH_USER_DATA,
  USER_NAMESPACE,
  USER_SIGNOUT,
} from '@/modules/user/store/userMutationsConsts';
import { USER_SIGNOUT_PATH } from '@/router/routeConsts';

export default {
  name: 'DashboardHeader',
  props: {
    emailHash: String,
    nameInitials: String,
    userName: String,
  },
  components: {
    UserAvatar,
  },
  computed: {
    title() {
      return `Welcome ${this.userName} to your Dashboard`;
    },
  },
  methods: {
    menuClick(item) {
      if (item?.path === USER_SIGNOUT_PATH) {
        this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`, {
          action: ACTION_OLD_USER_SIGNOUT,
          commit: true,
          mutation: USER_SIGNOUT,
        });
        return;
      }

      this.$emit('userMenuItemClick', item);
    },
  },
  data: () => ({}),
};
</script>

<style lang="scss" scoped></style>
