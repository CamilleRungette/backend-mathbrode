const mongoose = require('./db');

let orderSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    total: Number,
    date: Date,
    sent: Boolean,
    shipping_date: Date,
});

const OrderModel = mongoose.model("orders", orderSchema);

module.exports = OrderModel;