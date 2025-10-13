import { getDatasetMap, loadDataset } from '../../pages/datasets';
import { useAsyncData, type AsyncData } from 'nuxt/app';
import type { DatasetDTO } from '@/../../src/types/dataTransferObjectsTypes';

export const getAuthorNameCitation = (author) => {

  const firstName = author.given_name || author.firstName || '';

  const splits = firstName.trim().split(' ');
  let firstnameInitials = '';

  splits.forEach((name) => {
    firstnameInitials += `${name.substring(0, 1)}. `;
  })

  const lastName = author.name || author.lastName || '';

  return `${lastName.trim()}, ${firstnameInitials.trim()}`;
}

export const getAuthorsCitationString = (dataset) => {
  if (!dataset) {
    return null;
  }

  let authorString = '';

  if (dataset.author !== undefined) {
    let { author } = dataset;

    if (typeof dataset.author === 'string') {
      author = JSON.parse(dataset.author);
    }

    const authors = author;

    for (let i = 0; i < (authors.length || 19); i++) {
      const element = authors[i];
      authorString += ` ${getAuthorNameCitation(element)},`;
    }

    // cut of the last ';'
    if (authorString.length > 1) {
      authorString = authorString.substring(0, authorString.length - 1);
    }

    if (authors.length > 19) {
      authorString += ' et al.';
    }

  }

  return authorString.trim();
}

export const createCitation = (dataset) => {
  if (!dataset) {
    return null;
  }

  const ckanDomain = process.env.VITE_API_ROOT;

  const authors = getAuthorsCitationString(dataset);
  const title = dataset.title;

  let { publication } = dataset;

  if (publication && typeof publication === 'string') {
    try {
      publication = JSON.parse(publication);
    } catch (e) {
      console.error(e);
    }
  }

  const publisher = publication?.publisher || '';
  const year =
    publication?.publication_year || publication?.publicationYear || '';
  const doi = dataset.doi || '';
  const doiUrl = `https://www.doi.org/${doi}`;

  let text = `${authors.trim()}`;
  text += ` (${year}).`;
  text += ` ${title}. `;
  text += ` <span style="font-style: italic;" >${publisher}.</span> `;
  text += ` <a href="${doiUrl}" target="_blank">${doiUrl}</a>. `;

  /*
    text += ` <a href="${ckanDomain}/#/metadata/${dataset.name}" target="_blank">Institutional Repository</a> `;
  */

  return {
    id: dataset.id,
    citationText: text,
    doi,
    doiUrl,
    citationXmlLink: `${ckanDomain}/converters-api/internal-dataset/convert/datacite?package-id=${dataset.name}`,
    citationIsoXmlLink: `${ckanDomain}/converters-api/internal-dataset/convert/iso?package-id=${dataset.name}`,
    citationGCMDXmlLink: `${ckanDomain}/converters-api/internal-dataset/convert/dif?package-id=${dataset.name}`,
    citationBibtexXmlLink: `${ckanDomain}/converters-api/internal-dataset/convert/bibtex?package-id=${dataset.name}`,
    citationRisXmlLink: `${ckanDomain}/converters-api/internal-dataset/convert/ris?package-id=${dataset.name}`,
  };
}



function cropString(str: string, maxLength: number, ending: string | undefined) {
  if (!str) { return '' }

  if (str.length > maxLength) {
    const shortStr = str.substring(0, maxLength);
    return ending ? shortStr + ending : shortStr;
  }

  return str;
}

export const getSeoSanitizedDataset = (dataset: DatasetDTO): Partial<DatasetDTO> => {
  if (!dataset) {
    return {
      title: '',
      notes: '',
    }
  }

  return {
    title: cropString(dataset.title, 50, '...'),
    notes: cropString(dataset.notes, 155, '...'),
  } as Partial<DatasetDTO>
}



export const loadCachedDatasetMap = async () : Promise<Map<string, DatasetDTO> | undefined> => {
  const datasetMap = getDatasetMap();
  if (datasetMap) {
    console.log('got cached dataset map', datasetMap.size)
    return datasetMap;
  }

  await loadDataset();
  return getDatasetMap();
}

