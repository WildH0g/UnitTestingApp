// jshint esversion: 8
/**
 * Stores mock data that's not available locally to enable offline testing. 
 */
let MockData = (function() {
  const _registry = new WeakMap();
  
  class MockData {
    constructor() {
      if (MockData.instance) return MockData.instance;
      _registry.set(this, {});
      MockData.instance = this;
      return MockData.instance;
    }

    /**
     * Adds mock data
     * @param {String} key the key of the data 
     * @param {*} value the actual data
     * @returns {this}
     */
    addData(key, value) {
      if (_registry.get(this)[key]) throw new Error(`Key ${key} already exists`);
      if (typeof key !== 'string') throw new Error('The key must be of type string');
      _registry.get(this)[key] = value;
      return this; 
    }

    /**
     * Retrieves mock Data
     * @param {String} key 
     * @returns {*}
     */
    getData(key) {
      if (!_registry.get(this)[key]) throw new Error(`Data with key ${key} doesn't exist`);
      return _registry.get(this)[key];
    }
    
    /**
     * Deletes mock data
     * @param {*} key 
     * @returns {thiss}
     */
    deleteData(key) {
      if (!_registry.get(this)[key]) throw new Error(`Data with key ${key} doesn't exist`);
      delete _registry.get(this)[key];
      return this;
    }
  }
  return MockData;
})();

if (typeof module !== 'undefined') module.exports = MockData;