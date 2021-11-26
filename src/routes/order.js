const express = require('express');
const { requireSignin, userMiddleware, vendorMiddleware } = require('../common-middleware');
const { addOrder, getOrders, getOrder } = require('../controllers/order.js');
const { updateOrder } = require('../controllers/vendor/order.vendor');
const router = express.Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);
router.post("/vendor/updateOrder", requireSignin, vendorMiddleware, updateOrder)

module.exports = router;