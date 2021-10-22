const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");
const cloudinary = require("../utils/cloudinary.js");

exports.createProduct = async (req, res) => {
  const { name, price, quantity, description, category } = req.body;

  let productPictures = [];
  if (req.files.length > 0) {
    req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      if(result) {
        productPictures.push( {
          avatar: result.secure_url,
          cloudinary_id: result.public_id,
        })
        if(productPictures.length === req.files.length) {
          const product = new Product({
            name: name,
            slug: slugify(name),
            price,
            quantity,
            description,
            productPictures,
            category,
            createdByRole: req.user.role,
            createdBy: req.user._id,
          });
          product.save((error, product) => {
            if (error) return res.status(400).json({ error });
            if (product) {
              res.status(201).json({ product });
            }
          });
        }
      }
    });
  } else {
    res.status(200).json({error: "No file Uploaded"})
  }
};

exports.getProduct = (req, res) => {
  Product.find({}).exec((error, products) => {
    if (error) return res.status(400).json({ error });

    if (products) {
      res.status(200).json({ products });
    }
  });
};
exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
      .select("_id type")
      .exec((error, category) => {
          if (error) {
              return res.status(400).json({ error });
          }

          if (category) {
              Product.find({ category: category._id })
                  .exec((error, products) => {
                      if (error) {
                          return res.status(400).json({ error });
                      }
                      if(products){
                        res.status(200).json({ products });
                      }else {
                        res.status(400).json({ messsage: "No such product Exist" });
                      }
                  });
          }
      });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      } else {
        res.status(200).json({ messsage: "No such product Exist" });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.deleteProductById = async(req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    const product = await Product.findById({_id: productId});
    if (!product) {
      return res.json(400)({error: "Product Not Found"});
    }
    // console.log(product)
    product.productPictures.map(async(data) => {
      result = await cloudinary.uploader.destroy(data.cloudinary_id);
    })
    Product.deleteOne({ _id: productId }).exec((error, data) => {
      if (error) return res.status(400).json({ error });
      if (data) {
        res.status(202).json({ data });
      } else {
        res.status(202).json({ message: "No such Procuct Exist" });
      }
    });
  } else {
    res.status(400).json({ error: "Product Id required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({})
    .select(
      "_id name price quantity slug description productPictures createdBy createdByRole category offer reviews updatedBy updatedByRole"
    )
    .populate({ path: "category", select: "_id name" })
    .populate({ path: "createdBy", select: "email" })
    .exec();

  res.status(200).json({ products });
};

exports.getProductsByVendor = async (req, res) => {
  const products = await Product.findOne({ createdBy: req.user._id }).exec(
    (error, products) => {
      if (error) return res.status(400).json({ error });

      if (products) {
        res.status(200).json({ products });
      } else {
        res.status(200).json({ message: "No product Exist" });
      }
    }
  );
};

exports.updateProduct = async (req, res) => {
  const { _id, name, price, quantity, description, offer, category } = req.body;
  let productPictures = [];
  if (req.files) {
    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { img: file.filename };
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
  };
  console.log(productPictures);
  if (productPictures.length > 0) {
    product.productPictures = productPictures;
  }
  console.log(product);
  const updatedProduct = await Product.findOneAndUpdate({ _id }, product, {
    new: true,
  })
    .then(() => {
      console.log("Updated Sucessfully");
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
  return res.status(201).json({ updatedProduct });
};
exports.addReviews = (req, res) => {
  const { rating, comment, _id } = req.body;
  const review = {
    user: req.user._id,
    email: req.user.email,
    rating: Number(rating),
    comment,
  };
  Product.findOne({ _id }).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      const email = req.user.email;
      const user = product.reviews.find((c) => c.email == email);
      let condition, update;

      if (user) {
        condition = { _id: _id, "reviews.email": email };
        update = {
          $set: {
            "reviews.$": review,
          },
        };
      } else {
        condition = { _id };
        update = {
          $push: {
            reviews: review,
          },
        };
      }
      Product.findOneAndUpdate(condition, update, { upsert: true })
        .then((result) => {
          return res.status(201).json({ update });
        })
        .catch((err) => console.log("error in add reviews"));
    } else {
      return res.status(400).json({ message: "No Product Found" });
    }
  });
};

exports.removeProductReviews = (req, res) => {
  const { userId, _id } = req.body.payload;
  if (userId) {
    Product.findOneAndUpdate(
      { _id },
      {
        $pull: {
          reviews: {
            user: userId,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
};
