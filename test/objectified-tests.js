function setUpTest(name, file) {

  casper.test.begin(name, 12, function suite(test) {

    casper.start(file, function() {
      test.assertTitle('Test page', 'page title is set correctly');
      test.assertExists('textarea', 'textarea exists');
    });

    casper.then(function() {
      this.sendKeys('[name=house-price]', '400000');
      test.assertField('house-price', '400000');
      this.wait(400, function() {
        test.assertField('console', '{\"mincredit\":700,\"maxcredit\":720,\"price\":400000,\"percent-down\":5,\"loan-type\":\"conf\",\"foo\":3,\"meta\":10}');
      });
    });

    casper.then(function() {
      this.sendKeys('[name=down-payment]', '10000');
      test.assertField('down-payment', '10000');
      this.wait(400, function() {
        test.assertField('console', '{\"mincredit\":700,\"maxcredit\":720,\"price\":400000,\"percent-down\":2.5,\"loan-type\":\"conf\",\"foo\":3,\"meta\":5}');
      });
    });

    casper.then(function() {
      this.fill('form#test', {
        'down-payment': ''
      }, false);
      this.sendKeys('[name=down-payment]', '4000');
      test.assertField('down-payment', '4000');
      this.wait(400, function() {
        test.assertField('console', '{\"mincredit\":700,\"maxcredit\":720,\"price\":400000,\"percent-down\":1,\"loan-type\":\"conf\",\"foo\":3,\"meta\":2}');
      });
    });

    casper.then(function() {
      this.fill('form#test', {
        'down-payment': ''
      }, false);
      this.sendKeys('[name=down-payment]', '$4,000');
      test.assertField('down-payment', '$4,000');
      this.wait(400, function() {
        test.assertField('console', '{\"mincredit\":700,\"maxcredit\":720,\"price\":400000,\"percent-down\":1,\"loan-type\":\"conf\",\"foo\":3,\"meta\":2}');
      });
    });

    casper.then(function() {
      this.fill('form#test', {
        'down-payment': '',
        'loan-type': 'fha'
      }, false);
      test.assertField('loan-type', 'fha');
      this.wait(400, function() {
        test.assertField('console', '{\"mincredit\":700,\"maxcredit\":720,\"price\":400000,\"percent-down\":5,\"loan-type\":\"fha\",\"foo\":3,\"meta\":10}');
      });
    });

    casper.run(function() {
      test.done();
    });
  });
}

setUpTest('Native selector test', 'test/index.html');
setUpTest('jQuery selector test', 'test/index-jquery.html');