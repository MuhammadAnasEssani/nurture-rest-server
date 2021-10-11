const jwt = require('jsonwebtoken');


const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})

exports.upload = multer({ storage });


exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
    }else{
        return res.status(400).json({ message: 'Authorization Required' });
    }
    next();
}

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(400).json({ message: 'Admin Access Denied' })
    }
    next();
}

exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(400).json({ message: 'User Access Denied' })
    }
    next();
}

exports.vendorMiddleware = (req, res, next) => {
    if (req.user.role !== 'vendor') {
        return res.status(400).json({ message: 'Vendor Access Denied' })
    }
    next();
}

exports.staffMiddleware = (req, res, next) => {
    if (req.user.role !== 'staff') {
        return res.status(400).json({ message: 'Staff Access Denied' })
    }
    next();
}

exports.adminAndStaffMiddleware = (req, res, next) => {
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'Access Denied' })
    }
    next();
}

exports.adminStaffAndVendorMiddleware = (req, res, next) => {
    if (req.user.role !== 'staff' && req.user.role !== 'admin' && req.user.role !== 'vendor') {
        return res.status(400).json({ message: 'Access Denied' })
    }
    next();
}
