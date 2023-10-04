<template>
  <div style="background-color: gray; display: flex; "
       class="pa-4"
  >
    <div v-for="(item, index) in items"
         :key="`${index}_${item}`"
         :draggable="true"
         @dragenter="onDragEnter($event, item)"
         @dragleave="onDragLeave($event, item)"
         @dragend="onDragEnd($event, item)"
         style="cursor: e-resize"
         :data-author="item"
         class="pa-1"
    >
<!--
         @dragstart="onDragEnter($event, item)"
-->

      <TagChipAuthor :name="item" />
    </div>
  </div>
</template>

<script>


export default {
  name: 'BaseDraggableList',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {

  },
  methods: {
    onDragOver(event) {
      event.target.classList.add('secondary');
      event.preventDefault();
    },
    onDragStart(event, name) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('author', name)
    },
    onDragEnter(event, name) {
      console.log('onDragEnter');
      console.log(name);
      this.currentDragOver = name
    },
    onDragLeave(event, item) {
      if (this.currentDragOver === item) {
        return;
      }

      this.currentDragOver = '';
      console.log('onDragLeave');
      console.log(item);
    },
    onDragEnd(event, item) {
      console.log('onDragEnd');
      console.log(item);
      console.log(this.currentDragOver);
    },
    onDrop(event) {
/*
      console.log(event.target.value);
      console.log(event.srcElement);
*/
      console.log('onDrop');
      console.log(this.currentDragOver);
      const authorName = event.dataTransfer.getData('author')
      const authorItem = this.items.filter((author) => author === authorName)[0]
      console.log(authorItem);
    },
  },
  components: {
  },
  data: () => ({
    currentDragOver: '',
  }),
};
</script>
