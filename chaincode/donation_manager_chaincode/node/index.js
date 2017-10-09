const shim = require("fabric-shim");

const DonationManager = require("./src/donationManager");

shim.start(new DonationManager());
