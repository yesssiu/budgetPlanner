const mongoose = require("mongoose");

const userSchema = new Schema({
    name: {
        first: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            trim: true
        }
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    }, 
}, {
    timestamps: true
});

userSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`;
});

userSchema.virtual("username").get(function () {
    const firstLetter = this.name.first.charAt(0).toLowerCase();
    const lastName = this.name.last.slice(0, 7).toLowerCase();
    return firstLetter + lastName;
});

userSchema.pre("save", function (next) {
    let user = this;
    if (user.subscribedAccount === undefined) {
        Subscriber.findOne({
            email: user.email
        })
            .then(subscriber => {
                user.subscribedAccount = subscriber;
                next();
            })
            .catch(err => {
                console.log(`Error in connecting subscriber: ${err.message}`);
                next(error);
            });
    } else {
        next();
    }
});

module.exports = mongoose.model("User", userSchema);