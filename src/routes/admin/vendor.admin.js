const express = require('express');
const { requireSignin, adminMiddleware, staffMiddleware, adminAndStaffMiddleware } = require('../../common-middleware');
const { updateVendor } = require('../../controllers/admin/vendor.admin');
const router = express.Router();

router.post('/admin/update-vendor',requireSignin, adminAndStaffMiddleware, updateVendor);

module.exports = router;