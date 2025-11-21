const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
    // username field is automatically added by passport-local-mongoose plugin
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);