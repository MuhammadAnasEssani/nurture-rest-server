const Order = require("../models/order.js");
const Cart = require("../models/cart.js");
const Address = require("../models/address.js");

exports.addOrder = (req, res) => {
    Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
            req.body.user = req.user._id;
            req.body.orderStatus = [
                {
                    type: "ordered",
                    date: new Date(),
                    isCompleted: true,
                },
                {
                    type: "packed",
                    isCompleted: false,
                },
                {
                    type: "shipped",
                    isCompleted: false,
                },
                {
                    type: "delivered",
                    isCompleted: false,
                },
            ];
            // req.body.user = req.user._id;
            const order = new Order(req.body);
            order.save((error, order) => {
                if (error) return res.status(400).json({ message: "Something Went Wrong" });
                if (order) {
                    res.status(201).json({ message: "Order Added Successfully" });
                }
            });
        }
    });
};

exports.getOrders = (req, res) => {
    Order.find({ user: req.user._id })
        .select("_id paymentStatus items")
        .populate("items.productId", "_id name productPictures")
        .exec((error, orders) => {
            if (error) return res.status(400).json({message: "Something Went Wrong" });
            if (orders) {
                res.status(200).json({ orders });
            }
        });
};

exports.getOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ message: "Something Went Wrong" });
      if (order) {
          res.status(200).json({
            order,
          });
      }
    });
};