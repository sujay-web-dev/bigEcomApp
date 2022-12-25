const express = require('express');
require('dotenv').config()
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload')

// For Swagger Documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Regular Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies and file Middleware
app.use(cookieParser());
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));

// Morgan Middleware
app.use(morgan("tiny"))

// Import all routes here
const home = require('./routes/home');
const user = require('./routes/user');

// router Middleware
app.use('/api/v1', home);
app.use('/api/v1', user);

// Export app.js
module.exports = app;