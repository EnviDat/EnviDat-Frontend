<template>
  <v-card
      id="OrganizationTree"
      class="pa-0">
    <v-sheet class="pa-2 bg-secondary">
      <v-text-field
        v-model="search"
        label="Search Organization"
        dark
        flat
        solo-inverted
        hide-details
        clearable
        persistent-clear
        :clear-icon="mdiClose"
      />
    </v-sheet>

    <v-card-text>
      <v-treeview
        :items
        :search
        :open
        :activated
        color="secondary"
        open-on-click
        item-value="id"
        item-disabled="locked"
        selectable
        activatable
        hoverable
        :max-height="maxHeight"
        @update:active="catchActiveClick"
        @click:open="item => catchItemClick(item)"
      >

        <template v-slot:prepend="{ item }">
          <slot name="prepend" :item="item" />
        </template>

        <template v-slot:item="{ item }">
          <slot name="item" :item="item" />
        </template>

        <template v-slot:append="{ item }">
          <slot name="append" :item="item" />
        </template>

      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * @summary Shows a treeview of the organisations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-08-19 16:09:39
 * Last modified  : 2021-09-01 16:18:32
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mdiClose } from '@mdi/js';
import { getOrganitzionTreeItem } from '@/factories/organizationFactory';

export default {
  name: 'OrganizationTree',
  props: {
    preSelectedOrganization: String,
    organizationsTree: Array,
    selectionDisabled: Boolean,
    maxHeight: {
      type: Number,
      default: 500,
    },
  },
  emits: ['click', 'clickAppend'],
  mounted() {
    if (this.preSelectedOrganization) {
      this.setActiveItem(this.items, this.preSelectedOrganization);
    }
  },
  computed: {
    items() {
      return this.organizationsTree;
    },
  },
  methods: {
    setActiveItem(items, name) {
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          if (item.title === name) {
            if (!this.activated.includes(item.id)) {
              this.activated.push(item.id);
            }

            return true;
          }

          if (item.children?.length > 0) {
            const found = this.setActiveItem(item.children, name);
            if (found) {
              this.catchOpenClick(item);
            }
          }
        }
      }

      return false;
    },
    catchItemClick({ id }) {

      let orgaName = id;

      const entry = getOrganitzionTreeItem(this.organizationsTree, id);
      if (entry) {
        orgaName = entry.name;
      }

      this.$emit('click', orgaName);
    },
    catchOpenClick(item) {
      if (this.open.includes(item.id)) {
        const index = this.open.indexOf(item.id);
        if (index > -1) {
          this.open.splice(index, 1);
        }
      } else {
        this.open.push(item.id);
      }
    },
    catchActiveClick(arrayActive) {
      const activeId = arrayActive[0];
      let activeItem = null;
      if (activeId) {
        activeItem = this.getItemFromId(activeId);
      }

      this.$emit('organizationChanged', activeItem ? activeItem.name : '');
    },
    getItemFromId(activeId) {
      const isChild = activeId.includes(this.childIdPrefix);
      let itemId = activeId;

      let activeItem = this.getItemById(this.items, itemId);

      if (isChild) {
        itemId = this.getParentIdFromChild(activeId);
        const parentItem = this.getItemById(this.items, itemId);

        activeItem = this.getItemById(parentItem.children, activeId);
      }

      return activeItem;
    },
    getItemById(items, itemId) {
      const itemSelection = items.filter(i => i.id === itemId);
      return itemSelection[0];
    },
    getParentIdFromChild(childId) {
      const splits = childId.split('_');

      return `${this.parentIdPrefix}_${splits[1]}`;
    },
  },
  data: () => ({
    search: null,
    open: [],
    activated: [],
    childIdPrefix: 'child',
    parentIdPrefix: 'parent',
    mdiClose,
  }),
  components: {
  },
};
</script>

<style scoped></style>
