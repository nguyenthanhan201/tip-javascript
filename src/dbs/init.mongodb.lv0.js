"use strict";

const { default: mongoose } = require("mongoose");

const connectString = `mongodb+srv://thanhan:12345@cluster0.vyrvsyr.mongodb.net/shopDev`;

mongoose
  .connect(connectString, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB");
    console.log(err);
    // process.exit(1);
  });

module.exports = mongoose;
