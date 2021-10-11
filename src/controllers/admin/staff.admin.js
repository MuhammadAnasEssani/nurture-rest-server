const User = require('../../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

exports.addStaff = (req, res) => {
    User.findOne({ email: req.body.email })
    .exec(async(error, user) => {
        if(user) return res.status(400).json({
            message: 'Account already registered'
        });
        const {
            firstName,
            lastName,
            email,
            password,
            cpassword
        } = req.body;
        if (password != cpassword)
      return res.status(422).json({
        error: "password and confirm password not matched",
      });
        const hash_password = await bcrypt.hash(password, 10);
        const _user = new User({
            firstName,
            lastName,
            email,
            hash_password,
            username: shortid.generate(),
            role: 'staff',
            status: 'verified'           
        });
        _user.save((error, data) => {
            if(error){
                return res.status(400).json({
                    message: 'Something Went Wrong'
                });
            }
            if(data){
                return res.status(201).json({
                    message: 'Staff Created Sucessfully'
                })
            }
        })
    });
}

