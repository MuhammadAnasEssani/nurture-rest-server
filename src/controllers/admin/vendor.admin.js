const User = require("../../models/user.js");

exports.updateVendor = (req, res) => {
  User.updateOne(
    { _id: req.body.vendorId},
    {
      $set: {
        status: req.body.status,
      },
    }
  ).exec((error, user) => {
    if (error) return res.status(400).json({ error:"Such Vendor Not exist" });
    if (user) {
      res.status(201).json({ user });
    }
  });
};