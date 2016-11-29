/*globals module require*/
'use strict';
const helper = require('../utils/helper');

module.exports = function (data) {
    return {
        getAll(req, res) {
            let isLoggedIn = req.isAuthenticated();

            data.getAllAuctions()
                .then(auctions => {
                    res.render('auctions-list', {
                        result: {
                            auctions: auctions,
                            isAuthenticated: req.isAuthenticated()
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
                            auction: auction,
                            isAuthenticated: req.isAuthenticated()
                        },
                    });
                })
        },
        getCreate(req, res){
            if (req.isAuthenticated()) {
                res.render('create-auction', helper.isAuthenticated(req));
            }
            else {
                res.status(401)
                    .redirect('/unauthorized');
            }
        },
        create(req, res) {
            let body = req.body;
            let user = req.user;
            data.createAuction(body.title, body.item, user.username)
                .then(() => {
                    res.redirect('/auctions');
                });
        }
    }
};