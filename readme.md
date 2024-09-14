# midiplay.js

**Version:** 1.0  
**License:** MIT License

## Overview

`midiplay.js` is a lightweight JavaScript library designed to transform MIDI file links on your webpage into interactive elements that integrate with the [Choral Music Tutor](https://choralmusictutor.com) by Chris Hills. This integration allows users to easily play and practice singing with MIDI files through an online mixer with specialized functionality.

The script can automatically process all MIDI links or allow for manual control, providing flexibility to suit your specific needs.

Created 2022-2024 by Werner Knudsen, wkn@kor.dk.
The code was refactored to vanilla JavaScript from jq-mid.js with many improvements.


## Table of Contents

- Features
- Installation
- Usage
  - Automatic Mode
  - Manual Mode
- Options
- Examples
  - Simple Usage
  - Advanced Usage
- Global Defaults
- Passing Options via Query Parameters
- Styling
- Security Considerations
- License

## Features

- **Automatic Transformation:** Automatically processes all `<a>` elements linking to `.mid` files to provide an interactive experience.
- **Manual Control:** Option to disable automatic processing and manually specify which elements to transform.
- **Customization:** Offers various options to customize links, captions, and other elements.
- **Global Defaults:** Ability to set global default options.
- **Proxy Integration:** Integrates with the Choral Music Tutor proxy to provide enhanced MIDI playback functionality.

## Installation

Include `midiplay.js` in your HTML page. You can place the script tag in the `<head>` or at the end of the `<body>` section.

For example:

```html
<script src="midiplay.js"></script>
```

## Usage

### Automatic Mode

By default, `midiplay.js` operates in automatic mode, processing all `<a>` elements where the `href` attribute ends with `.mid` when the DOM content is fully loaded.

Include the script in your HTML:

`<script src="midiplay.js"></script>`

Any anchor tags like the following will be transformed:

`<a href="song.mid">Play my song!</a>`

### Manual Mode

If you prefer to have manual control over which elements are processed or wish to customize options, include the script with `mode=manual` and call `midiplay` manually.

Include the script with manual mode:

`<script src="midiplay.js?mode=manual"></script>`

Then, in your script:

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    midiplay(document.querySelectorAll('a[href$=".mid"]'), {
      // Your custom options here
    });
  });
</script>
```

## Options

Options are passed to the `midiplay` function using an object. The following keys are supported:

- **ref**: `string` (default: `'MyChoir'`)
  - Reference added to the proxifier link as `&ref=...`. Set to `false` to omit.
- **target**: `string` (default: `'_blank'`)
  - Specifies where to open the proxified link. Common values: `'_blank'`, `'_self'`, etc.
- **mixer**: `string` (default: `'Mixer'`)
  - Text to display for the link to the proxified MIDI file.
- **link**: `string` or `false` (default: `'Link'`)
  - Text to display for the link to the original MIDI file. Set to `false` to omit the link.
- **cls**: `string` (default: class name of the original anchor element)
  - Class name(s) to be applied to the new element created by `midiplay`.
- **src**: `string` (default: value of the `href` attribute of the original anchor)
  - Source URL of the MIDI file.
- **caption**: `string` or `false` (default: text content of the original anchor)
  - Text to display as a caption below the links. Set to `false` to omit the caption.
- **proxy**: `string` (default: `'https://choralmusictutor.com/?'`)
  - Base URL of the proxy service to use for the proxified link.
- **elementType**: `string` (default: `'div'`)
  - Type of HTML element to create in place of the original anchor. Common options: `'div'`, `'span'`.

## Examples

### Simple Usage

Include `midiplay.js` in automatic mode:

`<script src="midiplay.js"></script>`

Your MIDI links:

`<a href="song.mid">Play my song!</a>`

This will be transformed into:

`<div class="">
  <a href="https://choralmusictutor.com/?http://yourdomain.com/path/to/song.mid&ref=MyChoir" target="_blank">Mixer</a>
  <a href="song.mid">Link</a>
  <br />Play my song!
</div>`

### Advanced Usage

Using manual mode with custom options:

First, define global defaults before including `midiplay.js`:

```html
<script>
  window.midiplayDefaults = {
    ref: 'YourChoirName',
    link: false,
    mixer: 'Open Mixer',
    caption: 'Enjoy the music!',
  };
</script>
```

Include `midiplay.js` in manual mode:

`<script src="midiplay.js?mode=manual"></script>`

Your MIDI links:

`<a href="song1.mid">Song 1</a>`  
`<a href="song2.mid">Song 2</a>`

Your custom script:

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    midiplay(document.querySelectorAll('a[href$=".mid"]'), window.midiplayDefaults);
  });
</script>
```

## Global Defaults

You can set global default options by defining `window.midiplayDefaults` before including `midiplay.js`:

```html
<script>
  window.midiplayDefaults = {
    ref: 'YourChoirName',
    link: false,
    mixer: 'Open Mixer',
    caption: 'Enjoy the music!',
    // Other options...
  };
</script>
<script src="midiplay.js"></script>
```

These defaults will be used during automatic activation unless overridden by query parameters.

## Passing Options via Query Parameters

You can pass options via query parameters in the script `src` URL. For example:

`<script src="midiplay.js?mode=auto&ref=YourChoirName&link=false"></script>`

**Note:** Passing options via query parameters is limited and should be used cautiously due to potential security risks and URL length limitations.

## Styling

By default, class names assigned to the original anchor will be applied to the new element created by `midiplay`. This makes it convenient for styling:

CSS styles for the original anchor:

```css
a {
  /* Your styles */
}
```

CSS styles for the new element:

```css
div {
  /* Your styles */
}
```

## Security Considerations

- **Query Parameters:** Be cautious when passing options via query parameters to avoid potential security risks. Do not include sensitive information in the URL.
- **User Input:** Ensure that any user-generated content passed to `midiplay` is sanitized to prevent cross-site scripting (XSS) attacks.

## License

```
MIT License

Copyright (c)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights   
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell     
copies of the Software, and to permit persons to whom the Software is         
furnished to do so, subject to the following conditions:                      

The above copyright notice and this permission notice shall be included in     
all copies or substantial portions of the Software.                           

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR    
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,      
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE   
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER        
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING       
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS  
IN THE SOFTWARE.
```