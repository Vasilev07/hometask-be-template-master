const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { Op } = require("sequelize");
const { routesInit } = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

routesInit(app);

module.exports = app;
