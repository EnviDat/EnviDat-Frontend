<template>
  <v-chip class="userRoleChip" size="small" :color="roleColor">
    {{ roleText }}
  </v-chip>
</template>

<script>
/**
 * UserRoleChip.vue show the role of a user
 *
 * @summary show the publication state
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-12-14 14:19:00
 * Last modified  : 2021-12-14 14:19:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'UserRoleChip',
  props: {
    role: {
      type: String,
      default: '',
    },
    colorMap: {
      type: Object,
      default: () => ({
        member: '#EAF2BB',
        editor: '#84ED47',
        admin: '#F19460',
        sysadmin: '#F3143E',
      }),
    },
  },
  computed: {
    roleText() {
      return this.role?.toUpperCase();
    },
    roleColor() {
      return this.colorMap[this.role];
    },
  },
  methods: {},
};
</script>

<style scoped>
.userRoleChip {
  height: 1.5rem;
  font-size: 0.75rem;
}
</style>
