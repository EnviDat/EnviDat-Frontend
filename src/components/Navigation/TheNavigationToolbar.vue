<template>
  <v-app-bar clipped-left
              app
              color="white"
              :height="$vuetify.breakpoint.xsOnly ? 50 : 36" >

    <v-container fluid>

      <!-- <v-row class="pa-0" >
        <v-col v-if="hasModeData" >
          <ModeView :mode="mode"
                    :compact="compact"
                    :closeCallback="modeCloseCallback"/>
        </v-col>

        <v-col v-if="userIsSignedIn">
          <user-avatar v-if="$vuetify.breakpoint.smAndUp"
                      :clickCallback="avatarClickCallback" />
        </v-col>

        <v-progress-linear v-show="loading"
                          indeterminate
                          style="position: absolute; left: 0; bottom: 0;"
                          height="2"
                          color="primary" />
      </v-row>

    </v-container> -->
      <v-row class="pa-0"
              align="center"
              justify="space-between" >

        <v-col class="shrink pl-5">
          <v-row no-gutters>

            <v-col cols="6" >
              <v-btn icon
                      class="ma-0"
                      small
                      @click.stop="catchHomeClicked" >
                      <!-- :style="`background-color: ${ item.active ? $vuetify.theme.themes.light.accent : 'transparent' }`" -->
                <img :src="EnviDatLogo"
                      alt="envidat_logo" />
              </v-btn>
            </v-col>

            <v-col cols="6" >
              <v-row no-gutters>
                <v-col class="headline envidatNavbarTitleSmall py-0">
                  {{ logoText }}
                </v-col>
                <!-- <v-col v-if="version"
                        class="py-0"
                        style="font-size: 8px; position: relative; left: 2px;">
                  Version {{ version }}
                </v-col> -->
              </v-row>
            </v-col>
          </v-row>

        </v-col>

        <!-- <v-spacer></v-spacer> -->

        <v-col v-if="hasModeData" >
          <ModeView :mode="mode"
                    :compact="compact"
                    :closeCallback="modeCloseCallback"/>
        </v-col>

        <!-- <v-col v-if="signedInUser"
                class="shrink"
                cols="2">
          <user-avatar v-if="$vuetify.breakpoint.smAndUp"
                      :clickCallback="avatarClickCallback" />
        </v-col> -->

        <v-col v-if="signedInUser"
                class="shrink"
                cols="2" >

          <v-row align="center"
                  justify="end" >

            <v-col class="shrink">
              {{ signedInUser.fullname }}
            </v-col>

            <v-col cols="3">
              <UserMenu :userObject="signedInUser"
                          :navItems="userNavigationItems"
                          @userMenuItemClick="catchUserMenuItemClicked" />
            </v-col>
          </v-row>
        </v-col>

        <v-col v-else
                class="shrink" >

          <v-row align="center"
                  justify="end" >

            <v-col class="shrink"
                    @click="catchSigninClicked" >
                      
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon
                          color="black"
                          small
                          v-bind="attrs"
                          v-on="on" >
                    <v-icon>account_circle</v-icon>
                  </v-btn>
                </template>

                <span>{{ tooltipSignIn }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>

        <v-progress-linear v-show="loading"
                          indeterminate
                          style="position: absolute; left: 0; bottom: 0;"
                          height="2"
                          color="primary" />
      </v-row>

    </v-container>

  </v-app-bar>
</template>

<script>
import ModeView from '@/components/Layouts/ModeView';
import EnviDatLogo from '@/assets/logo/EnviDat_logo_32.png';
import UserMenu from '@/modules/user/components/UserMenu';

export default {
  name: 'TheNavigationToolbar',
  components: {
    ModeView,
    UserMenu,
  },
  props: {
    loading: Boolean,
    mode: String,
    modeCloseCallback: Function,
    signedInUser: Object,
    userNavigationItems: Array,
  },
  computed: {
    compact() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    hasModeData() {
      return !!this.mode;
    },
  },
  methods: {
    catchUserMenuItemClicked(item) {
      this.$emit('userMenuItemClick', item);
    },
    catchSigninClicked() {
      this.$emit('signinClick');
    },
    catchHomeClicked() {
      this.$emit('homeClick');
    },
  },
  data: () => ({
    EnviDatLogo,
    logoText: 'EnviDat',
    expanded: false,
    modeInfoPrefix: 'Special View',
    tooltipText: 'You are in a specific view which shows data for',
    tooltipSignIn: 'Click to sign in into EnviDat',
  }),
};
</script>
