/* globals require module */
'use strict';
const constants = require('./constants');

module.exports = {
    isAuthenticated(req) {
        return req.isAuthenticated() ? constants.loggedIn : constants.notLoggedIn;
    }
};