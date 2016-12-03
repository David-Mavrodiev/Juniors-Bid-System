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
    image: {
        type: Buffer
    }
});

schema.plugin(mongoosePaginate);
mongoose.model("Auction", schema);

module.exports = mongoose.model('Auction');