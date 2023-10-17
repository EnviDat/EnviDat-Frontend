<template>
  <v-container class="pa-0"
               id="BaseDraggableList"
               fluid>
    <v-row no-gutters>
      <v-col v-for="(item, index) in draggableItems"
           :key="`${index}_${item}`"
           style="cursor: e-resize;"
           class="flex-grow-0"
           :draggable="true"
           @dragenter.prevent
           @dragover="onDragOver($event, item)"
           @dragleave="onDragLeave($event)"
           @dragstart="onDragStart($event, item)"
           @drop="onDrop($event, item)"
      >

        <TagChipAuthor v-if="useAuthorTags"
                       style="cursor: e-resize;"
                       :name="item"
                       :color="currentHoverItem === item ? $vuetify.theme.themes.light.accent : undefined"
                       :highlighted="currentDragItem === item"
                       :isSmall="true"
                        />

        <TagChip v-if="!useAuthorTags"
                 :name="item"
                 :color="currentHoverItem === item ? $vuetify.theme.themes.light.accent : undefined"
                 :highlighted="currentDragItem === item"
                 :isSmall="false"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

/**
 * List of
 * check https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
 * for details about the drag and drop implementation
 */
export default {
  name: 'BaseDraggableList',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    useAuthorTags: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    draggableItems: {
      get(){
        return this.previewItems?.length > 0 ? this.previewItems : this.items;
      },
      set(value) {
        this.previewItems = value;
      },
    },
  },
  methods: {
    onDragOver(event, item) {
      event.preventDefault();
      this.currentHoverItem = item
    },
    onDragStart(event, item) {
      this.currentDragItem = item
    },
    onDragEnter(event, item) {
      event.preventDefault();
      this.currentHoverItem = item
    },
    onDragLeave(event) {
      event.preventDefault();
      this.currentHoverItem = ''
    },
/*
    onDragEnd(event, item) {
      console.log('onDragEnd');
      console.log(item);
      console.log(this.currentDragItem);
    },
*/
    onDrop(event, item) {

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
      newItems.splice(dragIndex, 1)
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
    emitChange(list) {
      this.$emit('listChanged', list);
    },
  },
  components: {
  },
  data: () => ({
    currentDragItem: '',
    currentHoverItem: '',
    previewItems: null,
  }),
};
</script>
