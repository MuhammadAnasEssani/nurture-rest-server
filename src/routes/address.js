const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addAddress, getAddress, removeAddress } = require('../controllers/address.js');
const router = express.Router();


router.post('/user/address/create', requireSignin, userMiddleware, addAddress);
router.post('/user/getaddress', requireSignin, userMiddleware, getAddress);
router.post("/user/remove-address", requireSignin, userMiddleware, removeAddress)

module.exports = router;