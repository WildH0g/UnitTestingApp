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
**Note:** If tests are disable, print-family function will no produce any output regardless of the level of information we have configured to show. See section: *Control Level of Information to log out* for more information.

### Choosing the Environment with runInGas(Boolean)

The `runInGas(Boolean)` function allows us to choose which environment we want the tests that follow to run in, like so:

```javascript
const test = new UnitTestingApp();

test.runInGas(false);
// local tests

test.runInGas(true);
// switch to online tests in Google Apps Script environment
```

Then we have the actual built-in testing methods, `assert()`, `catchErr()` and `is2dArray()`, etc..

### Control Level of Information to log out

The function attribute `levelInfo` controls the level information to be reported through the console. If `value`is less or equal than `0`, it runs in silent mode, i.e. no information will shown in the console. The only exception from print-family functions is `printSummary()` it logs out a single summary line. For example if all tests passed, the output will be:

```ALL TESTS ✔ PASSED```

if at least one test failed then it logs out the following information:

```❌ Some Tests FAILED```

This setup is usufull for large tests where we just want to add some incremental test and to have just a minimal output about the overall testing result.

Here is how the level of information can be specified for silent mode:

```javascript
test.levelInfo = 0;
```
If the value is `1`(default value) or greater, it means trace information will log out the result per each test, indicating if the test failed or passed. Depending on the specific testing function it will log out different information, for example, let's says we want to test the following custom function:

```javascript
function addTwoValues (a, b) {
  return a + b;
}
```

then invoking the following assert functions:

```javascript
test.assert(() => addTwoValues(1,2)==3); // expected result is 3
test.assertEquals(() => addTwoValues(1,2),3); // expected result is 3
```

will return

```
✔ PASSED: Input argument 'condition' passed
✔ PASSED: 3 === 3
```

on contrary, if we invoke the functions with a wrong expected result:

```javascript
test.assertEquals(() => addTwoValues(1,2),4); // expected result is 4
test.assertEquals(() => addTwoValues(1,2),4); // expected result is 4
```

will return

```
❌ FAILED: Input argument 'condition' failed
❌ FAILED: 3 != 4
```
In case of fail when the user doesn't provide the input argument `message`, `assertEquals` indicates the specific mismatch.

If we invoke `assertEquals` or `assert` including its optional input argument `message`, the user has more control of the information that goes to the console:

```javascript
test.assert(() => addTwoValues(1,2)==3, "Expected result: 1 + 2 = 3"); 
test.assert(() => addTwoValues(1,2)==4, "Wrong result because 1 + 2 should be equal to 3");
test.assertEquals(() => addTwoValues(1,2),3, "Expected result: 1 + 2 = 3"); 
test.assertEquals(() => addTwoValues(1,2),4, "Wrong result because 1 + 2 should be equal to 3");
```

The output will be:

```
✔ PASSED: Expected result: 1 + 2 = 3
❌ FAILED: Wrong result because 1 + 2 should be equal to 3
✔ PASSED: Expected result: 1 + 2 = 3
❌ FAILED: Wrong result because 1+2 should be equal to 3
```

If we invoke `printSummary()` with `levelInfo` is equal or greater than `1`, it logs out an additional line providing statistics about testing results:

```
TOTAL TESTS= 4, ❌ FAILED=2, ✔ PASSED=2
❌ Some Tests FAILED
```
Indicating that `2`test passed and `2` test failed and the total tests executed

### assert(condition, message = null)

`assert()` is the main method of the class. The first argument that it takes is the condition and it checks whether the condition is truthy or falsy. The condition can either be a boolean value or a function that returns such a condition, function being the preferred approach for error catching reasons. If the condition is truthy, it logs out a “PASSED” message, otherwise it logs out a “FAILED” message. If you pass in a function that throws an error, the method will catch the error and log out a “ERROR” message and it counts as a fail test. For example:

```javascript
const num = 6;
test.assert(() => num % 2 === 0, `Number ${num} is even`’); 
test.assert(() => num > 10, `Number ${num} is bigger than 10`); 
```
logs out:
```
✔ PASSED: Number 6 is even
❌ FAILED: Number 6 is bigger than 10
```

Let's say we have the following function that throws an error:

```javascript
function addTwoValues(a, b) {
  if (("number" != typeof a) || ("number" != typeof b)) 
    throw new Error("Input argument is not a valid number");
  return a+b;
}
```
then when testing `addTwoValues`:

```javascript 
test.assert(() => addTwoValues("a", "b") === 0, "Expected an error was thrown"); 
```

will show an error message in the console as follow. For errors the library uses `console.error` so it will appear with light red background

```
❌ ERROR: Expected and error was thrown (Error: Input argument is not a valid number)
```

**Note:** If input argument `message` is not provided a default built-in message is provided indicating the `condition` passed or failed.

### assertEquals(condition, expectedResult, message = null)
Similar to `assert` function, handy for checking against specific expected result, `assert` function when input argument `message` is not provided, there is not way to verify the condition againts expected result, with `assertEquals` the buil-in default message helps to confirm the match or to identify the mismatch. Here is how to validate javascript standard `max()`function:


```javascript
test.assertEquals(() => Math.max(1,2),2); // Pass
test.assertEquals(() => Math.max(1,2),1); // Fail
test.assertEquals(() => Math.max(1,2),2, "Correct result the max of 1,2 is 2"); // Pass
```
```
✔  PASSED: 2 === 2
❌ FAILED: 2 != 1
✔  PASSED: Correct result the max of 1,2 is 2
```
As in `assert` function in case an error is thrown an error message will be generated.

**Note:** Basic types values such as `number`, `boolean`, `null` or `undefined` are not wrapped in quotes ('), all other types are wrapped.

### catchErr(callback, errorMessage, message = null, errorType = null)

The goal of this method is to test whether your callback function (`callback`) catches the correct error message and/or error type. What you want to do is to make sure that the callback actually throws an error and then if it’s the correct one. Then finally it will use `assert()` to log out the corresponding message. For example, let’s say you have a function that returns the square value of a number you pass as the argument, and you want to throw an error if the argument isn’t a number, then you can test the error this way:

```javascript
function square(number) {
  if ("number" != typeof number) throw new Error("Argument must be a number");
  return number * number;
}

test.catchErr(
   () => square("a string"), // we’re passing a string here to test that our function throws an error
   "Argument must be a number", // this is the error message we are expecting
   "We caught the type error correctly"
);
```
If message is not provided a bult-in message is provided as follow for previous example:
```javascript
test.catchErr(
   () => square("a string"), // we’re passing a string here to test that our function throws an error
   "Argument must be a number" // this is the error message we are expecting
);
```
```
✔ PASSED: Error message is correct
```

Similar for fail case:
```javascript
test.catchErr(
   () => square("a string"), // we’re passing a string here to test that our function throws an error
   "Wrong error message" // this is the error message we are expecting
);
```
```
❌ FAILED: Wrong error message: 'Argument must be a number' != 'Wrong error message'
```
When input argument `errorType` is provided it also checks the error type caught is the same as `errorType`. For example:

```javascript
// Correct error type and error message
test.catchErr(
    () => square("a string"), // we’re passing a string here to test that our function throws an error
    "Argument must be a number", // this is the error message we are expecting
    Error // This is the error type we are expecting
);
// Wrong error type and correct error message
test.catchErr(
  () => square("a string"), // we’re passing a string here to test that our function throws an error
  "Argument must be a number", // this is the error message we are expecting
  TypeError  // This is the error type we are expecting
);
// Correct error type and wrong error message
test.catchErr(
  () => square("a string"), // we’re passing a string here to test that our function throws an error
  "Wrong error message", // this is the error message we are expecting
  Error  // This is the error type we are expecting
);
// Wrong error type and error message
test.catchErr(
  () => square("a string"), // we’re passing a string here to test that our function throws an error
  "Wrong error message", // this is the error message we are expecting
  TypeError  // This is the error type we are expecting
);

```

it will produce the following output:

```
✔ PASSED: Error type and error message are correct
❌ FAILED: Wrong error type: 'Error' != 'TypeError'
❌ FAILED: Wrong error message: 'Argument must be a number' != 'Wrong error message'
❌ FAILED: Wrong error type: 'Error' != 'TypeError' and wrong error message: 'Argument must be a number' != 'Wrong error message'
```

If we pass a valid value, no error is thrown:

```javascript
test.catchErr(
    () => square(2), // we’re passing a valid value
    "Argument must be a number", // this is the error message we are expecting
    Error
);
```

the test fails with the following information

```
❌ FAILED: No error thrown
```

**Note:** Even though you can invoke both asserts functions (`assert`, `assertEquals`) not using the `=>` (arrow function), for example:

```javascript
test.assertEquals(square(2), 4);
test.assert(square(2)==4, "Valid case sqrt(2) is equal to 4");
```

We don't recommend to do it, because `catchErr()` function will require arrow function invokation. The following code will produce an execution error on the first line of the body of `sqrt` function.

```javascript
test.catchErr(
   square("a string"), // we’re passing a string here to test that our function throws an error
   "Argument must be a number", // this is the error message we are expecting
   "We caught the type error correctly"
  );
```

### is2dArray(Array, message = null)

This method runs a test to check whether the argument is a 2D array. This is useful for testing spreadsheet values before inserting them into a spreadsheet:

```javascript
const values = [
  [‘a1’, ‘a2’],
  [‘b1’, ‘b2’]
];

test.is2dArray(values, ‘values is an array of arrays’); // logs out PASSED

```
If input argument `message` is not provided a built-in message is generated indicated the test passed or failed.

Then there are a couple of helper methods, `printHeader()` and `clearConsole()`.

### Print-family Functions

**Note**: The level of information shown by print-family functions will depend on the level of information the user specified via `levelInfo`, or if no value was specified it assumes the level of information is `1`. See section: *Control Level of Information to log out* for more information.

The `printHeader()` function just helps with readability by printing a header in the console like this. It can be used for printing for example the title of the testing set. Here the expected result under `1` level of information:


```javascript
test.printHeader(‘Offline tests’);
```

Logs out the following:

```
***************
* Offline tests
***************
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
❌ Some Tests FAILED
```

Similarly if the `levelInfo` lower or equial than `0`, the output will be:

```
❌ Some Tests FAILED
```

on contrary if all tests passed, will show:

```
ALL TESTS ✔ PASSED
```


### resetTestCounters()
The `resetTestCounters()` is usefull for reseting testing counters (`_nTests`, `_nFailTests`, `_nPassTests`, private attributes of the class `UnitTestingApp`), the function `printSummary()` will log out information depending on the overall testing results based on such attributes. We can use this function to reset testing counters after a running a set of tests, so we can print a summary information per set of tests using `printSummary()`.


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
