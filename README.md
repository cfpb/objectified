:warning: This project is archived and no longer maintained :warning: 

---
---
---

# objectified 

> Bind HTML form elements to a JavaScript object.

## Installation

Grab the `dist/objectified.js` file and include it at the bottom of your page:

```html
<script src="objectified.js"></script>
```

Or use [Browserify](http://browserify.org/):

```sh
npm install objectified --save
```

## Usage

Add some HTML form elements to your page, e.g.:

```html
<form id="mortgage">
  <input type="range" min="600" max="840" value="700" name="credit-score">
  <input type="text" placeholder="400000" name="house-price">
  <input type="text" placeholder="20000" name="down-payment">
</form>
```
Pass `objectify` a container selector (such as the form's id) and an array of objects, each with a name and source property.

```javascript
var loan = objectify('#mortgage', [
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
  },
  {
    name: 'viewport-width',
    source: function() {
      return document.documentElement.clientWidth;
    }
  }
]);
```

You'll get:

```javascript
> console.log(loan);
{"mincredit":700,"maxcredit":720,"price":400000,"percent-down-payment":5,"viewport-width":705}
```

Changing any values in the HTML form will update the `loan` object.

The `name` property defines the object's keys while the `source` property binds the object's values to HTML form elements. `source` can optionally perform arithmetic operations to compute dynamic values. In place of a string, a function can be provided to return a value.

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
