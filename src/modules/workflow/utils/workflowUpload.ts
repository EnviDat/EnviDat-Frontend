/* eslint-disable no-underscore-dangle,no-console */
/**
 * uploading with uppy for the redesigned workflow
 *
 * @summary user store mutations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 16:51:52
 * Last modified  : 2025-10-15 14:39:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import type { Body, Meta, Restrictions, UppyFile, UppyOptions } from '@uppy/core';
import { debugLogger, Uppy } from '@uppy/core';
import axios from 'axios';
import awsS3, { type AwsS3MultipartOptions } from '@uppy/aws-s3';

import { urlRewrite } from '@/factories/apiFactory';
import { eventBus, UPLOAD_STATE_RESET, UPLOAD_STATE_RESOURCE_CREATED } from '@/factories/eventBus';
import { ResourceViewModel } from '@/modules/workflow/viewModel/ResourceViewModel.ts';

let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT;
}

let uppyInstance: Uppy<Meta, Body> = null;
let storeReference = null;

const uppyId = 'workflow-resource-upload';
const defaultRestrictions: Restrictions = {
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
function createNewBaseResource(datasetId: string) {
  return {
    description: '',
    doi: '',
    format: '',
    hast: '',
    // don't set the id, because the backend will provide a new one
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

function createNewResourceForFileUpload(datasetId: string, file: UppyFile<Meta, Body>) {
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

async function createResourceInBackend(datasetId: string, file: UppyFile<Meta, Body>) {
  const newResource = createNewResourceForFileUpload(datasetId, file);

  const resourceVm = new ResourceViewModel(undefined, undefined);
  Object.assign(resourceVm, newResource);
  const backendResource = await storeReference?.datasetModel.createResourceOnExistingDataset(resourceVm);
  const resourceId = backendResource.id;

  if (resourceId) {
    storeReference?.setUploadResource(resourceId);
    eventBus.emit(UPLOAD_STATE_RESOURCE_CREATED, { id: UPLOAD_STATE_RESOURCE_CREATED, resourceId });
  } else {
    storeReference.setUploadError(new Error(`Resource creation failed datasetId: ${datasetId}`));
  }

  return resourceId;
}

async function initiateMultipart(file: UppyFile<Meta, Body>) {
  // // console.log('initiateMultipart', file);

  /*
  eventBus.emit(UPLOAD_STATE_RESET);
*/

  const datasetId = storeReference?.datasetModel.dataset.id;
  const resourceId = await createResourceInBackend(datasetId, file);

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

export async function getSinglePresignedUrl(file: UppyFile<Meta, Body>) {
  /*
  eventBus.emit(UPLOAD_STATE_RESET);
*/

  const datasetId = storeReference?.datasetModel.dataset.id;
  const resourceId = await createResourceInBackend(datasetId, file);

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
    };
  } catch (error) {
    console.error(`getSinglePresignedUrl failed: ${error}`);
    return error;
  }
}

async function requestPresignedUrl(file: UppyFile<Meta, Body>, partData) {
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
      url: presignedUrl,
      headers: {},
    };
  } catch (error) {
    console.error(`requestPresignedUrl failed: ${error}`);
    return error;
  }
}

async function completeMultipart(file: UppyFile<Meta, Body>, uploadData) {
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
    const fileUrl = res.data?.result?.url || null;

    // don't reset the resourceId in the store, it is still used for selecting

    return { location: fileUrl };
  } catch (error) {
    storeReference?.setUploadError(error);
    console.error(`Multipart completion failed: ${error}`);
    return error;
  }
}

async function abortMultipart(file: UppyFile<Meta, Body>, { uploadId, key }: { uploadId: string; key: string }) {
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

async function listUploadedParts(file: UppyFile<Meta, Body>, { uploadId, key }) {
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

export function hasUppyInstance() {
  return uppyInstance !== null;
}

export function subscribeOnUppyEvent(event: any, callback: any) {
  if (hasUppyInstance()) {
    uppyInstance.on(event, callback);
  }
}

export function unSubscribeOnUppyEvent(event: any, callback: any) {
  if (hasUppyInstance()) {
    uppyInstance.off(event, callback);
  }
}

function createUppyInstance(
  // height = 300,
  autoProceed = true,
  restrictions = defaultRestrictions,
) {
  const debug = import.meta.env?.MODE === 'development';

  const uppy = new Uppy<Meta, Body>({
    id: uppyId,
    autoProceed,
    debug: true,
    logger: debugLogger,
    restrictions,
    // height,
  } satisfies UppyOptions<Meta, Body>);

  uppy.use(awsS3, {
    id: 'workflow-multipart-aws',
    limit: 4,
    shouldUseMultipart: true,
    getChunkSize(file) {
      return Math.max(1024 * 1024 * 25, Math.ceil(file.size / 500));
    },
    createMultipartUpload: initiateMultipart,
    signPart: requestPresignedUrl,
    listParts: listUploadedParts,
    abortMultipartUpload: abortMultipart,
    completeMultipartUpload: completeMultipart,
  } satisfies AwsS3MultipartOptions<Meta, Body>);

  return uppy;
}

export function getUppyInstance(store: object) {
  storeReference = store;

  if (hasUppyInstance()) {
    return uppyInstance;
  }

  uppyInstance = createUppyInstance(true, undefined);

  return uppyInstance;
}

export function destroyUppyInstance() {
  if (hasUppyInstance()) {
    uppyInstance.destroy();
    uppyInstance = null;
  }

  // storeReference = null;
}
