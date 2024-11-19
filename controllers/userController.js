const User = require('../models/user');
const passport = require("passport");
const { body, validationResult } = require("express-validator");

module.exports = {
    login: (req, res) => {
        res.render("user/login");
    },

    authenticate: passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
        successFlash: "Logged in!"
    }),

    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },

    signup: (req, res) => {
        res.render("user/signup");
    },

    validate: [
        body("email")
            .isEmail()
            .withMessage("E-mail is invalid.")
            .normalizeEmail({ all_lowercase: true })
            .trim(),
        body("password")
            .notEmpty()
            .isLength({ min: 4 })
            .withMessage("Password must be at least 4 characters long."),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const messages = errors.array().map(err => err.msg);
                req.skip = true;
                req.flash("error", messages.join(" and "));
                res.locals.redirect = "/signup";
                next();
            } else {
                next();
            }
        }
    ],

    create: (req, res, next) => {
        if (req.skip) next();
        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (e, user) => {
            if (user) {
                req.flash("success", `${user.fullName}'s account created successfully!`);
                res.locals.redirect = "/user";
                next();
            } else {
                req.flash("error", `Failed to create user account because: ${e.message}.`);
                res.locals.redirect = "/user/new";
                next();
            }
        });
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },

    update: (req, res, next) => {
        let userId = req.params.id;
        let userParams = {
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode
        };
        User.findByIdAndUpdate(userId, {
            $set: userParams
        })
            .then(user => {
                res.locals.redirect = `/user/${userId}`;
                res.locals.user = user;
                next();
            })
            .catch(err => {
                console.log(`Error updating user by ID: ${err.message}`);
                next(err);
            });
    }
};