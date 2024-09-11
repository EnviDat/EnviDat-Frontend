<template id="MetadataPublications">
      <v-card class="relatedPubList">
        <v-card-title class="metadata_title text-h6 pa-4">
          {{ METADATA_PUBLICATIONS_TITLE }}
        </v-card-title>

        <v-skeleton-loader
          v-if="loading || showPlaceholder"
          type="list-item-two-line"
        >
        </v-skeleton-loader>

          <v-card-text
            ref="text"
            class="pa-4 pt-0 heightAndScroll readableText"
            :style="
              `scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`
            "
          >
            <v-col v-for="(n, index) in dataSliced" :key="'n_' + index">

              <section :class="{ 'd-flex align-center': isPreview }">
                <BaseCitationView
                  :abstract="n.abstract"
                  :citation="setCitation(n)"
                  :doi="n.doi"
                  :doiUrl="n.doiUrl"
                  :citationColsCustom="10"
                />
                <!-- isPreview - show this button only if it is within the Edit Related Publications section -->
                <div v-if="isPreview">
                  <v-col class="shrink px-1 d-flex flex-column flex-md-row">
                    <BaseIconButton
                      v-if="isPlainText(n)"
                      material-icon-name="edit"
                      icon-color="yellow"
                      @clicked="sendEditItemData(n.citation, index)"
                    />
                    <BaseIconButton
                      material-icon-name="remove_circle_outline"
                      icon-color="red"
                      @clicked="sendRemoveItem(index)"
                    />
                  </v-col>
                </div>
              </section>
            </v-col>
          </v-card-text>

          <v-card-actions
            v-if="dataLength > 2 && !isPreview"
            class="ma-0 pa-2"
            :style="`position: absolute; bottom: 0px; right: ${rightPos()};`"
          >
            <base-icon-button
              material-icon-name="expand_more"
              :iconColor="showFullText ? 'primary' : 'accent'"
              :fillColor="
                showFullText ? '' : $vuetify.theme.themes.light.primary
              "
              :color="showFullText ? 'accent' : 'transparent'"
              :outlined="showFullText"
              :rotateOnClick="true"
              :rotateToggle="showFullText"
              :tooltipText="showFullText ? 'Collaspe text' : 'Show full text'"
              @clicked="readMore"
            />
          </v-card-actions>

      </v-card>

</template>

<script>


import { mapState } from 'vuex';

import BaseCitationView from '@/components/BaseElements/BaseCitationView.vue';

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
/*
    ExpandableTextLayout,
*/
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
      // this is only for testing & implementation via storybook
      type: Array,
      default: () => [],
    },
  },
  created() {
    eventBus.on(EDIT_RELATED_PUBLICATION_ACTION, this.getEditItemData);
  },
  beforeDestroy() {
    eventBus.off(EDIT_RELATED_PUBLICATION_ACTION, this.getEditItemData);
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

    publications() {
      return this.mixinMethods_getGenericProp('publications');
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
    resolvingStatusText() {
      if (this.resolveError) {
        return `Publication could not be resolved because: ${this.resolveError}`;
      }

      return '';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  mounted() {
    // get the text from props and prepare data for the component
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

/*
      // scroll to textAreaControlloer (link above test area), import for mobile version
      const textAreaControlloer = document.getElementById('textAreaController');
      if (textAreaControlloer) {
        textAreaControlloer.scrollIntoView({ behavior: 'smooth' });
      }
      eventBus.emit(EDIT_RELATED_PUBLICATION_SEND, {
        citationText: value,
        index,
      });
*/
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
      return this.$refs.text && this.$refs.text.clientHeight >= 500
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
        ? this.$vuetify.theme.themes.light.highlight
        : 'auto';
    },
    recreateRelatedPublicationText() {
      let newText = '';

      for (let i = 0; i < this.dataRelatedPublications.length; i++) {
        if (i !== 0) {
          newText += '\n';
        }

        const publicationObj = this.dataRelatedPublications[i];
        const id = publicationObj.pid || publicationObj.doi || null;

        if(id) {
          newText += id;
        } else {
          newText += publicationObj.citation;
        }
      }

      return newText;
    },
    updatePublicationList() {
      this.dataRelatedPublications = [
        ...(this.pidPublications || []),
        ...(this.doiPublications || []),
        ...(this.emptyCitation || []),
      ];
    },
    generateCitationFromSimpleText(arrayText) {
      this.emptyCitation = [];

      arrayText.forEach(citation => {
        if (citation !== 'null' && citation.trim() !== '') {
          const citationProp = {
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
    resolvedCitations(text) {
      const pidMapSize = this.extractedPIDMap?.size || 0;
      const doiMapSize = this.extractedDOIMap?.size || 0;

      if (pidMapSize > 0 && !this.isResolving && !this.resolveError) {
        this.isResolving = true;
        this.$nextTick(() => this.resolvePIDs(text, this.extractedPIDMap));
      }

      if (doiMapSize > 0 && !this.isDoiResolving && !this.resolveDoiError) {
        this.isDoiResolving = true;
        this.$nextTick(() => this.resolveDOIs(this.extractedDOIMap));
      }
      // check whether there are also parts within the text without PID or DOI that need to be displayed
      if (doiMapSize > 0 || pidMapSize > 0) {
        this.$nextTick(() =>
          this.generateCitationFromSimpleText(this.extractedNoPidDoi),
        );
      }

      if (!pidMapSize && !doiMapSize) {
        const stringToArray = text?.split('\n').map(line => line.trim());
        this.loading = false;
        if (this.text?.length > 0) {
          this.$nextTick(() =>
            this.generateCitationFromSimpleText(stringToArray),
          );
        } else {
          return '';
        }
      }

      return text;
    },
    /**
     *
     * @param text
     * @param {null|Map<string, string>} pidMap
     * @returns {Promise<void>}
     */

    async resolvePIDs(text, pidMap) {
      if (!text || !pidMap) {
        return;
      }
      this.resolveError = null;
      this.isResolving = true;
      this.pidPublications = null;
      this.loading = true;

      try {
        const citationMap = await resolvePidCitationObjectsViaDora(pidMap, this.resolveBaseUrl);

        this.pidPublications = [];
        citationMap.forEach(value => {
          this.pidPublications.push(value);
        });

        this.updatePublicationList();
      } catch (e) {
        this.resolveError = e;
        this.loading = false;
      } finally {
        this.isResolving = false;
        this.loading = false;
      }
    },
    async resolveDOIs(doiMap) {
      if (!doiMap) {
        return;
      }
      this.isDoiResolving = true;
      this.doiPublications = null;
      this.loading = true;

      try {
        const citationMap = await resolveDoiCitationObjectsViaDora(doiMap, this.resolveBaseDOIUrl);

        this.doiPublications = [];
        citationMap.forEach(value => {
          this.doiPublications.push(value);
        });

        this.updatePublicationList();
      } catch (e) {
        this.resolveDoiError = e;
        this.loading = false;
      } finally {
        this.isDoiResolving = false;
        this.loading = false;
      }
    },
  },
  watch: {
    text() {
      this.resolvedCitations(this.text);
      // this.replacedText = null;
    },
    updatedCitation() {

      if (this.updatedCitation) {

        if (this.updatedCitationIndex === undefined) {
          // case for a new entry of just plain text
          this.generateCitationFromSimpleText([
              ...this.extractedNoPidDoi,
              this.updatedCitation,
          ]);
        } else {
          // case for selected item for editing and now needs updating
          const citationObject = this.dataRelatedPublications[this.updatedCitationIndex];
          if (citationObject) {
            citationObject.citation = this.updatedCitation;
          }
        }

        const newRelatedText = this.recreateRelatedPublicationText();
        this.$emit('updateText', newRelatedText);
      }
    },
  },
  data: () => ({
    METADATA_PUBLICATIONS_TITLE,
    isResolving: false,
    isDoiResolving: false,
    resolveError: null,
    resolveDoiError: null,
    // replacedText: null,
    dataRelatedPublications: null,
    doiPublications: null,
    pidPublications: null,
    loading: true,
    showFullText: false,
    emptyCitation: null,
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
