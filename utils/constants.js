/* globals module require*/

const secretWord = "secret";
const port = 3001;
const usersConnectionString = "mongodb://localhost:27017/Users";
const auctionsConnectionString = "mongodb://localhost:27017/Users";
const loggedIn = {
        result: {
            isAuthenticated: true
        }
    },
    notLoggedIn = {
        result: {
            isAuthenticated: false
        }
    };
const cryptingKey = 'asd214ag2t52rlla'
const siteCurrency = {
    big: 'лв',
    small: 'стот.'
};

module.exports = {
    secretWord,
    usersConnectionString,
    port,
    auctionsConnectionString,
    loggedIn: loggedIn,
    notLoggedIn: notLoggedIn,
    cryptingKey,
    siteCurrency: siteCurrency
};