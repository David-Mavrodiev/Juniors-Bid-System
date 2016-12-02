/* globals require module */
'use strict';
const constants = require('./constants');

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function preventMessageInjectionAttack(input) {
    let result = input.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')

    return result;
}

function preventUserInjectionAttack(input) {
    let result = input.replaceAll('&', '')
        .replaceAll('<', '')
        .replaceAll('>', '')
        .replaceAll('/', '')
        .replaceAll("'", '')
        .replaceAll('"', '')

    return result;
}

module.exports = {
    isAuthenticated(req) {
        return req.isAuthenticated() ? constants.loggedIn : constants.notLoggedIn;
    },
    preventMessageInjectionAttack: preventMessageInjectionAttack,
    preventUserInjectionAttack: preventUserInjectionAttack
};