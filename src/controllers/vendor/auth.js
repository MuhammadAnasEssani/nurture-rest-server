const User = require("../../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(422).json({
        error: "Account is already registered",
      });
    const { firstName, lastName, email, password, cpassword } = req.body;
    if (password != cpassword)
      return res.status(422).json({
        error: "password and confirm password not matched",
      });
    const token = jwt.sign(
      { firstName, lastName, email, password },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
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
          message: "Plz verify your Account on your email",
        });
      });
  });
};

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
    .exec(async (error, user) => {
        if(error) return res.status(400).json({ error });
        if(user){
          if(user.status != "pending"){
            const isPassword = await user.authenticate(req.body.password)
            if(isPassword){
                const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1d'})
                const { _id, firstName, lastName, email, role, fullName } = user;
                res.status(200).json({
                    token,
                    user: { _id, firstName, lastName, email, role, fullName }
                });
            }else{
                return res.status(400).json({
                    error: 'Authentication Faild'
                })
            }
          }else {
            return res.status(201).json({
              message: "plz wait your authorization in progress"
            })
          }
        }else{
            return res.status(400).json({error: 'Account is Not registered is not Registered'});
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
        role: 'vendor',
        status: 'pending'
      });
      _user.save((error, user) => {
        if (error) {
          return res.status(400).json({
            error: "Something Went Wrong",
          });
        }
        if (user) {
          const { _id, firstName, lastName, email, role, fullName, status } = user;
          return res.status(201).json({
            token,
            user: { _id, firstName, lastName, email, role, fullName, status },
          });
        }
      });
    });
  } else {
    return res.status(500).json({ error: "Something went Wrong" });
  }
};
