<template>
  <v-avatar :color="backgroundColor"
            :size="size"
            style="box-shadow: 0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12) !important" >

    <!--
    <v-img v-if="!showGravatar && showAvaaatarIcons"
           id="avaaatarIcons"
          :src="avataaarUrl"
          @error="avataaarError" />
-->

    <div v-if="showInitials"
          id="jazzIconContainer"
          ref="jazzIcon"
          :style="`opacity: 0.75; height: ${size}px;`">
    </div>

    <span
      v-if="showInitials"
      class="white--text"
      style="position: absolute;"
      :class="initialsTextClass"
      >{{ nameInitials }}</span
    >

    <v-icon
      v-if="showFallbackAccountIcon"
      color="black"
      :small="size <= 20"
      :large="size > 40 && size < 128"
      :x-large="size >= 128"
      >account_circle</v-icon
    >
  </v-avatar>
</template>

<script>
/**
 * UserAvatar.vue
 *
 * @summary Shows the users avatar circle
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-09-02 23:08:14
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import jazzicons from '@metamask/jazzicon';
import seedrandom from 'seedrandom';

import { getAvataaarUrl } from '@/store/avataaars';

export default {
  components: {},
  props: {
    nameInitials: String,
    emailHash: String,
    defaultGravatar: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 48,
    },
    color: {
      type: String,
      default: 'secondary',
    },
  },
  mounted() {
    this.avataaarUrl = getAvataaarUrl(this.emailHash);
    // console.log(`emailHash: ${this.emailHash} url: ${this.avataaarUrl}`);
    this.loadJazzIcon();
  },
  computed: {
    backgroundColor() {
      if (!this.showInitials) {
        return this.color;
      }

      return 'transparent';
    },
    showGravatar() {
      return !this.gravatarNotLoaded;
    },
    showAvaaatarIcons() {
      return !this.avataaarNotLoaded && this.emailHash;
    },
    showInitials() {
      return !this.showGravatar && !this.showAvaaatarIcons && this.nameInitials;
    },
    showFallbackAccountIcon() {
      return !this.emailHash && !this.showGravatar && !this.nameInitials;
    },
    initialsTextClass() {
      if (this.size >= 128) {
        return 'text-h2';
      }

      if (this.size > 48) {
        return 'text-h4';
      }

      if (this.size >= 32) {
        return 'text-h6';
      }

      if (this.size <= 28) {
        return '';
      }

      return 'text-h5';
    },
  },
  methods: {
    loadJazzIcon() {
      const jazzIconElement = this.$refs.jazzIcon;

      if (jazzIconElement) {
        const rng = seedrandom(this.nameInitials);
        const randNr = rng.int32();
        const icon = jazzicons(this.size, randNr);
        jazzIconElement.appendChild(icon);
      }
    },
    imageError() {
      this.gravatarNotLoaded = true;
    },
    avataaarError() {
      this.avataaarNotLoaded = true;
    },
  },
  watch: {
    gravatarNotLoaded() {
      if (this.gravatarNotLoaded) {
        this.$nextTick(() => {
          this.loadJazzIcon();
        });
      }
    },
  },
  data: () => ({
    gravatarNotLoaded: false,
    avataaarNotLoaded: false,
    avataaarUrl: '',
  }),
};
</script>
