const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(422).json({
        message: "User already registered",
      });
    const { firstName, lastName, email, password, cpassword } = req.body;
    if (password != cpassword)
      return res.status(422).json({
        message: "password and confirm password not matched",
      });
    const token = jwt.sign(
      { firstName, lastName, email, password },
      process.env.JWT_SECRET,
      { expiresIn: "20m" }
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "anas4302537@cloud.neduet.edu.pk",
        pass: `${process.env.pass}`, // generated ethereal password
      },
    });
    const info = await transporter
      .sendMail({
        from: "anas4302537@cloud.neduet.edu.pk",
        to: email,
        subject: "Hello ✔",
        html: `
                <h2>Please Click On The Given Link To Activate Your Account</h2>
                <a href=${process.env.CLIENT_URI}/authentication/activate/${token}>activate</a>
            `,
      })
      .then(() => {
        return res.status(201).json({
          message: "Please Verify Your Account On Your Email",
        });
      }).catch((err) => {
        console.log(err)
        return res.status(422).json({message: "Something Went Wrong"});
      })
  });
};

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
    .exec(async (error, user) => {
        if(error) return res.status(400).json({ error });
        if(user && user.role === "user"){
            const isPassword = await user.authenticate(req.body.password)
            if(isPassword && user.role === 'user'){
                const token = jwt.sign({_id: user._id, role: user.role, email: user.email}, process.env.JWT_SECRET, { expiresIn: '1d'})
                const { _id, firstName, lastName, email, role, fullName } = user;
                res.status(200).json({
                  message: "Login Sucessfully",
                    token,
                    user: { _id, firstName, lastName, email, role, fullName }
                });
            }else{
                return res.status(400).json({
                    message: 'Authentication Faild'
                })
            }

        }else{
            return res.status(400).json({message: 'User is not Registered'});
        }
    });
};

exports.activateAccount = async (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ error: "Incorrect or Expired Link" });
      }
      const { firstName, lastName, email, password } = decodedToken;
      const hash_password = await bcrypt.hash(password, 10);
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: shortid.generate(),
        status: 'verified'
      });
      _user.save((error, user) => {
        if (error) {
          return res.status(400).json({
            error: "Something Went Wrong",
          });
        }
        if (user) {
          const { _id, firstName, lastName, email, role, fullName } = user;
          return res.status(201).json({
            message: "User Registered Sucessfully"
          });
        }
      });
    });
  } else {
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

exports.forgotPassword = async (req, res) => {
  const {email} = req.body;
  User.findOne({email}, (err, user) => {
    if(!user) {
      return res.status(400).json({error: "User with this email doesnot exist"})
    }

    const token = jwt.sign({_id: user._id}, process.env.RESET_PASSWORD_KEY, { expiresIn: '20m'})
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "anas4302537@cloud.neduet.edu.pk",
        pass: `${process.env.pass}`, // generated ethereal password
      },
    });
    
    return user.updateOne({resetLink: token},async function(err, sucess){
      if(err) {
        return res.status(400).json({error: "reset password link error"})
      } else {
        const info = await transporter
      .sendMail({
        from: "anas4302537@cloud.neduet.edu.pk",
        to: email,
        subject: "Account Activation Link",
        html: `
                <h2>Please Click On The Given Link To Reset Your Password</h2>
                <a href=${process.env.CLIENT_URI}/resetpassword/${token}>activate</a>
            `,
      })
      .then(() => {
        return res.status(201).json({
          message: "Plz verify your Account on your email",
        });
      });
      }
    })
  }
  )
}

exports.resetPassword = (req, res) => {
  const {resetLink, newPass} = req.body;
  if(resetLink) {
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY,async function(error, decodedData) {
      if(error) {
        return res.status(401).json({
          error: "Incorrect Token Or It Is Expired"
        })
      }
      const password = await bcrypt.hash(newPass, 10);
      update = {
        $set: {
          "hash_password": password,
        },
      };
      User.findOneAndUpdate({resetLink}, update,{new: true}).then((result) => {
        return res.status(201).json({result})
      }).catch((err) => console.log(err))
    })
  }
}