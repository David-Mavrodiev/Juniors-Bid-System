/*globals require module*/
'use strict';
const express = require('express');

module.exports = function (app, data) {

    let controller =
        require('../controllers/auction-controller')(data);

    let router = express.Router();
    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);

    app.use('/auctions', router);
};