!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.objectify=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*
 * objectified
 *
 * A work of the public domain from the Consumer Financial Protection Bureau.
 */

var debounce = _dereq_('debounce'),
    unFormatUSD = _dereq_('unformat-usd');

var jQueryIsPresent = typeof jQuery !== 'undefined',
    // @TODO Use this object to cache references to elements.
    cachedElements = {};

/**
 * Split source strings and taxonimize language.
 * @param  {string|function} src String to tokenize. If it's a function, leave it.
 * @return {array}      Array of objects, each a token.
 */
function _tokenize( prop ) {

  var tokens = [],
      patterns,
      src = prop.source;

  src = typeof src !== 'string' ? src : src.split(' ');

  patterns = {
    operator: /^[+\-\*\/\%]$/, // +-*/%
    // @TODO Improve this regex to cover numbers like 1,000,000
    number: /^\$?\d+[\.,]?\d+$/
  };

  function _pushToken( val, type ) {
    var token = {
      value: val,
      type: type
    };
    tokens.push( token );
  }

  // Return early if it's a function.
  if ( typeof src === 'function' ) {
    _pushToken( src, 'function' );
    return tokens;
  }

  // @TODO DRY this up.
  for ( var i = 0, len = src.length; i < len; i++ ) {
    if ( patterns.operator.test(src[i]) ) {
      _pushToken( src[i].match(patterns.operator)[0], 'operator' );
    } else if ( patterns.number.test(src[i]) ) {
      _pushToken( parseFloat( src[i].match(patterns.number)[0] ), 'number' );
    } else {
      _pushToken( src[i], 'name' );
    }
  }
  return tokens;

}

/**
 * Returns the first element matching the provided string.
 * @param  {object} container DOM element node of parent container.
 * @param  {string} str Value to be provided to the selector.
 * @return {object}     Element object.
 */
function _getDOMElement( container, str ) {
  var el = container.querySelector( '[name=' + str + ']' );
  return el ? el : null;
}

/**
 * Process an array of tokens, returning a single value.
 * @param  {object} container DOM element node of parent container.
 * @param  {array} arr Array of tokens created from _tokenize.
 * @return {string|number} The value of the processed tokens.
 */
function _deTokenize( container, arr ) {
  var val,
      tokens = [];

  function _parseFloat( str ) {
    return parseFloat( unFormatUSD(str) );
  }

  for ( var i = 0, len = arr.length; i < len; i++ ) {
    var token = arr[i];
    // @TODO DRY this up.
    if ( token.type === 'function' ) {
      tokens.push( token.value );
    } else if ( token.type === 'operator' || token.type === 'number' ) {
      tokens.push( token.value );
    } else {
      try {
        // @TODO accommodate radio and other elements that don't use .value
        val = _getDOMElement( container, token.value );
        // Grab the value or the placeholder or default to 0.
        val = unFormatUSD( val.value || val.getAttribute('placeholder') || 0 );
        // Make it a number if it's a number.
        val = isNaN( val ) ? val : _parseFloat( val );
        tokens.push( val );
      } catch ( e ) {}
    }
  }
  // @TODO This feels a little repetitive.
  if ( typeof tokens[0] === 'function' ) {
    return tokens[0]();
  }
  val = tokens.length > 1 ? eval( tokens.join(' ') ) : tokens.join(' ');
  return isNaN( val ) ? val : _parseFloat( val );
}

/**
 * Update the exported object
 * @param  {object} container DOM element node of parent container.
 * @param {object} src Tokenize source object.
 * @param {object} dest Object to be updated.
 * @return {undefined}
 */
function update( container, src, dest ) {
  for ( var key in src ) {
    // @TODO Better handle safe defaults.
    dest[ key ] = _deTokenize( container, src[key] );
  }
}

/**
 * Constructor that processes the provided sources.
 * @param  {array} props Array of objects
 * @return {object} Returns a reference to the object that is periodically updated.
 */
function objectify( id, props ) {

      // Stores references to elements that will be monitored.
  var objectifier = {},
      // Stores final values that are sent to user.
      objectified = {},
      container = document.querySelector( id );

  for ( var i = 0, len = props.length; i < len; i++ ) {
    if ( props[i].hasOwnProperty('source') ) {
      objectifier[ props[i].name ] = _tokenize( props[i] );
    } else {
      objectifier[ props[i].name ] = undefined;
    }
  }

  function _update() {
    update( container, objectifier, objectified );
  }

  setListeners( container, _update );

  objectified.update = _update;

  return objectified;
}

function setListeners( container, cb ) {

  // IE8 doesn't support querySelectorAll so use jQuery if possible.
  var controllers = jQueryIsPresent ? $( container ).find( '[name]' ) : container.querySelectorAll( '[name]' ),
      len = controllers.length,
      i = 0;

  // @TODO Use event delegation and not this silliness.
  for ( ; i < len; i++ ) {
    controllers[i].addEventListener('change', cb);
    controllers[i].addEventListener('keyup', debounce(cb, 100));
  }

}

module.exports = objectify;
},{"debounce":2,"unformat-usd":4}],2:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var now = _dereq_('date-now');

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function debounced() {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

},{"date-now":3}],3:[function(_dereq_,module,exports){
module.exports = Date.now || now

function now() {
    return new Date().getTime()
}

},{}],4:[function(_dereq_,module,exports){
/**
 * @param  {string} str  USD-formatted string to be converted into a number.
 * @return {string}      The converted number OR the original argument if a 
 *   string was not passed.
 */
var unFormatUSD = function( str ) {
  return typeof str === 'string' ? parseFloat(str.replace(/[^0-9\.]/g,'')) || str : str;
};

module.exports = unFormatUSD;
},{}]},{},[1])
(1)
});