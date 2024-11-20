const ExpenseItem = require('../models/expense');

const getItemParams = body => {
    return {
        title: body.title,
        amount: body.amount,
        category: body.category,
        description: body.description,
        date: body.date,
        user: body.user,
        income: body.income,
        expense: body.expense
    };
};

module.exports = {
    // New budget item
    new: (req, res, next) => {
        res.render("budget/newExpense");
    },

    create: (req, res, next) => {
        let itemParams = getItemParams(req.body);
        itemParams.user = req.user._id;

        ExpenseItem.create(itemParams)
            .then(item => {
                console.log(`Budget item created successfully: ${item}`);
                req.flash("success", "Budget item created!");
                res.locals.redirect = "/overview";
                res.locals.item = item;
                next();
            })
            .catch(error => {
                console.log(`Error saving item: ${error.message}`);
                req.flash("error", `Failed to create budget item: ${error.message}`);
                res.locals.redirect = "/expense/new";
                next();
            });
    },

    // Editing budget item
    edit: (req, res, next) => {
        let itemId = req.params.id;
        ExpenseItem.findById(itemId)
            .then(item => {
                res.render("budget/edit", {
                    item: item
                });
            })
            .catch(error => {
                console.log(`Error finding item by ID: ${error.message}`);
                next(error);
            });
    },

    update: (req, res, next) => {
        let itemId = req.params.id,
            itemParams = getItemParams(req.body);

        ExpenseItem.findByIdAndUpdate(itemId, { $set: itemParams })
            .then(item => {
                res.locals.item = item;
                res.locals.redirect = "/overview";
                next();
            })
            .catch(error => {
                console.log(`Error updating item by ID: ${error.message}`);
                next(error);
            });
    },

    delete: (req, res, next) => {
        let itemId = req.params.id;
        ExpenseItem.findByIdAndRemove(itemId)
            .then(() => {
                res.locals.redirect = "/overview";
                next();
            })
            .catch(error => {
                console.log(`Error deleting item by ID: ${error.message}`);
                next();
            });
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
};