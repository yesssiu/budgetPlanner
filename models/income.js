const user = require("./user");
const mongoose = require("mongoose"),

incomeItemSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('IncomeItem', incomeItemSchema);