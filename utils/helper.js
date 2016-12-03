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

function getErrorMessage(errorMessage) {
    if (typeof errorMessage === 'function') {
        errorMessage = null;
    }

    return {
        message: errorMessage,
        errorOccured: !!errorMessage
    };
}

function formatMoney(money, currencyBig, currencySmall) {
    let formattedMoney;

    if (money >= 100) {
        formattedMoney = (money / 100) + ' ' + currencyBig;
    } else {
        formattedMoney = money + ' ' + currencySmall;
    }

    return formattedMoney;
}

function transformMoney(money) {
    return money * 100;
}

module.exports = {
    isAuthenticated(req) {
        return req.isAuthenticated() ? constants.loggedIn : constants.notLoggedIn;
    },
    preventMessageInjectionAttack: preventMessageInjectionAttack,
    preventUserInjectionAttack: preventUserInjectionAttack,
    getErrorMessage,
    formatMoney: formatMoney,
    transformMoney: transformMoney
};