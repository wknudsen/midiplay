/**
 *  jq-mid v0.1
 *  Copyright (c) 2022 by Werner Knudsen, licensed under the MIT License.
 *  Intended to proxify links to midi files with the Choral Music Tutor by Chris Hills,
 *  an online mixer implemented as a web app with special functionality for singing practice
 *  at https://choralmusictutor.com.
 * 
 *  This script is adapted from the mp3 player embedding script
 *  jmp3 v0.2.1 by Sean O (http://www.sean-o.com/jquery/jmp3)
 *  Copyright (c) 2006 Sean O (http://www.sean-o.com)
 *  Licensed under the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *
 *  Simple Usage:
 *  ------------
 * 
 *  Include jQuery and the jq-mid.js script in the <head> section of an HTML page.
 * 
 *  $('a.mid').mid(); //Activate on class "mid"
 *
 *  This sample script, placed at the bottom of the page, will turn an anchor like this:
 *
 *  <a href="song.mid" class="mid">Play my song!</a>
 *
 *  into a div like this:
 *
 *  <div class="mid">
 *  <a href="https://choralmusictutor.com?FullyQualifiedURL/song.mid&ref=MyChoir">Mixer</a>
 *  <a href="song.mid>Link</a>
 *  <br />Play my song!
 *  </div>
 *
 *
 *  Advanced Usage:
 *  --------------
 *      $('a.mid').mid({
 *          ref:      'StaplefordChoralSociety',   // Set reference to transfer to the proxy
 *          link:     false                        // Suppress link to original midi file
 *      });
 *
 * Instead of activating the function for class "mid" you can activate it 
 * for all .mid or .midi files with
 *
 * $("a[href$='.mid']").mid();
 * $("a[href$='.midi']").mid();
 *
 *  By default, classnames assigned to the anchor will be assigned to the div.  This makes it
 *  convenient for styling:
 *
 *  <style type="text/css">
 *      a.mid { ... }
 *      div.mid { ... }
 *  </style>
 *
 *  Options are passed to the 'mid' function using a single Object.  The options
 *  Object is a hash of key/value pairs.  The following option keys are supported:
 *
 *  Options:
 *  -------
 *  ref:         Reference added to proxifier link (&ref=...), or false (default: 'MyChoir')
 *  target:      Target to opening proxified link (default: '_blank')
 *  mixer:       Text to show for link to proxified file (default: 'Mixer')
 *  link:        Text to show for link to original file, or false (default: 'Link')
 *  cls:         classname(s) to be applied to new element (default: anchor classname)
 *  src:         source location of mid file (default: value of href attr)
 *  caption:     text to be used as caption; use false for no caption (default: value of anchor text)
 *  proxy:       full path to the proxy URL (default: 'https://choralmusictutor.com?')
 *  elementType: type of element to replace anchor (span, div, etc) (default: 'div')
 *
 */

function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.href;
}

jQuery.fn.mid = function(options){
    return this.each(function(){
        var $this = jQuery(this);
        var cls = this.className;

        var opts = jQuery.extend({
            proxy:        'https://choralmusictutor.com/?',
            src:          $this.attr('href'),
            caption:      $this.text(),
            cls:          cls,
            ref:          'MyChoir',
            target:       '_blank',
            mixer:        'Mixer',
            link:         'Link',
            elementType:  'div'
        }, options || {});
        
        var qSrc = qualifyURL(opts.src);
        
        var a = ['<a href="' + opts.proxy + ''];
        a.push(qSrc);
        if (opts.ref) a.push('&ref=' + encodeURIComponent(opts.ref));
        a.push('" target="' + opts.target + '"');
        a.push('">'+ opts.mixer + '</a>');
        if (opts.link) {
          a.push(' <a href="' + opts.src + '"');
          a.push('">' + opts.link + '</a>');
        }
        a.push('<br />');
        if (opts.caption) a.push('<span>' + opts.caption + '</span>');

        // convert anchor to span/div/whatever...
        var id = this.id ? (' id="'+this.id+'"') : '';
        var $el = jQuery('<' + opts.elementType + id + ' class="' + opts.cls + '"></' + opts.elementType + '>');
        $this.after($el).remove();
        $el.html(a.join(''));

        // Eolas workaround for IE (Thanks Kurt!)
        //if(jQuery.browser.msie){ $el[0].outerHTML = $el[0].outerHTML; }
    });
};
