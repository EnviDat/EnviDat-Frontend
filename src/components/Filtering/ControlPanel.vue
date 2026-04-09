<template>
  <v-card elevation="3" :style="`height: ${fixedHeight}px;`" class="controlPanel">
    <v-container class="px-1 px-sm-2 py-0 fill-height" fluid>
      <v-row align="center" justify="space-between" no-gutters>
        <v-col class="py-0" cols="8" :sm="hasEnabledControls ? 8 : 10" md="8" lg="8">
          <SmallSearchBarView
            class="elevation-0"
            :compactLayout="compactLayout"
            :searchTerm="searchTerm"
            :showSearch="showSearch"
            :showSearchCount="true"
            :searchCount="searchCount"
            :isFlat="true"
            :fixedHeight="fixedHeight"
            :labelText="searchBarPlaceholder"
            :showOrgSelect="advanceFilterActive && !orgLoading && organizationsStore.organizations.length > 0"
            :orgItems="organizationsStore.organizations"
            :loading="loading"
            @clicked="catchSearchClicked"
            @searchCleared="catchSearchCleared"
            @orgSelected="catchOrganizationSelected"
          />
        </v-col>

        <v-col v-if="showSearch" class="py-0 px-sm-1 flex-grow-0" id="shareSearchResult">
          <BaseIconButton
            style="opacity: 0.8"
            :icon="filterIcon"
            iconColor="black"
            tooltip-bottom
            tooltip-text="Advance filter by Organizations"
            :spin="orgLoading"
            :disabled="orgLoading || organizationsStore.organizations.length === 0"
            @clicked="catchFilterClick"
          />
        </v-col>
        <v-col v-if="showSearch && mode !== EDNA_MODE" class="ml-sm-4 flex-grow-0">
          <BaseIconSwitch
            :active="isAuthorSearch"
            :tooltipText="`Author search is ${isAuthorSearch ? 'active' : 'NOT active'}`"
            :icon="mdiAccountCircle"
            @clicked="catchAuthorSearchClick"
          />
        </v-col>

        <v-col v-if="showSearch" class="py-0 px-sm-1 flex-grow-0" id="shareSearchResult">
          <BaseIconButton
            style="opacity: 0.8"
            :icon="mdiShareVariant"
            iconColor="black"
            tooltip-bottom
            tooltip-text="Copy the url to this view to the clipboard to share it."
            @clicked="catchShareClick"
          />
        </v-col>

        <v-col v-if="showSearch && mode === EDNA_MODE" class="ml-sm-4 flex-grow-0">
          <BaseIconSwitch
            :active="isShallow"
            :zIndex="elementVisible ? 6 : undefined"
            :tooltipText="`${isShallow ? 'Samples' : 'Overview'} datasets are visible, click to switch to ${isShallow ? 'overview' : 'samples'} datasets.`"
            :icon="mdiLayers"
            :loading="loadingDetailSwitch"
            @clicked="catchShallowRealClick"
          />

          <v-overlay absolute :model-value="elementVisible" style="z-index: 5 !important">
            <div
              class="dialog"
              :style="`left: ${$vuetify.display.smAndDown ? '-20' : '45'}px;`"
              @click="elementVisible = !elementVisible"
            >
              <span>Toggle from overview to sample datasets:</span>
            </div>
          </v-overlay>
        </v-col>

        <v-col class="hidden-xs py-0">
          <list-control-toggle
            :style="`height: ${controlsHeight};`"
            :controls="controlsActive"
            :enabledControls="enabledControls"
            :flat="true"
            @controlsChanged="catchControlClick"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * MetadataList.vue uses the FilterKeywordView, FilterMapView and the ControlPanelView
 * to create a List of metadata cards which can be filtered via the mentioned
 * filtering components.
 *
 * @summary filterable list of metadata cards
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mdiLayers, mdiShareVariant, mdiAccountCircle, mdiFilter, mdiFilterOff, mdiLoading } from '@mdi/js';

import SmallSearchBarView from '@/components/Filtering/SmallSearchBarView.vue';
import ListControlToggle from '@/components/Filtering/ListControlToggle.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch.vue';
import { mapStores } from 'pinia';
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';

import { EDNA_MODE } from '@/store/metadataMutationsConsts';

export default {
  name: 'ControlPanel',
  props: {
    compactLayout: Boolean,
    fixedHeight: {
      type: Number,
      default: undefined,
    },
    controlsActive: Array,
    enabledControls: Array,
    loading: Boolean,
    loadingDetailSwitch: Boolean,
    showSearch: Boolean,
    isAuthorSearch: {
      type: Boolean,
      default: false,
    },
    isShallow: {
      type: Boolean,
      default: false,
    },
    mode: String,
    searchTerm: String,
    searchCount: Number,
    searchBarPlaceholder: String,
  },
  components: {
    SmallSearchBarView,
    ListControlToggle,
    BaseIconButton,
    BaseIconSwitch,
  },
  async mounted() {
    this.orgLoading = true;
    try {
      this.organizationData = (await this.organizationsStore.loadAllOrganizations()) || [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching organizations:', error);
    } finally {
      this.orgLoading = false;
    }
  },
  methods: {
    catchSearchClicked(search) {
      this.$emit('searchClick', search);
    },
    catchAuthorSearchClick() {
      this.$emit('authorSearchClick');
    },
    catchShallowRealClick() {
      this.$emit('shallowRealClick');
    },
    catchSearchCleared() {
      this.$emit('searchCleared');
    },
    catchControlClick(number) {
      this.$emit('controlsChanged', number);
    },
    catchOrganizationSelected(value) {
      const selected = value?.raw ?? value;
      const selectedId = value?.id ?? selected?.id;
      const selectedName =
        (selected?.name || value?.label || value?.id || '')
          .toString()
          .trim()
          .toLowerCase();
      const relatedIds = this.collectRelatedOrgIdsByGroup(selectedName, selectedId);

      this.$emit('organizationClicked', {
        id: selectedId,
        label: value?.label ?? selected?.display_name ?? selected?.title ?? selected?.name ?? selectedId,
        raw: selected,
        relatedIds,
      });
    },
    catchShareClick() {
      // const routeData = this.$router.resolve({ path: this.$route.fullPath });

      navigator.clipboard.writeText(window.location);
    },
    catchFilterClick() {
      const next = !this.advanceFilterActive;
      this.advanceFilterActive = next;
      if (!next) {
        this.$emit('organizationCleared');
      }
    },
    showOverlay() {
      this.elementVisible = true;

      setTimeout(() => {
        this.elementVisible = false;
      }, 10000); // 10000 milliseconds = 5 seconds
    },
    collectRelatedOrgIdsByGroup(groupName, selectedId) {
      if (!groupName) return selectedId ? [selectedId] : [];

      const orgs = this.organizationsStore?.organizations || [];
      const related = orgs
        .filter((org) =>
          (org?.groups || []).some((g) => {
            const gName = (g?.name || g?.display_name || g?.title || '').toString().trim().toLowerCase();
            return gName === groupName;
          }),
        )
        .map((org) => org?.id)
        .filter(Boolean);

      const ids = new Set([selectedId, ...related].filter(Boolean));
      return Array.from(ids);
    },
  },
  computed: {
    ...mapStores(useOrganizationsStore),
    hasEnabledControls() {
      return this.enabledControls?.length > 0;
    },
    filterIcon() {
      if (this.orgLoading) return mdiLoading;
      return this.advanceFilterActive ? mdiFilterOff : mdiFilter;
    },
    controlsHeight() {
      if (this.compactLayout || !this.fixedHeight) {
        return '36px';
      }

      return `${this.fixedHeight}px`;
    },
  },
  data: () => ({
    EDNA_MODE,
    mdiLayers,
    mdiShareVariant,
    mdiAccountCircle,
    mdiFilter,
    mdiFilterOff,
    mdiLoading,
    elementVisible: false,
    overlay: false,
    zIndex: 2,
    advanceFilterActive: false,
    orgLoading: false,
  }),
};
</script>

<style>
.switchSmallFont label {
  font-size: 10px !important;
}

.dialog {
  position: relative;
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  color: black;
  height: 30px;
  display: flex;
  justify-content: center;
}
.dialog:hover {
  cursor: pointer;
}
</style>
