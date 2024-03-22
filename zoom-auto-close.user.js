// ==UserScript==
// @name         Zoom auto-close
// @namespace    http://tampermonkey.net/
// @for          Zoom
// @version      0.1.2
// @description  Automatically closes zoom tabs after successfully redirecting you to the zoom app.
// @author       Ashton Eby (https://github.com/echo-bravo-yahoo)
// @match        https://*.zoom.us/j/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zoom.us
// @require      https://raw.githubusercontent.com/echo-bravo-yahoo/monkey-scripts/main/on-dom-change.js
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

  // if the user gave permission for Chrome to launch Zoom via custom application URI, this may
  // succeed without the user clicking the button, so let's poll on it
  setInterval(() => { if (window.location.hash === '#success') window.close() }, 1000)

  onDomChange(augmentJoinCallButton)
  augmentJoinCallButton()
})();
