// jshint esversion: 8
// import 'google-apps-script';
/**
 * require libraries if the require method exists
 */
if (typeof require !== 'undefined') {
  UnitTestingApp = require('../UnitTestingApp.js');
  Events = require('./Events.js');
  ArrayToHtml = require('./ArrayToHtml.js');
  MockData = require('../MockData.js');
}

/*****************
 * TESTS
 *****************/

/**
 * Runs the tests; insert online and offline tests where specified by comments
 * @returns {void}
 */
function runTests() {
  // const test = IS_GAS_ENV ? new UnitTestApp() : new UTA();
  const test = new UnitTestingApp();

  test.enable();
  test.clearConsole();

  const now = new Date();
  const later = new Date(new Date().setDate(now.getDate() + 14));
  const events = new Events(now, later);
  const html = new ArrayToHtml(events.get()).code;

  test.runInGas(false);
  test.printHeader('LOCAL TESTS');
  /************************
   * Run Local Tests Here
   ************************/
  
  test.catchErr(
    () => new Events('not a date', new Date(2021, 11, 31, 23, 59, 59)),
    'startTime is not a valid date-time format',
    'startTime type error successfully caught'
  );

  test.catchErr(
    () => new Events(new Date(2020, 0, 1, 0, 0, 1), 'not a date'),
    'endTime is not a valid date-time format',
    'endTime type error successfully caught'
  );

  test.is2dArray(() => events.get(), 'Calendar Data is a 2D array');
  test.assert(() =>events.get().length > 3, 'Calendar array has multiple rows');

  test.assert(
    /^<table.*<\/table>$/i.test(html),
    'The HTML code looks like a <table>'
  );

  const data = new MockData();
  const names = ['Dima', 'Masha', 'Tyson'];
  data.addData('names', names);
  test.assert(data.getData('names').join() === names.join(), 'Names array successfully registered in MockData');
  data.deleteData('names');
  
  test.catchErr(
    () => data.deleteData('non-existing key'),
    'doesn\'t exist',
    'Cannot delete data that does not exist'
  );

  test.catchErr(
    () => data.getData('names'),
    'doesn\'t exist',
    'The names array was successfully deleted from MockData'
  );

  function isEven(number) {
    this.assert(number % 2 === 0, `Number ${number} is even`);
  }

  test.addNewTest('isEven', isEven);
  test.isEven(2);
  

  test.runInGas(true);
  test.printHeader('ONLINE TESTS');
  /************************
   * Run Online Tests Here
   ************************/

  test.is2dArray(events.get(), 'Calendar Data is a 2D array');

  test.assert(
    () => /^<table.*<\/table>$/i.test(html),
    'The HTML code looks like a <table>'
  );
}

/**
 * If we're running locally, execute the tests. In GAS environment, runTests() needs to be executed manually
 */
(function () {
  /**
 * @param {Boolean} - if true, were're in the GAS environment, otherwise we're running locally
 */
  const IS_GAS_ENV = typeof ScriptApp !== 'undefined';
  if (!IS_GAS_ENV) runTests();
})();
