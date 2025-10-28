<template>
  <v-container class="pa-0" id="BaseDraggableList" fluid @click.stop>
    <v-row v-if="instructions" no-gutters>
      <v-col class="text-body-2 pb-1">
        {{ draggableItems?.length > 0 ? instructions : emptyInstructionsText }}
      </v-col>
    </v-row>

    <v-row no-gutters class="draggableList pa-2">
      <v-col
        v-for="(item, index) in draggableItems"
        :key="`${index}_${item}`"
        class="flex-grow-0"
        :draggable="!isReadOnly"
        @dragenter.prevent
        @dragover="onDragOver($event, item)"
        @dragleave="onDragLeave($event)"
        @dragstart="onDragStart($event, item)"
        @drop="onDrop($event, item)"
      >
        <TagChipAuthor
          v-if="useAuthorTags"
          :name="item"
          :color="currentHoverItem === item ? $vuetify.theme.themes.light.colors.accent : undefined"
          :highlighted="currentDragItem === item"
          :isSmall="true"
          :draggable="true"
        />

        <TagChip
          v-if="!useAuthorTags"
          :name="item"
          :color="currentHoverItem === item ? $vuetify.theme.themes.light.colors.accent : undefined"
          :highlighted="currentDragItem === item"
          :isSmall="false"
        />
      </v-col>
    </v-row>

    <v-row v-if="isReadOnly" class="ma-0 v-messages v-messages__message">
      <v-col>
        {{ readOnlyHint }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * BaseDraggableListBaseDraggableList.vue shows a taglist for the given string array.
 * The entries can be dragged and dropped to change their sequence.
 * Use the optional @prop useAuthorTags to shoe the tags as the tagChipAuthor component
 *
 * check https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
 * for details about the drag and drop implementation
 *
 * @summary shows the authors the a metadata entry
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';
import TagChipAuthor from '@/components/Chips/TagChipAuthor.vue';
import TagChip from '@/components/Chips/TagChip.vue';
import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';

export default {
  name: 'BaseDraggableList',
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
    useAuthorTags: {
      type: Boolean,
      default: false,
    },
    instructions: {
      type: String,
      default: undefined,
    },
    draggableProperty: {
      type: String,
      default: undefined,
      required: true,
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    draggableItems: {
      get() {
        return this.previewItems?.length > 0 ? this.previewItems : this.items;
      },
      set(value) {
        this.previewItems = value;
      },
    },
    isReadOnly() {
      return isFieldReadOnly(this.$props, this.draggableProperty);
    },
    readOnlyHint() {
      return readOnlyHint(this.$props, this.draggableProperty);
    },
  },
  methods: {
    onDragOver(event, item) {
      if (this.readOnlyHint) {
        return;
      }

      event.preventDefault();
      this.currentHoverItem = item;
    },
    onDragStart(event, item) {
      if (this.readOnlyHint) {
        return;
      }

      this.currentDragItem = item;
    },
    onDragLeave(event) {
      if (this.readOnlyHint) {
        return;
      }

      event.preventDefault();
      this.currentHoverItem = '';
    },
    onDrop(event, item) {
      if (this.readOnlyHint) {
        return;
      }

      const dragItem = this.draggableItems.filter((author) => author === this.currentDragItem)[0];
      const dragIndex = this.draggableItems.findIndex((author) => author === this.currentDragItem);
      const dropIndex = this.draggableItems.findIndex((author) => author === item);

      if (dropIndex < 0 || dragIndex < 0 || dropIndex === dragIndex) {
        // drop outside or on itself
        this.delayedReset();
        return;
      }
      /*
      const dropItem = this.draggableItems.filter((author) => author === item)[0];
      console.log(`dragged ${dragItem} to ${dropItem}`);
      console.log(`dragged ${dragIndex} to ${dropIndex}`);
*/
      const newItems = [...this.draggableItems];
      newItems.splice(dragIndex, 1);
      //      console.log(`remove ${dragIndex} ${newItems.length}`);
      newItems.splice(dropIndex, 0, dragItem);
      //        console.log(`inserted ${dragItem} at ${dropIndex} ${newItems.length}`);

      this.draggableItems = newItems;

      this.delayedReset();
      this.emitChange(this.draggableItems);
    },
    delayedReset() {
      setTimeout(() => {
        // change with delay to make a visible effect when dropped
        this.currentDragItem = '';
        this.currentHoverItem = '';
      }, 300);
    },
    clearPreviews() {
      this.previewItems = null;
    },
    emitChange(list) {
      this.$emit('listChanged', list);
    },
  },
  components: {
    TagChip,
    TagChipAuthor,
  },
  data: () => ({
    emptyInstructionsText: 'No items to change the sequence, add items first.',
    currentDragItem: '',
    currentHoverItem: '',
    previewItems: null,
  }),
};
</script>

<style scoped>
.draggableList {
  border-width: thin;
  border-color: black;
  border-radius: 4px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.42);
}

.draggableList:hover {
  border-color: rgba(0, 0, 0, 1);
}
</style>
