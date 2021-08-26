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
                  dense
                  activatable
                  >

        <template v-slot:prepend="{ item }">
          <v-btn icon
                  @click.stop="catchOpenClick(item)">
            <v-icon v-if="item.children" :style="!open.includes(item.id) ? '' : 'transform: rotate(90deg);' ">arrow_right</v-icon>
          </v-btn>
        </template>

        <template v-slot:label="{ item, active }">
          <div @click="catchActiveClick(item)">
            {{ active ? `${item.name} active` : item.name }}
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
 * Last modified  : 2021-08-26 18:12:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
// import {
//   EDITMETADATA_OBJECT_UPDATE,
//   EDITMETADATA_RELATED_PUBLICATIONS,
//   eventBus,
// } from '@/factories/eventBus';

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
              id: `child_${i}_${j}`,
              name: c.name,
            });
          }

          orgItems.push({
            id: `main_${i}`,
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
      if (!this.open.includes(item.id)) {
        this.open.push(item.id);
      }
    },
    catchActiveClick(item) {
      console.log(item);
    },
    // notifyChangeSelectedOrganisation(property, value) {
    //   const newRelatedPublications = {
    //       ...this.genericProps,
    //       [property]: value,
    //   };

    //   eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
    //       object: EDITMETADATA_RELATED_PUBLICATIONS,
    //       data: newRelatedPublications,
    //     });
    // },
  },
  data: () => ({
    search: '',
    open: [],
    selected: [],
  }),
  components: {
  },  
};
</script>

<style scoped>


</style>
