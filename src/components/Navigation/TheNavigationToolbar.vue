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

        <v-col cols="auto" sm="2">
          <v-row no-gutters>

            <v-col class="shrink px-2" >
              <v-btn icon
                      class="ma-0 pt-1"
                      small
                      @click.stop="catchHomeClicked" >
                      <!-- :style="`background-color: ${ item.active ? $vuetify.theme.themes.light.accent : 'transparent' }`" -->
                <v-img :src="EnviDatLogo"
                     height="32"
                     width="32"
                      alt="envidat_logo" />
              </v-btn>
            </v-col>
            <v-col class="shrink py-0" >
              <div class="text-md-h5 envidatText clickable mt-1 mt-sm-0"
                   @click.stop="catchHomeClicked">
                {{ showAdditionalText ? logoText : '' }}
              </div>
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
                cols="4" sm="4" md="3" xl="2">

          <v-row align="center"
                  justify="end" >

            <v-col :style="`text-align: right; ${$vuetify.breakpoint.xsOnly ? 'line-height: 1rem;' : ''}`">
              {{ signedInUser.fullName }}
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
               cols="auto" sm="3" md="2" xl="1">

          <v-row align="center"
                  justify="end"
                 no-gutters >

            <v-col @click="!signInDisabled  ? catchSigninClicked() : undefined"
                   xl="7"
                   class="px-1"
                    :style="!signInDisabled  ? 'cursor: pointer;' : ''">

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs"
                        v-on="on"
                        style="text-align: right;"
                        class="text-body-2">
                    {{ showAdditionalText ? signInText : '' }}
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
    showAdditionalText()  {
      return this.$vuetify.breakpoint.xsOnly && !this.hasModeData
          || this.$vuetify.breakpoint.smAndUp;
    },
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
<style>

.envidatText {
  font-family: "Raleway", sans-serif, sans-serif !important;
  text-transform: none;
}
.clickable {
 cursor: pointer;
}



</style>
