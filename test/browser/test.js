casper.test.begin('Main page test', 8, function suite(test) {

    casper.start('test/browser/index.html', function() {
        test.assertTitle('Test page', 'page title is set correctly');
        test.assertExists('textarea', 'textarea exists');
    });

    casper.then(function() {
        this.sendKeys('[name=house-price]', '400000');
        test.assertField('house-price', '400000');
        this.wait(400, function() {
            test.assertField('console', '{\"mincredit\":\"700\",\"maxcredit\":720,\"price\":\"400000\",\"percent-down\":0}');
        });
    });

    casper.then(function() {
        this.sendKeys('[name=down-payment]', '10000');
        test.assertField('down-payment', '10000');
        this.wait(400, function() {
            test.assertField('console', '{\"mincredit\":\"700\",\"maxcredit\":720,\"price\":\"400000\",\"percent-down\":2.5}');
        });
    });

    casper.then(function() {
        this.fill('form#test', {
            'down-payment': ''
        }, false);
        this.sendKeys('[name=down-payment]', '4000');
        test.assertField('down-payment', '4000');
        this.wait(400, function() {
            test.assertField('console', '{\"mincredit\":\"700\",\"maxcredit\":720,\"price\":\"400000\",\"percent-down\":1}');
        });
    });

    casper.run(function() {
        test.done();
    });
});

// var loan = formalize([
//   {
//     name: 'minfico',
//     default: 700,
//     source: 'credit-score'
//   },
//   {
//     name: 'maxfico',
//     default: 700,
//     source: 'credit-score + 20'
//   },
//   {
//     name: 'price',
//     default: 200000,
//     source: 'house-price'
//   },
//   {
//     name: 'down',
//     default: 200000,
//     source: 'down-payment'
//   },
//   {
//     name: 'percent-down',
//     default: 10,
//     source: 'down-payment / house-price * 100'
//   }
// ]);

// $('#percent-down').on('keyup', function(){
//   var val = $( this ).val() / 100 * loan.price;
//   formalize.update();
//   $('#down-payment').val( val ).trigger('change');
// });

// $('#down-payment').on('keyup', function(){
//   var val = $( this ).val() / loan.price * 100;
//   $('#percent-down').val( Math.round(val*100)/100 ).trigger('change');
// });


// function go() {
//   console.log('-------------');
//   for (var property in loan) {
//     console.log( property + ': ' + loan[property] );
//   }
// }

// Object.observe( loan, go );