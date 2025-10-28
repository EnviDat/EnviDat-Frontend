<template id="MetadataPublications">
  <v-card class="relatedPubList pa-0"
  >
    <v-card-title class="metadata_title text-h6 py-4">
      {{ METADATA_PUBLICATIONS_TITLE }}
    </v-card-title>

    <v-skeleton-loader
      v-if="loading || showPlaceholder"
      type="list-item-two-line"
    />

    <v-card-text v-if="!text && !showPlaceholder">
      No related publications available for this dataset.
    </v-card-text>

    <v-card-text
      v-if="text"
      ref="text"
      class="pa-4 pt-0 heightAndScroll readableText"
      :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
    >
      <v-col
        v-for="(n, index) in dataSliced"
        :key="'n_' + index"
        class="px-0 py-1"
      >
        <!-- title visible only in preview mode -->
        <p class="font-weight-bold" v-if="isPreview && n.title">
          {{ n.title }}
        </p>

        <p class="font-weight-bold" v-if="isPreview && n.pid">{{ n.pid }}</p>
        <p class="font-weight-bold" v-if="isPreview && n.doi">{{ n.doi }}</p>

        <v-row no-gutters :class="{ 'align-center': isPreview }">
          <v-col class="flex-grow-1">
            <BaseCitationView
              :abstract="n.abstract"
              :citation="setCitation(n)"
              :doi="n.doi"
              :doiUrl="n.doiUrl"
            />
          </v-col>
          <!-- Show buttons only in preview mode -->
          <v-col
            v-if="isPreview"
            class="flex-grow-0 px-1 d-flex flex-column flex-md-row"
          >
            <BaseIconButton
              v-if="isPlainText(n)"
              :icon="mdiPencil"
              icon-color="yellow"
              @clicked="sendEditItemData(n.citation, index)"
            />
            <BaseIconButton
              :icon="mdiMinusCircleOutline"
              icon-color="red"
              @clicked="sendRemoveItem(index)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-card-text>

    <v-card-actions
      v-if="dataLength > 2 && !isPreview"
      class="ma-0 pa-2"
      :style="`position: absolute; bottom: 0px; right: ${rightPos()};`"
    >
      <BaseIconButton
        :icon="mdiChevronDown"
        :icon-color="showFullText ? 'secondary' : 'white'"
        :color="showFullText ? 'transparent' : 'secondary'"
        :outlined="!!showFullText"
        outline-color="secondary"
        :rotated="showFullText"
        :tooltipText="showFullText ? 'Collapse text' : 'Show full text'"
        @clicked="readMore"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

import { mdiPencil, mdiMinusCircleOutline, mdiChevronDown } from '@mdi/js';
import BaseCitationView from '@/components/BaseElements/BaseCitationView.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';
import { METADATA_PUBLICATIONS_TITLE } from '@/factories/metadataConsts';
import {
  extractPIDsFromText,
  extractDOIsFromText,
  extractedNoPidDoiText,
  resolveDoiCitationObjectsViaDora,
  resolvePidCitationObjectsViaDora,
} from '@/factories/citationFactory';

export default {
  name: 'MetadataPublicationList',
  components: {
    BaseCitationView,
    BaseIconButton,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    updatedCitation: {
      type: String,
      default: undefined,
    },
    updatedCitationIndex: {
      type: Number,
      default: undefined,
    },
    allDatasets: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  computed: {
    ...mapState(['config']),
    dataLength() {
      return this.dataRelatedPublications?.length;
    },
    dataSliced() {
      let dataSliced = this.dataRelatedPublications;
      if (!this.showFullText && !this.isPreview) {
        dataSliced = this.dataRelatedPublications?.slice(0, 2);
      }
      return dataSliced;
    },
    metadataConfig() {
      return this.$store ? this.config?.metadataConfig || {} : {};
    },
    publicationsConfig() {
      return this.metadataConfig?.publicationsConfig || {};
    },
    resolveBaseUrl() {
      return this.publicationsConfig?.resolveBaseUrl || undefined;
    },
    resolveBaseDOIUrl() {
      return this.publicationsConfig?.resolveBaseDOIUrl || undefined;
    },
    extractedPIDMap() {
      return extractPIDsFromText(this.text);
    },
    extractedDOIMap() {
      return extractDOIsFromText(this.text);
    },
    extractedNoPidDoi() {
      return extractedNoPidDoiText(this.text);
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  mounted() {
    this.resolvedCitations(this.text);
  },
  methods: {
    isPlainText(n) {
      return n.doi == null && n.pid == null;
    },
    sendEditItemData(value, index) {
      this.$emit('editItem', {
        citationText: value,
        index,
      });
    },
    getEditItemData(object) {
      this.dataRelatedPublications = this.dataRelatedPublications.map(
        (obj, i) => (i === object.index ? object.object : obj),
      );
    },
    sendRemoveItem(index) {
      this.removeItem(this.dataRelatedPublications, index);
      const newRelatedText = this.recreateRelatedPublicationText();
      this.$emit('updateText', newRelatedText);
    },
    removeItem(array, index) {
      if (index >= 0 && index < array.length) {
        array.splice(index, 1);
      }
    },
    rightPos() {
      return this.$refs.text && this.$refs.text.$el.clientHeight >= 500
        ? '0px'
        : '10px';
    },
    setCitation(n) {
      return n.citation?.WSL ?? n.citation ?? 'No citation available';
    },
    readMore() {
      this.showFullText = !this.showFullText;
    },
    scrollbarColorFront() {
      return this.$vuetify
        ? this.$vuetify.theme.themes.light.colors.highlight
        : 'auto';
    },

    /**
     * Recreates a single string from dataRelatedPublications,
     * preserving lines with PIDs/DOIs and plain text lines.
     */
    recreateRelatedPublicationText() {
      let newText = '';
      for (let i = 0; i < this.dataRelatedPublications.length; i++) {
        if (i !== 0) {
          newText += '\n';
        }
        const publicationObj = this.dataRelatedPublications[i];
        const id = publicationObj.pid || publicationObj.doi || null;

        // If an object has a PID or DOI, use that in the text
        if (id) {
          newText += id; // e.g. "wsl:29664"
        } else {
          // Otherwise, it's plain text
          newText += publicationObj.citation;
        }
      }
      return newText;
    },

    /**
     * Merges or updates final array from partial arrays (if you have them).
     * Currently it's used for a different logic (resolvePIDs/resolveDOIs).
     */
    updatePublicationList() {
      this.dataRelatedPublications = [
        ...(this.pidPublications || []),
        ...(this.doiPublications || []),
        ...(this.emptyCitation || []),
      ];
    },

    /**
     * If you want to quickly add plain text lines in bulk
     * (not PIDs, not DOIs).
     */
    generateCitationFromSimpleText(arrayText) {
      this.emptyCitation = [];
      arrayText.forEach((citation) => {
        if (citation !== 'null' && citation.trim() !== '') {
          const citationProp = {
            title: 'Plain Text',
            doi: null,
            doiUrl: null,
            citation,
            abstract: null,
          };
          this.emptyCitation.push(citationProp);
        }
      });
      this.updatePublicationList();
    },

    /**
     * Helper function to resolve a single line (all-or-nothing).
     */
    async processLine(line, resolveBaseUrl, resolveBaseDOIUrl) {
      const linePidMap = extractPIDsFromText(line);
      const lineDoiMap = extractDOIsFromText(line);

      if (!linePidMap.size && !lineDoiMap.size) {
        // purely plain text
        return [
          {
            title: 'Plain Text',
            citation: line,
            pid: null,
            doi: null,
            abstract: null,
          },
        ];
      }

      let pidCitationMap = new Map();
      if (linePidMap.size > 0) {
        try {
          pidCitationMap = await resolvePidCitationObjectsViaDora(
            linePidMap,
            resolveBaseUrl,
          );
        } catch (err) {
          console.warn('Error resolving PIDs for line:', line, err);
        }
      }

      let doiCitationMap = new Map();
      if (lineDoiMap.size > 0) {
        try {
          doiCitationMap = await resolveDoiCitationObjectsViaDora(
            lineDoiMap,
            resolveBaseDOIUrl,
          );
        } catch (err) {
          console.warn('Error resolving DOIs for line:', line, err);
        }
      }

      let allResolved = true;

      for (const pid of linePidMap.values()) {
        if (!pidCitationMap.has(pid)) {
          allResolved = false;
          break;
        }
      }
      if (allResolved) {
        for (const doi of lineDoiMap.values()) {
          if (!doiCitationMap.has(doi)) {
            allResolved = false;
            break;
          }
        }
      }

      if (!allResolved) {
        return [
          {
            title: 'Plain Text',
            citation: line,
            pid: null,
            doi: null,
            abstract: null,
          },
        ];
      }

      // All PIDs/DOIs are resolved
      const resultItems = [];
      for (const pid of linePidMap.values()) {
        const citObj = pidCitationMap.get(pid);
        if (citObj) {
          resultItems.push(citObj);
        }
      }
      for (const doi of lineDoiMap.values()) {
        const citObj = doiCitationMap.get(doi);
        if (citObj) {
          resultItems.push(citObj);
        }
      }
      return resultItems;
    },

    /**
     * Processes the entire text line-by-line in parallel.
     */
    async resolvedCitations(text) {
      if (!text){
        // return '';
        return;
      }

      // You may decide to keep empty lines or not
      const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      // optional, if you don't want empty lines

      this.loading = true;
      try {
        const linePromises = lines.map((line) =>
          this.processLine(line, this.resolveBaseUrl, this.resolveBaseDOIUrl),
        );
        const arrayOfArrays = await Promise.all(linePromises);
        const finalItems = arrayOfArrays.flat();
        this.dataRelatedPublications = finalItems;
      } catch (error) {
        console.error('Error in resolvedCitations:', error);
        // fallback
        this.dataRelatedPublications = lines.map((l) => ({
          title: 'Plain Text',
          citation: l,
          pid: null,
          doi: null,
          abstract: null,
        }));
      } finally {
        this.loading = false;
      }
    },

    /**
     * @param {null|Map<string, string>} pidMap
     */
    async resolvePIDs(pidMap) {
      // ...
    },

    /**
     * @param {null|Map<string, string>} doiMap
     */
    async resolveDOIs(doiMap) {
      // ...
    },

    clearPreview() {
      this.doiPublications = null;
      this.pidPublications = null;
      this.emptyCitation = null;
    },

    /**
     * Add a new plain text line to dataRelatedPublications (manually),
     * so that we don't lose existing lines.
     */
    addPlainTextLine(citationText) {
      if (!citationText || citationText.trim().length === 0) {
        return;
      }
      this.dataRelatedPublications.push({
        title: 'Plain Text',
        pid: null,
        doi: null,
        citation: citationText,
        abstract: null,
      });
      // Then update the overall text
      const newRelatedText = this.recreateRelatedPublicationText();
      this.$emit('updateText', newRelatedText);
    },
  },
  watch: {
    text(newVal) {
      // If text changes from outside, re-run the entire logic
      this.resolvedCitations(newVal);
    },

    /**
     * When updatedCitation changes, we either:
     * - add a new line (if updatedCitationIndex is undefined),
     * - update an existing line (if updatedCitationIndex is set).
     */
    updatedCitation(newVal) {
      if (!newVal) {
        return;
      }
      if (this.updatedCitationIndex === undefined) {
        // We add a brand new line of plain text
        this.addPlainTextLine(newVal);
      } else {
        // We update the line at [updatedCitationIndex]
        if (
          this.dataRelatedPublications &&
          this.dataRelatedPublications[this.updatedCitationIndex]
        ) {
          const item = this.dataRelatedPublications[this.updatedCitationIndex];
          // If it's PID-based, you might want a different approach,
          // but let's assume we just replace the citation
          item.citation = newVal;
        }
        // Recreate the text
        const newRelatedText = this.recreateRelatedPublicationText();
        this.$emit('updateText', newRelatedText);
      }
    },
  },
  data: () => ({
    mdiPencil,
    mdiMinusCircleOutline,
    mdiChevronDown,
    METADATA_PUBLICATIONS_TITLE,
    dataRelatedPublications: [],
    isResolving: false,
    isDoiResolving: false,
    resolveError: null,
    resolveDoiError: null,
    pidPublications: null,
    doiPublications: null,
    emptyCitation: null,
    loading: false,
    showFullText: false,
  }),
};
</script>

<style scoped>
.relatedPubList .readableText ul > * + * {
  padding: 5px 0;
}
.heightAndScroll {
  max-height: 500px;
  overflow-y: auto !important;
  overflow-x: hidden;
  scrollbar-width: thin;
}
</style>
