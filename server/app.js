const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const router = require("./routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);
app.use(errorHandler);

module.exports = app;
