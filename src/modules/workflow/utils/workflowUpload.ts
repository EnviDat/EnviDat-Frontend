/* eslint-disable no-underscore-dangle,no-console */
/**
* uploading with uppy for the redesigned workflow
*
* @summary user store mutations
* @author Dominik Haas-Artho
*
* Created at     : 2020-07-14 16:51:52
 * Last modified  : 2025-10-13 07:48:37
*
* This file is subject to the terms and conditions defined in
* file 'LICENSE.txt', which is part of this source code package.
*/

import Uppy from '@uppy/core';
import axios from 'axios';
import awsS3 from '@uppy/aws-s3';

import {
  METADATA_UPLOAD_FILE_ERROR,
  METADATA_UPLOAD_FILE_SUCCESS,
  USER_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

import { urlRewrite } from '@/factories/apiFactory';
import {
  eventBus,
  UPLOAD_ERROR,
  UPLOAD_STATE_RESET,
  UPLOAD_STATE_RESOURCE_CREATED,
} from '@/factories/eventBus';

import { RESOURCE_FORMAT_LINK } from '@/factories/metadataConsts';
import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';


let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT;
}

let uppyInstance = null;
let storeReference = null;

const uppyId = 'resource-upload';
const defaultRestrictions = {
  maxFileSize: 1024 * 1024 * 1024 * 20, // KB * MB * GB * 20 = 20 GB
  maxNumberOfFiles: 1,
  minNumberOfFiles: 1,
};

/**
 * returns a resource object with all the properties most will be filled by the backend.
 * Some specific ones have to be set depending on the usage of a file upload or a linking of
 * a resource via url
 *
 * @param datasetId
 * @returns {{cacheLastUpdated: null, cacheUrl: null, created: string, format: string, packageId, description: string, hast: string, url: string, urlType: null, mimetypeInner: null, size: null, restricted: {level: string, allowedUsers: string, sharedSecret: string}, name: string, resourceSize: {sizeUnits: string, sizeValue: string}, mimetype: null, id: string, lastModified: string, position: number, state: string, doi: string, resourceType: null}}
 */
function createNewBaseResource(datasetId) {

  return {
    cacheLastUpdated: null,
    cacheUrl: null,
    created: '', // set by the backend
    description: '',
    doi: '',
    format: '',
    hast: '',
    id: '',
    lastModified: '',
    mimetype: null,
    mimetypeInner: null,
    name: '',
    packageId: datasetId,
    position: 0,
    resourceSize: {
      sizeUnits: 'kb',
      sizeValue: '',
    },
    resourceType: null,
    restricted: {
      allowedUsers: '',
      sharedSecret: '',
      level: 'public',
    },
    size: null,
    state: '',
    url: '',
    urlType: null,
  };
}

function createNewResourceForFileUpload(datasetId, file) {

  const baseResourceProperties = createNewBaseResource(datasetId);

  const name = file.name || file;
  const size = file.size || 0;

  return {
    ...baseResourceProperties,
    url: file.name || file,
    format: file.extension || '',
    mimetype: file.type || '',
    name,
    size,
    urlType: 'upload',
    multipartName: file.name,
  };

}

export function createNewResourceForUrl(datasetId, url) {

  const cleanUrlForName = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
  const splits = cleanUrlForName.split('/');
  const resourceName = splits.length > 0 ? splits[splits.length - 1] : url;

  const baseResourceProperties = createNewBaseResource(datasetId);

  return {
    ...baseResourceProperties,
    url,
    format: RESOURCE_FORMAT_LINK,
    size: 1,
    sizeFormat: 'B',
    name: resourceName,
  };

}

async function initiateMultipart(file) {
  // // console.log('initiateMultipart', file);

/*
  eventBus.emit(UPLOAD_STATE_RESET);
*/

  const datasetId = storeReference?.datasetModel.dataset.id;
  const newResource= createNewResourceForFileUpload(datasetId, file);

  const backendResource = await storeReference?.datasetModel.createResourceOnExistingDataset(newResource);
  const resourceId = backendResource.id;

  if (resourceId) {
    eventBus.emit(UPLOAD_STATE_RESOURCE_CREATED, { id: UPLOAD_STATE_RESOURCE_CREATED, resourceId});
  } else {
    eventBus.emit(UPLOAD_ERROR, { error: 'Resource creation failed', metadataId: datasetId });
    return null;
  }

  const actionUrl = 'cloudstorage_initiate_multipart';
  const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

  const payload = {
    id: resourceId,
    name: file.name,
    size: file.size,
  };

  try {
    const res = await axios.post(url, payload);

    const uploadId = res.data.result.id;
    const key = res.data.result.name;
    // storeReference?.commit(`${USER_NAMESPACE}/${METADATA_UPLOAD_FILE}`, key);

    return {
      uploadId,
      key,
    };
  } catch (error) {
    console.error(`Multipart initiation failed: ${error}`);
    return error;
  }
}

export async function getSinglePresignedUrl(file) {

/*
  eventBus.emit(UPLOAD_STATE_RESET);
*/

  const datasetId = storeReference?.datasetModel.dataset.id;
  const newResource= createNewResourceForFileUpload(datasetId, file);

  const backendResource = await storeReference?.datasetModel.createResourceOnExistingDataset(newResource);
  const resourceId = backendResource?.id;
  storeReference?.setUploadResource(resourceId);

  if (resourceId) {
    eventBus.emit(UPLOAD_STATE_RESOURCE_CREATED, { id: UPLOAD_STATE_RESOURCE_CREATED });
  } else {
    eventBus.emit(UPLOAD_ERROR, { error: 'Resource creation failed', metadataId: datasetId });
    return null;
  }

  const actionUrl = 'cloudstorage_get_presigned_url_multipart';
  const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

  const payload = {
    id: resourceId,
    partNumber: 0,
    filename: file.name,
/*
    // uploadId,
    // partNumber: partNumbers,
    upload: {
    },
*/
  };

  try {
    const res = await axios.post(url, payload);

    const signedUrl = res.data.result;

    return {
      method: 'POST',
      url: signedUrl,
      // fields: '',
      headers: {
        'Content-Type': file.type,
      },
    }

  } catch (error) {
    console.error(`getSinglePresignedUrl failed: ${error}`);
    return error;
  }

}

async function requestPresignedUrl(file, partData) {
  // console.log('requestPresignedUrl', file, partData);

  const actionUrl = 'cloudstorage_get_presigned_url_multipart';
  const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

  const resourceId = storeReference?.uploadingResourceId;

  const { uploadId, partNumber } = partData;

  const payload = {
    id: resourceId,
    uploadId,
    partNumber,
    filename: file.name,
  };

  try {
    const res = await axios.post(url, payload);

    const presignedUrl = res.data.result;

    return {
      'url': presignedUrl,
      'headers': {},
    };
  } catch (error) {
    console.error(`requestPresignedUrl failed: ${error}`);
    return error;
  }
}


async function completeMultipart(file, uploadData) {
  // console.log('completeMultipart', file, uploadData);

  const actionUrl = 'cloudstorage_finish_multipart';
  const url = urlRewrite(actionUrl, API_BASE, API_ROOT);
  const resourceId = storeReference?.uploadingResourceId;

  const { uploadId, parts } = uploadData;

  const payload = {
    id: resourceId,
    uploadId,
    partInfo: JSON.stringify(parts),
  };

  try {
    const res = await axios.post(url, payload);
    const fileUrl = res.data?.result?.url || null

    storeReference?.setUploadResource(undefined);

    return { location: fileUrl };
  } catch (error) {
    storeReference?.commit(`${USER_NAMESPACE}/${METADATA_UPLOAD_FILE_ERROR}`, error);
    console.error(`Multipart completion failed: ${error}`);
    return error;
  }
}

async function abortMultipart(file, uploadData) {
  // console.log('abortMultipart', file, uploadData);

  const actionUrl = 'cloudstorage_abort_multipart';
  const url = urlRewrite(actionUrl, API_BASE, API_ROOT);
  const resourceId = storeReference?.uploadingResourceId;

  await storeReference?.deleteResourceOnExistingDataset(resourceId);

  const payload = {
    id: resourceId,
  };

  try {
    const response = await axios.post(url, payload);
    // console.log(`Multipart upload aborted. Resource ID ${resourceId} | S3 Upload ID ${uploadData.uploadId}`);
    // console.log(response);

    storeReference?.setUploadResource(undefined);

    return {};
  } catch (error) {
    // console.log(`Multipart abort failed for Resource ID ${resourceId}: ${error}`);
    return error;
  } finally {
    eventBus.emit(UPLOAD_STATE_RESET);
  }
}

async function listUploadedParts(file, { uploadId, key }) {

  const actionUrl = 'cloudstorage_multipart_list_parts';
  const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

  const payload = {
    uploadId,
    uploadKey: key,
  };

  try {
    const res = await axios.post(url, payload);

    // console.log(`Multipart parts: ${res.data.result}`);

    return res.data.result;
  } catch (error) {
    // console.log(`Listing multipart parts failed: ${error}`);
    return error;
  }
}


export function hasUppyInstance () {
  return uppyInstance !== null;
}


export function subscribeOnUppyEvent(event, callback) {
  if (hasUppyInstance()) {
    uppyInstance.on(event, callback);
  }
}

export function unSubscribeOnUppyEvent(event, callback) {
  if (hasUppyInstance()) {
    uppyInstance.off(event, callback);
  }
}


function createUppyInstance(
  height = 300,
  autoProceed = true,
  restrictions = defaultRestrictions,
) {

  const uppy =  new Uppy();
  const debug = import.meta.env?.MODE === 'development';

  uppy.setOptions({
    // use different ids multiple instance, e.g. avatar image upload, resource-upload, etc.
    // in this case the singleton creation (prevention of multiple instances) via getUppyInstance() needs to be changed
    id: uppyId,
    autoProceed,
    debug,
    restrictions,
    height,
  });

  uppy.use(awsS3, {
    id: 'multipart-aws',
    limit: 4,
    shouldUseMultipart: true,
    getChunkSize(file) {
      // at least 25MB per request, at most 500 requests
      return Math.max(1024 * 1024 * 25, Math.ceil(file.size / 500));
    },
    createMultipartUpload: initiateMultipart,
    signPart: requestPresignedUrl,
    listParts: listUploadedParts,
    abortMultipartUpload: abortMultipart,
    completeMultipartUpload: completeMultipart,
  });

  // // console.log('createUppyInstance', uppy);

  return uppy;
}

export function getUppyInstance(datasetId: string, height = 300, autoProceed = true, restrictions = undefined) {

  storeReference = useDatasetWorkflowStore();

  if (hasUppyInstance()) {
    return uppyInstance;
  }

  uppyInstance = createUppyInstance(height, autoProceed, restrictions);

  return uppyInstance;
}

export function destroyUppyInstance() {
  if (hasUppyInstance()) {
    uppyInstance.destroy();
    uppyInstance = null;
  }

  storeReference = null;
}

