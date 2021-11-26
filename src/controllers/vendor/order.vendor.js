const Order = require("../../models/order.js");

exports.updateOrder = (req, res) => {
  Order.updateOne(
    { _id: req.body.orderId, "items.productId": req.body.productId },
    {
      $set: {
        "items.$.itemStatus": true,
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      // res.status(201).json({ order });
      Order.findOne({ _id: req.body.orderId }).exec(async (error, ordered) => {
        if (error) return res.status(400).json({ error });
        if (ordered) {
          // res.status(201).json({ ordered });
          // ordered.items.forEach(function (val, index) {
          //   if (val.itemStatus == false) {
          //     console.log("Hello");
          //     res.status(201).json({ message: "Orders Remaining" });
          //     return;
          //   } else {
          //     console.log("Hello2");
          //     Order.updateOne(
          //       { _id: req.body.orderId, "orderStatus.type": "packed" },
          //       {
          //         $set: {
          //           "orderStatus.$": [
          //             { type: "packed", date: new Date(), isCompleted: true },
          //           ],
          //         },
          //       }
          //     ).exec((error, order) => {
          //       if (error) return res.status(400).json({ error });
          //       if (order) {
          //         res.status(201).json({ order });
          //       }
          //     });
          //   }
          // });
          const check = ordered.items.find(function (item) {
            return item.itemStatus == false;
          });
          if (check == undefined) {
            Order.updateOne(
              { _id: req.body.orderId, "orderStatus.type": "packed" },
              {
                $set: {
                  "orderStatus.$": [
                    { type: "packed", date: new Date(), isCompleted: true },
                  ],
                },
              }
            ).exec((error, order) => {
              if (error) return res.status(400).json({ error });
              if (order) {
                res.status(201).json({ order });
              }
            });
          } else {
            res.status(201).json({ message: "Orders Remaining" });
          }
        }
      });
    }
  });
};

exports.getCustomerOrdersByVendors = async (req, res) => {
  const orders = await Order.find({ "items.productVendor": req.user._id })
    .populate("items.productId", "name")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error: "No Order Found" });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};
