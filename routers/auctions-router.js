/*globals require module*/
'use strict';
const express = require('express');

module.exports = function(app, data) {

    let controller =
        require('../controllers/auction-controller')(data);

    let router = express.Router();
    router.get('/', controller.getAll);
    router.get('/myAuctions', controller.getMyAuctions);
    router.get('/gallery', controller.getAuctionsGallery)
    router.get('/search/:search', controller.searchAll);
    router.get('/page/:page', controller.getPage);
    router.get('/create', controller.getCreate);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.post('/offer', controller.handleOffer);
    router.post('/:id', controller.createComment);

    app.use('/auctions', router);
};