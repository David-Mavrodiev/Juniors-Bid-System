/*globals require module*/
'use strict';
const express = require('express');

module.exports = function (app, data) {
    let router = express.Router();
    router.get('/', (req, res) => {
        data.getAllAuctions()
            .then(auctions => {
                res.render('auctions-list', {
                    result: auctions
                })
            })
    });
    router.get('/:id', (req, res) => {
        data.getAuctionById(req.params.id)
            .then(auction => {
                if (auction === null) {
                    return res.status(404)
                        .redirect('/error');
                }
                res.render('auction-details', {
                    result: auction
                });
            })
    });
    router.post('/', (req, res) => {
        let body = req.body;
        data.createAuction(body.name, body.item, body.bidders)
            .then(() => {
                res.redirect('/auctions');
            });
    });

    app.use('/auctions', router);
};