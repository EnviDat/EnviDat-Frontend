/* eslint-disable no-underscore-dangle */
// Utility file to collect all tracking functions from Matomo

// tracking download
export function trackDownload(url, label) {
  const consentGiven = localStorage.getItem('matomoConsentGiven');

  if (consentGiven === 'true') {
    window._paq.push(['trackEvent', 'Download', url, label]);
  }
}

// TEST, post request to valuate the token rights.

// export function trackPageView() {
//   const apiUrl = '/api';
//   const params = new URLSearchParams({
//     idsite: '37',
//     rec: '1',
//     action_name: 'Test Page View',
//     url: 'https://example.com/test-page',
//     rand: Math.random()
//       .toString(36)
//       .substr(2, 9),
//     apiv: '1',
//     token_auth: '1ca09c368e30f9d025de4f2463147dba',
//   });

//   fetch(apiUrl, {
//     method: 'POST',
//     body: params,
//   })
//     .then(response => {
//       if (response.ok) {
//         console.log('Tracciamento riuscito:', response);
//       } else {
//         console.error('Errore durante il tracciamento:', response);
//       }
//     })
//     .catch(error => {
//       console.error('Errore durante il tracciamento:', error);
//     });
// }
