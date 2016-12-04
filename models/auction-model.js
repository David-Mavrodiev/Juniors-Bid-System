/*globals module require*/

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');


let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    comments: {
        type: [{
            comment: String,
            user: String
        }]
    },
    bidders: {
        type: [{
            username: String,
            amount: Number
        }]
    },
    image: {
        type: Buffer
    },
    minPrice: {
        type: Number,
        default: 0
    }
});

schema.plugin(mongoosePaginate);
mongoose.model("Auction", schema);

module.exports = mongoose.model('Auction');