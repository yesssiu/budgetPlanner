const User = require('../models/user');
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const getUserParams = body => {
    return {
        name: {
            first: body.first_name,
            last: body.last_name
        },
        email: body.email,
        password: body.password
    };
};

module.exports = {
    login: (req, res) => {
        res.render("user/login");
    },

    authenticate: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.log(`Login error: ${err.message}`);
                req.flash("error", "Failed to login.");
                return res.redirect("/login");
            }
            if (!user) {
                console.log("Login failed: No user found.");
                req.flash("error", "Failed to login.");
                return res.redirect("/login");
            }
            req.logIn(user, err => {
                if (err) {
                    console.log(`Login error: ${err.message}`);
                    req.flash("error", "Failed to login.");
                    return res.redirect("/login");
                }
                console.log(`Login successful: ${user.email}`);
                req.flash("success", "Logged in!");
                return res.redirect("/");
            });
        })(req, res, next);
    },

    logout: (req, res, next) => {
        req.logout(err => {
            if(err) {
                console.log(`Error logging out: ${err.message}`);
                req.flash("error", "Failed to log out.");
                return next(err);
            }
            req.flash("success", "You have been logged out!");
            res.locals.redirect = "/";
            next();
        });
    },

    signup: (req, res) => {
        res.render("user/signup", { title: 'Sign up' });
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