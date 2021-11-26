const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // addressId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "UserAddress.address",
    //   required: true,
    // },
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        productVendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        itemStatus: {
          type: Boolean,
          default: false,

        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchasedQty: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cod", "card"],
      required: true,
    },
    address: {
      // type: Object,
      // required: true,
      name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50,
      },
      mobileNumber: {
        type: String,
        required: true,
        trim: true,
      },
      pinCode: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 100,
      },
      cityDistrictTown: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        required: true,
      },
      landmark: {
        type: String,
        min: 10,
        max: 100,
      },
      alternatePhone: {
        type: String,
      }
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "packed", "shipped", "delivered"],
          default: "ordered",
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
