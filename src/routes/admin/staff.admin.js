const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { addStaff } = require('../../controllers/admin/staff.admin');
const { validateSignupRequest, isRequestValidated } = require('../../validators/auth');
const router = express.Router();


router.post('/admin/add-staff', requireSignin,adminMiddleware,validateSignupRequest ,isRequestValidated, addStaff);

module.exports = router;