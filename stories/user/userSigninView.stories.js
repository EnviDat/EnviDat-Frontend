/* eslint-disable object-curly-newline */
/**
 * @summary story of SigninPage sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import SigninView from '@/modules/user/components/SigninView.vue';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from '@/../stories/js/envidatViewports';


export default {
  title: '7 User / SignIn',
  component: SigninView,
};

export const Empty = {};

export const EmailEntered = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
  },
};

export const EmailEnteredWithDisclaimer = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    disclaimerText: 'Please note that by publishing data, you allow EnviDat to store, copy and transform any deposited digital objects for preservation purposes, as well as to provide long-term access to them. All EnviDat datasets will be published with a Digital Object Identifier (DOI) and consequently, every <b>data provider</b>:',
    disclaimerPoints: [
      'has acquired the permission to publish the dataset (e.g. from the group or research unit leader) and that the dataset doesn\'t violate copyright, privacy, confidentiality, non-disclosure agreements or institutional research integrity policies.',
      'after the publication, understands the responsibility not to modify the already uploaded data files, as well as any metadata field that influences the <b>citation</b> (Dataset Title, Authors, etc...); if errors will need to be corrected, please get in touch with the EnviDat team at <mailto="envidat@wsl.ch">envidat@wsl.ch</mailto> for devising an appropriate solution.',
      'will always use the DOI to reference the dataset in any publication and will regularly review and curate the published dataset, e.g. by improving the Description of the dataset or by adding associated papers to the list of Related Publications.',
    ],
  },
};

export const EmailEnteredRequestLoading = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    requestLoading: true,
  },
};

export const EmailEnteredRequestSuccess = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    requestSuccess: true,
  },
};

export const EmailAndKeyEntered = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    prefilledKey: '01234567890123456789012345678901',
  },
};

export const EmailAndKeyEnteredRequestSuccess = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    requestSuccess: true,
    prefilledKey: '01234567890123456789012345678901',
  },
};

export const EmailAndKeyEnteredLoading = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    signInLoading: true,
    prefilledKey: '01234567890123456789012345678901',
  },
};

export const SigninFinishedSuccessful = {
  args: {
    signedIn: true,
    signedInEmail: 'dominik.haas@wsl.ch',
  },
};

export const SigninErrorToken = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    errorFieldText: 'Token is wrong',
    errorField: 'key',
  },
};

export const SigninErrorEmail = {
  args: {
    prefilledEmail: 'dominik.haas@wsl.ch',
    formErrorText: 'Error: Network Error. If you\'re unable to sign in please contact the EnviDat team.',
  },
};

export const MobileFilled = {};
MobileFilled.args = { ...EmailEnteredRequestSuccess.args };
MobileFilled.parameters = mobileViewportParams;

export const MobileLargeFilled = {};
MobileLargeFilled.args = { ...EmailEnteredRequestSuccess.args };
MobileLargeFilled.parameters = mobileLargeViewportParams;

export const TabletFilled = {};
TabletFilled.args = { ...EmailEnteredRequestSuccess.args };
TabletFilled.parameters = tabletViewportParams;

export const MobileFilledWithDisclaimer = {};
MobileFilledWithDisclaimer.args = { ...EmailEnteredWithDisclaimer.args };
MobileFilledWithDisclaimer.parameters = mobileViewportParams;

export const MobileLargeFilledWithDisclaimer = {};
MobileLargeFilledWithDisclaimer.args = { ...EmailEnteredWithDisclaimer.args };
MobileLargeFilledWithDisclaimer.parameters = mobileLargeViewportParams;

export const TabletFilledWithDisclaimer = {};
TabletFilledWithDisclaimer.args = { ...EmailEnteredWithDisclaimer.args };
TabletFilledWithDisclaimer.parameters = tabletViewportParams;

