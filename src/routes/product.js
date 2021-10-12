const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const { upload, requireSignin, adminStaffAndVendorMiddleware, vendorMiddleware } = require('../common-middleware');
const { createProduct, getProducts, getProduct, getProductsByVendor, getProductDetailsById, deleteProductById, updateProduct } = require('../controllers/product');

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
router.post("/product/update",upload.array('productPicture'), requireSignin, adminStaffAndVendorMiddleware, updateProduct)
module.exports = router;