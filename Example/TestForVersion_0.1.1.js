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
  test.printSubHeader("Expected: Test 1 passes, Test 2 passes with message, Test 3 fails, Test 4 fails with custom message");
  test.assertEquals(() => addTwoValues(1, 2), 3); // PASS
  test.assertEquals(() => addTwoValues(2, 2), 4, "Valid case: 2 + 2 = 4"); // PASS with message
  test.assertEquals(() => addTwoValues(1, 2), 4); // FAIL
  test.assertEquals(() => addTwoValues(1, 2), 4, "Expected to fail, because 1+2 != 4");
  test.printSummary(); // It should print final result and statistics (two lines)
  test.printSubHeader("Testing when fun is boolean");
  test.printSubHeader("Reset counters");
  test.resetTestCounters();
  test.printSubHeader("Expected Test-1 Pass, Test-2 Fail");
  test.assertEquals(1 + 2 == 3, true);
  test.assertEquals(1 + 1 == 3, true);
  test.printSummary();
  test.printSubHeader("Testing undefined input arguments");
  test.printSubHeader("Expected: Test-3 Pass, Test-4 Fail, Test-5 Pass, Test-6 Fail");
  test.assertEquals(); // PASS both are undefined
  test.assertEquals(1 + 1); // FAIL, because the expectedValue is undefined
  test.assertEquals(1 + 1, 2, undefined); // Pass but message is undefined
  test.assertEquals(1 + 1, 3, undefined); // Fail with undefined message (default is null, so the message doesn't show)
  test.printSubHeader("Expected: 6-Tests, 3-Pass and 3-Fail");
  test.printSummary();


  // Testing the same tests but in silent mode (LevelInfo = 0)
  test.printSubHeader("Testing the same tests with setting levelInfo = 0"); // It logs out, because we haven't changed LevelInfo yet
  test.setLevelInfo(0); // 0-Only summary result, 1-Detail results
  // Because LevelInfo = 0 we use the console for traceability purpose
  console.log("LevelInfo = " + test.getLevelInfo());
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
  test.printSubHeader('Default level Info');
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
  test.printSubHeader("Test-1 Pass, Test-2 Fail");
  test.assert(1 + 2 == 3, "Valid case: 1 + 2 = 3");
  test.assert(1 + 1 == 3, "Invalid case: 1 + 1 != 3");
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
