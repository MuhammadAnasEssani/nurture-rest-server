const express = require("express");
const { adminStaffAndVendorMiddleware, requireSignin } = require("../../common-middleware/index.js");
const { getCustomerOrdersByVendors } = require("../../controllers/vendor/order.vendor.js");
const router = express.Router();

router.post(
  `/order/getCustomerOrdersByVendors`,
  requireSignin,
  adminStaffAndVendorMiddleware,
  getCustomerOrdersByVendors
);

module.exports = router;