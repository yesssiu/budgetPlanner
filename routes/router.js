"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Home Route
router.get("/", (req, res) => {
  res.render("index", { title: 'Home' });
});

// Login routes
router.get("/login", userController.login);
router.post("/login", userController.authenticate);

// Logout route
router.get("/users/logout", userController.logout, userController.redirectView);

// Signup routes
router.get("/signup", userController.signup);
router.post("/signup", userController.validate, userController.create, userController.redirectView);

// Update user information 
router.get("/:id/update", userController.update);

module.exports = router;

//Not needed for Express?
// exports.handle = (req, res) => {
//   try {
//     routes[req.method][req.url](req, res);
//   } catch (e) {
//     res.writeHead(httpStatus.OK, contentTypes.html);
//     utils.getFile("views/error.html", res);
//   }
// };

// exports.get = (url, action) => {
//   routes["GET"][url] = action;
// };

// exports.post = (url, action) => {
//   routes["POST"][url] = action;
// };
