<template>
  <v-card id="UserOrganizationInfo" raised :width="width" :height="height">
    <div class="cardGrid fill-height">
      <div class="avatarGrid py-4 pl-4 pr-2">
        <div class="text-h6">
          {{ title }}
        </div>

        <UserAvatar
          :size="avatarHeight"
          :nameInitials="nameInitials"
          :emailHash="emailHash"
          class="elevation-5"
        />
      </div>

      <div
        class="infoGrid pa-4 pt-0"
        :style="!hasARole ? 'grid-template-rows: auto !important;' : ''"
      >
        <div v-if="hasARole" class="roleGrid ">
          <div class="pb-1">
            <div class="text-body-1">Organization</div>

            <div class="text-body-1">Role</div>
          </div>

          <div v-for="(roles,index) in organizationRoles"
                :key="index"
                class="pt-1">
            <div class="text-body-1" >
              <a :href="`${ckanDomain}/organization/${roles.organization}`" target="_blank">{{ roles.organization }}</a>
            </div>

            <div class="text-body-1">
              <UserRoleChip :role="roles.role" />
            </div>
          </div>
        </div>

        <div  class="textGrid mt-2 text-caption">
          <div>
            <v-icon small>info</v-icon>
          </div>
          <div v-html="markdownText"></div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
/**
 * UserOrganizationInfo.vue
 *
 * @summary shows the users organizations and their role in it
 * @author Dominik Haas-Artho
 *
 * Created at     : 2022-01-27 09:00:00
 * Last modified  : 2020-10-08 17:44:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mapState } from 'vuex';

import UserRoleChip from '@/components/Chips/UserRoleChip.vue';
import UserAvatar from '@/components/Layouts/UserAvatar.vue';
import {
  hasOrganizationRoles,
  isAdmin,
  isEditor,
  isMember,
  isSysadmin,
} from '@/factories/userEditingValidations';
import {renderMarkdown} from '@/factories/stringFactory';

export default {
  name: 'UserOrganizationInfo',
  props: {
    width: {
      type: Number,
      default: 250,
    },
    height: {
      type: Number,
      default: 350,
    },
    userName: String,
    email: String,
    emailHash: String,
    nameInitials: String,
    organizationRoles: Array,
    isCollaborator: Boolean,
  },
  computed: {
    ...mapState(['config']),
    userDashboardConfig() {
      if (this.$store) {
        return this.config?.userDashboardConfig || {};
      }

      return {};
    },
    markdownText() {
      return renderMarkdown(this.organizationInfoText.trim(), false);
    },
    noOrganizationInfoText() {
      const infoText = 'If you are an employee of WSL or affiliated with WSL, please contact <a href="mailto:envidat@wsl.ch">envidat@wsl.ch</a> to receive editing rights for publishing datasets.';
      return (infoText);
    },
    organizationInfoText() {
      if (isSysadmin(this.organizationRoles)) {
        return (
          this.userDashboardConfig.organizationRolesText
            ?.sysadminOrganizationText || this.sysadminOrganizationText
        );
      }

      if (isAdmin(this.organizationRoles)) {
        return (
          this.userDashboardConfig.organizationRolesText
            ?.adminOrganizationText || this.adminOrganizationText
        );
      }

      if (isEditor(this.organizationRoles)) {
        return (
          this.userDashboardConfig.organizationRolesText
            ?.editorOrganizationText || this.editorOrganizationText
        );
      }

      if (this.isCollaborator) {
        return this.userDashboardConfig.organizationRolesText?.collaboratorText || this.collaboratorText;
      }

      if (isMember(this.organizationRoles)) {
        return this.userDashboardConfig.organizationRolesText?.memberOrganizationText || this.memberOrganizationText;
      }

      if (isMember(this.organizationRoles)) {
        return (
          this.userDashboardConfig.organizationRolesText
            ?.memberOrganizationText || this.memberOrganizationText
        );
      }

      return (
        this.userDashboardConfig.organizationRolesText?.noOrganizationText ||
        this.noOrganizationText
      );
    },
    hasARole() {
      return hasOrganizationRoles(this.organizationRoles);
    },
  },
  methods: {},
  data: () => ({
    avatarHeight: 32,
    title: 'Organization Roles',
    noOrganizationText: 'If you are an employee of WSL or affiliated with WSL, please contact <a href="mailto:envidat@wsl.ch">envidat@wsl.ch</a> to receive editing rights for publishing datasets.',
    memberOrganizationText: 'As a member of an organisation you can see its datasets but not edit or create new ones. Get in contact with your group leader to get editor rights.',
    editorOrganizationText: 'As an editor of an organisation you can edit datasets and create new ones.',
    adminOrganizationText: 'As an admin of an organisation you can manage the organisation users, datasets and information. ',
    sysadminOrganizationText: 'You have System Administrator rights, be careful!',
    collaboratorText: 'You are added as collaborator to datasets, you can edit datasets which are listed under "Collaborator Datasets".',
    ckanDomain: process.env.VITE_API_ROOT,
  }),
  components: {
    UserAvatar,
    UserRoleChip,
  },
};
</script>

<style scoped>
.cardGrid {
  display: grid;
  grid-template-rows: 64px auto;
  grid-template-columns: 100%;
}

.infoGrid {
  display: grid;
  grid-template-rows: 1fr auto;
  overflow-y: auto;
}

.avatarGrid {
  display: grid;
  justify-content: space-between;
  grid-template-columns: auto 32px;
  column-gap: 5px;
}

.roleGrid {
  align-content: start;
  display: grid;
  grid-template-rows: 32px auto;
  overflow-y: auto;
}

.roleGrid > div {
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 25px;
  align-content: end;
}

.textGrid {
  display: grid;
  overflow-y: auto;
  grid-template-columns: 1fr auto;
  gap: 8px;
}
</style>
