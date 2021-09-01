<template>
  <v-card id="OrganizationTree"
            class="pa-4" >

      
    <v-sheet class="pa-4 primary lighten-2">
      <v-text-field v-model="search"
                    label="Search Company Directory"
                    dark
                    flat
                    solo-inverted
                    hide-details
                    clearable
                    clear-icon="close"
                    />
    </v-sheet>
    <v-card-text>
      <v-treeview :items="items"
                  :search="search"
                  :open.sync="open"
                  :active.sync="active"
                  dense
                  activatable
                  rounded
                  hoverable
                  @update:active="catchActiveClick"
                  >

        <template v-slot:prepend="{ item }">
          <v-btn v-if="item.children && item.children.length > 0" 
                  icon
                  @click.stop="catchOpenClick(item)">
            <v-icon :style="!open.includes(item.id) ? '' : 'transform: rotate(90deg);' ">arrow_right</v-icon>
          </v-btn>
        </template>

        <!-- <template v-slot:label="{ item, active }"> -->
        <template v-slot:label="{ item }">
          <!-- <div @click="catchActiveClick(item)"> -->
          <div >
            {{ item.name }}
          </div>
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
 * Last modified  : 2021-09-01 10:03:55
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';

export default {
  name: 'OrganizationTree',
  props: {  
    preSelectedOrganization: String,
    organizationsMap: Object,
  },
  mounted() {
    if (this.preSelectedOrganization) {
      this.setActiveItem(this.preSelectedOrganization);
    }
  },
  computed: {
    items: {
      get() {
        const map = this.organizationsMap;
        const mainKeys = Object.keys(map);

        const orgItems = [];

        for (let i = 0; i < mainKeys.length; i++) {
          const mainOrg = mainKeys[i];
          const childs = map[mainOrg];

          const children = [];

          for (let j = 0; j < childs.length; j++) {
            const c = childs[j];
            children.push({
              id: `${this.childIdPrefix}_${i}_${j}`,
              name: c.name,
            });
          }

          orgItems.push({
            id: `${this.parentIdPrefix}_${i}`,
            name: mainOrg,
            children,
          });
          
        }

        return orgItems;
      },
    },
  },
  methods: {
    setActiveItem(name) {
      if (this.items) {
        for (let i = 0; i < this.items.length; i++) {
          const item = this.items[i];
          if (item.name === name) {
            this.catchOpenClick(item);
            break;
          }
        }
      }
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

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_ORGANIZATION,
        data: activeItem ? activeItem.name : '',
      });
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
    search: '',
    open: [],
    active: [],
    childIdPrefix: 'child',
    parentIdPrefix: 'parent',
  }),
  components: {
  },  
};
</script>

<style scoped>


</style>
