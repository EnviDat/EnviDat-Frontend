import * as msal from '@azure/msal-browser';

// eslint-disable-next-line import/no-mutable-exports
let msalInstance = null;

export default class MsalPlugin extends msal.PublicClientApplication {
  static install(vue, msalConfig) {
    msalInstance = new MsalPlugin(msalConfig);
    vue.prototype.$msal = msalInstance;
  }

  constructor(options) {
    super(options);
    this.extendedConfiguration = { ...options };
    this.loginRequest = { scopes: options.auth.scopes || [] };
  }

  async tokenPopupOrRedirect() {
    if (this.extendedConfiguration.mode === 'popup') {
      const tokenResponse = await this.acquireTokenPopup({
        scopes: ['User.Read'],
      });
      sessionStorage.setItem('envidat-azure-user', tokenResponse.account);
      return tokenResponse.accessToken
    }
    if (this.extendedConfiguration.mode === 'popup') {
      // return this.acquireTokenRedirect({
      //   scopes: ['User.Read'],
      // });
      console.error('Azure login with redirect not implemented')
      return null
    }
    console.error('Login mode not defined, options: [redirect, popup]')
    return null
  }

  async getAccessToken() {
    // Attempt to get user from Azure
    await this.handleRedirectPromise();
    let account = this.getAllAccounts()[0];

    // Then attempt to get user from session storage
    if (!account) {
      account = sessionStorage.getItem('envidat-azure-user');
    }

    // If no user found, login again
    if (!account) {
      const token = await this.tokenPopupOrRedirect()
      return token
    }

    // If user found, attempt acquire token silently
    try {
      const tokenResponse = await this.acquireTokenSilent({
        account,
        scopes: ['User.Read'],
      });
      return tokenResponse.accessToken;

    } catch (error) {
      if (error instanceof msal.InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        const token = await this.tokenPopupOrRedirect()
        return token
      }

      return null;
    }
  }
}
export { msalInstance };
