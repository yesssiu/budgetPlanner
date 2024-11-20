const user = require("./user");

const mongoose = require("mongoose"),

budgetItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false
    },

    date: {
        type: Date,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    income: {
        type: Boolean,
        required: true
    },

    expense: {
        type: Boolean,
        required: true
    }

});

// // Custom validation to ensure either income or expense is true, but not both
// budgetItemSchema.pre('validate', function(next) {
//     if (this.income === this.expense) {
//         next(new Error('Either income or expense must be true, but not both.'));
//     } else {
//         next();
//     }
// });

module.exports = mongoose.model('BudgetItem', budgetItemSchema);