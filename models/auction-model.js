/*globals module require*/

const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    bidders: [{
        type: String
    }]
});

mongoose.model("Auction", schema);

module.exports = mongoose.model('Auction');