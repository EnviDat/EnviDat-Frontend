/* eslint-disable no-underscore-dangle */
/**
* user store mutations
*
* @summary user store mutations
* @author Dominik Haas-Artho
*
* Created at     : 2020-07-14 16:51:52
 * Last modified  : 2021-08-18 10:14:35
*
* This file is subject to the terms and conditions defined in
* file 'LICENSE.txt', which is part of this source code package.
*/

import Uppy, { debugLogger } from '@uppy/core';
import axios from 'axios';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
/*
import GoldenRetriever from '@uppy/golden-retriever';
import Tus from '@uppy/tus';
*/

import {
  METADATA_CREATION_RESOURCE,
  METADATA_DELETE_RESOURCE,
  METADATA_EDITING_SAVE_RESOURCE,
  METADATA_UPLOAD_FILE,
  METADATA_UPLOAD_FILE_INIT,
  USER_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

import { urlRewrite } from '@/factories/apiFactory';
import {
  EDITMETADATA_DATA_RESOURCE,
  eventBus,
  UPLOAD_ERROR,
  UPLOAD_STATE_RESET,
  UPLOAD_STATE_RESOURCE_CREATED, UPLOAD_STATE_RESOURCE_UPDATED,
} from '@/factories/eventBus';


let API_BASE = '';
let ENVIDAT_PROXY = '';

const useTestdata = import.meta.env.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  ENVIDAT_PROXY = import.meta.env.VITE_ENVIDAT_PROXY;
}

let uppyInstance = null;
let storeReference = null;

const uppyId = 'resource-upload';
const defaultRestrictions = {
  maxFileSize: 1024 * 1024 * 1024 * 20, // KB * MB * GB * 20 = 20 GB
  maxNumberOfFiles: 1,
  minNumberOfFiles: 1,
};

function createNewBaseResource(metadataId) {
  const restricted = JSON.stringify({
    allowed_users: '',
    shared_secret: '',
    level: 'public',
  });

  return {
    packageId: metadataId,
    description: null,
    restricted,
    doi: null,
    // state: ?,
    // private: ?
    // publicationState: null,
  };
}

function createNewResourceForFileUpload(metadataId, file) {

  const baseResourceProperties = createNewBaseResource(metadataId);

  const name = file.name || file;
  const size = file.size || 0;

  return {
    ...baseResourceProperties,
    url: file.name || file,
    format: file.extension || '',
    mimetype: file.type || '',
    name,
    description: null,
    size,
    urlType: 'upload',
    multipartName: file.name,
  };

}

export function createNewResourceForUrl(metadataId, url) {

  const splits = url.split('/');
  const resourceName = splits.length > 0 ? splits[splits.length - 1] : url;

  const baseResourceProperties = createNewBaseResource(metadataId);

  return {
    ...baseResourceProperties,
    url,
    url_type: null,
    format: '',
    name: resourceName,
    resourceSize: JSON.stringify({
      size_units: 'kb',
      size_value: '0',
    }),
/*
    resource_size: "{\"size_units\": \"kb\", \"size_value\": \"\"}",
    size_value: size / 1024 / 1024,
*/
  };

}

export async function initiateMultipart(file) {

  eventBus.emit(UPLOAD_STATE_RESET);

  const metadataId = storeReference?.getters[`${USER_NAMESPACE}/uploadMetadataId`];
  const newResource = createNewResourceForFileUpload(metadataId, file);

  await storeReference?.dispatch(`${USER_NAMESPACE}/${METADATA_CREATION_RESOURCE}`, {
    data: newResource,
  });

  const resourceId = storeReference?.getters[`${USER_NAMESPACE}/uploadResourceId`];

  if (resourceId) {
    eventBus.emit(UPLOAD_STATE_RESOURCE_CREATED, { id: UPLOAD_STATE_RESOURCE_CREATED });
  } else {
    eventBus.emit(UPLOAD_ERROR, { error: 'Resource creation failed' });
  }

  const actionUrl = 'cloudstorage_initiate_multipart';
  const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

  const payload = {
    // id: await this.createCKANResource(file),
    id: resourceId,
    name: file.name,
    size: file.size,
  };

  try {
    const res = await axios.post(url, payload);

    const fileId = res.data.result.id;
    const key = res.data.result.name;

    storeReference?.commit(`${USER_NAMESPACE}/${METADATA_UPLOAD_FILE}`, { fileId, key });

    return {
      uploadId: res.data.result.id,
      key: res.data.result.name,
    };
  } catch (error) {
    console.error(`Multipart initiation failed: ${error}`);
    return error;
  }
}

export async function getSinglePresignedUrl(file) {

  const metadataId = storeReference?.getters[`${USER_NAMESPACE}/uploadMetadataId`];

  await storeReference?.dispatch(
    `${USER_NAMESPACE}/${METADATA_CREATION_RESOURCE}`,
    {
      metadataId,
      file,
      // fileUrl: file.id,
    },
  );


  const actionUrl = 'cloudstorage_get_presigned_url_multipart';
  const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

  const resourceId = storeReference?.getters[`${USER_NAMESPACE}/uploadResourceId`];

  const payload = {
    id: resourceId,
    // uploadId,
    // partNumber: partNumbers,
    upload: {
      filename: file.name,
    },
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

export async function requestPresignedUrl(file, partData) {

  const actionUrl = 'cloudstorage_get_presigned_url_multipart';
  const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

  const resourceId = storeReference?.getters[`${USER_NAMESPACE}/uploadResourceId`];

  const payload = {
    id: resourceId,
    uploadId: partData.uploadId,
    partNumber: partData.partNumber,
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

export async function updateResourceWithFileUrl(fileUrl, store) {

  const metadataId = store?.getters[`${USER_NAMESPACE}/uploadMetadataId`];
  const newRes = store?.getters[`${USER_NAMESPACE}/uploadResource`];

  // create a local copy because it might come directly from the $store
  const resource = {
    ...newRes,
    url: fileUrl,
  };

  // let the regular saving of a resource take over, instead
  // eventBus.emit(SAVE_EDITING_RESOURCE, resource);

  await store?.dispatch(`${USER_NAMESPACE}/${METADATA_EDITING_SAVE_RESOURCE}`, {
    object: EDITMETADATA_DATA_RESOURCE,
    data: resource,
    id: metadataId,
  });

  eventBus.emit(UPLOAD_STATE_RESOURCE_UPDATED, { id: UPLOAD_STATE_RESOURCE_UPDATED });
}

export async function completeMultipart(file, uploadData) {

  const actionUrl = 'cloudstorage_finish_multipart';
  const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
  const resourceId = storeReference?.getters[`${USER_NAMESPACE}/uploadResourceId`];

  const payload = {
    id: resourceId,
    uploadId: uploadData.uploadId,
    partInfo: JSON.stringify(uploadData.parts),
  };

  try {
    const res = await axios.post(url, payload);
    const fileUrl = res.data?.result?.url || null

    return { location: fileUrl };
  } catch (error) {
    console.error(`Multipart completion failed: ${error}`);
    return error;
  }
}

export async function abortMultipart(file, uploadData) {

  const actionUrl = 'cloudstorage_abort_multipart';
  const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
  const resourceId = storeReference?.getters[`${USER_NAMESPACE}/uploadResourceId`];

  const deletedInCKAN = await storeReference?.dispatch(`${USER_NAMESPACE}/${METADATA_DELETE_RESOURCE}`, { resourceId });

  const payload = {
    id: resourceId,
    deletedInCKAN,
  };

  try {
    // const res =
    await axios.post(url, payload);
    // console.log(
    //   `Multipart upload aborted. Resource ID ${this.resourceId} | S3 Upload ID ${uploadData.uploadId}`,
    // );
    return {};
  } catch (error) {
    // console.log(
    //   `Multipart abort failed for Resource ID ${this.resourceId}: ${error}`,
    // );
    return error;
  }
}

export async function listUploadedParts(file, { uploadId, key }) {

  const actionUrl = 'cloudstorage_multipart_list_parts';
  const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

  const payload = {
    uploadId,
    uploadKey: key,
  };

  try {
    const res = await axios.post(url, payload);

    console.log(`Multipart parts: ${res.data.result}`);

    return res.data.result;
  } catch (error) {
    console.log(`Listing multipart parts failed: ${error}`);
    return error;
  }
}

export async  function getPresignedUrlForDownload(resourceId) {

  const actionUrl = 'get_presigned_url_download';
  const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
  const payload = { id: resourceId };

  try {
    const res = await axios.post(url, payload);

    const preSignedUrl = res.data.result.signed_url || res.data.result;

    console.log(`Presigned Url: ${preSignedUrl}`);
    return preSignedUrl;

  } catch (error) {
    console.log(`Getting presigned url for download failed: ${error}`);
    return error;
  }

}

export function hasUppyInstance () {
  return uppyInstance !== null;
}

/*
export function addFile(fileName, filepath, filedata) {

  if (hasUppyInstance()) {
    uppyInstance.addFile({
      name: fileName,
      type: 'image/png', // file type
      data: filedata, // file blob
      meta: {
        // optional, store the directory path of a file so Uppy can tell identical files in different directories apart.
        relativePath: filepath,
      },
      source: 'Local', // optional, determines the source of the file, for example, Instagram.
      isRemote: false, // optional, set to true if actual file is not in the browser, but on some remote server, for example,
      // when using companion in combination with Instagram.
    });
  }
}
*/

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

/*
function awsS3Parameters(file) {
  return {
    method: 'POST',
    url: '',
    fields: '',
    headers: '',
  }
}
*/

function createUppyInstance(height = 300, autoProceed = true, debug = true, restrictions = defaultRestrictions) {

  const uppy =  new Uppy();

  uppy.setOptions({
    // use different ids multiple instance, e.g. avatar image upload, resource-upload, etc.
    // in this case the singleton creation (prevention of multiple instances) via getUppyInstance() needs to be changed
    id: uppyId,
    autoProceed,
    debug,
    logger: debugLogger,
    restrictions,
    height,
  });

  uppy.use(AwsS3Multipart, {
    id: 'multipart-aws',
    limit: 4,
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

/*
  uppy
    // .use(GoldenRetriever, { serviceWorker: true })
    .use(GoldenRetriever, { })
*/


/*
  uppy.on('file-added', (newFile) => {

    if (newFile.size >= 1024 * 1024 * 6) {

      const awsS3Plugin = uppy.getPlugin('AwsS3');
      if (awsS3Plugin) {
        uppy.removePlugin(AwsS3);
      }
      uppy.use(AwsS3Multipart, {
        id: 'multipart-aws',
        limit: 4,
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
    } else {

      const awsS3Plugin = uppy.getPlugin('multipart-aws');
      if (awsS3Plugin) {
        uppy.removePlugin(AwsS3Multipart);
      }

      uppy.use(AwsS3, {
        id: 'AwsS3',
        // companionUrl: ENVIDAT_PROXY,
        getUploadParameters: getSinglePresignedUrl,
      });
    }
  });

*/
  /*
      .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' });
  */


  // uppy.on('upload-complete', this.$emit('uploadComplete', 'Done'));

  return uppy;
}

export function getUppyInstance(metadataId, store, height = 300, autoProceed = true, debug = true, restrictions = undefined) {

  // need to be stored for later usage for some multipart functions
  storeReference = store;
  storeReference?.commit(`${USER_NAMESPACE}/${METADATA_UPLOAD_FILE_INIT}`, metadataId);

  if (hasUppyInstance()) {
    return uppyInstance;
  }

  uppyInstance = createUppyInstance(height, autoProceed, debug, restrictions);

  return uppyInstance;
}

export function destroyUppyInstance() {
  if (hasUppyInstance()) {
    // uppyInstance.close({ reason: 'unmount' });
    uppyInstance.close();
    uppyInstance = null;
  }

  storeReference = null;
}
