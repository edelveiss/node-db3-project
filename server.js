const express = require("express");
const helmet = require("helmet");
const schemeRouter = require("./api/schemes/schemeRouter.js");
const stepRouter = require("./api/steps/stepRouter.js");

const server = express();
server.use(helmet());
server.use(express.json());
server.use("/api/schemes", schemeRouter);
server.use("/api/steps", stepRouter);

module.exports = server;
