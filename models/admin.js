const mongoose = require('./db');

let adminSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const AdminModel = mongoose.model("admins", adminSchema);

module.exports = AdminModel;