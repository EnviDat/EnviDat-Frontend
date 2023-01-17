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

import Uppy from '@uppy/core';
import axios from 'axios';

const domain = process.env.VUE_APP_ENVIDAT_PROXY;

let uppyInstance = null;
let apiKey = null;
let currentResourceId = undefined;

const uppyId = 'resource-upload';
const defaultRestrictions = {
  maxFileSize: 1024 * 1024 * 1024 * 20, // KB * MB * GB * 20 = 20 GB
  maxNumberOfFiles: 1,
  minNumberOfFiles: 1,
};

function createUppyInstance(autoProceed = true, debug = false, restrictions = defaultRestrictions) {

  const uppy =  new Uppy();

  uppy.setOptions({
    // use different ids multiple instance, e.g. avatar image upload, resource-upload, etc.
    // in this case the singleton creation (prevention of multiple instances) via getUppyInstance() needs to be changed
    id: uppyId,
    autoProceed,
    debug,
    // logger: Uppy.debugLogger,
    restrictions,
  });

  return uppy;
}

export async function initiateMultipart(file) {
  // this.$store.dispatch(
  //   `${USER_NAMESPACE}/METADATA_EDITING_MULTIPART_UPLOAD_INIT`,
  //   payload,
  // );

/*
const files = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  }
  this.$emit('createResources', files);
*/

  const url = `${domain}/api/action/cloudstorage_initiate_multipart`;

  const payload = {
    // id: await this.createCKANResource(file),
    id: currentResourceId,
    name: file.name,
    size: file.size,
  };

  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: apiKey,
      },
    });

    return {
      uploadId: res.data.result.id,
      key: res.data.result.name,
    };
  } catch (error) {
    console.error(`Multipart initiation failed: ${error}`);
    return error;
  }
}

export async function requestPresignedUrls(file, { uploadId, partNumbers }) {

  const url = `${domain}/api/action/cloudstorage_get_presigned_url_list_multipart`;

  const payload = {
    id: currentResourceId,
    uploadId,
    partNumbersList: partNumbers,
    filename: file.name,
  };

  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: apiKey,
      },
    });
    return {
      presignedUrls: res.data.result.presignedUrls,
      // headers: {
      //   'Content-Type': 'application/octet-stream',
      // },
    };
  } catch (error) {
    console.error(`Presigning urls failed: ${error}`);
    return error;
  }
}

export async function completeMultipart(file, uploadData) {
  const url = `${domain}/api/action/cloudstorage_finish_multipart`;

  const payload = {
    id: currentResourceId,
    uploadId: uploadData.uploadId,
    partInfo: JSON.stringify(uploadData.parts),
  };

  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: apiKey,
      },
    });
    return { location: await res.data.result.url };
  } catch (error) {
    console.error(`Multipart completion failed: ${error}`);
    return error;
  }
}

export async function abortMultipart(file, uploadData) {
  const url = `${domain}/api/action/cloudstorage_abort_multipart`;

  const payload = {
    id: currentResourceId,
    deletedInCKAN: await this.deleteCKANResource(),
  };

  try {
    // const res =
    await axios.post(url, payload, {
      headers: {
        Authorization: apiKey,
      },
    });
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
  const url = `${domain}/api/action/cloudstorage_multipart_list_parts`;

  const payload = {
    uploadId,
    uploadKey: key,
  };

  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: apiKey,
      },
    });
    console.log(`Multipart parts: ${res.data.result}`);
    return res.data.result;
  } catch (error) {
    console.log(`Listing multipart parts failed: ${error}`);
    return error;
  }
}

export function hasUppyInstance () {
  return uppyInstance !== null;
}

export function getUppyInstance(userApiKey) {
  apiKey = userApiKey;

  if (hasUppyInstance()) {
    return uppyInstance;
  }

  uppyInstance = createUppyInstance();

/*
  const testing = process.env.NODE_ENV === 'test';

  if (!testing) {
    uppyInstance
      .use(GoldenRetriever, { serviceWorker: true })
      .use(AwsS3Multipart, {
        limit: 4,
        getChunkSize(file) {
          // at least 25MB per request, at most 500 requests
          return Math.max(1024 * 1024 * 25, Math.ceil(file.size / 500));
        },
        createMultipartUpload: initiateMultipart,
        prepareUploadParts: requestPresignedUrls,
        listParts: listUploadedParts,
        abortMultipartUpload: abortMultipart,
        completeMultipartUpload: completeMultipart,
      })

  }
*/

  // uppyInstance.on('upload-complete', this.$emit('uploadComplete', 'Done'));


  return uppyInstance;
}

export function setCurrentResourceId(id) {
  currentResourceId = id;
}

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

export function destoryUppyInstance() {
  apiKey = null;

  // this will cancel all pending uploads
  uppyInstance.close();

  uppyInstance = null;
}
