// jshint esversion: 8
if (typeof require !== 'undefined') {
  UnitTestingApp = require('./UnitTestingApp.js');
}

/*****************
 * TESTS 
 *****************/

/**
 * Runs the tests; insert online and offline tests where specified by comments
 * @returns {void}
 */
function runTests() {
  const test = new UnitTestingApp();
  test.enable();
  test.clearConsole();
  
  test.runInGas(false);
  test.printHeader('LOCAL TESTS');
  /************************
   * Run Local Tests Here
  ************************/

  test.runInGas(true);
  test.printHeader('ONLINE TESTS');
    /************************
   * Run Online Tests Here
   ************************/
}

/**
 * If we're running locally, execute the tests. In GAS environment, runTests() needs to be executed manually
 */
(function() {
  /**
 * @param {Boolean} - if true, were're in the GAS environment, otherwise we're running locally
 */
  const IS_GAS_ENV = typeof ScriptApp !== 'undefined';
  if (!IS_GAS_ENV) runTests();
})();