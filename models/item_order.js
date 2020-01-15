const mongoose = require('./db');

let itemOrderSchema = mongoose.Schema({
    item_id: {type: mongoose.Schema.Types.ObjectId, ref: "items"},
    price: Number,
    name: String,
    order_id: {type: mongoose.Schema.Types.ObjectId, ref: "orders"},
    copy: Number,
    photo: String,
    description: String,
});

const ItemOrderModel = mongoose.model("item_orders", itemOrderSchema);

module.exports = ItemOrderModel;