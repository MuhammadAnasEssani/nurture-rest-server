const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const { requireSignin, adminStaffAndVendorMiddleware, vendorMiddleware, userMiddleware, adminMiddleware } = require('../common-middleware');
const { createProduct, getProducts, getProduct, getProductsByVendor, getProductDetailsById, deleteProductById, updateProduct, addReviews, removeProductReviews } = require('../controllers/product');
const upload = require("../utils/multer.js")

router.post('/product/create', requireSignin, adminStaffAndVendorMiddleware, upload.array('productPicture'), createProduct)
router.get('/product/getproduct', getProduct);
router.get(`/product/:productId`, getProductDetailsById);
router.delete(
    "/product/deleteProductById",
    requireSignin,
    adminStaffAndVendorMiddleware,
    deleteProductById
);
router.post(
    "/product/getProducts",
    requireSignin,
    adminStaffAndVendorMiddleware,
    getProducts
);
router.post("/product/getProductsByVendor", requireSignin, adminStaffAndVendorMiddleware, getProductsByVendor);
router.post("/product/update",upload.array('productPicture'), requireSignin, adminStaffAndVendorMiddleware, updateProduct);
router.post("/product/add-review", requireSignin, userMiddleware, addReviews);
router.post("/product/delete-review", requireSignin, adminMiddleware, removeProductReviews)
module.exports = router;