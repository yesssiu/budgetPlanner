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
        User.create(userParams)
            .then(user => {
                res.locals.redirect = '/users';
                res.locals.user = user;
                next();
            })
            .catch(err => {
                console.log(`Error saving user: ${err.message}`);
                next(err);
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
    }
};

