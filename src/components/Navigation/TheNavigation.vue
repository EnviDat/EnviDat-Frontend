<template>
  <span>
    <v-btn v-if="smallScreen && !show"
            fab
            left
            fixed
            bottom
            color="secondary"
            @click="setShow(true)">
      <v-icon :icon="mdiMenu" />
    </v-btn>

  <v-navigation-drawer :permanent="!smallScreen"
                       :style="smallScreen ? 'top: 36px; max-height: calc(100% - 36px);' : ''"
                       :mini-variant="mini"
                       :rail="!show"
                       expand-on-hover
                       @change="setShow"
                       @input="onInput"
                       overlay-color="highlight"
                       mini-variant-width="60"
                       rail-width="60"
                       width="190" >

    <v-list dense >

      <v-list-item v-for="(item, index) in navItemsMenuExcluded"
                   :key="index"
                   :prepend-icon="item.icon"
                   :title="item.title"
                   :color="item.disabled ? 'grey' : 'primary'"
                   :disabled="item.disabled"
                   :class="`${item.icon === 'envidat' ? mini ? 'px-2' : 'px-3' : '' }`"
                   @click.stop="itemClick(item)" >

      </v-list-item>

    </v-list>

  </v-navigation-drawer>
  </span>
</template>

<script>
import { mdiMenu } from '@mdi/js';
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
