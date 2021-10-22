const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addOrder, getOrders, getOrder } = require('../controllers/order.js');
const router = express.Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);

module.exports = router;