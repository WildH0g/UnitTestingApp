/*
Testing script for testing the new changes introduced in UnitTestingApp script on version 0.1.1
*/

// jshint esversion: 8
if (typeof require !== 'undefined') {
  UnitTestingApp = require('./UnitTestingApp.js');
}

// Function to test
function addTwoValues(a, b) {
  return a + b;
}

// Function to test in case an error is thrown
function addTwoValuesSafe(a, b) {
  if (("number" != typeof a) || ("number" != typeof b)) throw new Error("Input argument is not a valid number");
  return addTwoValues(a, b);
}

/*****************
 * TESTS 
 * Taking the sources files from: https://github.com/WildH0g/UnitTestingApp
 *****************/

/**
 * Runs the tests; insert online and offline tests where specified by comments
 * @returns {void}
 */
function runTests() {
  const test = new UnitTestingApp();
  test.enable();
  test.clearConsole();
  test.runInGas(true);

  /************************
   * Run Local Tests Here
  ************************/

  test.printHeader("Testing addTwoValues using assertEquals");
  // Testing new method: assertEquals, printSummary and printSubHeader using addTwoValue function with default levelInfo
  // We haven´t set levelInfo, so we are using the default value: 1
  test.printSubHeader("Using default Level Info value (1) for 'addTwoValues' function");
  test.printSubHeader("Expected: Test 1 pass, Test 2 pass with user message, Test 3 fail default message, Test 4 fails with user message");
  test.assertEquals(() => addTwoValues(1, 2), 3); // PASS
  test.assertEquals(() => addTwoValues(2, 2), 4, "Valid case: 2 + 2 = 4"); // PASS with message
  test.assertEquals(() => addTwoValues(1, 2), 4); // FAIL
  test.assertEquals(() => addTwoValues(1, 2), 4, "Expected to fail, because 1+2 != 4");
  test.printSubHeader("Expected: 4-Tests, 2-Tests fail, 2-Tests Pass");
  test.printSummary(); // It should print final result and statistics (two lines)

  test.printSubHeader("Testing when fun is boolean");
  test.printSubHeader("Reset counters");
  test.resetTestCounters();

  test.printSubHeader("Expected Test-1 pass with default message, Test-2 pass with user message, Test-3 fail with default message, Test-4 fail with user message");
  test.assertEquals(1 + 2 == 3, true); // Pass
  test.assertEquals(1 + 2 == 3, true, "Valid Case");
  test.assertEquals(1 + 1 == 3, true); // FAIL
  test.assertEquals(1 + 1 == 3, true, "Invalid Case");
  test.printSubHeader("Expected: 4-Tests, 2-Tests fail, 2-Tests Pass");
  test.printSummary();

  test.printSubHeader("testing using strings");
  test.printSubHeader("Test-5 pass with user message, Test-6 pass with default message, Test-7 pass with default message, Test-8 fail with default message, Test-9 fail with deafult message");
  test.assertEquals("world" == "world", true, "Expected to pass 'world' = 'world'"); // Pass with user message
  test.assertEquals("world" == "world", true); // Pass
  test.assertEquals("world" != "World", true, "Expected to pass 'world' != 'World'"); // Pass with user message
  test.assertEquals("world" == "World", true); // Fail with default message
  test.assertEquals("world" != "world", true); // Fail with default message
  test.printSubHeader("Expected: 9-Tests, 4-Tests fail, 5-Tests Pass");
  test.printSummary();


  test.printSubHeader("Testing undefined input arguments using default message or undefined message");
  test.printSubHeader("Reset counters");
  test.resetTestCounters();
  test.printSubHeader("Expected: Test-1 pass, Test-2 fail, Test-3 pass, Test-4 fail");
  test.assertEquals(); // PASS both are undefined
  test.assertEquals(1 + 1); // FAIL, because the expectedValue is undefined
  test.assertEquals(1 + 1, 2, undefined); // Pass but message is undefined
  test.assertEquals(1 + 1, 3, undefined); // Fail with undefined message (treated as null, so it shows default message
  test.printSubHeader("Expected: 4-Tests, 2-Tests fail, 2-Tests pass");
  test.printSummary();

  test.printHeader("Testing catching errors using catchErr");
  test.printSubHeader("Reset counters");
  test.resetTestCounters();

  test.printSubHeader("Testing backward compatibility");

  test.printSubHeader("Expected to pass: throw an error and error message is correct, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Input argument is not a valid number", // this is the error message we are expecting (correct)
    "We caught the error message correctly" // This is the user message to log out
  );

  test.printSubHeader("Expected to pass: throw an error and error message is correct, using default message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Input argument is not a valid number", // this is the error message we are expecting (correct)
  );

  test.printSubHeader("Expected to fail: wrong error message, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Wrong error message", // this is the error message we are expecting
    "We caught the error, but with the wrong error message"
  );

  test.printSubHeader("Expected to fail: wrong error message, using default message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Wrong error message" // this is the error message we are expecting (wrong)
  );

  test.printSubHeader("Expected: 4-Tests, 2-Tests fail, 2-Pass");
  test.printSummary();

  test.printSubHeader("Testing error type via errorType optional input argument");
  test.printSubHeader("Reset counters");
  test.resetTestCounters();

  test.printSubHeader("Expected to pass: error type and error message are correct, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Input argument is not a valid number", // this is the error message we are expecting
    "We caught the error type and error message correctly",
    Error // This is the error type we are expecting
  );

  test.printSubHeader("Expected to pass: error type and error message are correct, using default message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Input argument is not a valid number", // this is the error message we are expecting
    Error // This is the error type we are expecting
  );

  test.printSubHeader("Expected to fail: error type correct, but wrong error message, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Wrong error message", // this is the error message we are expecting
    "We caught the error type correctly, but wrong error message",
    Error // This is the error type we are expecting
  );

  test.printSubHeader("Expected to fail: error type correct, but wrong error message using default message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Wrong error message", // this is the error message we are expecting
    Error // This is the error type we are expecting
  );

  test.printSubHeader("Expected to fail: wrong error type, error message correct, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Input argument is not a valid number", // this is the error message we are expecting
    "We caught incorrect error type, but the error message is correct",
    TypeError // This is the error type we are expecting
  );

  test.printSubHeader("Expected to fail: wrong error type, error message correct, using default message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Input argument is not a valid number", // this is the error message we are expecting
    TypeError // This is the error type we are expecting
  );

  test.printSubHeader("Expected to fail: wrong error type and error message, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Wrong error message", // this is the error message we are expecting
    "We caught incorrect error type and message",
    TypeError // This is the error type we are expecting
  );

  test.printSubHeader("Expected to fail: wrong error type and error message, using default message");
  test.catchErr(
    () => addTwoValuesSafe("a", "b"), // we’re passing a string here to test that our function throws an error
    "Wrong error message", // this is the error message we are expecting
    TypeError // This is the error type we are expecting
  );

  test.printSubHeader("Expected: 8-Tests 6-Tests fail, 2-Pass");
  test.printSummary();

  test.printSubHeader("Testing no error should be thrown");
  test.printSubHeader("Reset counters");
  test.resetTestCounters();

  // Not catching error
  test.printSubHeader("Expected to fail: no error should be thrown, correct error message, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "Input argument is not a valid number", // this is the error message we are expecting
    "No error should be thrown" // this is the error message we are expecting
  );

  test.printSubHeader("Expected to fail: no error should be thrown, correct error message using defeault message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "Input argument is not a valid number" // this is the error message we are expecting
  );

  test.printSubHeader("Expected to fail: no error should be thrown, wrong error message,  user provided the message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "No error", // this is the error message we are expecting
    "No error should be thrown" // this is the error message we are expecting
  );

  test.printSubHeader("Expected to fail: no error should be thrown, using default message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "No error", // this is the error message we are expecting
  );

  test.printSubHeader("Expected to fail: no error should be thrown, error type and message are correct, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "Input argument is not a valid number", // this is the error message we are expecting
    "No error should be thrown", // this is the error message we are expecting
    Error
  );

test.printSubHeader("Expected to fail: no error should be thrown, error type and message are correct, using default message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "Input argument is not a valid number", // this is the error message we are expecting
    Error
  );

  test.printSubHeader("Expected to fail: no error should be thrown, error type correct and wrong error message, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "No error", // this is the error message we are expecting
    "No error should be thrown", // this is the error message we are expecting
    Error
  );

  test.printSubHeader("Expected to fail: no error should be thrown, error type correct and wrong error message, using default message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "No error", // this is the error message we are expecting
    Error
  );

  test.printSubHeader("Expected to fail: no error should be thrown, providing wrong errorType and correct error message, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "Input argument is not a valid number", // this is the error message we are expecting
    "No error should be thrown", // this is the error message we are expecting
    TypeError
  );

  test.printSubHeader("Expected to fail: no error should be thrown, providing wrong errorType and correct error message, using default message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "Input argument is not a valid number", // this is the error message we are expecting
    TypeError
  );

  test.printSubHeader("Expected to fail: no error should be thrown, wrong error type an message, user provided the message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "No error", // this is the error message we are expecting
    "No error should be thrown", // this is the error message we are expecting
    TypeError
  );

  test.printSubHeader("Expected to fail: no error should be thrown, providing wrong errorType and wrong error message using default message");
  test.catchErr(
    () => addTwoValuesSafe(1, 2), // we are passing valid values (no error thrown)
    "No error", // this is the error message we are expecting
    TypeError
  );

  test.printSubHeader("Expected: 12-Tests, 12-Tests fail, 0-Pass");
  test.printSummary();

  // Testing similar basic tests but in silent mode (LevelInfo = 0)
  test.printHeader("Testing the same assertEquals tests with setting levelInfo = 0"); // It logs out, because we haven't changed LevelInfo yet
  test.setLevelInfo(0); // 0-Only summary result, 1-Detail results
  // Because LevelInfo = 0 we use the console for traceability purpose
  console.log("LevelInfo = " + test.getLevelInfo());
  console.log("Reset counters");
  test.resetTestCounters();
  test.assertEquals(() => addTwoValues(1, 2), 3);
  test.assertEquals(() => addTwoValues(2, 2), 4, "Valid case: 2 + 2 = 4");
  test.assertEquals(() => addTwoValues(1, 2), 4);
  test.assertEquals(() => addTwoValues(1, 2), 4, "Expected to fail, because 1+2 != 4");
  test.printSummary(); // Only summary result: Some test failed
  test.printSubHeader("Reset counters");
  test.resetTestCounters();
  console.log("Shows only the summary line, the counters are reseted so no tests, therefore all test passed");
  test.printSummary(); //Shows only summary line

  // Testing the existing assert function work as expected
  test.printSubHeader('Setting default level Info');
  test.setLevelInfo(1);

  test.printHeader("Testing addTwoValues using assert");
  test.printSubHeader("LevelInfo = " + test.getLevelInfo());
  test.printSubHeader("Test-1 Pass, Test-2 Fail");
  test.assert(() => addTwoValues(1, 2) == 3, "Valid case: 1 + 2 = 3");
  test.assert(() => addTwoValues(1, 2) == 4, "Invalid case: 1 + 2 != 4");
  test.printSubHeader("Expected to log out two lines: statistics and summary");
  test.printSummary();

  test.printSubHeader("Testing when condition is boolean");
  test.printSubHeader("Reset counters");
  test.resetTestCounters();
  test.printSubHeader("Test-1 Pass, Test-2 pass (empty string), Test-3 fail");
  test.assert(1 + 2 == 3, "Valid case: 1 + 2 = 3");
  test.assert(1 + 2 == 3, ""); // testing empty message
  test.assert(1 + 1 == 3, "Invalid case: 1 + 1 != 3");
  test.printSubHeader("3-Tests, 1-fail, 2 pass");
  test.printSummary();

  test.printSubHeader("Testing undefined input arguments");
  test.printSubHeader("Expected: Test-3 Fail (no arguments), Test-4 Pass (with undefined message), Test-5 Pass(with undefined message), Test-6 Pass(with undefined message)");
  test.assert(); // Expected to fail, not a valid condition
  test.assert(undefined == undefined); // Pass
  test.assert(1 + 1 == 2);
  test.assert(1 + 1 == 3);
  test.printSubHeader("Expected: 6-Tests, Fail=3, Pass=3");
  test.printSummary();

  test.printSubHeader("Testing under silent mode: one test passed, one failed");
  test.setLevelInfo(0);
  console.log("LevelInfo = " + test.getLevelInfo());
  console.log("Reseting the counters");
  test.resetTestCounters();
  test.assert(() => addTwoValues(1, 2) == 3, "Valid case: 1 + 2 = 3");
  test.assert(() => addTwoValues(1, 2) == 4, "Invalid case: 1 + 2 != 4");
  console.log("Expected to see some test failed");
  test.printSummary();

  // Reset the counters. For testing all test passed under silent mode
  console.log("Testing the case all test passed with silent mode");
  console.log("Reseting the counters");
  test.resetTestCounters();
  console.log('Testing with assert, under silent mode: one test executed and passed');
  test.assert(() => addTwoValues(1, 2) == 3, "Valid case");
  console.log("Printing the summary line only: all test passed");
  test.printSummary();

  console.log("Changing the level info to 1");
  test.setLevelInfo(1);
  test.printSubHeader("Showing now printSummary with two lines for the previous set of tests");
  test.printSummary();

  test.printHeader("Testing enable = false, the print-family functions print no information");
  test.disable();
  test.printHeader("No expected output");
  test.printSubHeader("No expected output");
  test.printSummary();

}
