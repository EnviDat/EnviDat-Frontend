<template>
  <v-card id="UserOrganizationInfo"
          raised
          :width="width"
          :height="height">

    <div class="cardGrid fill-height" >

      <div class="avatarGrid py-4 pl-4 pr-2" >

        <div class="text-h6">
          {{ title }}
        </div>

        <UserAvatar :size="avatarHeight"
                    :emailHash="emailHash"
                    :nameInitials="nameInitials"
                    class="elevation-5" />

      </div>

      <div class="infoGrid pa-4 pt-0"
            :style="!hasARole ? 'grid-template-rows: auto !important;' : ''">

        <div v-if="hasARole"
             class="roleGrid " >

          <div class="pb-1" >
            <div class="text-body-1">Organization</div>

            <div class="text-body-1">Role</div>
          </div>

          <div v-for="(roles,index) in organizationRoles"
                :key="index"
                class="pt-1">
            <div class="text-body-1" >
              <a :href="`${domain}/organization/${roles.organization}`" target="_blank">{{ roles.organization }}</a>
            </div>

            <div class="text-body-1">
              <UserRoleChip :role="roles.role" />
            </div>
          </div>

        </div>

        <div class="textGrid mt-2 text-caption">
          <div>
            <v-icon small>info</v-icon>
          </div>
          <div>
            {{ organizationInfoText }}
          </div>
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
import UserAvatar from '@/components/Layouts/UserAvatar';
import UserRoleChip from '@/components/Chips/UserRoleChip';
import { mapState } from 'vuex';
import {
  isMember,
  isEditor,
  isAdmin,
  isSysadmin,
  hasOrganizationRoles,
} from '@/factories/userEditingFactory';

const domain = process.env.VUE_APP_ENVIDAT_PROXY;

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
    ...mapState([
      'config',
    ]),
    userDashboardConfig() {
      if (this.$store) {
        return this.config?.userDashboardConfig || {};
      }

      return {};
    },
    organizationInfoText() {

      if (isSysadmin(this.organizationRoles)) {
        return this.userDashboardConfig.organizationRolesText?.sysadminOrganizationText || this.sysadminOrganizationText;
      }
      
      if (isAdmin(this.organizationRoles)) {
        return this.userDashboardConfig.organizationRolesText?.adminOrganizationText || this.adminOrganizationText;
      }
      
      if (isEditor(this.organizationRoles)) {
        return this.userDashboardConfig.organizationRolesText?.editorOrganizationText || this.editorOrganizationText;
      }

      if (this.isCollaborator) {
        return this.userDashboardConfig.organizationRolesText?.collaboratorText || this.collaboratorText;
      }
      
      if (isMember(this.organizationRoles)) {
        return this.userDashboardConfig.organizationRolesText?.memberOrganizationText || this.memberOrganizationText;
      }

      return this.userDashboardConfig.organizationRolesText?.noOrganizationText || this.noOrganizationText;
    },
    hasARole() {
      return hasOrganizationRoles(this.organizationRoles);
    },
  },
  methods: {
  },
  data: () => ({
    avatarHeight: 32,
    title: 'Organization Roles',
    noOrganizationText: `You aren't assigned to an organisation yet.
      If you are working at WSL ask your group leader to assign editor rights, so you can create dataset within your organisation.
      If you aren't working at WSL you can ask for being added as a collaborator to a dataset, get in contact with the datasets main contact.`,
    memberOrganizationText: 'As a member of an organisation you can see its datasets but not edit or create new ones. Get in contact with your group leader to get editor rights.',
    editorOrganizationText: 'As an editor of an organisation you can edit datasets and create new ones.',
    adminOrganizationText: 'As an admin of an organisation you can manage the organisation users, datasets and information. ',
    sysadminOrganizationText: 'You have System Administrator rights, be careful!',
    collaboratorText: 'You are added as collaborator to datasets, you can edit datasets which are listed under "Collaborator Datasets".',
    domain,
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
    grid-template-rows: 60% 40%;
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
    grid-template-columns: 1fr 1fr;
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
