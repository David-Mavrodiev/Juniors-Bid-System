/* globals module require */
'use strict';
const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    message: {
        type: String
    }
})

let chatSchema = new mongoose.Schema({
    firstUser: {
        type: String,
        required: true
    },
    secondUser: {
        type: String,
        required: true
    },
    messages: [messageSchema]
});

mongoose.model('Chat', chatSchema);

module.exports = mongoose.model('Chat');