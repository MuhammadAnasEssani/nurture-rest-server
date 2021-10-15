const express = require("express");
const { requireSignin, adminMiddleware } = require("../../common-middleware");
const { getCustomerOrders } = require("../../controllers/admin/order.admin.js");
const router = express.Router();

router.post(
  `/order/getCustomerOrders`,
  requireSignin,
  adminMiddleware,
  getCustomerOrders
);

module.exports = router;