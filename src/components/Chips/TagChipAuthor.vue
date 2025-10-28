<template>
  <v-chip class="authorTag text-black"
          :class="{
            'text-white': highlighted,
            authorTagDraggable: draggable,
           }"
          :color="highlighted ? 'primary' : color"
          @click.stop="clicked"
          :draggable="draggable"
          :size="isSmall ? 'small': undefined"
          :density="isSmall ? 'compact' : 'default'"
          :close-icon="mdiClose"
          :closeable="closeable"
          @click:close="$emit('closeClicked', authorName)"
          >
    <v-avatar start class="pr-1">
      <v-icon size="24px" :icon="mdiAccountCircle" />
    </v-avatar>

    {{ authorName }}

    <v-tooltip v-if="isAuthorDead"
               location='bottom'>
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" size='small' :icon="mdiTimerSand" />
      </template>

      {{ AUTHOR_PASSED_INFO }}
    </v-tooltip>

  </v-chip>

</template>

<script>
/**
 * TagChipAuthor.vue creates a chip specific for authors with the name as text.
 *
 * @summary tag for authors
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-02-10 16:46:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import { mdiTimerSand, mdiAccountCircle, mdiClose } from '@mdi/js';
import { replaceAuthorDeadAscii } from '@/factories/authorFactory';
import { AUTHOR_ASCII_DEAD, AUTHOR_PASSED_INFO } from '@/store/mainMutationsConsts';

export default {
  props: {
    name: String,
    tooltipText: String,
    highlighted: Boolean,
    colorIcon: {
      type: String,
      default: 'dark',
    },
    color: {
      type: String,
      default: '#f8f8f8',
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
    closeable: Boolean,
    draggable: {
      type: Boolean,
      default: undefined,
    },
  },
  data: ()=>({
    mdiTimerSand,
    mdiAccountCircle,
    mdiClose,
    AUTHOR_PASSED_INFO,
  }),
  computed: {
    isAuthorDead() {
      return this.name?.includes(AUTHOR_ASCII_DEAD);
    },
    authorName() {
      if (this.isAuthorDead) {
        return replaceAuthorDeadAscii(this.name);
      }

      return this.name;
    },
  },
  methods: {
    clicked: function clicked() {
      this.$emit('clicked', this.name);
    },
  },
};
</script>

<style scoped>

  .authorTag {
    /*
    Remove opacity because with vuetify 3 chip are harder to read
    opacity: 0.85;
    */
    /*
    background-color: #f8f8f8 !important;
    */
    margin: 0 2px !important;
  }

  .authorTag > .v-chip__content > .v-avatar {
    margin-left: -12px !important;
  }

  .authorTag > .v-chip__content > .v-avatar > .v-icon.dark {
    color: rgba(0, 0, 0, 0.87) !important;
  }
  
  .authorTag > .v-chip__content > .v-avatar > .v-icon.white {
    background-color: #00897b !important;
  }
  

  .authorTagDraggable  {
    cursor: move !important;
  }

</style>

<style>

.authorTag .v-chip__close {
  color: red !important;
}

</style>
