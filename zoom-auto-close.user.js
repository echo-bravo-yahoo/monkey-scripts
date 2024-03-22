// ==UserScript==
// @name         Zoom auto-close
// @namespace    http://tampermonkey.net/
// @for          Zoom
// @version      0.1.1
// @description  Automatically closes zoom tabs after successfully redirecting you to the zoom app.
// @author       Ashton Eby (https://github.com/echo-bravo-yahoo)
// @match        https://*.zoom.us/j/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zoom.us
// @require      https://raw.githubusercontent.com/echo-bravo-yahoo/monkey-scripts/main/zoom-auto-close.user.js
// @grant        window.close
// ==/UserScript==

(function() {
  'use strict';

  function augmentJoinCallButton() {
    const joinCallButton = document.querySelector('div[role=button]')

    // this event listener will almost certainly be added multiple times, but I don't think I care
    joinCallButton && joinCallButton.addEventListener('click', () => window.close())
  }

  window.addEventListener('hashchange', function(event) {
    console.log('event', event)
    if (event.newURL.split('#').pop() === 'success') { window.close() }
  });

  // sometimes, the greasemonkey script will be run after the hashchange event has already fired
  // so, let's check immediately, as well as on event trigger
  if (window.location.hash === '#success') { window.close() }

  onDomChange(augmentJoinCallButton)
  augmentJoinCallButton()
})();
