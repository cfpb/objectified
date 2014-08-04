# What we need to happen

Given our model (vanilla JS object) and our view (HTML inputs), any changes to the object should be reflected in the HTML. Likewise, any changes to the HTML inputs should update the object. Some values (maxfico, loan_amount, #percent-down) are computed.

## Model

```js
var loan = {
  minfico: 700, // this is the value selected in the range input
  maxfico: 720, // this is 20 more than the range input value
  price: 200000, // house price field
  loan_amount: 180000 // house price minus down payment
}
```

## View

```html
<input id="credit-score" type="range" min="600" max="840" step="20" value="700" class="recalc">

<input type="text" placeholder="250,000" name="house-price" class="recalc" id="house-price">

<!-- #percent-down is #down-payment / #house-price * 100 -->
<input type="text" placeholder="10" name="percent-down" maxlength="2" class="recalc down-calc" id="percent-down">
<input type="text" placeholder="20,000" name="down-payment" class="recalc down-calc" id="down-payment">
```