const mongoose = require('./db');

var messageSchema = mongoose.Schema({
    object: String, 
    content: String,
    sender_email: String,
    sender_name: String,
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    item_id: {type: mongoose.Schema.Types.ObjectId, ref: "items"},
    date: Date,
    read: Boolean,
    photo: String,
});

const MessageModel = mongoose.model('messages', messageSchema);

module.exports = MessageModel;
