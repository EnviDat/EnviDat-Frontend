/* eslint-disable no-underscore-dangle */
// Utility file to collect all tracking functions from Matomo

// tracking download
export function trackDownload(url, label) {
  const consentGiven = localStorage.getItem('matomoConsentGiven');

  if (consentGiven === 'true') {
    window._paq.push(['trackEvent', 'Download', url, label]);
  }
}

// tracking event
// use this function to create an event from the website
// EventCategory (mandatory): Describes the category of the event. It can be used to group similar events, for example, "Video," "Button Click," "Download," etc.
// EventAction (mandatory): Describes the action performed by the user. For example, "Play," "Pause," "Click," "Download," etc.
// EventName (optional): An optional label to describe the event in more detail. It could be the name of a video, the text of a button, the name of a downloaded file, etc.

// IMPORTANT to use EventName to specify the path to the page ex /metadata/satellite-avalanche-mapping-validation, this is important to have the ability to filter and get all events related to a specific page

export function trackEvent(eventCategory, eventAction, eventName) {
  const consentGiven = localStorage.getItem('matomoConsentGiven');

  if (consentGiven === 'true') {
    window._paq.push(['trackEvent', eventCategory, eventAction, eventName]);
  }
}
