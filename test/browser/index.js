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
    name: 'percent-down',
    source: 'down-payment / house-price * 100'
  }
]);

$('input').on('change keyup', debounce(function(){
  $('textarea').val( JSON.stringify(loan) );
}, 300));