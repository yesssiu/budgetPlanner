const User = require('./models/user');

module.exports = {
    index: (req, res) => {
        User.find({})
            .then(users => {
                res.render('users/index', {
                    users: users
                });
            })
            .catch(err => {
                console.log(`Error fetching users: ${err.message}`)
                res.redirect('/');
            });
    },
    indexView: (req, res) => {
        res.render('users/index');
    },

    new: (req, res) => {
        res.render('users/new');
    },
    create: (req, res, next) => {
        if (req.skip) next();
        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (e, user) => {
          if (user) {
            req.flash("success", `${user.fullName}'s account created successfully!`);
            res.locals.redirect = "/users";
            next();
          } else {
            req.flash("error", `Failed to create user account because: ${e.message}.`);
            res.locals.redirect = "/users/new";
            next();
          }
        });
      },

    show: (req, res, next) => { 
        let userId = req.params.id;
        User.findById(userId)
            .then(user => { 
                res.locals.user = user;
                next();
            })
            .catch(err => {
                console.log(`Error fetching user by ID: ${err.message}`);
                next(err);
            });
    },
    showView: (req, res) => { 
        res.render('users/show');
    },

    edit: (req, res, next) => { 
        let userId = req.params.id;
        User.findById(userId)
            .then(user => { 
                if (user) {
                    console.log(`User found: ${user}`);
                    res.render('users/edit', { user: user });
                } else {
                    console.log(`User not found, redirecting...`);
                    res.redirect('/users');  // Redirect if user not found
                }
            })
            .catch(err => {
                console.log(`Error fetching user by ID: ${err.message}`);
                next(err);
            });
    },

    update: (req, res, next) => { 
        console.log("Update route hit!");
        let userId = req.params.id;
        console.log("User ID:", userId);
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
                res.locals.redirect = `/users/${userId}`;
                res.locals.user = user;
                next();
            })
            .catch(err => {
                console.log(`Error updating user by ID: ${err.message}`);
                next(err);
            });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },

    delete: (req, res, next) => { 
        let userId = req.params.id;
        User.findByidAndRemove(userId)
            .then(() => {
                res.locals.redirect = '/users';
                next();
            })
            .catch(err => {
                console.log(`Error deleting user by ID: ${err.message}`);
                next(err);
            });
    },

    login: (req, res) => {
        res.render("users/login");
        },

    //User authentication
    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
        successFlash: "Logged in!"
      }),

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

    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/"; //Back to home page
        next();
    }
};

