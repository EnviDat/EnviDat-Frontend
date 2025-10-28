/**
 * function factory for notifcation object creation
 * or notification handling methods.
 *
 * @summary function factory for notification methods
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:07:03
 * Last modified  : 2019-11-01 09:52:52
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mdiInformation, mdiCheckCircle, mdiAlert, mdiAlertOctagram } from '@mdi/js';
import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';

export function infoMessage(message = undefined, details = undefined) {
  return {
    message: message || 'short text for the user',
    details: details || 'the full error text',
    stack: undefined,
    color: 'white',
    icon: mdiInformation,
    type: 'info',
    timeout: 4000,
    show: true,
  };
}

export function successMessage(message, details) {
  const notification = infoMessage();
  notification.message = message;
  notification.details = details;
  notification.icon = mdiCheckCircle;
  notification.color = 'success';
  notification.type = 'success';

  return notification;
}

export function errorMessage(message, details, stack) {
  const notification = infoMessage();
  notification.message = message;
  notification.details = details;
  notification.stack = stack;
  notification.color = 'error';
  notification.icon = mdiAlertOctagram;
  notification.type = 'error';
  notification.timeout = 8000;
  return notification;
}

export function warningMessage(message, details, stack) {
  const notification = infoMessage();
  notification.message = message;
  notification.details = details;
  notification.stack = stack;
  notification.color = 'warning';
  notification.icon = mdiAlert;
  notification.type = 'warning';
  notification.timeout = 6000;
  return notification;
}

function genericMessage(status) {
  switch (status) {
    case 400:
      return 'Client tried to execute a function with wrong parameters';
    case 401:
      return 'Not authorized';
    // case 422:
    //   return 'Unprosomething entity';
    case 403:
      return 'Access denied';
    case 404:
      return 'Could not find the requested resource';
    case 405:
      return 'Client tried to execute an unkown function';
    case 408:
      return 'Timeout! Ups no answer from the internet? Check your internet connection and if it persits report this error.';
    default:
      return 'An unknown Error occurred please report to the envidat team (envidat@wsl.ch)';
  }
}

export function getSpecificApiError(details, reason) {
  let errObj = errorMessage(reason, details);

  if (reason) {
    if (reason.response) {
      const status = `${reason.response.status} ${reason.response.statusText}`;
      details += `\n ${reason.request ? reason.request.responseURL : ''}`;
      errObj = errorMessage(status, details, reason.response.stack);
    } else {
      errObj.message = reason.message;
    }
  }

  return errObj;
}

export function getGenericApiError(reason) {
  let errObj = errorMessage(reason);

  if (reason && reason.response) {
    const status = `${reason.response.status} ${reason.response.statusText}`;
    const message = genericMessage(reason.response.status);
    const details = reason.request ? reason.request.responseURL : '';
    errObj = errorMessage(message, `${status} ${details}`, reason.response.stack);
  }

  return errObj;
}

export function handleGenericAPIError(store, reason) {
  const errObj = getGenericApiError(reason);

  store.commit(ADD_USER_NOTIFICATION, errObj);
}

export function handleGenericError(store, msg, details, stack) {
  const errObj = errorMessage(msg, details, stack);

  store.commit(ADD_USER_NOTIFICATION, errObj);
}
