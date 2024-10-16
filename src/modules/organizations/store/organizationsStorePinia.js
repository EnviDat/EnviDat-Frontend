import { defineStore } from 'pinia';


import axios from 'axios';


import { urlRewrite } from '@/factories/apiFactory';
import {
  extractBodyIntoUrl,
  getSOLRStringForElements,
} from '@/factories/stringFactory';


import { enhanceTagsOrganizationDatasetFromAllDatasets } from '@/factories/keywordsFactory';
import { enhanceMetadataFromCategories } from '@/modules/user/store/mutationFactory';
import { isUserGroupAdmin } from '@/factories/userEditingValidations';
import { enhanceElementsWithStrategyEvents, SELECT_EDITING_DATASET_PROPERTY } from '@/factories/strategyFactory';





// CONST
const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
const API_ROOT = import.meta.env.VITE_API_ROOT;

const GET_ORGANIZATIONS_URL = import.meta.env?.DEV && useTestdata ? './testdata/organization_list.json' : 'organization_list'
const GET_ORGANIZATION_URL = import.meta.env?.DEV && useTestdata ? './testdata/organization_show.json' : 'organization_show'

const ACTION_USER_ORGANIZATION_IDS = import.meta.env?.DEV && useTestdata ? './testdata/organization_list_for_user.json' : 'organization_list_for_user'
const ACTION_USER_GET_ORGANIZATIONS_SEARCH = import.meta.env?.DEV && useTestdata ? './testdata/organization_search.json' : 'package_search'


export const useOrganizationsStore = defineStore({
  id: 'organizations',
  state: () => ({
    loading: false,
    organizationIds: [],
    organizations: [],
    error: null,
    organizationsPageBackRoute: null,
    userOrganizationLoading: false,
    userOrganizationIds: [],
    userOrganizations: [],
    userOrganizationError: null,
    organizationsDatasetsLimit: 10,
    userOrgaDatasetTotal: 0,
    userOrgaDatasetOffset: 0,
  }),
  actions: {
    enhanceOrganizationsWithDatasets(store, datasets) {
        // got the store from the dashboard page function
        const state = store.state;
        const userOrganizations = this.userOrganizations;
        const userOrganizationIds = this.userOrganizationIds;
        const userId = state.userSignIn?.user?.id || null;
        const metadataContents = state.metadata?.metadatasContent || {};

        // create a new array here to "override" the this.userOrganizations via $set() so the
        // reactivity will trigger
        const userOrgas = [];

        datasets = enhanceTagsOrganizationDatasetFromAllDatasets(datasets, metadataContents);
        datasets = enhanceMetadataFromCategories(store, datasets);

        for (let i = 0; i < userOrganizationIds.length; i++) {
          const orgaId = userOrganizationIds[i];
          const orga = userOrganizations.filter((o) => o.id === orgaId)[0];
          let orgaDatasets = datasets.filter((d) => d.owner_org === orgaId);

          if (orgaDatasets.length > 0) {
            if (isUserGroupAdmin(userId, orga)) {
              orgaDatasets = enhanceElementsWithStrategyEvents(orgaDatasets, SELECT_EDITING_DATASET_PROPERTY);
            }

            orga.packages = orgaDatasets;
          }

          userOrgas.push(orga);
        }

        return userOrgas;
      },
    getOrganizationRequestArray(ids, body = {}) {
        const actionUrl = GET_ORGANIZATION_URL;

        const requests = [];
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];

            let url = extractBodyIntoUrl(actionUrl, {
            id,
            ...body,
            });

            url = urlRewrite(url, API_BASE, API_ROOT);

            if (useTestdata) {
            // ignore the parameters for testdata, because it's directly a file
            url = urlRewrite(actionUrl, API_BASE, API_ROOT);
            }

            requests.push(axios.get(url));
        }

        return requests;
    },
    async GET_ALL_ORGANIZATIONS_IDS () {
        this.organizationIds = [];

        const actionUrl = GET_ORGANIZATIONS_URL;
        let url = extractBodyIntoUrl(actionUrl, { limit: 1000 });
        url = urlRewrite(url, API_BASE, API_ROOT);

        await axios.get(url)
            .then(response => {
                this.organizationIds = response.data.result
            })
            .catch(reason => {
                this.error = reason
            });
    },
    async GET_ALL_ORGANIZATIONS (ids) {
        this.organizations = [];


        const requests = this.getOrganizationRequestArray(ids, {
          include_datasets: true,
        });

        await Promise.all(requests)
          .then((responses) => {
            for (let i = 0; i < responses.length; i++) {
              const response = responses[i];
              this.organizations.push(response.data.result)
            }
          })
          .catch((error) => {
            this.error = error
          });

      },



      async GET_ORGANIZATIONS () {

        // organization_list has a limitation of returning 25 when using the all_fields=true,
        // even that the CKAN docu says otherwise, it doesn't work
        // therefor we need to get all ids first and them each organization with one call

        await this.GET_ALL_ORGANIZATIONS_IDS;


        const ids = this.organizations.organizationIds;

        // always call the USER_GET_ORGANIZATIONS action because it resolves the store & state also when userOrganizationIds is empty
        await this.GET_ALL_ORGANIZATIONS(ids);

        if (this.organizations.error) {
          this.userOrganizationLoading = false
          this.userOrganizationError = this.organizations.error;
        } else {
          this.loading = false;
        }

      },

      async USER_GET_ORGANIZATION_IDS(userId) {
        this.userOrganizationLoading = true;
        this.userOrganizationIds = [];
        this.error = null;

        const actionUrl = ACTION_USER_ORGANIZATION_IDS;
        let url = extractBodyIntoUrl(actionUrl, { id: userId });
        url = urlRewrite(url, API_BASE, API_ROOT);

        if (useTestdata) {
          // ignore the parameters for testdata, because it's directly a file
          url = urlRewrite(actionUrl, API_BASE, API_ROOT);
        }

        await axios.get(url)
          .then((response) => {
            const orgaIds = [];
            const payload = response.data.result

            if (payload?.length > 0 && payload instanceof Array) {
              for (let i = 0; i < payload.length; i++) {
                const orga = payload[i];
                orgaIds.push(orga.id);
              }
            }
            this.userOrganizationIds = orgaIds;
            this.userOrganizations = payload;
            this.userOrganizationLoading = false;
          })
          .catch((error) => {
            this.userOrganizationLoading = false;
            this.error = error;
          });
      },

        resetOrganization() {
            this.userOrganizationLoading = false;
            this.userOrganizations = [];
            this.userOrganizationError = null;
            this.userOrgaDatasetTotal = 0;
            this.userOrgaDatasetOffset = 0;
        },


      async USER_GET_ORGANIZATIONS(store, ids) {
        this.userOrganizationLoading = true;
        this.userOrganizationError = null;

        if (!ids || ids.length <= 0) {
            this.resetOrganization()
            return;
        }

        // don't use this.this.organizations.organizations to filter the userOrganizations
        // always call the backend, because unpublished datasets won't be part of the orgaizations list
        // which was loaded from a "public viewpoint"

        const requests = this.getOrganizationRequestArray(ids, {
          include_datasets: true,
          include_tags: true,
        });

        await Promise.all(requests)
          .then((responses) => {
            for (let i = 0; i < responses.length; i++) {
              const response = responses[i];
              const payload = response.data.result
              const datasets = payload.packages;
              const userOrgas = this.enhanceOrganizationsWithDatasets(store, datasets);

              // use this._vm.$set() to make sure computed properties are recalulated
              this.userOrganizations = userOrgas;
              this.userOrganizationLoading = false;
            }
          })
          .catch((error) => {
            this.userOrganizationLoading = false;
            this.userOrganizationError = error;
          });
      },


      async USER_GET_ORGANIZATIONS_SEARCH(ids) {
        this.userOrganizationLoading = true;
        this.userOrganizationError = null;

        if (!ids || ids.length <= 0) {
            this.userOrganizationLoading = false;
            this.userOrganizations = [];
            this.userOrganizationError = null;
            this.userOrgaDatasetTotal = 0;
            this.userOrgaDatasetOffset = 0;
          return;
        }

        const actionUrl = ACTION_USER_GET_ORGANIZATIONS_SEARCH;
        const rows = this.organizations.organizationsDatasetsLimit;

        const idQuery = getSOLRStringForElements('owner_org', ids);

        let url = extractBodyIntoUrl(actionUrl, {
          q: idQuery,
          include_private: true,
          include_drafts: true,
          rows,
        });

        url = urlRewrite(url, API_BASE, API_ROOT);

        await axios.get(url)
          .then((response) => {
            this.userOrganizationLoading = false;

            const datasets = response.data.result.results;
            const userOrgas = this.enhanceOrganizationsWithDatasets(this, datasets);

            this.userOrganizations = userOrgas;
          })
          .catch((error) => {
            this.userOrganizationLoading = false;
            this.userOrganizationError = error;
          });

      },


      async USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE( ids) {
        this.userOrganizationLoading = true;
        this.userOrganizationError = null;

        const actionUrl = ACTION_USER_GET_ORGANIZATIONS_SEARCH;
        const rows = this.organizations.organizationsDatasetsLimit;
        const preOffset = this.organizations.userOrgaDatasetOffset;

        const idQuery = getSOLRStringForElements('owner_org', ids);

        let url = extractBodyIntoUrl(actionUrl, {
          q: idQuery,
          include_private: true,
          include_drafts: true,
          rows,
          start: preOffset,
        });

        url = urlRewrite(url, API_BASE, API_ROOT);

        await axios.get(url)
          .then((response) => {
            this.organizationSearchRecursive(response.data.result)
          })
          .catch((error) => {
            this.userOrganizationLoading = false;
            this.userOrganizationError = error;
          });

        if (this.organizations.userOrganizationError) {
          return;
        }

        const afterOffset = this.organizations.userOrgaDatasetOffset;
        const totalAvailable = this.organizations.userOrgaDatasetTotal;

        if (afterOffset < totalAvailable) {
          this.USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE(ids);
        } else {
            this.userOrganizationLoading = false;
        }
      },

      organizationSearchRecursive(payload) {
        this.userOrgaDatasetTotal = payload.count;

        const datasets = payload.results;
        const datasetReturned = datasets?.length || 0;

        this.organizationsSuccess(datasets)


        if (datasetReturned !== 0) {
          this.userOrgaDatasetOffset =+ this.userOrgaDatasetOffset + datasetReturned;
        } else {
          this.userOrgaDatasetOffset = 0;
        }
      },

      organizationsSuccess(payload) {
            this.userOrganizationLoading = false;

            const datasets = payload;
            const userOrgas = this.enhanceOrganizationsWithDatasets(this, datasets);

            // use this._vm.$set() to make sure computed properties are recalulated
            this.userOrganizations = userOrgas;
      },
  },
});
