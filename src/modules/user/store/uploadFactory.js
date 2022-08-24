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
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import GoldenRetriever from '@uppy/golden-retriever';
import axios from 'axios';

const domain = process.env.VUE_APP_ENVIDAT_PROXY;

let uppyInstance = null;
let apiKey = null;

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

async function initiateMultipart(file) {
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
    id: '',
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
    console.log(`Multipart initiation failed: ${error}`);
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

  uppyInstance
    .use(GoldenRetriever, { serviceWorker: true })
    .use(AwsS3Multipart, {
      limit: 4,
      getChunkSize(file) {
        // at least 25MB per request, at most 500 requests
        return Math.max(1024 * 1024 * 25, Math.ceil(file.size / 500));
      },
      createMultipartUpload: initiateMultipart,
      prepareUploadParts: this.requestPresignedUrls,
      listParts: this.listUploadedParts,
      abortMultipartUpload: this.abortMultipart,
      completeMultipartUpload: this.completeMultipart,
    })
    .on('upload-complete', this.$emit('uploadComplete', 'Done'));


  return uppyInstance;
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

