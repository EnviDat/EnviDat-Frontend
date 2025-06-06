import { describe, expect, bench } from 'vitest';

import {
  getBackendJSONForStep,
  getFrontendJSONForStep,
  convertJSON,
  getObjectInOtherCase,
  toCamelCase,
  populateEditingComponents,
} from '@/factories/mappingFactory';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_INFO_DATES,
  EDITMETADATA_DATA_LICENSE,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

import * as mappingTestData from '@/../public/testdata/mappingTestData.json';
import {
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
  METADATA_TITLE_PROPERTY,
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
} from '@/factories/metadataConsts';

describe('getFrontendJSON performance', () => {

  bench(EDITMETADATA_MAIN_HEADER, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const headerData = getFrontendJSONForStep(EDITMETADATA_MAIN_HEADER, snakeCaseJSON)

    expect(headerData[METADATA_TITLE_PROPERTY]).not.toBeNull();
    expect(headerData[METADATA_CONTACT_EMAIL]).not.toBeNull();
    expect(headerData[METADATA_CONTACT_FIRSTNAME]).not.toBeNull();
    expect(headerData[METADATA_CONTACT_LASTNAME]).not.toBeNull();
    expect(headerData.license).not.toBeNull();

    const maintainer = JSON.parse(mappingTestData.maintainer);

    expect(headerData[METADATA_TITLE_PROPERTY]).toBe(mappingTestData.title);
    expect(headerData[METADATA_CONTACT_EMAIL]).toBe(maintainer.email);
    expect(headerData[METADATA_CONTACT_FIRSTNAME]).toBe(maintainer.given_name);
    expect(headerData[METADATA_CONTACT_LASTNAME]).toBe(maintainer.name);
    expect(headerData.license).toBe(mappingTestData.license_title);

  });

  bench(EDITMETADATA_MAIN_DESCRIPTION, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const descData = getFrontendJSONForStep(EDITMETADATA_MAIN_DESCRIPTION, snakeCaseJSON)

    expect(descData.description).not.toBeNull();
    expect(descData.description).toBe(snakeCaseJSON.notes);

  });

  bench(EDITMETADATA_KEYWORDS, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const keywordsData = getFrontendJSONForStep(EDITMETADATA_KEYWORDS, snakeCaseJSON)

    expect(keywordsData.keywords).toBeInstanceOf(Array);

    for (let i = 0; i < keywordsData.keywords.length; i++) {
      const tag = keywordsData.keywords[i];
      const backendTag = snakeCaseJSON.tags[i];

      expect(tag.id).toBe(backendTag.id);
      expect(tag.display_name).toBe(backendTag.displayName);
      expect(tag.name).toBe(backendTag.name);
      expect(tag.state).toBe(backendTag.state);
      expect(tag.vocabulary_id).toBe(backendTag.vocabularyId);
    }

  });

  bench(EDITMETADATA_AUTHOR_LIST, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const authorsData = getFrontendJSONForStep(EDITMETADATA_AUTHOR_LIST, snakeCaseJSON)

    expect(authorsData.authors).toBeInstanceOf(Array);

    for (let i = 0; i < authorsData.authors.length; i++) {
      const author = authorsData.authors[i];
      expect(author.firstName).not.toBeNull();
      expect(author.lastName).not.toBeNull();
      expect(author.fullName).not.toBeNull();

      expect(author.datasetCount > 0).toBeTruthy();
      expect(author.affiliation).not.toBeNull();
      expect(author.email).not.toBeNull();

      expect(typeof author.dataCredit === 'string' || author.dataCredit instanceof Array).toBeTruthy();
    }

  });

  bench(EDITMETADATA_DATA_RESOURCES, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const resourceData = getFrontendJSONForStep(EDITMETADATA_DATA_RESOURCES, snakeCaseJSON)

    const array = resourceData.resources;
    expect(array).toBeInstanceOf(Array);

    for (let i = 0; i < array.length; i++) {
      const res = array[i];
      const backendRes = snakeCaseJSON.resources[i];

      expect(res.id).toBe(backendRes.id);
      expect(res.packageId).toBe(backendRes.package_id);
      expect(res.name).toBe(backendRes.name);
      expect(res.size).toBe(backendRes.size);
      expect(res.lastModified).toBe(backendRes.last_modified);
      expect(res.created).toBe(backendRes.created);
      expect(res.url).toBe(backendRes.url);
      expect(res.format).toBe(backendRes.format);
    }

  });

  bench(EDITMETADATA_DATA_INFO, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const dataInfoData = getFrontendJSONForStep(EDITMETADATA_DATA_INFO, snakeCaseJSON)

    const array = dataInfoData.dates;
    expect(array).toBeInstanceOf(Array);

    for (let i = 0; i < array.length; i++) {
      const backendDate = snakeCaseJSON.date[i];

      const mappedEntry = getFrontendJSONForStep(EDITMETADATA_DATA_INFO_DATES, backendDate);

      expect(mappedEntry[DATE_PROPERTY_DATE_TYPE]).toBe(backendDate.date_type);
      expect(mappedEntry[DATE_PROPERTY_START_DATE]).toBe(backendDate.date);
      expect(mappedEntry[DATE_PROPERTY_END_DATE]).toBe(backendDate.end_date);
    }

  });

  bench(EDITMETADATA_DATA_GEO, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const geoData = getFrontendJSONForStep(EDITMETADATA_DATA_GEO, snakeCaseJSON)

    expect(geoData.location.geoJSON.type).toBe(snakeCaseJSON.spatial.type);
    expect(geoData.location.geoJSON.coordinates).toStrictEqual(snakeCaseJSON.spatial.coordinates);

  });

  bench(EDITMETADATA_RELATED_PUBLICATIONS, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const relatedPubData = getFrontendJSONForStep(EDITMETADATA_RELATED_PUBLICATIONS, snakeCaseJSON)

    expect(relatedPubData.relatedPublicationsText).toBe(snakeCaseJSON.related_publications);

  });

  bench(EDITMETADATA_RELATED_DATASETS, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const relatedDatasetsData = getFrontendJSONForStep(EDITMETADATA_RELATED_DATASETS, snakeCaseJSON)

    expect(relatedDatasetsData.relatedDatasetsText).toBe(snakeCaseJSON.related_datasets);

  });

  bench(EDITMETADATA_CUSTOMFIELDS, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const customFieldsData = getFrontendJSONForStep(EDITMETADATA_CUSTOMFIELDS, snakeCaseJSON)

    const array = customFieldsData.customFields;
    expect(array).toBeInstanceOf(Array);

    for (let i = 0; i < array.length; i++) {
      const fields = array[i];
      const backendFields = snakeCaseJSON.extras[i];

      expect(fields.key).toBe(backendFields.key);
      expect(fields.value).toBe(backendFields.value);
    }

  });

  bench(EDITMETADATA_ORGANIZATION, () => {
    const backendOrganization = mappingTestData.organization;
    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const organizationData = getFrontendJSONForStep(EDITMETADATA_ORGANIZATION, snakeCaseJSON)

    const id = organizationData.organizationId;

//    const frontendOrganization = organizationData.organization;

    expect(id).toBe(backendOrganization.id);
/*
    expect(frontendOrganization.name).toBe(backendOrganization.name);
    expect(frontendOrganization.title).toBe(backendOrganization.title);
    expect(frontendOrganization.type).toBe(backendOrganization.type);
    expect(frontendOrganization.description).toBe(backendOrganization.description);

    expect(frontendOrganization.imageUrl).toBe(backendOrganization.image_url);
    expect(frontendOrganization.created).toBe(backendOrganization.created);
    expect(frontendOrganization.isOrganization).toBe(backendOrganization.is_organization);
    expect(frontendOrganization.approvalStatus).toBe(backendOrganization.approval_status);
    expect(frontendOrganization.state).toBe(backendOrganization.state);
*/
  });

  bench(EDITMETADATA_PUBLICATION_INFO, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const publicationData = getFrontendJSONForStep(EDITMETADATA_PUBLICATION_INFO, snakeCaseJSON)

    expect(publicationData.publicationState).toBe(mappingTestData.publication_state);
    expect(publicationData.doi).toBe(mappingTestData.doi);

    const publication = snakeCaseJSON.publication;

    expect(publicationData.publisher).toBe(publication.publisher);
    expect(publicationData.publicationYear).toBe(publication.publication_year);

  });

  bench(EDITMETADATA_FUNDING_INFO, () => {

    const snakeCaseJSON = convertJSON(mappingTestData, false);
    const fundingData = getFrontendJSONForStep(EDITMETADATA_FUNDING_INFO, snakeCaseJSON)

    const array = fundingData.funders;
    expect(array).toBeInstanceOf(Array);

    for (let i = 0; i < array.length; i++) {
      const funder = array[i];
      const backendFunder = snakeCaseJSON.funding[i];

      expect(funder.institution).toBe(backendFunder.institution);
      expect(funder.institutionUrl).toBe(backendFunder.institution_url);
      expect(funder.grantNumber).toBe(backendFunder.grant_number);
    }

  });

});

describe('getBackendJSON performance', () => {

  bench(EDITMETADATA_MAIN_HEADER, () => {

    const inputMaintainer = JSON.parse(mappingTestData.maintainer);

    const frontEndJSON = {
      [METADATA_TITLE_PROPERTY]: mappingTestData.title,
      [METADATA_CONTACT_EMAIL]: inputMaintainer.email,
      [METADATA_CONTACT_FIRSTNAME]: inputMaintainer.given_name,
      [METADATA_CONTACT_LASTNAME]: inputMaintainer.name,
      license: mappingTestData.license_title,
    }

    const headerData = getBackendJSONForStep(EDITMETADATA_MAIN_HEADER, frontEndJSON)

    expect(headerData.title).not.toBeNull();
    expect(headerData.maintainer).not.toBeNull();
    expect(headerData.license_title).not.toBeNull();

    expect(headerData.title).toBe(frontEndJSON[METADATA_TITLE_PROPERTY]);
    expect(headerData.maintainer.email).toBe(frontEndJSON[METADATA_CONTACT_EMAIL]);
    expect(headerData.maintainer.given_name).toBe(frontEndJSON[METADATA_CONTACT_FIRSTNAME]);
    expect(headerData.maintainer.name).toBe(frontEndJSON[METADATA_CONTACT_LASTNAME]);
    expect(headerData.license_title).toBe(frontEndJSON.license);

    const flatJSON = convertJSON(headerData, true);

    expect(flatJSON.title).toBe(frontEndJSON[METADATA_TITLE_PROPERTY]);

    expect(flatJSON.maintainer).not.toBeNull();
    expect(typeof flatJSON.maintainer === 'string').toBeTruthy()
    expect(flatJSON.maintainer.includes('given_name')).toBeTruthy()
    expect(flatJSON.maintainer.includes('name')).toBeTruthy()
    expect(flatJSON.maintainer.includes('email')).toBeTruthy()
    expect(flatJSON.maintainer.includes(frontEndJSON[METADATA_CONTACT_EMAIL])).toBeTruthy()
    expect(flatJSON.maintainer.includes(frontEndJSON[METADATA_CONTACT_FIRSTNAME])).toBeTruthy()
    expect(flatJSON.maintainer.includes(frontEndJSON[METADATA_CONTACT_LASTNAME])).toBeTruthy()

    expect(flatJSON.license_title).toBe(frontEndJSON.license);

  });

  bench(EDITMETADATA_MAIN_DESCRIPTION, () => {

    const frontendJSON = {
      description: mappingTestData.notes,
    }

    const descData = getBackendJSONForStep(EDITMETADATA_MAIN_DESCRIPTION, frontendJSON)

    expect(descData.notes).not.toBeNull();
    expect(descData.notes).toBe(frontendJSON.description);

  });

  bench(EDITMETADATA_KEYWORDS, () => {

    const frontendJSON = {
      keywords: mappingTestData.tags,
    }

    const frontendKeywords = getObjectInOtherCase(frontendJSON, toCamelCase);

    const backEndKeywords = getBackendJSONForStep(EDITMETADATA_KEYWORDS, frontendKeywords)

    expect(backEndKeywords.tags).toBeInstanceOf(Array);

    for (let i = 0; i < backEndKeywords.tags.length; i++) {
      const tag = backEndKeywords.tags[i];
      const frontendTag = frontendKeywords.keywords[i];

      expect(tag.id).toBe(frontendTag.id);
      expect(tag.display_name).toBe(frontendTag.displayName);
      expect(tag.name).toBe(frontendTag.name);
      expect(tag.state).toBe(frontendTag.state);
      expect(tag.vocabulary_id).toBe(frontendTag.vocabularyId);
    }

  });

  bench(EDITMETADATA_AUTHOR_LIST, () => {

    const authorArray = JSON.parse(mappingTestData.author);

    const frontendAuthors = getObjectInOtherCase({ authors: authorArray }, toCamelCase);

    const backEndAuthors = getBackendJSONForStep(EDITMETADATA_AUTHOR_LIST, frontendAuthors)

    expect(backEndAuthors.author).toBeInstanceOf(Array);

    for (let i = 0; i < backEndAuthors.author.length; i++) {
      const author = backEndAuthors.author[i];
      expect(author.first_name).not.toBeUndefined();
      expect(author.last_name).not.toBeUndefined();
      expect(author.full_name).toBeUndefined();

      expect(author.dataset_count > 0).toBeTruthy();
      expect(author.affiliation).not.toBeUndefined();
      expect(author.email).not.toBeUndefined();

      expect(typeof author.data_credit === 'string' || author.data_credit instanceof Array).toBeTruthy();
    }

  });

  bench(EDITMETADATA_DATA_RESOURCES, () => {

    const frontendJSON = {
      resources: mappingTestData.resources,
    }

    const frontendResources = getObjectInOtherCase(frontendJSON, toCamelCase);

    const resourceData = getBackendJSONForStep(EDITMETADATA_DATA_RESOURCES, frontendResources)

    const array = resourceData.resources;
    expect(array).toBeInstanceOf(Array);

    for (let i = 0; i < array.length; i++) {
      const res = array[i];
      const frontendRes = frontendResources.resources[i];

      expect(res.id).toBe(frontendRes.id);
      expect(res.package_id).toBe(frontendRes.packageId);
      expect(res.name).toBe(frontendRes.name);
      expect(res.size).toBe(frontendRes.size);
      expect(res.last_modified).toBe(frontendRes.lastModified);
      expect(res.created).toBe(frontendRes.created);
      expect(res.url).toBe(frontendRes.url);
      expect(res.format).toBe(frontendRes.format);
    }

  });

  bench(EDITMETADATA_DATA_INFO, () => {

    const dates = JSON.parse(mappingTestData.date);
    const frontendJSON = { dates };

    const frontendDates = [];
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      frontendDates.push({
        dateType: date.date_type,
        dateStart: date.date,
        dateEnd: date.end_date,
      })
    }

    const frontendDataInfo = getObjectInOtherCase(frontendJSON, toCamelCase);

    const dataInfoData = getBackendJSONForStep(EDITMETADATA_DATA_INFO, frontendDataInfo);

    const array = dataInfoData.date;
    expect(array).toBeInstanceOf(Array);

    for (let i = 0; i < array.length; i++) {
      const backendDate = array[i];

      const frontendDate = frontendDates[i];

      const mappedEntry = getBackendJSONForStep(EDITMETADATA_DATA_INFO_DATES, frontendDate);

      expect(backendDate.date).toBe(frontendDate.dateStart);
      expect(mappedEntry.date).toBe(frontendDate.dateStart);

      expect(backendDate.date_type).toBe(frontendDate.dateType);
      expect(mappedEntry.date_type).toBe(frontendDate.dateType);

      expect(backendDate.end_date).toBe(frontendDate.dateEnd);
      expect(mappedEntry.end_date).toBe(frontendDate.dateEnd);
    }


    const flatJSON = convertJSON(dataInfoData, true);

    expect(flatJSON.date).not.toBeNull();
    expect(typeof flatJSON.date === 'string').toBeTruthy()
    expect(flatJSON.date.includes('date')).toBeTruthy()
    expect(flatJSON.date.includes('date_type')).toBeTruthy()
    expect(flatJSON.date.includes('end_date')).toBeTruthy()
  });

  bench(EDITMETADATA_DATA_LICENSE, () => {

    const frontendJSON = {
      dataLicenseId: mappingTestData.license_id,
      dataLicenseTitle: mappingTestData.license_title,
      dataLicenseUrl: mappingTestData.license_url,
    };

    const frontendDataInfo = getObjectInOtherCase(frontendJSON, toCamelCase);
    const dataInfoData = getBackendJSONForStep(EDITMETADATA_DATA_LICENSE, frontendDataInfo);

    expect(dataInfoData.license_id).toBe(frontendDataInfo.dataLicenseId);
    expect(dataInfoData.license_title).toBe(frontendDataInfo.dataLicenseTitle);
    expect(dataInfoData.license_url).toBe(frontendDataInfo.dataLicenseUrl);

  });

  bench(EDITMETADATA_DATA_GEO, () => {

    const spatial = JSON.parse(mappingTestData.spatial);

    const frontendJSON = {
      location: {
        geoJSON: spatial,
      },
    }

    const frontendGeoInfo = getObjectInOtherCase(frontendJSON, toCamelCase);
    const geoData = getBackendJSONForStep(EDITMETADATA_DATA_GEO, frontendGeoInfo)

    expect(geoData.spatial.type).toBe(frontendJSON.location.geoJSON.type);
    expect(geoData.spatial.coordinates).toStrictEqual(frontendJSON.location.geoJSON.coordinates);

    const flatJSON = convertJSON(geoData, true);

    expect(flatJSON.spatial.includes('type')).toBeTruthy();
    expect(flatJSON.spatial.includes('coordinates')).toBeTruthy();
    expect(flatJSON.spatial.includes(frontendJSON.location.geoJSON.type)).toBeTruthy();

  });

  bench(EDITMETADATA_RELATED_PUBLICATIONS, () => {

    const frontendJSON = {
      relatedPublicationsText: mappingTestData.related_publications,
    }

    const backendData = getBackendJSONForStep(EDITMETADATA_RELATED_PUBLICATIONS, frontendJSON)

    expect(backendData.related_publications).not.toBeNull();
    expect(backendData.related_publications).toBe(frontendJSON.relatedPublicationsText);

  });

  bench(EDITMETADATA_RELATED_DATASETS, () => {

    const frontendJSON = {
      relatedDatasetsText: mappingTestData.related_datasets,
    }

    const backendData = getBackendJSONForStep(EDITMETADATA_RELATED_DATASETS, frontendJSON)

    expect(backendData.related_datasets).not.toBeNull();
    expect(backendData.related_datasets).toBe(frontendJSON.relatedDatasetsText);

  });

  bench(EDITMETADATA_CUSTOMFIELDS, () => {

    const frontendJSON = {
      customFields: mappingTestData.extras,
    }

    const frontendCustomFields = getObjectInOtherCase(frontendJSON, toCamelCase);

    const extrasData = getBackendJSONForStep(EDITMETADATA_CUSTOMFIELDS, frontendCustomFields)

    const array = extrasData.extras;
    expect(array).toBeInstanceOf(Array);

    for (let i = 0; i < array.length; i++) {
      const extra = array[i];
      const frontendExtra = frontendCustomFields.customFields[i];

      expect(extra.key).toBe(frontendExtra.key);
      expect(extra.value).toBe(frontendExtra.value);
    }

  });

  bench(EDITMETADATA_ORGANIZATION, () => {

    const frontendOrganizationInfo = getObjectInOtherCase({
      organizationId: mappingTestData.organization.id,
    }, toCamelCase);

    const organizationData = getBackendJSONForStep(EDITMETADATA_ORGANIZATION, frontendOrganizationInfo)

//    const backendOrganization = organizationData.organization;
//    const frontendOrganization = frontendOrganizationInfo.organization;

    expect(organizationData.organization.id).toBe(mappingTestData.organization.id);
/*
    expect(frontendOrganization.name).toBe(backendOrganization.name);
    expect(frontendOrganization.title).toBe(backendOrganization.title);
    expect(frontendOrganization.type).toBe(backendOrganization.type);
    expect(frontendOrganization.description).toBe(backendOrganization.description);

    expect(frontendOrganization.imageUrl).toBe(backendOrganization.image_url);
    expect(frontendOrganization.created).toBe(backendOrganization.created);
    expect(frontendOrganization.isOrganization).toBe(backendOrganization.is_organization);
    expect(frontendOrganization.approvalStatus).toBe(backendOrganization.approval_status);
    expect(frontendOrganization.state).toBe(backendOrganization.state);
*/
  });

  bench(EDITMETADATA_PUBLICATION_INFO, () => {

    const publication = JSON.parse(mappingTestData.publication);

    const frontendJSON = {
      publicationState: mappingTestData.publication_state,
      doi: mappingTestData.doi,
      publisher: publication.publisher,
      publicationYear: publication.publication_year,
    }

    const frontendPublicationInfo = getObjectInOtherCase(frontendJSON, toCamelCase);

    const publicationData = getBackendJSONForStep(EDITMETADATA_PUBLICATION_INFO, frontendPublicationInfo)

    expect(publicationData.publication_state).toBe(frontendJSON.publicationState);
    expect(publicationData.doi).toBe(frontendJSON.doi);

    expect(publicationData.publication.publisher).toBe(frontendJSON.publisher);
    expect(publicationData.publication.publication_year).toBe(frontendJSON.publicationYear);

    const flatJSON = convertJSON(publicationData, true);

    expect(flatJSON.publication.includes('publisher')).toBeTruthy();
    expect(flatJSON.publication.includes('publication_year')).toBeTruthy();

  });

  bench(EDITMETADATA_FUNDING_INFO, () => {

    const funding = JSON.parse(mappingTestData.funding);

    const frontendJSON = {
      funders: funding,
    }

    const frontendFundingInfo = getObjectInOtherCase(frontendJSON, toCamelCase);

    const fundingData = getBackendJSONForStep(EDITMETADATA_FUNDING_INFO, frontendFundingInfo)

    const array = fundingData.funding;
    expect(array).toBeInstanceOf(Array);

    for (let i = 0; i < array.length; i++) {
      const funder = array[i];
      const frontendFunder = frontendFundingInfo.funders[i];

      expect(funder.institution).toBe(frontendFunder.institution);
      expect(funder.institution_url).toBe(frontendFunder.institutionUrl);
      expect(funder.grant_number).toBe(frontendFunder.grantNumber);
    }

    const flatJSON = convertJSON(fundingData, true);

    expect(flatJSON.funding.includes('institution')).toBeTruthy();
    expect(flatJSON.funding.includes('institution_url')).toBeTruthy();
    expect(flatJSON.funding.includes('grant_number')).toBeTruthy();

  });

});

describe('populateEditingComponents performance', () => {

  const mockCommit = (mutationName, payload) => {
    // console.log(`Received mutation for ${payload.object} with data: ${JSON.stringify(payload.data)} and options: ${JSON.stringify(options)}`);

    const keys = Object.keys(payload.data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      expect(key.includes('_')).toBeFalsy();
    }
  }

  bench('with mock commit', () => {
    populateEditingComponents(mockCommit, mappingTestData);
  });

  bench('populateEditingComponents performance', () => {
    populateEditingComponents(mockCommit, mappingTestData);
  })
});
