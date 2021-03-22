<template>
  <v-app-bar clipped-left
              app
              color="white"
              :height="$vuetify.breakpoint.xsOnly ? 50 : 36" >

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
            <v-row>
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

      <v-col v-if="modeData" >
        <v-row align="center"
                justify="center" >

          <v-col v-if="compact" class="shrink item body-2">
            {{ modeInfoPrefix }}: {{ modeTitle }}
          </v-col>

          <v-col v-else
                  class="shrink title text-no-wrap">
            {{ modeInfo }}
          </v-col>

          <v-col v-if="modeLogo"
                  class="shrink">
            <a v-if="modeExternalUrl"
              :href="modeExternalUrl"
              target="_blank" >
              <v-img :src="modeLogo" style="height: 34px; width: 34px;" />
            </a>
            <v-img v-else :src="modeLogo" style="height: 34px; width: 34px;" />

          </v-col>

          <v-col class="shrink">
            <base-icon-button materialIconName="info_outline"
                              :tooltipText="`${tooltipText} ${modeTitle}`"
                              tooltipBottom
                              color="transparent"
                              iconColor="secondary"
                              isSmall />
          </v-col>

          <v-col v-if="modeCloseCallback"
                  class="shrink">
            <base-icon-button materialIconName="close"
                              :tooltipText="`Exit ${modeTitle} ${modeInfoPrefix}`"
                              tooltipBottom
                              color="transparent"
                              iconColor="red"
                              isSmall
                              @clicked="modeCloseCallback" />
          </v-col>
        </v-row>
      </v-col>

      <v-col v-if="signedInUser"
              class="shrink"
              cols="2" >

        <v-row align="center"
                justify="end" >

          <v-col class="shrink">
            {{ signedInUser.fullname }}
          </v-col>

          <v-col cols="3">
            <user-menu :userObject="signedInUser"
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


  </v-app-bar>
</template>

<script>
import EnviDatLogo from '@/assets/logo/EnviDat_logo_32.png';
import { getModeData } from '@/factories/modeFactory';
import UserMenu from '@/modules/user/components/UserMenu';
// import UserAvatar from '@/components/Layouts/UserAvatar';
import BaseIconButton from '../BaseElements/BaseIconButton';

export default {
  name: 'TheNavigationToolbar',
  components: {
    BaseIconButton,
    // UserAvatar,
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
    modeData() {
      if (!this.mode) return null;
      return getModeData(this.mode);
    },
    modeLogo() {
      return this.modeData ? this.modeData.logo : null;
    },
    modeExternalUrl() {
      return this.modeData ? this.modeData.externalUrl : null;
    },
    modeInfo() {
      let infoText = this.modeInfoPrefix;

      if (this.modeTitle) {
        infoText = `${infoText}: ${this.modeTitle}`;
      }

      return infoText;
    },
    modeTitle() {
      return this.modeData ? this.modeData.title : null;
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
