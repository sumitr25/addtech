/**
 * @constant
 * @name INDEX
 * @type {Object}
 * @default
 */
const INDEX = {
  donationId: 0,
  project: 0,
  itemType: 1,
  amount: 2,
  timestamp: 3,
  validity: 4
};

/**
 * @constant
 * @name ID_LENGTH
 * @type {string}
 * @default
 */
const ID_LENGTH = 64;

/**
 * @constant
 * @name PARAM_LENGTH
 * @type {Object}
 * @default
 */
const PARAM_LENGTH = {
  Init: 0,
  readDonation: 1,
  isPresent: 1,
  getHistoryForDonation: 1,
  addDonation: 3,
  updateDonationLowerLimit: 3,
  updateDonationUpperLimit: 7,
  removeDonation: 1
};

module.exports = { INDEX, ID_LENGTH, PARAM_LENGTH };
