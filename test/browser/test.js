var loan = objectify([
  {
    name: 'minfico',
    source: 'credit-score'
  },
  {
    name: 'maxfico',
    source: 'credit-score + 20'
  },
  {
    name: 'price',
    source: 'house-price'
  },
  {
    name: 'percent-down',
    source: 'down-payment / house-price * 100'
  }
]);


$('input').on('change', function(){
  console.log(loan);
});