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

      <div class="infoGrid pa-4 pt-0" >

        <div class="roleGrid " >
          <div class="pb-1">
            <div class="text-body-1">Organization</div>

            <div class="text-body-1">Role</div>
          </div>

          <div v-for="(roles,index) in organizationRoles"
                :key="index"
                class="pt-1">
            <div class="text-body-1" >
              {{ roles.organization }}
            </div>

            <div class="text-body-1">
              <UserRoleChip :role="roles.role" />
            </div>
          </div>

        </div>

        <div class="textGrid mt-2 text-caption">
          {{ organizationInfoText }}
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
    organizationRoleMap: Object,
  },
  data: () => ({
    avatarHeight: 32,
    title: 'Organization Roles',
    noOrganizationText: `You aren't assigned to an organisation yet.
      If you are working at WSL ask your group leader to assign editor rights, so you can create dataset within your organisation.
      If you aren't working at WSL you can ask for being added as a collaborator to a dataset, get in contact with the datasets main contact.`,
    memberOrganizationText: 'As a member of an organisation you can its datasets but not edit or create new ones. Get in contact with your group leader to get editor rights.',
    editorOrganizationText: 'As an editor of an organisation you can edit datasets and create new ones.',
    adminOrganizationText: 'As an admin of an organisation you can manage the organisation users, datasets and information.',
    sysadminOrganizationText: 'You have System Administrator right, be careful!',
  }),
  computed: {
    organizationInfoText() {

      if (this.isSysadmin) {
        return this.sysadminOrganizationText;
      }
      
      if (this.isAdmin) {
        return this.adminOrganizationText;
      }
      
      if (this.isEditor) {
        return this.editorOrganizationText;
      }
      
      if (this.isMember) {
        return this.memberOrganizationText;
      }

      return this.noOrganizationText;
    },
    isMember() {
      return this.hasRole('member');
    },
    isEditor() {
      return this.hasRole('editor');
    },
    isAdmin() {
      return this.hasRole('admin');
    },
    isSysadmin() {
      return this.hasRole('sysadmin');
    },
    organizationRoles() {
      if (!this.organizationRoleMap) {
        return null;
      }

      const roles = [];
      const keys = Object.keys(this.organizationRoleMap);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        roles.push ({
          organization: key,
          role: this.organizationRoleMap[key],
        });
      }

      return roles;
    },
  },
  methods: {
    hasRole(roleName) {
      const roles = this.organizationRoles;

      if (roles) {
        const matchedRole = roles.filter(r => r.role === roleName);
        return matchedRole.length > 0 && matchedRole[0];
      }

      return false;
    },
  },
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
    word-break: break-all;
    align-content: end;
  }

  .textGrid {
    display: grid;
    overflow-y: auto;
  }

</style>
