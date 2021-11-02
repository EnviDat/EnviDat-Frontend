<template>
  <v-container
    class="pa-0 fill-height"
    fluid
    id="MetadataEditPage"
    tag="article"
  >
    <NavigationStepper
      :steps="metadataCreationSteps"
      :initialStepTitle="metadataCreationSteps[0].title"
      stepColor="success"
    />
  </v-container>
</template>

<script>
/**
 * The MetadataEditPage shows a workflow to create and Edit
 * metadata and data & resources
 *
 * @summary metadata detail page
 * @author Dominik Haas-Artho & Sam Woodcock
 *
 * Created at     : 2021-06-29 13:49:30
 * Last modified  : 2021-10-26 13:06:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  CANCEL_EDITING_AUTHOR,
  CANCEL_EDITING_RESOURCE,
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  SAVE_EDITING_AUTHOR,
  SAVE_EDITING_RESOURCE,
  SELECT_EDITING_AUTHOR,
  SELECT_EDITING_RESOURCE,
} from '@/factories/eventBus';

import {
  createBody,
  createHeader,
  createLocation,
  createPublications,
  createResources,
  extractDataInfoDates,
} from '@/factories/metaDataFactory';

import { metadataCreationSteps } from '@/factories/userEditingFactory';

import { mapGetters, mapState } from 'vuex';

import {
  METADATA_CANCEL_AUTHOR_EDITING,
  METADATA_CANCEL_RESOURCE_EDITING,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SAVE_RESOURCE,
  METADATA_EDITING_SELECT_AUTHOR,
  METADATA_EDITING_SELECT_RESOURCE,
  UPDATE_METADATA_EDITING,
  USER_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

import { METADATAEDIT_PAGENAME } from '@/router/routeConsts';
import { SET_APP_BACKGROUND, SET_CURRENT_PAGE, } from '@/store/mainMutationsConsts';

import NavigationStepper from '@/components/Navigation/NavigationStepper';

import {
  LOAD_METADATA_CONTENT_BY_ID,
  METADATA_NAMESPACE,
  METADATA_UPDATE_AN_EXISTING_AUTHOR,
} from '@/store/metadataMutationsConsts';

export default {
  name: 'MetadataEditPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATAEDIT_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  created() {
    eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    eventBus.$on(SAVE_EDITING_RESOURCE, this.saveResource);
    eventBus.$on(CANCEL_EDITING_RESOURCE, this.cancelEditingResource);
    eventBus.$on(SELECT_EDITING_RESOURCE, this.selectResource);
    eventBus.$on(SAVE_EDITING_AUTHOR, this.saveAuthor);
    eventBus.$on(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.$on(SELECT_EDITING_AUTHOR, this.selectAuthor);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    eventBus.$off(SAVE_EDITING_RESOURCE, this.saveResource);
    eventBus.$off(CANCEL_EDITING_RESOURCE, this.cancelEditingResource);
    eventBus.$off(SELECT_EDITING_RESOURCE, this.selectResource);
    eventBus.$off(SAVE_EDITING_AUTHOR, this.saveAuthor);
    eventBus.$off(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.$off(SELECT_EDITING_AUTHOR, this.selectAuthor);
  },
  mounted() {
    if (this.metadataId) {
      this.initMetadataUsingId(this.metadataId);
    }

    // reset the scrolling to the top
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapState(USER_NAMESPACE, ['metadataInEditing']),
    ...mapGetters(USER_NAMESPACE, ['resources', 'authors']),
    ...mapGetters(METADATA_NAMESPACE, [
      'currentMetadataContent',
      'authorsMap',
      'existingAuthors',
      'existingKeywords',
    ]),
    /**
     * @returns {String} the metadataId from the route
     */
    metadataId() {
      return this.$route.params.metadataid;
    },
  },
  methods: {
    async initMetadataUsingId() {
      await this.$store.dispatch(
        `${METADATA_NAMESPACE}/${LOAD_METADATA_CONTENT_BY_ID}`,
        this.metadataId
      );
      this.populateEditingComponents(this.currentMetadataContent);
    },
    selectResource(id) {
      this.$store.commit(
        `${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`,
        id
      );
    },
    selectAuthor(id) {
      this.$store.commit(
        `${USER_NAMESPACE}/${METADATA_EDITING_SELECT_AUTHOR}`,
        id
      );
    },
    cancelEditingResource() {
      this.$store.commit(
        `${USER_NAMESPACE}/${METADATA_CANCEL_RESOURCE_EDITING}`
      );
    },
    cancelEditingAuthor() {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_CANCEL_AUTHOR_EDITING}`);
    },
    saveResource(newRes) {
      this.$store.dispatch(
        `${USER_NAMESPACE}/${METADATA_EDITING_SAVE_RESOURCE}`,
        newRes
      );
    },
    // eslint-disable-next-line no-unused-vars
    saveAuthor(newAuthor) {
      this.$store.dispatch(
        `${USER_NAMESPACE}/${METADATA_EDITING_SAVE_AUTHOR}`,
        newAuthor
      );
    },
    editComponentsChanged(updateObj) {
      // console.log(`got update on ${JSON.stringify(updateObj.object)} with data ${JSON.stringify(updateObj.data)}`);

      this.$store.commit(
        `${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`,
        updateObj
      );

      this.$nextTick(() => {
        this.enhanceKeywordsStep(updateObj.object);
        this.enhanceMetadataHeaderStep(updateObj.object);

        if (updateObj.object === EDITMETADATA_AUTHOR) {
          this.updateExistingAuthors(updateObj);
        }
      });
    },
    getGenericPropsForStep(key) {
      return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](
        key
      );
    },
    updateExistingAuthors(updateObj) {
      this.$store.commit(
        `${METADATA_NAMESPACE}/${METADATA_UPDATE_AN_EXISTING_AUTHOR}`,
        updateObj.data
      );
    },
    enhanceKeywordsStep(updatedKey) {
      if (
        updatedKey === EDITMETADATA_MAIN_HEADER ||
        updatedKey === EDITMETADATA_MAIN_DESCRIPTION
      ) {
        const keywordProps = this.getGenericPropsForStep(EDITMETADATA_KEYWORDS);
        const headerProps = this.getGenericPropsForStep(
          EDITMETADATA_MAIN_HEADER
        );
        const descProps = this.getGenericPropsForStep(
          EDITMETADATA_MAIN_DESCRIPTION
        );

        const newKeywordProps = {
          ...keywordProps,
          metadataCardTitle: headerProps.metadataTitle,
          metadataCardSubtitle: descProps.description,
        };

        this.$store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`, {
          object: EDITMETADATA_KEYWORDS,
          data: newKeywordProps,
        });
      }
    },
    enhanceMetadataHeaderStep(updatedKey) {
      if (
        updatedKey === EDITMETADATA_KEYWORDS ||
        updatedKey === EDITMETADATA_AUTHOR_LIST
      ) {
        const keywordProps = this.getGenericPropsForStep(EDITMETADATA_KEYWORDS);
        const headerProps = this.getGenericPropsForStep(
          EDITMETADATA_MAIN_HEADER
        );
        const authorProps = this.getGenericPropsForStep(
          EDITMETADATA_AUTHOR_LIST
        );

        const newHeaderProps = {
          ...headerProps,
          keywords: keywordProps.keywords,
          authors: authorProps.authors,
        };

        this.$store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`, {
          object: EDITMETADATA_MAIN_HEADER,
          data: newHeaderProps,
        });
      }
    },
    emitEditObjUpdateEvent(eventName, dataObj) {
      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: eventName,
        data: dataObj,
      });
    },
    populateEditingComponents(metadataRecord) {
      // ** Populate the editing form with existing metadata **

      // Stepper 1: Header, Description, Keywords, Authors
      const headerFull = createHeader(
        metadataRecord,
        this.$vuetify.breakpoint.smAndDown
      );
      const splitName = headerFull.contactName.split(' ');
      // headerFull.fullName = headerFull.contactName;
      const basicInfo = {
        metadataTitle: headerFull.metadataTitle,
        contactAuthor: {
          contactEmail: headerFull.contactEmail,
          contactGivenName: splitName[0],
          contactSurname: splitName[1],
        },
      };
      const descriptionFull = createBody(
        metadataRecord,
        this.$vuetify.breakpoint.smAndDown
      );
      this.emitEditObjUpdateEvent('EDITMETADATA_MAIN_HEADER', basicInfo);
      this.emitEditObjUpdateEvent('EDITMETADATA_MAIN_DESCRIPTION', {
        description: descriptionFull.text,
      });
      this.emitEditObjUpdateEvent('EDITMETADATA_KEYWORDS', {
        keywords: headerFull.tags,
      });
      // this.emitEditObjUpdateEvent("EDITMETADATA_AUTHOR_LIST", {
      //   authors: headerFull.authors,
      // });

      // Stepper 2: Data Resources, Info, Location
      const resourcesFull = createResources(metadataRecord);
      const metadataDates = extractDataInfoDates(metadataRecord);
      const dataInfo = {
        collectionDateStart: metadataDates.collection?.dateStart,
        collectionDateEnd: metadataDates.collection?.dateEnd,
        creationDateStart: metadataDates.creation?.dateStart,
        creationDateEnd: metadataDates.creation?.dateEnd,
        dataLicense: metadataRecord.license_title,
      };
      // collection date / year not in metadata - where stored?
      const location = createLocation(metadataRecord);
      this.emitEditObjUpdateEvent(
        'EDITMETADATA_DATA_RESOURCES',
        resourcesFull.resources
      );
      this.emitEditObjUpdateEvent('EDITMETADATA_DATA_INFO', dataInfo);
      this.emitEditObjUpdateEvent('EDITMETADATA_DATA_GEO', {
        location,
      });

      // Stepper 3: Related Info, Custom Fields
      const relatedPublications = createPublications(metadataRecord);
      // To extract publication IDs from text use:
      // this.$store.dispatch(`${METADATA_NAMESPACE}/${EXTRACT_IDS_FROM_TEXT}`, {
      //   text: this.publications?.text,
      //   idDelimiter: this.publicationsConfig?.idDelimiter,
      //   idPrefix: this.publicationsConfig?.idPrefix,
      // });
      this.emitEditObjUpdateEvent('EDITMETADATA_RELATED_PUBLICATIONS', {
        relatedPublicationsText: relatedPublications.text,
      });
      this.emitEditObjUpdateEvent('EDITMETADATA_CUSTOMFIELDS', {
        customFields: metadataRecord.extras,
      });

      // Stepper 4: Publication Info, Organization
      // const publicationInfoFull = createPublishingInfo(metadataRecord);
      // const funding = createFunding(metadataRecord);
      // const publicationInfo = {
      //   publicationState: publicationInfoFull.publication_state,
      //   doi: publicationInfoFull.doi,
      //   publicationYear: publicationInfoFull.publicationYear,
      //   publisher: publicationInfoFull.publisher,
      //   funders: funding,
      // };
      // // // Failing in EditPublicationInfo?
      // // // "Cannot read property 'institution' of undefined"
      // this.emitEditObjUpdateEvent(
      //   "EDITMETADATA_PUBLICATION_INFO",
      //   publicationInfo
      // );
      // this.emitEditObjUpdateEvent("EDITMETADATA_ORGANIZATION",
      //   {organization: metadataRecord.organization.name}
      // );
    },
  },
  components: {
    NavigationStepper,
  },
  data: () => ({
    metadataCreationSteps,
  }),
};
</script>

<style>
</style>
