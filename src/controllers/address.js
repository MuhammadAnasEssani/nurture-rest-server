const UserAddress = require("../models/address");

exports.addAddress = (req, res) => {
    //return res.status(200).json({body: req.body})
    const { payload } = req.body;
    if (payload.address) {
        if (payload.address._id) {
            UserAddress.findOneAndUpdate(
                { user: req.user._id, "address._id": payload.address._id },
                {
                    $set: {
                        "address.$": payload.address,
                    },
                }
            ).exec((error, address) => {
                if (error) return res.status(400).json({ error });
                if (address) {
                    res.status(201).json({ address });
                }
            });
        } else {
            UserAddress.findOneAndUpdate(
                { user: req.user._id },
                {
                    $push: {
                        address: payload.address,
                    },
                },
                { new: true, upsert: true }
            ).exec((error, address) => {
                if (error) return res.status(400).json({ error });
                if (address) {
                    res.status(201).json({ address });
                }
            });
        }
    } else {
        res.status(400).json({ error: "Params address required" });
    }
};

exports.getAddress = (req, res) => {
    UserAddress.findOne({ user: req.user._id }).exec((error, userAddress) => {
        if (error) return res.status(400).json({ error });
        if (userAddress) {
            res.status(200).json({ userAddress });
        } else {
            res.status(200).json({});
        }
    });
};

exports.removeAddress = (req, res) => {
    const {addressId} = req.body.payload;
    if (addressId) {
        UserAddress.findOneAndUpdate(
            {user: req.user._id},
            {
                $pull: {
                    address: {
                        _id: addressId
                    }
                }
            }
        ).exec((error, result) => {
            if(error) return res.status(400).json({error: "Such Address Not Found"});
            if(result) {
                res.status(202).json({result});
            }
        })
    }
}