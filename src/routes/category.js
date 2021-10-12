const express = require('express');
const multer = require('multer');
const router = express.Router();
const shortid = require('shortid');
const path = require('path');
const { addCategory, getCategories, updateCategories, deleteCategories } = require('../controllers/category');
const { requireSignin, adminStaffAndVendorMiddleware, upload } = require('../common-middleware');


router.post('/category/create',requireSignin,adminStaffAndVendorMiddleware,upload.single('categoryImage') ,addCategory )
router.get('/category/getcategory',getCategories )
router.post('/category/update',upload.array('categoryImage'),requireSignin,adminStaffAndVendorMiddleware,updateCategories )
router.post('/category/delete',requireSignin,adminStaffAndVendorMiddleware, deleteCategories )

module.exports = router;