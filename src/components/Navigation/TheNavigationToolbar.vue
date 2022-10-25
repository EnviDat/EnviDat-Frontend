<template>
  <v-app-bar clipped-left
              app
              color="white"
              :height="$vuetify.breakpoint.xsOnly ? 50 : 36" >

    <v-container fluid
                  class="pa-0" >

      <v-row no-gutters
              align="center"
              justify="space-between" >

        <v-col cols="4" sm="2">
          <v-row no-gutters>

            <v-col class="shrink px-2" >
              <v-btn icon
                      class="ma-0 pt-1"
                      small
                      @click.stop="catchHomeClicked" >
                      <!-- :style="`background-color: ${ item.active ? $vuetify.theme.themes.light.accent : 'transparent' }`" -->
                <img :src="EnviDatLogo"
                      alt="envidat_logo" />
              </v-btn>
            </v-col>

            <v-col class="text-h6 text-md-h5 envidatNavbarTitleSmall py-0">
              {{ logoText }}
            </v-col>
          </v-row>

        </v-col>

        <v-col v-if="hasModeData" >
          <ModeView :mode="mode"
                    :compact="compact"
                    :closeCallback="modeCloseCallback"/>
        </v-col>

        <v-col v-if="signedInUser"
                class="shrink"
                cols="4" sm="3" md="2">

          <v-row align="center"
                  justify="end" >

            <v-col style="text-align: right; ">
              {{ signedInUser.fullname }}
            </v-col>

            <v-col v-if="editingDatasetName"
                   class="shrink">
              <BaseIconButton id="EditButtonNavigationToolbar"
                              material-icon-name="edit"
                              :fillColor="$vuetify.theme.themes.light.accent"
                              iconColor="black"
                              color="accent"
                              :isSmall="true"
                              :isElevated="true"
                              :tooltipText="`Continue editing ${editingDatasetName}`"
                              :tooltipBottom="true"
                              :overwriteHeight="24"
                              @clicked="catchContinueClick" />
            </v-col>

            <v-col class="shrink">
              <UserMenu :userObject="signedInUser"
                          :navItems="userNavigationItems"
                          @userMenuItemClick="catchUserMenuItemClicked" />
            </v-col>
          </v-row>
        </v-col>

        <v-col v-else
               class="shrink"
               cols="4" sm="2" md="1" xl="1">

          <v-row align="center"
                  justify="end"
                 no-gutters >

            <v-col @click="!signInDisabled  ? catchSigninClicked() : undefined"
                   xl="7"
                    :style="!signInDisabled  ? 'cursor: pointer;' : ''">

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs"
                        v-on="on"
                        class="text-body-2">
                    {{ signInText }}
                  </div>
                </template>

                <span>{{ tooltipSignIn }}</span>
              </v-tooltip>

            </v-col>

            <v-col class="shrink" >

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon
                         :disabled="signInDisabled"
                          color="black"
                          small
                          @click="catchSigninClicked"
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
import ModeView from '@/components/Layouts/ModeView.vue';
import EnviDatLogo from '@/assets/logo/EnviDat_logo_32.png';
import UserMenu from '@/modules/user/components/UserMenu.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

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
  },
  data: () => ({
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
