const Product = require('../models/product')
const shortid = require('shortid');
const slugify = require("slugify");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
    // res.status(200).json({ file: req.files, body: req.body })
    const {
        name, price, quantity, description, category
    } = req.body;

    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }

    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        createdByRole: req.user.role,
        createdBy: req.user._id
    })
    product.save((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            res.status(201).json({ product });
        }

    })
}

exports.getProduct = (req, res) => {
    Product.find({})
        .exec((error, products) => {
            if (error) return res.status(400).json({ error })

            if (products) {
                res.status(200).json({ products });
            }
        });
}


exports.getProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if (productId) {
        Product.findOne({ _id: productId }).exec((error, product) => {
            if (error) return res.status(400).json({ error });
            if (product) {
                res.status(200).json({ product });
            } else {
                res.status(200).json({messsage: "No such product Exist"})
            }
        });
    } else {
        return res.status(400).json({ error: "Params required" });
    }
};

exports.deleteProductById = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
        Product.deleteOne({ _id: productId }).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
                res.status(202).json({ result });
            } else {
                res.status(202).json({message: "No such Procuct Exist"})
            }
        });
    } else {
        res.status(400).json({ error: "Product Id required" });
    }
};

exports.getProducts = async (req, res) => {
    const products = await Product.find({})
        .select("_id name price quantity slug description productPictures createdBy createdByRole category")
        .populate({ path: "category", select: "_id name" })
        .populate({ path: "createdBy", select: "email"})
        .exec();

    res.status(200).json({ products });
};

exports.getProductsByVendor = async (req, res) => {
    const products = await Product.findOne({createdBy: req.user._id})
    .exec((error, products) => {
        if (error) return res.status(400).json({ error })

        if (products) {
            res.status(200).json({ products });
        } else {
            res.status(200).json({message: "No product Exist"})
        }
    })
}

exports.updateProduct = async (req, res) => {
    const {_id, name, price, quantity, description, offer, category} = req.body
    let productPictures = [];
    if(req.files){
        if (req.files.length > 0) {
            productPictures = req.files.map(file => {
                return { img: file.filename }
            });
        }
    }
    const product = {
        name,
        slug: slugify(name),
        price,
        quantity,
        description,
        offer,
        category,
        updatedBy: req.user._id,
        updatedByRole: req.user.role,
    }
    console.log(productPictures)
    if (productPictures.length > 0) {
        product.productPictures = productPictures
    }
    console.log(product)
    const updatedProduct = await Product.findOneAndUpdate({ _id }, product, {
        new: true,
    }).then(() => {
        console.log("Updated Sucessfully")
    }).catch((err) => {
        console.log("error")
        console.log(err)
    });
    return res.status(201).json({ updatedProduct });

}