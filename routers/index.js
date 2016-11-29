/*globals module require */
'use strict';
const fs = require('fs');
const path = require('path');

module.exports = function(app, data) {
    //Magic happens here, please don't be offensive
    fs.readdirSync('./routers')
        .filter(x => x.includes('-router')) //loads only files that ends on '-data' ex. 'auctions-data.js'
        .forEach(file => {
            require(path.join(__dirname, file))(app, data); //dir name if any of you use linux
        });
};