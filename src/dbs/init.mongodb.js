"use strict";

const { default: mongoose } = require("mongoose");
const {
  db: { name },
} = require("../configs/config.mongodb");

const connectString = `mongodb+srv://thanhan:12345@cluster0.vyrvsyr.mongodb.net/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  // connect to database
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", {
        color: true,
      });
    }

    // mongoose.connect(connectString, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.log("Failed to connect to MongoDB");
        console.log(err);
        // process.exit(1);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
