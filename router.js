"use strict";

const httpStatus = require("http-status-codes"),
  contentTypes = require("./contentTypes"),
  utils = require("./utils");


const express = require("express");
const router = express.Router();
const userController = require("./userController");

const routes = {
  GET: {},
  POST: {}
};

// Home Route
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});



router.get('/',)

//Login routes
router.get('/login', userController.login)


// Update user information 
router.get('/:id/update', userController.update)




exports.handle = (req, res) => {
  try {
    routes[req.method][req.url](req, res);
  } catch (e) {
    res.writeHead(httpStatus.OK, contentTypes.html);
    utils.getFile("views/error.html", res);
  }
};

exports.get = (url, action) => {
  routes["GET"][url] = action;
};

exports.post = (url, action) => {
  routes["POST"][url] = action;
};
