const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [{
        text: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model("User", UserModel);
