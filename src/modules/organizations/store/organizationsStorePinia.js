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

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT;
}

const GET_ORGANIZATIONS_URL = useTestdata ? './testdata/organization_list.json' : 'organization_list';
const GET_ORGANIZATION_URL = useTestdata ? './testdata/organization_show.json' : 'organization_show';
const ACTION_USER_ORGANIZATION_IDS = useTestdata ? '/testdata/organization_list_for_user.json' : 'organization_list_for_user';
const ACTION_USER_GET_ORGANIZATIONS_SEARCH = useTestdata ? './testdata/organization_search.json' : 'package_search';


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
  getters: {
    hasOrganizations: (state) => state.organizations.length > 0,
    hasUserOrganizations: (state) => state.userOrganizations.length > 0,
  },
  actions: {
    async fetchOrganizations(url, params = {}) {
      try {
        const requestUrl = urlRewrite(extractBodyIntoUrl(url, params), API_BASE, API_ROOT);
        const response = await axios.get(requestUrl);
        return response.data.result;
      } catch (error) {
        this.error = error;
        throw error;
      }
    },

    async getAllOrgIds() {
      this.organizationIds = [];
      try {
        this.organizationIds = await this.fetchOrganizations(GET_ORGANIZATIONS_URL, { limit: 1000 });
      } catch (error) {
        this.error = error;
      }
    },

    async getAllOrg(ids) {
      this.organizations = [];
      try {
        const requests = this.getOrganizationRequestArray(ids, { include_datasets: true });
        const responses = await Promise.all(requests);
        this.organizations = responses.map(response => response.data.result);
      } catch (error) {
        this.error = error;
      }
    },

    async getOrg() {
      await this.getAllOrgIds();
      if (this.organizationIds.length > 0) {
        await this.getAllOrg(this.organizationIds);
      }
      this.loading = !this.error;
    },

    async UserGetOrgIds(userId) {
      this.setLoadingStatus(true);
      this.userOrganizationIds = [];
      try {
        const payload = await this.fetchOrganizations(ACTION_USER_ORGANIZATION_IDS, { id: userId });
        this.userOrganizationIds = payload.map(orga => orga.id);
        this.userOrganizations = payload;
      } catch (error) {
        this.userOrganizationError = error;
      } finally {
        this.setLoadingStatus(false);
      }
    },

    async UserGetOrg(store, ids) {
      this.setLoadingStatus(true);
      if (!ids || ids.length <= 0) {
        this.resetOrganization();
        return;
      }
      try {
        const requests = this.getOrganizationRequestArray(ids, {
          include_datasets: true,
          include_tags: true,
        });
        const responses = await Promise.all(requests);
        const datasets = responses.flatMap(response => response.data.result.packages);
        this.userOrganizations = this.enhanceOrganizationsWithDatasets(store, datasets);
      } catch (error) {
        this.userOrganizationError = error;
      } finally {
        this.setLoadingStatus(false);
      }
    },

    async UserGetOrgSearch(ids) {
      this.setLoadingStatus(true);
      if (!ids || ids.length <= 0) {
        this.resetOrganization();
        return;
      }
      try {
        const url = ACTION_USER_GET_ORGANIZATIONS_SEARCH;
        const idQuery = getSOLRStringForElements('owner_org', ids);
        const datasets = await this.fetchOrganizations(url, {
          q: idQuery,
          include_private: true,
          include_drafts: true,
          rows: this.organizationsDatasetsLimit,
        });
        this.userOrganizations = this.enhanceOrganizationsWithDatasets(this, datasets);
      } catch (error) {
        this.userOrganizationError = error;
      } finally {
        this.setLoadingStatus(false);
      }
    },

    resetOrganization() {
      this.setLoadingStatus(false);
      this.userOrganizations = [];
      this.userOrganizationError = null;
      this.userOrgaDatasetTotal = 0;
      this.userOrgaDatasetOffset = 0;
    },

    getOrganizationRequestArray(ids, body = {}) {
      return ids.map(id => {
        let url = extractBodyIntoUrl(GET_ORGANIZATION_URL, { id, ...body });
        url = urlRewrite(url, API_BASE, API_ROOT);
        return axios.get(url);
      });
    },

    setLoadingStatus(value) {
      this.userOrganizationLoading = value
    },

    enhanceOrganizationsWithDatasets(store, datasets) {
      const metadataContents = store.state.metadata?.metadatasContent || {};
      datasets = enhanceTagsOrganizationDatasetFromAllDatasets(datasets, metadataContents);
      datasets = enhanceMetadataFromCategories(store, datasets);

      return this.userOrganizationIds.map(orgaId => {
        const orga = this.userOrganizations.find(o => o.id === orgaId);
        let orgaDatasets = datasets.filter(d => d.owner_org === orgaId);
        if (orgaDatasets.length > 0 && isUserGroupAdmin(store.state.userSignIn?.user?.id, orga)) {
          orgaDatasets = enhanceElementsWithStrategyEvents(orgaDatasets, SELECT_EDITING_DATASET_PROPERTY);
        }
        orga.packages = orgaDatasets;
        return orga;
      });
    },
  },
});
