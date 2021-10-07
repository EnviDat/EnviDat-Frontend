<template>
  <v-card id="BaseUserPicker"
            :class="showAsCard ? 'pa-4' : 'pa-0'"
            :flat="!showAsCard" >

    <v-row v-if="instructions"
           no-gutters>
      <v-col class="text-body-1 pa-0 pb-4" >
        {{ instructions }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-autocomplete v-model="pickedUsers"
                        :items="users"
                        outlined
                        append-icon="arrow_drop_down"
                        :prepend-icon="prependIcon"
                        :label="pickerLabel"
                        :multiple="multiplePick"
                        :clearable="isClearable"
                        :search-input.sync="search"
                        clear-icon="close"
                        @change="catchPicks"
                        >

          <template v-slot:selection="{ item }">
            <TagChipAuthor v-if="item"
                           :name="item"
                           :isSmall="false"
                           :isCloseable="authorsCloseable"
                           @closeClicked="catchCloseClicked"/>
          </template>

          <template v-slot:item="{ item }">
            <TagChipAuthor v-if="item"
                           :name="item"
                           @clicked="catchPickClicked"
                           :isSmall="false" />
          </template>

          <template v-slot:no-data>
            <v-list-item v-html="autocompleteHint" />
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
import TagChipAuthor from '@/components/Chips/TagChipAuthor';

export default {
  name: 'BaseUserPicker',
  props: {
    users: Array,
    preSelected: Array,
    multiplePick: Boolean,
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
    authorsCloseable: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    if (this.preSelected?.length > 0) {

      if (this.multiplePick) {
        this.preSelected.forEach((author) => {
          // if (typeof author === 'object') {
            this.pickedUsers.push(author.fullName);
          // } else {
          //   this.pickedUsers.push(author);
          // }
        });
      } else {
        this.pickedUsers = this.preSelected[0].fullName;
      }
    } else {
      this.pickedUsers = this.multiplePick ? [] : '';
    }
  },
  computed: {
    autocompleteHint() {
      if (!this.search) {
        return 'Start typing for author autocompletion.';
      }

      return `No author name matching "<strong>${this.search}</strong>".`;
    },

  },
  methods: {
    catchCloseClicked(authorName) {
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
        if (!this.pickedUsers?.includes(pickedItem)) {
          this.pickedUsers.push(pickedItem);
        } else {
          this.pickedUsers = [];
        }
      } else {
        this.pickedUsers = pickedItem;
      }

      this.$emit('pickedUsers', this.pickedUsers);
    },
    catchPicks(picks) {
      this.$emit('pickedUsers', picks);
    },
  },
  data: () => ({
    pickerLabel: 'Click here to pick a EnviDat User',
    pickedUsers: [],
    search: '',
  }),
  components: {
    TagChipAuthor,
  },
};
</script>

<style scoped>

</style>
