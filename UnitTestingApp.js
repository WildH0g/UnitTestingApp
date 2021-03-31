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

  class UnitTestingApp {
    constructor() {
      if (UnitTestingApp.instance) return UnitTestingApp.instance;
      
      _enabled.set(this, false);
      _runningInGas.set(this, false);
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

    /**
     * Tests whether conditions pass or not
     * @param {Boolean | Function} condition - The condition to check
     * @param {String} message - the message to display in the onsole
     * @return {void}
     */
    assert(condition, message) {
      if(!_enabled.get(this)) return;
      if(this.isInGas !== this.runningInGas) return;
      try {
        if ("function" === typeof condition) condition = condition();
        if (condition) console.log(`✔ PASSED: ${message}`);
        else console.log(`❌ FAILED: ${message}`);
      } catch(err) {
        console.log(`❌ FAILED: ${message} (${err})`);
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
      if(!_enabled.get(this)) return;
      if(this.isInGas !== this.runningInGas) return;
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
      if(!_enabled.get(this)) return;
      if(this.isInGas !== this.runningInGas) return;
      try {
        if (typeof array === 'function') array = array();
        this.assert(Array.isArray(array) && Array.isArray(array[0]), message);
      } catch(err) {
        this.assert(false, `${message}: ${err}`);
      }
    }

    printHeader(text) {
      if(this.isInGas !== this.runningInGas) return;  
      console.log('*********************');
      console.log('* ' + text);
      console.log('*********************');
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