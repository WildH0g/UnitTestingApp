//jshint esversion: 9

/************************
 * TESTS
 ************************/

/**
 * Class for running unit tests
 */

let UnitTestingApp = (function () {

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

    runInGas(bool = true) {
      _runningInGas.set(this, bool);
    }

    clearConsole() {
      if (console.clear) console.clear();
    }

    getLevelInfo() {
      return _levelInfo.get(this);
    }

    setLevelInfo(value) {
      _levelInfo.set(this, value);
    }

    /**
    * Reset statistics counters
    * @return {void}
    */
    resetTestCounters() {
      _nTests.set(this, 0);
      _nFailTests.set(this, 0);
      _nPassTests.set(this, 0);
    }

    /**
     * Tests whether conditions pass or not
     * @param {Boolean | Function} condition - The condition to check
     * @param {String} message - the message to display in the console (based on _levelInfo value).
     * @return {void}
     */
    assert(condition, message) {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      _nTests.set(this, _nTests.get(this) + 1);
      try {
        if ("function" === typeof condition) condition = condition();
        if (condition) {
          _nPassTests.set(this, _nPassTests.get(this) + 1);
          let msg = (message =="") ? "" : ": " + message; // remove ":" if empty message
          if (this.getLevelInfo() > 0) console.log(`✔ PASSED${msg}`);
        }
        else {
          _nFailTests.set(this, _nFailTests.get(this) + 1);
          if (this.getLevelInfo() > 0) console.log(`❌ FAILED: ${message}`);
        }

      } catch (err) {
        _nFailTests.set(this, _nFailTests.get(this) + 1);
        if (this.getLevelInfo() > 0) console.log(`❌ FAILED: ${message} (${err})`);
      }
    }

    /**
     * Tests whether fun result is equal to expected result or not
     * @param {Boolean | Function} Condition or fun - to check
     * @param {String} expectedResult - The expected result to validate
     * @param {String} message - If present, then used as message to display to console (based on _levelInfo value). 
     *                           If message is not provided (default), then in case the result is not equal to expectedResult, 
     *                           it shows the missmatch in the form of: 
     *                           "'result' != 'expectedResult'" (numbers or booleans are not wrapped in quotes ('))
     *                           If the result is valid and message is not provided, then it only indicates the test passed.
     * @return {void}
     */
    assertEquals(fun, expectedResult, message = null) {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      _nTests.set(this, _nTests.get(this) + 1);
      let msg, result;
      //wraps in quotes (') any type except numbers or boolean
      function q(v){return (('number' === typeof v) || ('boolean' === typeof v)) ? v : "'" + v + "'"}; 
      try {
        ("function" === typeof fun) ? result = fun() : result = fun;
        let condition = expectedResult === result;
        if (condition) {
          _nPassTests.set(this, _nPassTests.get(this) + 1);
          msg = (message == null) ? "" : ": " + message;
          if (this.getLevelInfo() >= 1) console.log(`✔ PASSED${msg}`);
        }
        else {
          _nFailTests.set(this, _nFailTests.get(this) + 1);
          msg = (message == null) ?  q(result) + " != " + q(expectedResult) : message;
          if (this.getLevelInfo() >= 1) console.log(`❌ FAILED: ${msg}`);
        }

      } catch (err) {
        _nFailTests.set(this, _nFailTests.get(this) + 1);
        (message == null) ? q(result) + " != " + q(expectedResult) : message;
        if (this.getLevelInfo() >= 1) console.log(`❌ FAILED(err): ${msg} (${err})`);
      }
    }

    /**
        * Tests functions that throw error, validating message and/or type of error. If no error thrown, then the test fails.
        * @param {Function} callback - the function that you expect to return the error message
        * @param {String} errorMessage - the error message you are expecting
        * @param {String} message - the message to display to console (based on _levelInfo attribute value). 
        *        If null (default value), in case error is cautgh, it builds a predefined message as follow: 
        *         In case of wrong error type: "Wrong error type: 'CaughErrorType' != 'errorType'"
        *         In case of wrong error message: "Wrong error message: 'Caugh error message' != 'errorMessage'"
        *         In case both errorType and errorMessage are wrong: 
        *           "Wrong error type: 'CaughErrorType' != 'errorType' and Wrong error message: 'Caugh error message' != 'errorMessage'"
        *        If no error was caught, then the message will be: "No error thrown"
        * @param {Type} errorType - the error type you are expecting
        * @return {void}
        */
    catchErr(callback, errorMessage, message = null, errorType = null) {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      let isCaughtErrorType = true, isCaughtErrorMessage = false;
      
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
        if (message == null) {
          !isCaughtErrorType ? message = `Wrong error type: '${err.name}' != '${errorType.name}'` : message ="";
          if (!isCaughtErrorMessage) message += (!isCaughtErrorType ? " and wrong " : "Wrong ")
            + `error message: '${errorMessage}' != '${err.message}'`;
        }
      } finally {
        if (message == null) message = "No error thrown";
        this.assert(isCaughtErrorType && isCaughtErrorMessage, message);
      }
    }

    /**
     * Tests whether an the argument is a 2d array
     * @param {*[][]} array - any 2d-array
     * @returns {Boolean}
     */
    is2dArray(array, message) {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      try {
        if ('function' === typeof array) array = array();
        this.assert(Array.isArray(array) && Array.isArray(array[0]), message);
      } catch (err) {
        this.assert(false, `${message}: ${err}`);
      }
    }

    printHeader(text) {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      if (this.getLevelInfo() > 0) {
        console.log('*********************');
        console.log('* ' + text)
        console.log('*********************');
      }
    }

    printSubHeader(text) {
      if (!_enabled.get(this)) return;
      if (this.getLevelInfo() > 0) console.log('** ' + text);
    }

    /**
    * Logs out testing summary, If _levelInfo is > 0, informs about total tests, number of failed tests and passed tests
    * and in a second line indicating all test passed if no test failed otherwise indicating some test failed.
    * If _levelInfo <= 0, logs out only the content of the second line.
    * @return {void}
    */
    printSummary() {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      let msg = "TOTAL TESTS=%d, ❌ FAILED=%d, ✔ PASSED=%d";
      if (this.getLevelInfo() > 0) console.log(Utilities.formatString(msg, _nTests.get(this),
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
