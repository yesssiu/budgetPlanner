"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Home Route
router.get("/", (req, res) => {
  res.render("index", { title: 'Home' });
});

router.get("/error", (req, res) => { 
  res.render("error", { title: 'Error' });
})

// Login routes
router.get("/login", userController.login);
router.post("/login", userController.authenticate);

// Logout route
router.get('/users/logout', userController.logout, userController.redirectView);

// Signup routes
router.get("/signup", userController.signup);
router.post("/signup", userController.validate, userController.create, userController.redirectView);

// Update user information
router.get('/:id/update', userController.update);

// FAQ route
router.get('/faq', (req, res) => {
    res.render('user/faq', { title: 'FAQ & Chat' });
});

module.exports = router;

