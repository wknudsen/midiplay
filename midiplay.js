/**
 *  midiplay v1.0
 *  Refactored to vanilla JavaScript from jq-mid.
 *  Created 2022-2024 by Werner Knudsen, wkn@kor.dk.
 *  Intended to proxify links to MIDI files with the Choral Music Tutor by Chris Hills,
 *  an online mixer implemented as a web app with special functionality for singing practice
 *  at https://choralmusictutor.com.
 *
 *  Default Behavior:
 *  -----------------
 *  By default, midiplay.js will automatically process all `<a>` elements linking to `.mid` files
 *  (`<a href="...">` where `href` ends with `.mid`) when the DOM content is fully loaded.
 *
 *  You do **not** need to add a specific class to these `<a>` elements or write any additional
 *  JavaScript code in your HTML document to activate it.
 *
 *  Simple Usage:
 *  -------------
 *  Include the midiplay.js script in your HTML page:
 *
 *  ```html
 *  <script src="midiplay.js"></script>
 *  ```
 *
 *  Any anchor tags like the following will be transformed:
 *
 *  ```html
 *  <a href="song.mid">Play my song!</a>
 *  ```
 *
 *  Advanced Usage:
 *  ---------------
 *  If you wish to customize the behavior or apply `midiplay` to different elements,
 *  you can still call the `midiplay` function manually with your own selectors and options.
 *
 *  ```javascript
 *  midiplay(document.querySelectorAll('a[href$=".mid"]'), {
 *      ref:      'YourChoirName',   // Set reference to transfer to the proxy
 *      link:     false,             // Suppress link to original MIDI file
 *      // Other custom options...
 *  });
 *  ```
 *
 *  Options:
 *  --------
 *  Options are passed to the `midiplay` function using an object. The following keys are supported:
 *
 *  - **ref**: `string` (default: `'MyChoir'`)
 *    - Reference added to the proxifier link as `&ref=...`. Set to `false` to omit.
 *
 *  - **target**: `string` (default: `'_blank'`)
 *    - Specifies where to open the proxified link. Common values: `'_blank'`, `'_self'`, etc.
 *
 *  - **mixer**: `string` (default: `'Mixer'`)
 *    - Text to display for the link to the proxified MIDI file.
 *
 *  - **link**: `string` or `false` (default: `'Link'`)
 *    - Text to display for the link to the original MIDI file. Set to `false` to omit the link.
 *
 *  - **cls**: `string` (default: class name of the original anchor element)
 *    - Class name(s) to be applied to the new element created by `midiplay`.
 *
 *  - **src**: `string` (default: value of the `href` attribute of the original anchor)
 *    - Source URL of the MIDI file.
 *
 *  - **caption**: `string` or `false` (default: text content of the original anchor)
 *    - Text to display as a caption below the links. Set to `false` to omit the caption.
 *
 *  - **proxy**: `string` (default: `'https://choralmusictutor.com/?'`)
 *    - Base URL of the proxy service to use for the proxified link.
 *
 *  - **elementType**: `string` (default: `'div'`)
 *    - Type of HTML element to create in place of the original anchor. Common options: `'div'`, `'span'`.
 */
(function () {
  function qualifyURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.href;
  }

  function parseQueryParams(queryString) {
    var params = {};
    if (!queryString) return params;
    queryString = queryString.substring(1); // Remove the '?'
    queryString.split('&').forEach(function (pair) {
      var parts = pair.split('=');
      var key = decodeURIComponent(parts[0]);
      var value = parts[1] ? decodeURIComponent(parts[1]) : '';
      params[key] = value;
    });
    return params;
  }

  function midiplay(elements, options) {
    elements.forEach(function (el) {
      var cls = el.className;

      var defaults = {
        proxy: 'https://choralmusictutor.com/?',
        src: el.getAttribute('href'),
        caption: el.textContent,
        cls: cls,
        ref: 'MyChoir',
        target: '_blank',
        mixer: 'Mixer',
        link: 'Link',
        elementType: 'div',
      };

      var opts = Object.assign({}, defaults, options || {});

      var qSrc = qualifyURL(opts.src);

      // Construct the proxy URL without URL encoding the filename
      var proxyUrl = opts.proxy + qSrc;
      if (opts.ref) {
        proxyUrl += '&ref=' + encodeURIComponent(opts.ref);
      }

      // Create the new element
      var newEl = document.createElement(opts.elementType);
      if (el.id) {
        newEl.id = el.id;
      }
      newEl.className = opts.cls;

      // Create the Mixer link
      var mixerLink = document.createElement('a');
      mixerLink.href = proxyUrl;
      mixerLink.target = opts.target;
      mixerLink.textContent = opts.mixer;
      newEl.appendChild(mixerLink);

      // Create the original link if needed
      if (opts.link) {
        var space = document.createTextNode(' ');
        newEl.appendChild(space);

        var originalLink = document.createElement('a');
        originalLink.href = opts.src;
        originalLink.textContent = opts.link;
        newEl.appendChild(originalLink);
      }

      // Add a line break
      newEl.appendChild(document.createElement('br'));

      // Add the caption if needed
      if (opts.caption) {
        var captionSpan = document.createElement('span');
        captionSpan.textContent = opts.caption;
        newEl.appendChild(captionSpan);
      }

      // Replace the old element with the new one
      el.parentNode.replaceChild(newEl, el);
    });
  }

  // Expose the midiplay function globally for manual use
  window.midiplay = midiplay;

  // Get the script's own URL and parse query parameters
  var currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var scriptSrc = currentScript.src;
  var queryIndex = scriptSrc.indexOf('?');
  var queryParams = {};
  if (queryIndex !== -1) {
    var queryString = scriptSrc.substring(queryIndex);
    queryParams = parseQueryParams(queryString);
  }

  // Check the mode parameter
  var mode = queryParams.mode || 'auto';

  // Merge global defaults and query parameters (excluding 'mode')
  var globalOptions = window.midiplayDefaults || {};
  var options = Object.assign({}, globalOptions, queryParams);
  delete options.mode; // Remove 'mode' from options

  // Automatic activation if mode is not 'manual'
  if (mode !== 'manual') {
    document.addEventListener('DOMContentLoaded', function () {
      // Select all <a> elements where href ends with '.mid'
      var elements = document.querySelectorAll('a[href$=".mid"]');
      midiplay(elements, options);
    });
  }
})();