<template>
  <span>
    <v-btn
      v-if="smallScreen && !show"
      color="secondary"
      @click="setShow(true)"
      style="
        bottom: 15px;
        left: 15px;
        border-radius: 50%;
        height: 60px;
        width: 60px;
      "
      class="position-fixed"
    >
      <v-icon size="x-large" :icon="mdiMenu" />
    </v-btn>

    <v-navigation-drawer
      :mode="smallScreen ? 'temporary' : 'permanent'"
      :style="smallScreen ? 'top: 45px; max-height: calc(100% - 45px);' : ''"
      :rail="!show"
      v-model="drawerModel"
      expand-on-hover
      @change="setShow"
      @update:modelValue="onInput"
      scrim="highlight"
      :rail-width="60"
      width="220"
    >
      <v-list density="compact">
        <v-list-item
          v-for="(item, index) in navItemsMenuExcluded"
          :key="index"
          :prepend-icon="item.icon"
          :title="item.title"
          density="compact"
          :class="[
            item.disabled ? 'text-grey' : item.active ? 'text-secondary' : '',
            item.icon === 'envidat' ? (mini ? 'px-2' : 'px-3') : '',
            item.isMenuIcon === true ? 'd-flex d-lg-none rotateIcon' : '',
          ]"
          :disabled="item.disabled"
          @click.stop="itemClick(item)"
        >
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
  // mounted() {
  //   this.updateShowBasedOnViewport();
  //   window.addEventListener('resize', this.updateShowBasedOnViewport);
  // },
  // beforeUnmount() {
  //   window.removeEventListener('resize', this.updateShowBasedOnViewport);
  // },
  data: () => ({
    Logo,
    mdiMenu,
    logoText: 'EnviDat',
    show: false,
  }),
  computed: {
    drawerModel() {
      return this.smallScreen ? this.show : true;
    },
    mini() {
      return !this.smallScreen && !this.show;
    },
    smallScreen() {
      return this.$vuetify.display.smAndDown;
    },
    navItemsMenuExcluded() {
      const actives = [];

      this.navigationItems?.forEach((el) => {
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
    // updateShowBasedOnViewport() {
    //   this.show = window.innerWidth >= this.$vuetify.display.smAndUp;
    // },
    setShow(value) {
      if (this.smallScreen) {
        this.show = value;
      }
    },
    // Hack: NavigationDrawer Input events should only take effect on smallScreen
    onInput(value) {
      if (this.smallScreen) {
        this.setShow(value);
      }
    },
    itemClick(item) {
      // manage active status
      this.navItemsMenuExcluded.forEach((i) => {
        i.active = false;
      });
      item.active = true;
      if (item.isMenuIcon) {
        this.setShow(false);
      }
      if (!item.disabled) {
        this.$emit('itemClick', item);
      }
    },
  },
};
</script>

<style>
.narrowNavigation > div[role='listitem'] > div {
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

.rotateIcon {
  transform: rotate(180deg);
}

@media (min-width: 767px) {
  .v-navigation-drawer__scrim {
    display: none;
  }
}
</style>
