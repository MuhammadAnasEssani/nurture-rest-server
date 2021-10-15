const Order = require("../../models/order.js");



exports.getCustomerOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error: "No Order Found" });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};
