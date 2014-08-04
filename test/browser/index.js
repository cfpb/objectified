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

$('#percent-down').on('keyup', function(){
  var val = $( this ).val() / 100 * loan.price;
  formalize.update();
  $('#down-payment').val( val ).trigger('change');
});

$('#down-payment').on('keyup', function(){
  var val = $( this ).val() / loan.price * 100;
  $('#percent-down').val( Math.round(val*100)/100 ).trigger('change');
});


function go() {
  console.log('-------------');
  for (var property in loan) {
    console.log( property + ': ' + loan[property] );
  }
}

Object.observe( loan, go );