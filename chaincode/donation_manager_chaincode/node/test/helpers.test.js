const assert = require("assert");
const sinon = require("sinon");

const helpers = require("../src/helpers");
const { objCompare } = require("./testHelpers");

const testJson = { test: "abc" };

describe("jsonToBuffer", () => {
  it("should return right buffer when pass an object", () => {
    let result = helpers.jsonToBuffer(testJson);
    result = result.toString("hex");
    assert.equal(result, "7b2274657374223a22616263227d");
  });
});

describe("bufferToJSON", () => {
  it("should return right JSON when pass an buffer", () => {
    let bufferValue = Buffer.from("7b2274657374223a22616263227d", "hex");
    let result = helpers.bufferToJSON(bufferValue);
    result = objCompare(result, testJson);
    assert.equal(result, true);
  });

  it("should return right JSON when a buffer is passed", () => {
    try {
      let bufferValue = Buffer.from("", "hex");
      let result = helpers.bufferToJSON(bufferValue);
      result = objCompare(result, testJson);
      assert.equal(result, true);
    } catch (error) {
      assert.equal(error.message, "Error parsing value to JSON: .");
    }
  });
});

describe("bufferToJSON", () => {
  it("should return if string is empty or not", () => {
    let result = helpers.isEmpty("");
    assert.equal(result, true);
  });
});

describe("defaultToUndefinedIfEmpty", () => {
  it("should return undefined when pass an empty object", () => {
    let result = helpers.defaultToUndefinedIfEmpty("");
    result = result.toString("hex");
    assert.equal(result, "756e646566696e6564");
  });
});

describe("formatToJson", () => {
  it("should return object when pass an array of values", () => {
    const expectedJson = {
      project: "test",
      itemType: "test",
      amount: 3.2,
      timestamp: "test",
      validity: "test"
    };
    let result = helpers.formatToJson(["test", "test", "3.2", "test", "test"]);
    result = objCompare(result, expectedJson);
    assert.equal(result, true);
  });
});

describe("createUpdateJson", () => {
  it("should return right updated object when pass an array", async () => {
    const expectedJson = { testValue1: "testValue2" };
    let result = await helpers.createUpdateJson(["testValue1", "testValue2"]);
    result = objCompare(result, expectedJson);
    assert.equal(result, true);
  });

  it("should fail if number of elements in array is odd", async () => {
    try {
      let result = await helpers.createUpdateJson([
        "testValue1",
        "testValue2",
        "testvalue3"
      ]);
      assert.fail("should have thrown before");
    } catch (error) {
      assert.equal(
        error.message,
        "Number of elements in update request should be even"
      );
    }
  });
});

describe("getAllResults", () => {
  it("should return all results in JSON when pass an iterator and history", async () => {
    const iterator = {
      next: () => {},
      close: () => {}
    };
    const expectedResult = {
      value: {
        tx_id:
          "fc7980500c5b1acbfa0754d30e7c988e3a28829e8d8bfdbbbf1127a23d8fd479",
        value: Buffer.from(
          '{"project":"ITU","itemType":"grains","amount":"1","timestamp":{"seconds":{"low":1551256489,"high":0,"unsigned":false},"nanos":949499015},"validity":true}'
        ),
        timestamp: {
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 494418844
        },
        is_delete: false
      },
      done: false
    };

    stubFunctionNext = sinon.stub(iterator, "next");
    stubFunctionClose = sinon.stub(iterator, "close");

    stubFunctionNext.onFirstCall().returns(expectedResult);
    stubFunctionNext.onSecondCall().returns({ done: true });

    const result = await helpers.getAllResults(iterator);
    objCompare(
      result[0].Record,
      helpers.bufferToJSON(expectedResult.value.value)
    );
  });

  it("should return empty array if iterator returns done on first next", async () => {
    const iterator = {
      next: () => {},
      close: () => {}
    };

    stubFunctionNext = sinon.stub(iterator, "next");
    stubFunctionClose = sinon.stub(iterator, "close");

    stubFunctionNext.returns({ done: true });

    const result = await helpers.getAllResults(iterator);
    objCompare(result, []);
  });
});
