<template>
  <v-app-bar color="white" order="-1" :height="$vuetify.display.xs ? 50 : 36">
    <v-container fluid class="pa-0">
      <v-row no-gutters align="center" justify="space-between">
        <v-col cols="auto" sm="2">
          <v-row no-gutters class="align-center">
            <v-col class="flex-grow-0">
              <v-btn icon size="small" @click.stop="catchHomeClicked">
                <!-- :style="`background-color: ${ item.active ? $vuetify.theme.themes.light.colors.accent : 'transparent' }`" -->
                <v-img :src="EnviDatLogo" height="32" width="32" alt="envidat_logo" />
              </v-btn>
            </v-col>
            <v-col class="flex-grow-0 py-0">
              <div class="text-md-h5 envidatText clickable mt-1 mt-sm-0" @click.stop="catchHomeClicked">
                {{ showAdditionalText ? logoText : '' }}
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col v-if="hasModeData">
          <ModeView :mode="mode" :compact="compact" :closeCallback="modeCloseCallback" />
        </v-col>

        <v-col v-if="signedInUser" class="flex-grow-0" cols="4" sm="4" md="3" xl="2">
          <v-row align="center" justify="end">
            <v-col :style="`text-align: right; ${$vuetify.display.xs ? 'line-height: 1rem;' : ''}`">
              {{ signedInUser.fullName }}
            </v-col>

            <v-col v-if="editingDatasetName" class="flex-grow-0">
              <BaseIconButton
                class="editButtonNavigationToolbar"
                :icon="mdiPencil"
                icon-color="black"
                color="accent"
                small
                elevated
                :tooltip-text="`Continue editing ${editingDatasetName}`"
                tooltip-bottom
                @clicked="catchContinueClick"
              />
            </v-col>

            <v-col class="flex-grow-0">
              <UserMenu
                :userObject="signedInUser"
                :navItems="userNavigationItems"
                @userMenuItemClick="catchUserMenuItemClicked"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col v-else class="flex-grow-0" cols="auto" sm="3" md="2" xl="1">
          <v-row align="center" justify="end" no-gutters>
            <v-col
              @click="!signInDisabled ? catchSigninClicked() : undefined"
              xl="7"
              class="px-1"
              :style="!signInDisabled ? 'cursor: pointer;' : ''"
            >
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" style="text-align: right" class="text-body-2">
                    {{ showAdditionalText ? signInText : '' }}
                  </div>
                </template>

                <span>{{ tooltipSignIn }}</span>
              </v-tooltip>
            </v-col>

            <v-col class="flex-grow-0">
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    :disabled="signInDisabled"
                    color="black"
                    size="small"
                    @click="catchSigninClicked"
                    v-bind="props"
                  >
                    <v-icon :icon="mdiAccountCircle" />
                  </v-btn>
                </template>

                <span>{{ tooltipSignIn }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>

        <v-progress-linear v-show="loading" indeterminate absolute height="2" color="primary" />
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mdiAccountCircle, mdiPencil } from '@mdi/js';
import ModeView from '@/components/Layouts/ModeView.vue';
import EnviDatLogo from '@/assets/logo/EnviDat_logo_32.png';
import UserMenu from '@/modules/user/components/UserMenu.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';

export default {
  name: 'TheNavigationToolbar',
  props: {
    loading: Boolean,
    mode: String,
    modeCloseCallback: Function,
    signedInUser: Object,
    signInDisabled: {
      type: Boolean,
      default: false,
    },
    userNavigationItems: Array,
    editingDatasetName: {
      type: String,
      default: '',
    },
  },
  computed: {
    showAdditionalText() {
      return (this.$vuetify.display.xs && !this.hasModeData) || this.$vuetify.display.smAndUp;
    },
    compact() {
      return this.$vuetify.display.xs;
    },
    hasModeData() {
      return !!this.mode;
    },
    hasLoggedUser() {
      return this.signedInUser || {};
    },
  },
  methods: {
    catchUserMenuItemClicked(item) {
      this.$emit('userMenuItemClick', item);
    },
    catchSigninClicked() {
      if (!this.signInDisabled) {
        this.$emit('signinClick');
      }
    },
    catchHomeClicked() {
      this.$emit('homeClick');
    },
    catchContinueClick() {
      this.$emit('continueClick');
    },
    // Load organization IDs for the logged-in user. This is used to determine whether the "Create Dataset" item should be shown in the dropdown menu.
    async fetchUserOrganizationId(forceReload = false) {
      if (forceReload || (!forceReload && this.organizationsStore.userOrganizations?.length > 0)) {
        await this.organizationsStore.UserGetOrgIds(this.hasLoggedUser.id);
      }
    },
  },
  mounted() {
    if (this.hasLoggedUser?.id) {
      this.fetchUserOrganizationId(true);
    }
  },
  created() {
    this.organizationsStore = useOrganizationsStore();
  },
  data: () => ({
    mdiAccountCircle,
    organizationsStore: null,
    mdiPencil,
    EnviDatLogo,
    logoText: 'EnviDat',
    expanded: false,
    modeInfoPrefix: 'Special View',
    signInText: 'Sign In Here',
    tooltipText: 'You are in a specific view which shows data for',
    tooltipSignIn: 'Sign in to manage your research data',
  }),
  components: {
    ModeView,
    UserMenu,
    BaseIconButton,
  },
};
</script>
<style>
.envidatText {
  font-family: 'Raleway', sans-serif, sans-serif !important;
  text-transform: none;
}
.clickable {
  cursor: pointer;
}
</style>
