/*
 * cf-objectify
 *
 * A work of the public domain from the Consumer Financial Protection Bureau.
 */

var debounce = require('debounce'),
    unformatUSD = require('unformat-usd');

// The HTML attribute used for selecting inputs.
var ATTR = 'cf-objectify';

    // Stores references to elements that will be monitored.
var objectifier = {},
    // Stores final values that are sent to user.
    objectified = {},
    // @TODO Use this object to cache references to elements.
    cachedElements = {};

/**
 * Split source strings and taxonimize language.
 * @param  {string|function} src String to tokenize. If it's a function, leave it.
 * @return {array}      Array of objects, each a token.
 */
function _tokenize( src ) {

  var tokens = [],
      patterns;

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
      _pushToken( unformatUSD( src[i].match(patterns.number)[0] ), 'number' );
    } else {
      _pushToken( src[i], 'name' );
    }
  }
  return tokens;

}

/**
 * _getDOMElementValue returns a reference to the element's value.
 * This needs to be modified to work with radios.
 * @param  {[type]} $el [description]
 * @return {[type]}     [description]
 */
// function _getDOMElementValue( el ) {
//   return el.value;
// }

/**
 * Returns the first element matching the provided string.
 * @param  {string} str Value to be provided to the selector.
 * @return {object}     Element object.
 */
function _getDOMElement( str ) {
  var el = document.querySelector( '[' + ATTR + '=' + str + ']' );
  return el ? el : null;
}

// down = [{
//   type: "name"
//   value: "house-price"
// },{
//   type: "operator"
//   value: "-"
// },{
//   type: "name"
//   value: "down-payment"
// }]
/**
 * [_deTokenize description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function _deTokenize( arr ) {
  var el,
      tokens = [];
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
        el = _getDOMElement( arr[i].value );
        // Grab the value or the placeholder or default to 0.
        el = unformatUSD( el.value || el.getAttribute('placeholder') || 0 );
        tokens.push( el );
      } catch ( e ) {}
    }
  }
  // @TODO This feels a little repetitive.
  if ( typeof tokens[0] === 'function' ) {
    return tokens[0]();
  }
  return tokens.length > 1 ? eval( tokens.join(' ') ) : tokens.join(' ');
}

/**
 * [_parseSource description]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
function _parseSource( source ) {
  var src = _tokenize( source );
  if ( src ) {
    return src;
  }
  return null;
}

/**
 * [objectify description]
 * @param  {[type]} props [description]
 * @return {[type]}       [description]
 */
function objectify( props ) {
  var i,
      len;
  for ( i = 0, len = props.length; i < len; i++ ) {
    if ( props[i].hasOwnProperty('source') ) {
      objectifier[ props[i].name ] = _parseSource( props[i].source );
    } else {
      objectifier[ props[i].name ] = undefined;
    }
  }
  for ( i = 0, len = objectifier.length; i < len; i++ ) {

  }
  return objectified;
}

/**
 * [update description]
 * @return {[type]} [description]
 */
function update() {
  for (var key in objectifier) {
    objectified[ key ] = _deTokenize( objectifier[ key ] );
  }
}

var controllers = document.querySelectorAll('[' + ATTR + ']'),
    len = controllers.length,
    i = 0;

for ( ; i < len; i++ ) {
  controllers[i].addEventListener('change', update);
  controllers[i].addEventListener('keyup', debounce(update, 100));
}

module.exports = objectify;
module.exports.update = update;