//jshint esversion: 9

/************************
 * TESTS
 ************************/

/**
 * Class for running unit tests
 */

let UnitTestingApp = (function () {

  _nTests = 0;      // Total number of tests executed
  _nFailTests = 0;  // Total test failed
  _nPassTests = 0;  // Total test passed
  _levelInfo = 1;   // Level of information to show in the output (0-summary, 1-trace and test result information)
  const _enabled = new WeakMap();
  const _runningInGas = new WeakMap();

  class UnitTestingApp {
    constructor() {
      if (UnitTestingApp.instance) return UnitTestingApp.instance;

      _enabled.set(this, false);
      _runningInGas.set(this, false);
      this._nTests = 0;
      this._nFailTests = 0;
      this._nPassTests = 0;
      this._levelInfo = 1;
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
      return this._levelInfo;
    }

    setLevelInfo(value) {
      this._levelInfo = value;
    }

    resetTestCounters() {
      this._nFailTests = 0;
      this._nPassTests = 0;
      this._nTests = 0;
    }

    /**
     * Tests whether conditions pass or not
     * @param {Boolean | Function} condition - The condition to check
     * @param {String} message - the message to display in the console (based on _levelInfo value)
     * @return {void}
     */
    assert(condition, message) {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      this._nTests++;
      try {
        if ("function" === typeof condition) condition = condition();
        if (condition) {
          this._nPassTests++;
          if (this._levelInfo > 0) { console.log(`✔ PASSED: ${message}`) };
        }
        else {
          this._nFailTests++;
          if (this._levelInfo > 0) { console.log(`❌ FAILED: ${message}`) };
        }

      } catch (err) {
        this._nFailTests++;
        if (this._levelInfo > 0) { console.log(`❌ FAILED: ${message} (${err})`) };
      }
    }

    /**
     * Tests whether fun result is equal to expected result or not
     * @param {Function} fun - The function to evaluate
     * @param {String} expectedResult - The expected result to validate
     * @param {String} message - If present, then used as message to display in the console (based on _levelInfo value). 
     *                           If message is not present, then in case the result is not equal, it shows the missmatch
     *                           In the form of: "result != expectedResult". If the result is valid and message is not 
     *                           provided, then it only indicates the test passed.
     * @return {void}
     */
    assertEquals(fun, expectedResult, message = null) {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      this._nTests++;
      let msg, result;

      try {
        if ("function" === typeof fun) {
          result = fun();
        }
        let condition = expectedResult == result;
        if (condition) {
          this._nPassTests++;
          msg = (message == null) ? "" : ": " + message;
          if (this._levelInfo >= 1) { console.log(`✔ PASSED${msg}`) };
        }
        else {
          this._nFailTests++;
          msg = (message == null) ? result + " != " + expectedResult : message;
          if (this._levelInfo >= 1) { console.log(`❌ FAILED: ${msg}`) };
        }

      } catch (err) {
        this._nFailTests++;
        this.errorMsg = result + " != " + expectedResult;
        msg = (message == null) ? result + " != " + expectedResult : message;
        if (this._levelInfo >= 1) { console.log(`❌ FAILED(err): ${msg} (${err})`) };
      }
    }


    /**
     * Tests functions that throw error messages
     * @param {Function} callback - the function that you expect to return the error message
     * @param {String} errorMessage - the error message you are expecting
     * @param {String} message - the message to display in the console
     * @return {void}
     */
    catchErr(callback, errorMessage, message) {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      let error;
      let isCaught = false;
      try {
        callback();
      } catch (err) {
        error = err;
        isCaught = new RegExp(errorMessage).test(err);
      } finally {
        this.assert(isCaught, message);
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
        if (typeof array === 'function') array = array();
        this.assert(Array.isArray(array) && Array.isArray(array[0]), message);
      } catch (err) {
        this.assert(false, `${message}: ${err}`);
      }
    }

    printHeader(text) {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      if (_levelInfo > 0) {
        console.log('*********************');
        console.log('* ' + text)
        console.log('*********************');
      }
    }

    printSubHeader(text) {
      if (!_enabled.get(this)) return;
      if (this._levelInfo > 0) { console.log('** ' + text) };
    }

    printSummary() {
      if (!_enabled.get(this)) return;
      if (this.isInGas !== this.runningInGas) return;
      if (this._levelInfo > 0) {
        console.log('TOTAL TESTS= ' + this._nTests + ', ❌ FAILED=' + this._nFailTests + ', ✔ PASSED=' + this._nPassTests);
      }
      console.log((this._nFailTests == 0) ? "ALL TESTS ✔ PASSED" : "❌ Some Tests Failed");
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
