const express = require('express');
const { signup, signin, activateAccount, forgotPassword, resetPassword } = require('../controllers/auth.js');
const { validateSignupRequest, isRequestValidated } = require('../validators/auth.js');
// const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
const router = express.Router();

router.post('/signin', signin );

router.post('/signup',validateSignupRequest ,isRequestValidated ,signup);
router.post("/email-activate", activateAccount);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword)


module.exports = router;