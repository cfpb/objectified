# cf-objectify [![Build Status](https://secure.travis-ci.org/cfpb/cf-objectify.png?branch=master)](http://travis-ci.org/cfpb/cf-objectify)

> Bind HTML form elements to a JavaScript object.

## Installation

Grab the `dist/cf-objectify.js` file and include it at the bottom of your page:

```html
<script src="cf-objectify.js"></script>
```

Or use [Browserify](http://browserify.org/):

```sh
npm install cf-objectify --save
```

## Usage

Add some HTML form elements to your page with a `cf-objectify` attribute, e.g.:

```html
<input type="range" min="600" max="840" cf-objectify="credit-score">
<input type="text" placeholder="400000" cf-objectify="house-price">
<input type="text" placeholder="20000" cf-objectify="down-payment">
```
Pass `objectify` an array of objects, each with a name and source property.

```javascript
var loan = objectify([
  {
    name: 'mincredit',
    source: 'credit-score'
  },
  {
    name: 'maxcredit',
    source: 'credit-score + 20'
  },
  {
    name: 'price',
    source: 'house-price'
  },
  {
    name: 'percent-down-payment',
    source: 'down-payment / house-price * 100'
  }
]);
```

Whenever the user changes any of the HTML form elements, the `loan` object will be updated accordingly.

For example, if *credit-score* was slid to '700', '500000' was typed into the *house-price* field and '10000' was typed into *down-payment*, `console.log(loan)` would produce:

```javascript
{"mincredit":700,"maxcredit":720,"price":500000,"percent-down-payment":2}
```

Changing the *down-payment* field to '19000' results in:

```javascript
{"mincredit":700,"maxcredit":720,"price":500000,"percent-down-payment":3.8}
```

The `name` property defines the object's keys while the `source` property binds a key's value to an HTML form element. `source` can perform arithmetic operations to compute dynamic values.

## Contributing

Please read the [Contributing guidelines](CONTRIBUTING.md).

### Running Tests

To run tests, first install dependencies via npm:

```
npm install
```

Run tests with:

```
npm test
```

## License

The project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](http://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.

Software source code previously released under an open source license and then modified by CFPB staff is considered a "joint work" (see 17 USC § 101); it is partially copyrighted, partially public domain, and as a whole is protected by the copyrights of the non-government authors and must be released according to the terms of the original open-source license.

For further details, please see: http://www.consumerfinance.gov/developers/sourcecodepolicy/