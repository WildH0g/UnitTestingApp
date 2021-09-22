# UnitTestingApp for Google Apps Script

## Introduction

This is a unit testing library with Google Apps Script in mind. It has 0 depencies, lightweight and can run online in the Google Apps Script environment as well as offline in you IDE.

## How to Install

Git clone the following files and copy them into your project:

1. `UnitTestingApp.js`
1. `MockData.js` (for running tests offline)

I also recommend that you use the `TestingTemplate.js` to set up your tests.

## How to Use

Inside there is a small class called `UnitTestingApp` with just a few simple functions (lightweight and easy to maintain, remember?). There is also the `MockData` class that allows you to add and work with, well, mock data, which is especially important when running tests offline.

### Enabling, Disabling and Checking the Status of the Tests

The 2 methods, `enable()`, `disable()` and the `isEnabled` property are hopefully self-explanatory. The syntax is:

```javascript
const test = new UnitTestApp();
test.enable(); // tests will run below this line
// code
if(test.isEnabled) {
  // code
}

test.disable(); // tests will not run below this line
```

### Choosing the Environment with runInGas(Boolean)

The `runInGas(Boolean)` function allows us to choose which environment we want the tests that follow to run in, like so:

```javascript
const test = new UnitTestingApp();

test.runInGas(false);
// local tests

test.runInGas(true);
// switch to online tests in Google Apps Script environment
```

Then we have the actual built-in testing methods, `assert()`, `catchErr()` and `is2dArray()`.

### Control level of information to log out

The function `setLevelInfo(value)` controls the level information to be reported through the console. If `value`is equal to `0`, it runs in silent mode, i.e. no information will be reported. The only exception from print-family functions is `printSummary()` that under this mode just logs out a single summary line. For example if no errors found, the output will be:

```ALL TESTS ✔ PASSED```

if at least one test failed then it logs out the following information:

```❌ Some Tests Failed```

This setup is usufull for large tests where we just want to add some incremental test and to have just a minimal output about the overall testing result.

Here is how the level of information can be specified for silent mode:

```javascript
test.setLevelInfo(0);
```
If value is `1`(default value) it means trace information will log out the result per each test, indicating if the test fails or passed. Depending on the specific testing function it will log out different information, for example, let´s says we want to test the following function:

```javascript
function addTwoValues (a, b) {
  return a + b;
}
```

then invoking the following assert function:

```javascript
test.assertEquals(() => addTwoValues(1,2),3); // where expected result is 3
```

will return

```
✔ PASSED
```

on contrary, if we invoke the function with a wrong expected result:

```javascript
test.assertEquals(() => addTwoValues(1,2),4); // where expected result is 4
```

will return

```
❌ FAILED: 3 != 4
```
If we invoke `assertEquals` including its optional input argument `message`, then the output information will be on each case the information specificied by this input argument

```javascript
test.assertEquals(() => addTwoValues(1,2),3, "Expected result: 1+2 = 3"); 
test.assertEquals(() => addTwoValues(1,2),4, "Wrong result because 1+2 should be equal to 3");
```

The output will be:

```
✔ PASSED: Expected result: 1+2 = 3
❌ FAILED: Wrong result because 1+2 should be equal to 3
```

If we are using `assert` that has `message`as input argument, the message will be printed as testing result.

In case `printSummary()` is invoked with level info is equal to `1`, it logs out an additional line providing statistics about testing results:

```
TOTAL TESTS= 1, ❌ FAILED=0, ✔ PASSED=1
ALL TESTS ✔ PASSED
```
Indicating that `1`test passed and `0` test failed

### assert(condition, message)

`assert()` is the main method of the class. The first argument that it takes is the condition and it checks whether the condition is truthy or falsy. The condition can either be a boolean value or a function that returns such a condition, function being the preferred approach for error catching reasons. If the condition is truthy, it logs out a “PASSED” message, otherwise it logs out a “FAILED” message. If you pass in a function that throws an error, the method will catch the error and log out a “FAILED” message. For example:

```javascript
const num = 6;

test.assert(() => num % 2 === 0, `Number ${num} is even`’); 
// logs out PASSED: Number 2 is even

test.assert(() => num > 10, `Number ${num} is bigger than 10`); 
// logs out FAILED: Number 2 is bigger than 10
```
### assertEquals(fun, expectedResult, message)
`assertEquals`is another assert function, that helps to verify the result with respect the expected value. The first argument is the function we would like to evaluate, the second argument is the expected result. If returned value of the `fun`is not equal to `expectedResult` it fails, otherwise passed. Here is how to validate javascript standard `max()`function:

```javascript
test.assertEquals(() => Math.max(1,2),2); # Expected result is 2 (equal to actual result)
test.assertEquals(() => Math.max(1,2),1); # Expected result is 1 (different than actual result)
test.assertEquals(() => Math.max(1,2),2, "Correct result the max of 1,2 is 2"); 
```
The last case specifies the message to log out as testing result regardless of the test result, the same message will be log out.


### catchErr(condition, expectedErrorMessage, message)

The goal of this method is to test whether your callback function (`callback`) catches the correct error. What you want to do is to make sure that the callback actually throws an error and then the `tests` method will check if it’s the correct one. Then finally it will use `assert()` to log out the corresponding message. For example, let’s say you have a function that returns the square value of a number you pass as the argument, and you want to throw an error if the argument isn’t a number, then you can test the error this way:

```javascript
function square(number) {
  if (typeof number !== ‘number’) throw new Error(‘Argument must be a number’);
  return number * number;
}

test.catchErr(
  () => square(‘a string’), // we’re passing a string here to test that our function throws an error
  ‘Argument must be a number’, // this is the error message we are expecting
  ‘We caught the type error correctly’
);
```

### is2dArray(Array)

This method runs a test to check whether the argument is a 2D array. This is useful for testing spreadsheet values before inserting them into a spreadsheet:

```javascript
const values = [
  [‘a1’, ‘a2’],
  [‘b1’, ‘b2’]
];

test.is2dArray(values, ‘values is an array of arrays’); // logs out PASSED
```

Then there are a couple of helper methods, `printHeader()` and `clearConsole()`.

### Print* Functions

**Note**: The level of information shows by print-family functions wil depend on the level of information the user specified via `setLevelInfo(vaue)`, or if no value was specified it assumes the level of infomration is `1`. See section: *Control level of information to log out* for more information.

The `printHeader()` function just helps with readability by printing a header in the console like this. It can be used for printing for example the title of the testing set. Here the expected result under `1` level of information:

```javascript
test.printHeader(‘Offline tests’);
```
Logs out the following:
```
*********************
* Offline tests
*********************
```

There also a second print header function: `printSubHeader(text)`, usefull to log out a sub header as a single line with prefix `**`. Here the output under level of information equal to `1`:

```javascript
test.printSubHeader(‘Testing valid cases...’);
```
logs out:
```
** Testing valid cases...
```
There is a third print function: `printSummary()`, that logs out a summary of testing results (depending on the level of information we want to show)

```javascript
test.printSummary();
```
If we ran 20 tests, where there is one failed test, under level of information equal to `1`, the result will be:
```
TOTAL TESTS= 20, ❌ FAILED=1, ✔ PASSED=19
ALL TESTS ✔ PASSED
```
Similarly if the level of information is equal to `0`, the output will be:
```
ALL TESTS ✔ PASSED
```

### resetTestCounters()
The `resetTestCounters()` is usefull for reseting testing counters (`_nTests`, `_nFailTests`, `_nPassTests`, attributes of the class `UnitTestingApp`), the function `printSummary()` will log out information depending on the overall testing results based on such attributes. We can use this function to reset testing counters after a running a set of tests, so we can print a summary information per set of tests using `printSummary()`.


### clearConsole()

A straight-forward method that clears the console log if you are in the local environment.

And finally there is a way to add new tests to the calls with the `addNewTest()` method.

### addNewTest(functionName, func)

Let’s say for example that we needed a test that would check whether a number is even:

```javascript
function isEven(number, message) {
  this.assert(() => number % 2 === 0, message);
}

test.addNewTest(‘isEven’, isEven);

const number = 8;
test.isEven(number, `Number ${number} is even`); // logs out PASSED: Number 8 is even

```

## The TestingTemplate.js File

The template makes use of most of the above features.

To make your tests offline-compatible, aways `require` modules inside an `if (typeof require !== 'undefined')` test and export modules in a similar way inside an `if (typeof module !== 'undefined') module.exports = YourClass`

```javascript
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
```

## Current Version

0.1.1
