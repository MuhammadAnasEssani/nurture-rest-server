const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const app = express();

// Routes
const authRoutes = require("./routes/auth.js");
const vendorAuthRoutes = require("./routes/vendor/auth.js");
const adminAddStaffRoutes = require("./routes/admin/staff.admin.js");
const adminVendorRoutes = require("./routes/admin/vendor.admin.js");
const categoryRoutes = require("./routes/category.js")

env.config();

mongoose.connect(`${process.env.DB_URI}`).then(() => {
  console.log("Database Connected");
});

// Use

app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use("/api", authRoutes);
app.use("/api", vendorAuthRoutes)
app.use("/api", adminAddStaffRoutes)
app.use("/api", adminVendorRoutes)
app.use("/api", categoryRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
