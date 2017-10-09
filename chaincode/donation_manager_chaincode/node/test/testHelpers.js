const sinon = require("sinon");

/**
 * Test Helper: creates stubFunctions for stub and returns it
 *
 * @function createStubAndStubFunctions
 */
function createStubAndStubFunctions(functionNames) {
  const stub = {
    getFunctionAndParameters: () => {},
    getTxID: () => {},
    getArgs: () => {},
    getTxTimestamp: () => {},
    getState: () => {},
    putState: () => {},
    deleteState: () => {},
    getHistoryForKey: () => {}
  };

  let stubFunctions = {};
  functionNames.map(functionName => {
    if (!Object.keys(stub).includes(functionName)) {
      throw new Error("invalid stub function name");
    }
    stubFunctions[functionName] = sinon.stub(stub, functionName);
  });

  return { stubFunctions, stub };
}

/**
 * Test Helper: convert Buffer to JSON
 *
 * @function bufferToJSON
 */
function bufferToJSON(buffer) {
  try {
    const response =
      buffer.toString() === "undefined" ? null : JSON.parse(buffer.toString());
    return response;
  } catch (error) {
    throw new Error(`Error parsing value to JSON: ${buffer.toString()}.`);
  }
}

/**
 * Test Helper: used to compare objects
 *
 * @function objCompare
 */
function objCompare(obj1, obj2) {
  // Loop through properties in object 1
  for (const p in obj1) {
    // Check property exists on both objects
    if (obj1.hasOwnProperty(p) != obj2.hasOwnProperty(p)) return false;

    switch (typeof obj1[p]) {
      // Deep compare objects
      case "object":
        if (!objCompare(obj1[p], obj2[p])) return false;
        break;
      // Compare function code
      case "function":
        if (
          typeof obj2[p] == "undefined" ||
          (p != "compare" && obj1[p].toString() != obj2[p].toString())
        )
          return false;
        break;
      // Compare values
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }

  // Check object 2 for any extra properties
  for (const p in obj2) {
    if (typeof obj1[p] == "undefined") return false;
  }
  return true;
}

module.exports = {
  createStubAndStubFunctions,
  bufferToJSON,
  objCompare
};
