"use strict";

const { mongo, default: mongoose } = require("mongoose");
const _SECOND = 5000;
const os = require("os");
const process = require("process");

// count number of connections
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

// check over load connection
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCor = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnection = numCor * 5;

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnection) {
      console.log(`Over load connections: ${numConnection}`);
      process.exit(1);
    }

    if (numConnection > 100) {
      console.log(`Over load connections: ${numConnection}`);
      process.exit(1);
    }
  }, _SECOND);
};

module.exports = {
  countConnect,
  checkOverLoad,
};
