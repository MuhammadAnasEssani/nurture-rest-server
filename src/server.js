const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
// const path = require('path');
const app = express();
 
env.config();

mongoose.connect(`${process.env.DB_URI}`).then(() => {
  console.log("Database Connected");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
