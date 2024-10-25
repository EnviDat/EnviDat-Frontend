<template>
  <v-card
    id="BaseUserPicker"
    :class="showAsCard ? 'pa-4' : 'pa-0'"
    :flat="!showAsCard"
  >
    <v-row v-if="instructions" no-gutters>
      <v-col class="text-body-1 pa-0 pb-4">
        {{ instructions }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="pt-2 tagAuthorFix">
        <v-autocomplete
          v-model="pickedUsers"
          :items="users"
          :menu-icon="mdiArrowDownDropCircleOutline"
          :readonly="readonly"
          :hint="hint"
          :persistent-hint="!!hint"
          :prepend-icon="prependIcon"
          :label="pickerLabel"
          :multiple="multiplePick"
          :clearable="isClearable"
          clear-on-select="true"
          :search-input="search"
          :error-messages="errorMessages"
          :menu-props="menuOptions"
          :clear-icon="mdiClose"
          v-bind="$props"
          @change="catchPicks"
          @blur="$emit('blur', $event)"
        >

          <template v-slot:selection="{ item }">
            <TagChipAuthor
                v-if="item.value"
                :name="item.value"
                :closable="userTagsCloseable && !readonly"
                @closeClicked="catchCloseClicked"
            />
          </template>

          <!-- documentation https://vuetifyjs.com/en/components/autocompletes/ -->

          <!--

          following documentation

          Define a custom item appearance. The root element of this slot must be a v-list-item with v-bind="props" applied. props includes everything required for the default select list behaviour - including title, value, click handlers, virtual scrolling, and anything else that has been added with item-props.

          -->

          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props"  @click="catchPickClicked(item.value)">
              <!-- <TagChipAuthor
                v-if="item"
                :name="item.value"
                @clicked="catchPickClicked"
                :isSmall="true"
              /> -->
            </v-list-item>
          </template>

          <template v-slot:no-data>
            <v-list-item>
              <div v-html="autocompleteHint"></div>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
/**
 * @summary UserPicker component
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 13:23:01
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import TagChipAuthor from '@/components/Chips/TagChipAuthor.vue';
import {mdiAccountBox, mdiArrowDownDropCircleOutline, mdiClose} from '@mdi/js';

export default {
  name: 'BaseUserPicker',
  props: {
    users: Array,
    preSelected: {
      type: Array,
      default: undefined,
    },
    multiplePick: Boolean,
    placeholder: {type: String, default: undefined},
    pickerLabel: {
      type: String,
      default: 'Click here to pick an EnviDat author',
    },
    isClearable: {
      type: Boolean,
      default: false,
    },
    showAsCard: Boolean,
    instructions: String,
    prependIcon: {
      type: String,
      default: mdiAccountBox,
    },
    userTagsCloseable: {
      type: Boolean,
      default: true,
    },
    errorMessages: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.updatePreselection();
  },
  watch: {
    preSelected() {
      this.updatePreselection();
    },
  },
  computed: {
    autocompleteHint() {
      if(this.placeholder){
        return this.placeholder;
      }
      if (!this.search) {
        return 'Start typing for autocompletion.';
      }

      return `No name matching "<strong>${this.search}</strong>".`;
    },
    menuOptions() {
      return {
        transition: 'fade-transition',
      }
    },
  },
  methods: {
    updatePreselection() {
      if (this.preSelected?.length > 0) {
        if (this.multiplePick) {
          this.pickedUsers = [];

          this.preSelected.forEach(authorName => {
            this.pickedUsers.push(authorName);
          });
        } else {
          this.pickedUsers = this.preSelected[0];
        }
      } else {
        this.pickedUsers = this.multiplePick ? [] : undefined;
      }
    },
    catchCloseClicked(authorName) {
      if (this.readonly) {
        return;
      }

      if (this.multiplePick) {
        const remains = this.pickedUsers.filter(value => value !== authorName);

        if (remains?.length > 0) {
          this.pickedUsers = remains;
        } else {
          this.pickedUsers = [];
        }
      } else {
        this.pickedUsers = undefined;
      }

      this.$emit('removedUsers', this.pickedUsers);
    },
    catchPickClicked(pickedItem) {
      if (this.multiplePick) {
        if (!this.pickedUsers.includes(pickedItem)) {
          this.pickedUsers.push(pickedItem);
        }
      } else {
        this.pickedUsers = pickedItem;
      }
      this.$emit('pickedUsers', this.pickedUsers);
    },
    catchPicks() {
      this.$emit('pickedUsers', this.pickedUsers);
      this.search = '';
    },
  },
  data: () => ({
    pickedUsers: undefined,
    search: '',
    mdiArrowDownDropCircleOutline,
    mdiClose,
  }),
  components: {
    TagChipAuthor,
  },
};
</script>

<style>
.tagAuthorFix .v-chip__content {
  /*
  a fix for now because there is a overlay coming in the way of the author icon
  but the chips are getting wider which isn't good
  */
  padding: 0 11px !important;
}

</style>
