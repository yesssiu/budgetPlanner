const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose") 


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

//Password hashing
const bcrypt = require("bcrypt")

userSchema.pre("save", function(next) {
    let user = this;
    bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash;
    next();
    })
    .catch(error => {
        console.log(`Error in hashing password: ${error.message}`);
        next(error);
    });
    });
    userSchema.methods.passwordComparison = function(inputPassword){
        let user = this;
        return bcrypt.compare(inputPassword, user.password);
    };

userSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`;
});

userSchema.virtual("username").get(function () {
    const firstLetter = this.name.first.charAt(0).toLowerCase();
    const lastName = this.name.last.slice(0, 7).toLowerCase();
    return firstLetter + lastName;
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
    });



module.exports = mongoose.model("User", userSchema);