const mongoose = require('./db');

let persoOrderSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    total: Number,
    date: Date,
    sent: Boolean,
    shipping_date: Date,
    in_person: Boolean,
    photo: String,
    shipping_fee: Number,
    description: String,
    paid: Boolean,
});

const OrderModel = mongoose.model("perso_orders", persoOrderSchema);

module.exports = OrderModel;