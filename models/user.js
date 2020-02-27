const mongoose = require('./db');

var userSchema = mongoose.Schema({
    first_name: String, 
    last_name: String,
    email: String,
    password: String,
    address: String,
    zip_code: String,
    details: String,
    city: String,
    token: String,
    salt: String,
    photo: String,
})

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
