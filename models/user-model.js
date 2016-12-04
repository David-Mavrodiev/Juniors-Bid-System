/* globals module require */
'use strict';
const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: Buffer
    },
    offers: {
        type: [{
            auctionId: String,
            auctionTitle: String,
            amount: Number
        }]
    },
    IsAdmin: {
        type: Boolean,
        default: false
    }
});

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');