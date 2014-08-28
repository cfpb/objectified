var els = document.getElementsByTagName('input');

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
      return els.length;
    }
  },
  {
    name: 'meta',
    source: function() {
      return loan['percent-down'] * 2;
    }
  }
]);

for ( var i = 0, len = els.length; i < len; i++ ) {
  els[i].addEventListener('keyup', debounce(function logResult() {
    document.getElementById('console').value = JSON.stringify( loan );
  }, 200));
  els[i].addEventListener('change', debounce(function logResult() {
    document.getElementById('console').value = JSON.stringify( loan );
  }, 200));
}