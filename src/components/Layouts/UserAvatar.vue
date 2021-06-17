<template>
  <v-avatar :color="color"
            :size="size"
            style="box-shadow: 0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12) !important" >

    <!-- <v-img v-if="showGravatar"
          :src="`https://gravatar.com/avatar/${emailHash}?s=${size}&d=${defaultGavatar}&r=g`"
          @error="imageError" /> -->

    <v-img v-if="showGravatar"
          :src="avataaarUrl"
          @error="imageError" />

    <span v-if="!showGravatar && nameInitials"
          class="white--text"
          :class="initialsTextClass" >{{ nameInitials }}</span>

    <v-icon v-if="!showGravatar && !nameInitials"
            color="black"
            :small="size <= 20"
            :large="size > 40 && size < 128"
            :x-large="size >= 128" >account_circle</v-icon>

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
import { getAvataaarUrl } from '@/store/avataaars';

export default {
  components: {
  },
  props: {
    nameInitials: String,
    emailHash: String,
    defaultGavatar: {
      type: String,
      default: 'identicon',
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
  },
  computed: {
    showGravatar() {
      return !this.gravatarNotLoaded;
    },
    initialsTextClass() {
      if (this.size >= 128) {
        return 'display-2';
      } 

      if (this.size > 48) {
        return 'display-1';
      } 

      if (this.size <= 32) {
        return 'subtitle-1';
      }

      return 'headline';
    },
  },
  methods: {
    imageError() {
      this.gravatarNotLoaded = true;
    },
  },
  data: () => ({
    gravatarNotLoaded: false,
    avataaarUrl: '',
  }),
};
</script>
