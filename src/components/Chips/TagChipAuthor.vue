<template>
  <v-chip class="authorTag"
          :class="{
            'white--text': highlighted,
            smallChip: $vuetify.breakpoint.smAndDown,
            authorTagDraggable: draggable,
           }"
          :color="highlighted ? 'primary' : color"
          @click.stop="clicked"
          :draggable="draggable"
          :small="isSmall"
          close-icon="close"
          :close="isCloseable"
          @click:close="$emit('closeClicked', authorName)"
          >
    <v-avatar left>
      <v-icon :class="colorIcon" size="24px" >account_circle</v-icon>
    </v-avatar>

    {{ authorName }}

    <v-tooltip v-if="authorIsDead"
                bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" x-small >hourglass_bottom</v-icon>
      </template>

      {{ authorPassedInfo }}
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
    asciiDead: String,
    authorPassedInfo: String,
    isSmall: {
      type: Boolean,
      default: false,
    },
    isCloseable: Boolean,
    draggable: {
      type: Boolean,
      default: undefined,
    },
  },
  computed: {
    authorIsDead() {
      return this.asciiDead && this.name ? this.name.includes(this.asciiDead) : false;
    },
    authorName() {
      return this.authorIsDead ? this.name.replace(`(${this.asciiDead})`, '') : this.name;
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
    opacity: 0.85;
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
