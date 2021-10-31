//jshint esversion: 9

/************************
 * TESTS
 ************************/

/**
 * Class for running unit tests. For more information check the following links:
 * https://github.com/WildH0g/UnitTestingApp
 * https://medium.com/geekculture/taking-away-the-pain-from-unit-testing-in-google-apps-script-98f2feee281d
 */

let UnitTestingApp = (function () {
  // Using WeakMap to keep attributes private, idea taken from here:
  // https://chrisrng.svbtle.com/using-weakmap-for-private-properties
  const _enabled = new WeakMap();
  const _runningInGas = new WeakMap();
  const _nTests = new WeakMap();      // Total number of tests executed
  const _nFailTests = new WeakMap();  // Total tests failed
  const _nPassTests = new WeakMap();  // Total tests passed
  const _levelInfo = new WeakMap();   // Level of information to show in the console (0-summary, 1-trace and test result information)

  class UnitTestingApp {
    constructor() {
      if (UnitTestingApp.instance) return UnitTestingApp.instance;

      _enabled.set(this, false);
      _runningInGas.set(this, false);
      _levelInfo.set(this, 1);
      _nTests.set(this, 0);
      _nFailTests.set(this, 0);
      _nPassTests.set(this, 0);
      UnitTestingApp.instance = this;

      return UnitTestingApp.instance;
    }

    enable() {
      _enabled.set(this, true);
    }

    disable() {
      _enabled.set(this, false);
    }

    get isEnabled() {
      return _enabled.get(this);
    }

    get isInGas() {
      return typeof ScriptApp !== 'undefined';
    }

    get runningInGas() {
      return _runningInGas.get(this);
    }

    get levelInfo() {
      return _levelInfo.get(this);
    }

    set levelInfo(value) {
      if ("number" !== typeof value) throw new TypeError("Input argument value should be a number");
      _levelInfo.set(this, value);
    }

    runInGas(bool = true) {
      _runningInGas.set(this, bool);
    }

    clearConsole() {
      if (console.clear) console.clear();
    }

    stopIfNotActive_() {// Helper function (not vissible for users of the library)
      if (!_enabled.get(this)) return true;
      if (this.isInGas !== this.runningInGas) return true;
      return false;
    }

    /**
    * Reset statistics counters: Number of tests, test passed and test failed
    * @return {void}
    */
    resetTestCounters() {
      _nTests.set(this, 0);
      _nFailTests.set(this, 0);
      _nPassTests.set(this, 0);
    }

    /**
     * Tests whether conditions pass or not. If other attributes such as enable, runningInGas indicate
     * the test is not active, no test is carried out.
     * @param {Boolean | Function} condition - The condition to check
     * @param {String} message - the message to display in the console (if attribute levelInfo >=1).
     *        if value is not provided (default) it builds a default message indicating whether the test
     *        failed os passed, or some error occurred.
     * @return {void}
     */
    assert(condition, message = null) {
      if (this.stopIfNotActive_()) return;
      _nTests.set(this, _nTests.get(this) + 1);
      try {
        if ("function" === typeof condition) condition = condition();
        if (condition) {
          _nPassTests.set(this, _nPassTests.get(this) + 1);
          message = (message == null) ? "Input argument 'condition' passed" : message;
          if (this.levelInfo >= 1) console.log(`✔ PASSED: ${message}`);
        } else {
          message = (message == null) ? "Input argument 'condition' failed" : message;
          _nFailTests.set(this, _nFailTests.get(this) + 1);
          if (this.levelInfo >= 1) console.log(`❌ FAILED: ${message}`);
        }
      } catch (err) {
        message = (message == null) ? "Something was wrong" : message;
        _nFailTests.set(this, _nFailTests.get(this) + 1);
        if (this.levelInfo >= 1) console.error(`❌ ERROR: ${message} (${err})`);
      }
    }

    /**
     * Tests whether condition result is strictly equal (===) to expected result or not.
     * If other attributes such as enable, runningInGas 
     * indicate the test is not active no test is carried out.
     * @param {Boolean | Function} Condition or fun - to check
     * @param {String} expectedResult - The expected result to validate
     * @param {String} message - If present, then used as message to display to console (if attribute levelInfo >= 1). 
     *                           If message is not provided (default), if test failed, i.e. result is not equal to expectedResult, 
     *                            it shows the missmatch in the form of: 
     *                              "'result' != 'expectedResult'" (numbers or booleans are not wrapped in quotes ('))
     *                            If the test passed, the message will be:
     *                              "'result' === 'expectedResult'" (numbers or booleans are not wrapped in quotes ('))
     *                            If some error occured, then: "Something was wrong"
     * @return {void}
     */
    assertEquals(condition, expectedResult, message = null) {
      if (this.stopIfNotActive_()) return;
      _nTests.set(this, _nTests.get(this) + 1);
  
      // wraps in quotes (') any type except numbers, booleans, null or undefined
      function q(v) {return ('number' === typeof v) || ('boolean' === typeof v) || !v ? v: `'${v}'`}
      try {
        if ("function" === typeof condition) condition = condition();
        let result = condition === expectedResult;
        if (result) {
          _nPassTests.set(this, _nPassTests.get(this) + 1);
          message = (message == null) ? q(condition) + " === " + q(expectedResult) : message;
          if (this.levelInfo >= 1) console.log(`✔ PASSED: ${message}`);
        } else {
          _nFailTests.set(this, _nFailTests.get(this) + 1);
          message = (message == null) ? q(condition) + " != " + q(expectedResult) : message;
          if (this.levelInfo >= 1) console.log(`❌ FAILED: ${message}`);
        }
      } catch (err) {
        _nFailTests.set(this, _nFailTests.get(this) + 1);
        message = (message == null) ? "Something was wrong" : message;
        if (this.levelInfo >= 1) console.error(`❌ ERROR: ${message} (${err})`);
      }
    }

    /**
    * Tests functions that throw error, validating message and/or type of error. If no error thrown, then the test fails.
    * If other attributes such as enable, runningInGas indicate the test is not active, no test is carried out.
    * @param {Function} callback - the function that you expect to return the error message
    * @param {String} errorMessage - the error message you are expecting
    * @param {String} message - the message to display to console (if attribute levelInfo >= 1). 
    *        If null (default value), in case error is cautgh, it builds a predefined message as follow: 
    *         In case of wrong error type: "Wrong error type: 'CaughErrorType' != 'errorType'"
    *         In case of wrong error message: "Wrong error message: 'Caugh error message' != 'errorMessage'"
    *         In case both errorType and errorMessage are wrong: 
    *           "Wrong error type: 'CaughErrorType' != 'errorType' and wrong error message: 'Caugh error message' != 'errorMessage'"
    *.        In case error type and error message are correct, then:
    *           "Error type and error message are correct"
    *        If no error was caught, then the message will be: "No error thrown" and it is considered the test failed.
    * @param {Type} errorType - the error type you are expecting. If null (default) the error type is not tested.
    * @return {void}
    */
    catchErr(callback, errorMessage, message = null, errorType = null) {
      if (this.stopIfNotActive_()) return;
      let isCaughtErrorMessage = false, isCaughtErrorType = true // Error type is optional so default result is true

      // Identify correct input argument by its expected type
      if ((message != null) && ("string" != typeof message)) {// invoked: catchErr(callback,string, null, Error)
        errorType = message;
        message = null;
      }

      try {
        callback();
      } catch (err) {
        if (errorType != null) isCaughtErrorType = err instanceof errorType;
        isCaughtErrorMessage = new RegExp(errorMessage).test(err);
        if (message == null) {// Building default message in case of fail
          if(!isCaughtErrorType) message = `Wrong error type: '${err.name}' != '${errorType.name}'`;
          if (!isCaughtErrorMessage){
            let msg = `error message: '${err.message}' != '${errorMessage}'`;
            message  = (isCaughtErrorType) ? `Wrong ${msg}` : `${message} and wrong ${msg}`;
          } 
        }
        // In case it didn't fail (message is still null), building default message
        if(message == null) message = (errorType == null) ? "Error message is correct" : "Error type and error message are correct";
      } finally {
        if (message == null) message = "No error thrown";
        this.assert(isCaughtErrorType && isCaughtErrorMessage, message);
      }
    }

    /**
     * Tests whether an the argument is a 2d array. If other attributes such as enable, runningInGas 
     * indicate the test is not active no test is carried out.
     * @param {*[][]} array - any 2d-array
     * @param {String} message - The message to log out. If message is not provided a default
     *                 message will be provided.
     * @returns {Boolean}
     */
    is2dArray(array, message = null) {
      if (this.stopIfNotActive_()) return;
      try {
        if ('function' === typeof array) array = array();
        let isArray = Array.isArray(array) && Array.isArray(array[0]);
        if (message == null) message = "Input argument array is " + (isArray ? "2D array" : "not a 2D array");
        this.assert(isArray, message);
      } catch (err) {
        if (message == null) message = "Something was wrong";
        this.assert(false, `${message}: ${err}`);
      }
    }

    /**
     * Logs out using header format (3 lines). It logs out to the console if attribute levelInfo >= 1.
     * If other attributes such as enable, runningInGas indicate the test is not active no information is loged out.
     */
    printHeader(text) {
      if (this.stopIfNotActive_()) return;
      if (this.levelInfo >= 1) {
        let len = ("string" === typeof text) ? text.length + 2 : 20;
        if(len > 80) len = 80;
        console.log("*".repeat(len));
        console.log('* ' + text)
        console.log("*".repeat(len));
      }
    }

    /**
     * Logs out using sub header format (1 line). It logs out to the console if attribute levelInfo >= 1.
     * If other attributes such as enable, runningInGas indicate the test is not active no information is loged out.
     */
    printSubHeader(text) {
      if (this.stopIfNotActive_()) return;
      if (this.levelInfo >= 1) console.log('** ' + text);
    }

    /**
    * Logs out testing summary, If levelInfo is >= 1, then provides test statistics, informaing about total tests, 
    * number of failed tests and passed tests and in a second line summary line indicating all test passed if no test failed 
    * otherwise indicating some test failed.
    * If levelInfo < 1, logs out only the content of the second line (summary line).
    * If other attributes such as enable, runningInGas indicate the test is not active no information is loged out.
    * @return {void}
    */
    printSummary() {
      if (this.stopIfNotActive_()) return;
      let msg = "TOTAL TESTS=%d, ❌ FAILED=%d, ✔ PASSED=%d";
      if (this.levelInfo >= 1) console.log(Utilities.formatString(msg, _nTests.get(this),
        _nFailTests.get(this), _nPassTests.get(this)));
      console.log((_nFailTests.get(this) == 0) ? "ALL TESTS ✔ PASSED" : "❌ Some Tests FAILED");
    }

    /**
     * Adds a new test to the prototype of the class
     * @param {String} name the name of the function
     * @param {Function} callback the function to add to the prototype of the class
     */
    addNewTest(name, callback) {
      UnitTestingApp.prototype[name] = callback;
    }
  }
  return UnitTestingApp;
})();

if (typeof module !== "undefined") module.exports = UnitTestingApp;
