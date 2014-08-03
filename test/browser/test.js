(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * cf-formalize
 *
 * A work of the public domain from the Consumer Financial Protection Bureau.
 */

'use strict';

var debounce = require('debounce'),
    unformatUSD = require('unformat-usd');

var formalizer = {},
    formalized = {},
    cachedElements = {};

function _tokenize( str ) {

  var arr = str.split(' '),
      tokens = [],
      patterns;

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

  // @TODO DRY this up.
  for ( var i = 0, len = arr.length; i < len; i++ ) {
    if ( patterns.operator.test(arr[i]) ) {
      _pushToken( arr[i].match(patterns.operator)[0], 'operator' );
    } else if ( patterns.number.test(arr[i]) ) {
      _pushToken( unformatUSD( arr[i].match(patterns.number)[0] ), 'number' );
    } else {
      _pushToken( arr[i], 'name' );
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
 * This only grabs the first applicable element.
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function _getDOMElement( str ) {
  var el = document.querySelector( '[cf-formalize=' + str + ']' );
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
function _deTokenize( arr ) {
  var el,
      tokens = [];
  for ( var i = 0, len = arr.length; i < len; i++ ) {
    var token = arr[i];
    if ( token.type === 'operator' || token.type === 'number' ) {
      tokens.push( token.value );
    } else {
      try {
        // @TODO accommodate radio and other elements that don't use .value
        el = _getDOMElement( arr[i].value );
        tokens.push( el.value || 0 );
      } catch ( e ) {}
    }
  }
  return eval( tokens.join(' ') );
}

function _parseSource( source ) {
  var src = _tokenize( source );
  if ( src ) {
    return src;
  }
  return null;
}

function formalize( props ) {
  var i,
      len;
  for ( i = 0, len = props.length; i < len; i++ ) {
    if ( props[i].hasOwnProperty('source') ) {
      formalizer[ props[i].name ] = _parseSource( props[i].source );
    } else {
      formalizer[ props[i].name ] = undefined;
    }
  }
  for ( i = 0, len = formalizer.length; i < len; i++ ) {

  }
  return formalized;
}

function update() {
  for (var key in formalizer) {
    formalized[ key ] = _deTokenize( formalizer[ key ] );
  }
}

var controllers = document.querySelectorAll('[cf-formalize]');

for ( var i = 0, len = controllers.length; i < len; i++ ) {

  controllers[i].addEventListener('change', function(){
    update();
  });

  controllers[i].addEventListener('keyup', debounce(function(){
    update();
  }, 100));

}

module.exports = formalize;
module.exports.update = update;
},{"debounce":2,"unformat-usd":4}],2:[function(require,module,exports){

/**
 * Module dependencies.
 */

var now = require('date-now');

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

},{"date-now":3}],3:[function(require,module,exports){
module.exports = Date.now || now

function now() {
    return new Date().getTime()
}

},{}],4:[function(require,module,exports){
/**
 * @param  {string} str  USD-formatted string to be converted into a number.
 * @return {string}      The converted number OR the original argument if a 
 *   string was not passed.
 */
var unFormatUSD = function( str ) {
  return typeof str === 'string' ? parseFloat(str.replace(/[^0-9\.]/g,'')) || str : str;
};

module.exports = unFormatUSD;
},{}],5:[function(require,module,exports){
var formalize = require('../..'),
    debounce = require('debounce');

var loan = formalize([
  {
    name: 'minfico',
    default: 700,
    source: 'credit-score'
  },
  {
    name: 'maxfico',
    default: 700,
    source: 'credit-score + 20'
  },
  {
    name: 'price',
    default: 200000,
    source: 'house-price'
  },
  {
    name: 'down',
    default: 200000,
    source: 'down-payment'
  },
  {
    name: 'percent-down',
    default: 10,
    source: 'down-payment / house-price * 100'
  }
]);

$('#percent-down').on('keyup', debounce(function(){
  var val = $( this ).val() / 100 * loan.price;
  $('#down-payment').val( val ).trigger('change');
  formalize.update();
}, 0));

$('#down-payment').on('keyup', debounce(function(){
  var val = $( this ).val() / loan.price * 100;
  $('#percent-down').val( Math.round(val*100)/100 ).trigger('change');
}, 0));


function go() {
  console.log('-------------');
  for (var property in loan) {
    console.log( property + ': ' + loan[property] );
  }
}

Object.observe( loan, go );
},{"../..":1,"debounce":2}]},{},[5])