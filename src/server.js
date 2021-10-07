const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Routes
const authRoutes = require("./routes/auth.js");

env.config();

mongoose.connect(`${process.env.DB_URI}`).then(() => {
  console.log("Database Connected");
});

// Use
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);

// async function main() {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "anas4302537@cloud.neduet.edu.pk",
//       pass: `${process.env.pass}`, // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: "anas4302537@cloud.neduet.edu.pk",
//     to: "anasqadir782@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     //   text: "Hello world?", // plain text body
//     html: "<b>Abc Junior?</b>", // html body
//   });
// }

// main().catch(console.error);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
