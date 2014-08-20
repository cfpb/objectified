var loan = objectify('#test',[
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
  },
  {
    name: 'loan-type',
    source: 'loan-type'
  },
  {
    name: 'foo',
    source: function() {
      return $('input').length;
    }
  },
  {
    name: 'meta',
    source: function() {
      return loan['percent-down'] * 2;
    }
  }
]);

$('input').on('change keyup', debounce(function(){
  $('textarea').val( JSON.stringify(loan) );
}, 100));