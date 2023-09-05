<template>
  <span>
    <v-btn v-if="smallScreen && !show"
            fab
            left
            fixed
            bottom
            color="secondary"
            @click="setShow(true)">
      <v-icon>menu</v-icon>
    </v-btn>

  <v-navigation-drawer app
                        :permanent="!smallScreen"
                        clipped
                        :style="smallScreen ? 'top: 36px; max-height: calc(100% - 36px);' : ''"
                        :mini-variant="mini"
                        :value="show"
                        @change="setShow"
                        @input="onInput"
                        overlay-color="highlight"
                        mini-variant-width="60"
                        width="190" >

    <v-list dense >

      <v-list-item v-for="(item, index) in navItemsMenuExcluded"
                    :key="index"
                    link
                    :color="item.disabled ? 'grey' : 'primary'"
                    :disabled="item.disabled"
                    :class="`${item.icon === 'envidat' ? mini ? 'px-2' : 'px-3' : '' }`"
                    @click.stop="itemClick(item)" >

        <v-list-item-action v-if="item.icon === 'envidat'"
                            @click.stop="itemClick(item)" >
          <v-btn icon
                  class="ma-0"
                  :style="`background-color: ${ item.active ? $vuetify.theme.themes.light.accent : 'transparent' }`"
                  @click.stop="itemClick(item)" >
            <v-img :src="Logo"
                 height="32"
                 width="32"
                  alt="envidat_logo" />
          </v-btn>
        </v-list-item-action>

        <v-list-item-content v-if="item.icon === 'envidat'"
                              @click.stop="itemClick(item)">
          <v-row no-gutters
                  class="fill-height"
                  align="start"
                  justify="end" >

            <v-col cols="12"
                   class="text-h5 envidatNavbarTitleSmall py-0">
              {{ logoText }}
            </v-col>

            <v-col v-if="version"
                    cols="12"
                    class="py-0"
                    style="font-size: 8px; position: relative; left: 2px;">
              {{ versionText }}
            </v-col>
          </v-row>
        </v-list-item-content>

        <v-list-item-icon v-if="item.icon !== 'envidat'"
                          :color="item.disabled ? 'grey' : 'primary'"
                          @click.stop="itemClick(item)" >
                          <!-- @click="item.icon === 'menu' ? item.active = !item.active : itemClick(item)" > -->

          <v-tooltip right
                      style="z-index: 1150;"
                      :disabled="$vuetify.display.smAndDown || !item.toolTip">
            <template v-slot:activator="{ on }">

              <v-icon v-on="on"
                      :color="item.disabled ? 'grey' : item.active ? 'accent' :  'secondary'" >
                {{ item.icon }}
              </v-icon>
            </template>

            <span>{{ item.toolTip }}</span>
          </v-tooltip>

        </v-list-item-icon>

        <v-list-item-content v-if="item.icon !== 'envidat'"
                              class=""
                              @click.stop="itemClick(item)" >
          {{ item.title }}
        </v-list-item-content>
      </v-list-item>

      <v-list-item >
        <v-list-item-icon >
          <v-tooltip right
                     style="z-index: 1150;" >
            <template v-slot:activator="{ on }">

              <v-icon v-on="on"
                      color="secondary">
                tag
              </v-icon>
            </template>

            <span>{{ versionText }}</span>
          </v-tooltip>

        </v-list-item-icon>

        <v-list-item-content class="text-caption">
          {{ versionText }}
        </v-list-item-content>

      </v-list-item>

      <v-list-item link
                    @click.stop="setShow(!show)">
        <v-list-item-icon >

          <v-icon color="secondary">
            {{ mini ? 'chevron_right' : 'chevron_left' }}
          </v-icon>

        </v-list-item-icon>
      </v-list-item>

    </v-list>

  </v-navigation-drawer>
  </span>
</template>

<script>
import Logo from '@/assets/logo/EnviDat_logo_32.png';

export default {
  props: {
    navigationItems: Array,
    version: String,
  },
  data: () => ({
    Logo,
    logoText: 'EnviDat',
    show: false,
  }),
  computed: {
    mini() {
      return !this.smallScreen && !this.show;
    },
    smallScreen() {
      return this.$vuetify.display.smAndDown;
    },
    navItemsMenuExcluded() {
      const actives = [];

      this.navigationItems.forEach((el) => {
        if (el.icon !== 'menu') {
          actives.push(el);
        }
      });

      return actives;
    },
    versionText() {
      return `EnviDat version: ${this.version}`;
    },
  },
  methods: {
    setShow(value) {
      this.show = value;
    },
    // Hack: NavigationDrawer Input events should only take effect on smallScreen
    onInput(value) {
      if (this.smallScreen) {
        this.setShow(value);
      }
    },
    itemClick(item) {
      if (!item.disabled) {
        this.$emit('itemClick', item);
      }
    },
  },
};
</script>

<style>

.narrowNavigation > div[role="listitem"] > div {
  padding: 0;
  margin: 0;
}

.envidatLogoText {
  display: inline;
  vertical-align: middle;
  position: relative;
  bottom: -2px;
}

.envidatNavbarLinksSmall > span > .v-btn--small {
  font-size: 10px !important;
}

.envidatNavbarTitleSmall {
  font-size: 18px !important;
}

</style>
