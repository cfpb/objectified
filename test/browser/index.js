var loan = objectify([
  {
    name: 'mincredit',
    source: 'credit-score',
    type: 'number'
  },
  {
    name: 'maxcredit',
    source: 'credit-score + 20',
    type: 'number'
  },
  {
    name: 'price',
    source: 'house-price',
    type: 'number'
  },
  {
    name: 'percent-down',
    source: 'down-payment / house-price * 100',
    type: 'number'
  },
  {
    name: 'foo',
    source: function() {
      return $('input').length;
    }
  }
]);

$('input').on('change keyup', debounce(function(){
  $('textarea').val( JSON.stringify(loan) );
}, 100));