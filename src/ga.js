// Google Analytics 4. The build writes the Measurement ID in place of __GA_ID__.
// The tag loads only after the page has finished (or on the first tap, key or scroll), so it
// never competes with the page itself for the network or the main thread.
// No advertising features. In the EEA, the UK and Switzerland, analytics cookies stay off
// (Consent Mode sends cookieless pings only).
(function () {
  'use strict';
  var ID = '__GA_ID__';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  var denied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
    region: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'],
  });
  denied.analytics_storage = 'granted';
  gtag('consent', 'default', denied);
  gtag('set', { allow_google_signals: false, allow_ad_personalization_signals: false });
  gtag('js', new Date());
  gtag('config', ID);

  var done = false;
  function load() {
    if (done) return;
    done = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  }
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (e) {
    window.addEventListener(e, load, { once: true, passive: true });
  });
  if (document.readyState === 'complete') setTimeout(load, 3500);
  else window.addEventListener('load', function () { setTimeout(load, 3500); });
})();
