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
      <v-col>
        <v-autocomplete
          v-model="pickedUsers"
          :items="users"
          outlined
          :dense="dense"
          append-icon="arrow_drop_down"
          :readonly="readonly"
          :hint="hint"
          :persistent-hint="!!hint"
          :prepend-icon="prependIcon"
          :label="pickerLabel"
          :multiple="multiplePick"
          :clearable="isClearable"
          :search-input.sync="search"
          :error-messages="errorMessages"
          :menu-props="menuOptions"
          clear-icon="close"
          v-bind="$props"
          @change="catchPicks"
          @blur="$emit('blur', $event)"
        >
          <template v-slot:selection="{ item }">
            <TagChipAuthor
              v-if="item"
              :name="item"
              :isSmall="true"
              :isCloseable="userTagsCloseable"
              @closeClicked="catchCloseClicked"
            />
          </template>

          <template v-slot:item="{ item }">
            <TagChipAuthor
              v-if="item"
              :name="item"
              @clicked="catchPickClicked"
              :isSmall="true"
            />
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

export default {
  name: 'BaseUserPicker',
  props: {
    users: Array,
    preSelected: Array,
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
      default: 'account_box',
    },
    userTagsCloseable: {
      type: Boolean,
      default: true,
    },
    dense: {
      type: Boolean,
      default: false,
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
            // if (typeof author === 'object') {
            this.pickedUsers.push(authorName);
            // } else {
            //   this.pickedUsers.push(author);
            // }
          });
        } else {
          this.pickedUsers = this.preSelected[0];
        }
      } else {
        this.pickedUsers = this.multiplePick ? [] : '';
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
        this.pickedUsers = '';
      }

      this.$emit('removedUsers', this.pickedUsers);
    },
    catchPickClicked(pickedItem) {
      if (this.multiplePick) {
        // if (Array.isArray(this.pickedUsers)) {
        if (!this.pickedUsers.includes(pickedItem)) {
          this.pickedUsers.push(pickedItem);
          /*
          } else {
            const index = this.pickedUsers.indexOf(pickedItem);
            this.pickedUsers.splice(index, 1);
*/
        }
        // }
      } else {
        this.pickedUsers = pickedItem;
      }

      this.$emit('pickedUsers', this.pickedUsers);
    },
    catchPicks(picks) {
      this.$emit('pickedUsers', picks);
      this.search = '';
    },
  },
  data: () => ({
    pickedUsers: [],
    search: '',
  }),
  components: {
    TagChipAuthor,
  },
};
</script>

<style scoped></style>
