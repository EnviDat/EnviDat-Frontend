<template>
  <v-card
    id="BaseDatasetPicker"
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
          v-model="pickedDataset"
          :items="projects"
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
            <TagChipProject
              v-if="item"
              :name="item"
              :isSmall="false"
              :fontSize="'14px'"
              :iconSize="'14px'"
              :closeable="true"
              :iconName="'category'"
              @clickedClose="catchCloseClicked"
            />
          </template>

          <template v-slot:item="{ item }">
            <TagChipProject
              v-if="item"
              :name="item"
              :fontSize="'14px'"
              :iconSize="'14px'"
              @clicked="catchPickClicked"
              iconName="category"
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
import TagChipProject from '@/components/Chips/TagChipProject.vue';

export default {
  name: 'BaseDatasetPicker',
  props: {
    projects: Array,
    preSelected: Array,
    multiplePick: Boolean,
    placeholder: { type: String, default: undefined },
    pickerLabel: {
      type: String,
      default: 'Click here to pick a Project',
    },
    isClearable: {
      type: Boolean,
      default: false,
    },
    showAsCard: Boolean,
    instructions: String,
    prependIcon: {
      type: String,
      default: 'category',
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
      if (this.placeholder) {
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
      };
    },
  },
  methods: {
    updatePreselection() {
      if (this.preSelected?.length > 0) {
        if (this.multiplePick) {
          this.pickedDataset = [];

          this.preSelected.forEach(projectName => {
            this.pickedDataset.push(projectName);
          });
        } else {
          this.pickedDataset = this.preSelected[0];
        }
      } else {
        this.pickedDataset = this.multiplePick ? [] : '';
      }
    },
    catchCloseClicked(projectName) {
      if (this.readonly) {
        return;
      }
      if (this.multiplePick) {
        const remains = this.pickedDataset.filter(
          value => value !== projectName,
        );

        if (remains?.length > 0) {
          this.pickedDataset = remains;
        } else {
          this.pickedDataset = [];
        }
      } else {
        this.pickedDataset = '';
      }

      this.$emit('removedUsers', this.pickedDataset);
    },
    catchPickClicked(pickedItem) {
      if (this.multiplePick) {
        if (!this.pickedDataset.includes(pickedItem)) {
          this.pickedDataset.push(pickedItem);
        }
      } else {
        this.pickedDataset = pickedItem;
      }

      this.$emit('pickedDataset', this.pickedDataset);
    },
    catchPicks(picks) {
      this.$emit('pickedDataset', picks);
      this.search = '';
    },
  },
  data: () => ({
    pickedDataset: [],
    search: '',
  }),
  components: {
    TagChipProject,
  },
};
</script>
