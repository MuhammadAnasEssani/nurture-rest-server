const express = require('express');
const { signup, activateAccount, signin } = require('../../controllers/vendor/auth.js');
const { validateSignupRequest, isRequestValidated } = require('../../validators/auth.js');
// const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
const router = express.Router();

router.post('/vendor/signin',signin );

router.post('/vendor/signup',validateSignupRequest ,isRequestValidated ,signup);
router.post("/vendor/email-activate", activateAccount)

module.exports = router;
