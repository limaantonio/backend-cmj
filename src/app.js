require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const User = require('./models/User');

const app = express();



mongoose.connect(
  process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(routes);

module.exports = app;