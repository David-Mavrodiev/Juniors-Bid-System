/* globals require module */
'use strict';
const userModel = require('../models/user-model');
const usersData = require('../data/users-data')({ User: userModel });
const usersController = require('./users-controller')(usersData);

module.exports = {
    addUserOffer(username, offer) {
        usersController.createOffer(username, offer);
    },
    updateUserOffer(username, auctionId, newAmount) {
        usersController.updateOffer(username, auctionId, newAmount);
    }
};