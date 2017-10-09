const assert = require("assert");

const validations = require("../src/validations");

describe("checkDonationArgsType", () => {
  it("should return false when pass an array of project test", () => {
    const result = validations.checkDonationArgsType(["test", "test", "3.2"]);
    assert.equal(result, false);
  });

  it("should return true when pass an array of project FAO", () => {
    const result = validations.checkDonationArgsType(["FAO", "water", "3.2"]);
    assert.equal(result, true);
  });
});

describe("isValidAmount", () => {
  it("should return true when pass a valid number 87", () => {
    const result = validations.isValidAmount(87);
    assert.equal(result, true);
  });
});

describe("isValidItemType", () => {
  it("should return true if item passed is valid (water)", () => {
    const result = validations.isValidItemType("water");
    assert.equal(result, true);
  });

  it("should return false if item passed is valid (test)", () => {
    const result = validations.isValidItemType("test");
    assert.equal(result, false);
  });
});

describe("isValidProject", () => {
  it("should return true if project passed is valid (FAO)", () => {
    const result = validations.isValidProject("FAO");
    assert.equal(result, true);
  });

  it("should return false if project passed is invalid (test)", () => {
    const result = validations.isValidProject("test");
    assert.equal(result, false);
  });
});

describe("throwIfEmpty", () => {
  it("should return error when pass an empty object or string", async () => {
    try {
      validations.throwIfEmpty("");
      assert.fail("should have thrown before");
    } catch (error) {
      assert.equal(
        error.message,
        "Donation data is absent OR no state registered."
      );
    }
  });

  it("should not return error when pass an valid object string or array", async () => {
    try {
      validations.throwIfEmpty("test");
    } catch (error) {
      assert.equal(
        error.message,
        "Donation data is absent OR no state registered."
      );
    }
  });
});

describe("checkSuccessfulStateRetrieval", () => {
  it("should return error when pass an empty object or string or zero", async () => {
    try {
      validations.checkSuccessfulStateRetrieval(0);
      assert.fail("should have thrown before");
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");
    }
  });

  it("should not return error when pass an valid object string or array", async () => {
    try {
      validations.checkSuccessfulStateRetrieval("test");
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");
    }
  });
});

describe("isArray", () => {
  it("should return error when pass an non-array", async () => {
    try {
      validations.isArray(123);
      assert.fail("should have thrown before");
    } catch (error) {
      assert.equal(
        error.message,
        "Invalid argument type. Expected array, got number 123."
      );
    }
  });

  it("should not return error when pass an valid array", async () => {
    try {
      validations.isArray([1, 2]);
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");
    }
  });
});

describe("checkArgsLengthIsWithinRange", () => {
  it("should return error when pass an string an incorect expected length", async () => {
    try {
      validations.checkArgsLengthIsWithinRange("test", 2, 3);
      assert.fail("should have thrown before");
    } catch (error) {
      assert.equal(
        error.message,
        `Invalid number of arguments. Expected length between 2-3, got 4 in args: test.`
      );
    }
  });

  it("should not return error when pass an string and expeccted correct length", async () => {
    try {
      validations.checkArgsLengthIsWithinRange("test", 2, 5);
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");
    }
  });
});

describe("checkLength", () => {
  it("should return error when pass an string an incorect expected length", async () => {
    try {
      validations.checkLength("test", 2);
      assert.fail("should have thrown before");
    } catch (error) {
      assert.equal(
        error.message,
        `Invalid number of arguments. Expected 2, got 4 in args: test.`
      );
    }
  });

  it("should not return error when pass an string and valid expected length", async () => {
    try {
      validations.checkLength("test", 4);
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");
    }
  });
});
