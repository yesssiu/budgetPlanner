const IncomeItem = require('../models/income');

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

    overview: (req, res, next ) => {
        IncomeItem.find()
      .then(incomeItems => {
        res.locals.incomeItems = incomeItems;
        next();
      })
      .catch(error => {
        console.log(`Error fetching income items: ${error.message}`);
        next(error);
      });
    },
    // New budget item
    new: (req, res, next) => {
        res.render("budget/newIncome");
    },

    create: (req, res, next) => {
        let itemParams = getItemParams(req.body);
        itemParams.user = req.user._id;

        IncomeItem.create(itemParams)
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
                res.locals.redirect = "/income/new";
                next();
            });
    },

    // Editing budget item
    edit: (req, res, next) => {
        let itemId = req.params.id;
        IncomeItem.findById(itemId)
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

            IncomeItem.findByIdAndUpdate(itemId, { $set: itemParams })
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
        IncomeItem.findByIdAndRemove(itemId)
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