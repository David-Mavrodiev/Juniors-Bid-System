/*globals module require*/
'use strict';
const constants = require('../utils/constants');

module.exports = function (data) {
    return {
        getAll(req, res) {
            let isLoggedIn = req.isAuthenticated();

            data.getAllAuctions()
                .then(auctions => {
                    res.render('auctions-list', {
                        result: {
                            auctions: auctions,
                            isAuthenticated: isLoggedIn
                        }
                    })
                })
        },
        getById(req, res) {
            data.getAuctionById(req.params.id)
                .then(auction => {
                    if (auction === null || auction === undefined) {
                        return res.status(404)
                            .redirect('/error');
                    }
                    res.render('auction-details', {
                        result: {
                            auction: auction
                        },
                    });
                })
        },
        create(req, res) {
            let body = req.body;
            data.createAuction(body.name, body.item, body.bidders)
                .then(() => {
                    res.redirect('/auctions');
                });
        }
    }
};