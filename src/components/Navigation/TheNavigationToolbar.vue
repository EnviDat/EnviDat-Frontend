<template>
  <v-app-bar clipped-left
              app
              color="white"
              :height="$vuetify.breakpoint.xsOnly ? 50 : 36" >

    <v-container fluid>

      <v-row class="pa-0" >
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

    </v-container>


  </v-app-bar>
</template>

<script>
import Logo from '@/assets/logo/EnviDat_logo_32.png';
import UserAvatar from '@/components/Layouts/UserAvatar';
import ModeView from '@/components/Layouts/ModeView';


export default {
  name: 'TheNavigationToolbar',
  components: {
    ModeView,
    UserAvatar,
  },
  props: {
    loading: Boolean,
    mode: String,
    modeCloseCallback: Function,
    userIsSignedIn: Boolean,
    avatarClickCallback: Function,
  },
  computed: {
    compact() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    hasModeData() {
      return !!this.mode;
    },
  },
  data: () => ({
    Logo,
    logoText: 'EnviDat',
    expanded: false,
    modeInfoPrefix: 'Special View',
    tooltipText: 'You are in a specific view which shows data for',
  }),
};
</script>
