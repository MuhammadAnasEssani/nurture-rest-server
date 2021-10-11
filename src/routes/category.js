const express = require('express');
const multer = require('multer');
const router = express.Router();
const shortid = require('shortid');
const path = require('path');
const { addCategory, getCategories } = require('../controllers/category');
const { requireSignin, adminStaffAndVendorMiddleware, upload } = require('../common-middleware');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(path.dirname(__dirname), 'uploads'))
//     },
//     filename: function (req, file, cb) {
//         cb(null, shortid.generate() + '-' + file.originalname)
//     }
// })

// const upload = multer({ storage });

router.post('/category/create',requireSignin,adminStaffAndVendorMiddleware,upload.single('categoryImage') ,addCategory )
router.get('/category/getcategory',getCategories )
// router.post('/category/update',upload.array('categoryImage') ,updateCategories )
// router.post('/category/delete', deleteCategories )

module.exports = router;