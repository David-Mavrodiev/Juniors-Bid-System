/*globals module require*/
'use strict';
const helper = require('../utils/helper');

module.exports = function (data) {
    return {
        getAll(req, res) {
            const user = req.user;
            let isAuthenticated = helper.isAuthenticated(req);
            let imageUrl;

            if (user) {
                imageUrl = '/static/profileimages/' + user.username + '.jpg';
            }

            data.getAllAuctions()
                .then(auctions => {
                    res.render('auctions-list', {
                        result: {
                            auctions: auctions,
                            isAuthenticated: req.isAuthenticated(),
                            img: imageUrl,
                            user: user
                        }
                    })
                })
        },
        searchAll(req, res){
            const user = req.user;
            let isAuthenticated = helper.isAuthenticated(req);
            let imageUrl;

            if (user) {
                imageUrl = '/static/profileimages/' + user.username + '.jpg';
            }
            data.searchAllAuctions(req.params.search)
                .then(auctions => {
                    res.render('auctions-list', {
                        result: {
                            auctions: auctions,
                            isAuthenticated: req.isAuthenticated(),
                            img: imageUrl,
                            user: user
                        }
                    })
                })
        }
        ,
        getPage(req, res){
            data.getAuctionsPage(req.params.page)
                .then(auctions => {
                    res.render('auctions-for-paging', {
                        result: {
                            auctions: auctions,
                            isAuthenticated: req.isAuthenticated()
                        }
                    })
                })
        },
        getById(req, res) {
            const user = req.user;
            let imageUrl;

            if (user) {
                imageUrl = '/static/profileimages/' + user.username + '.jpg';
            }
            data.getAuctionById(req.params.id)
                .then(auction => {
                    if (auction === null || auction === undefined) {
                        return res.status(404)
                            .redirect('/error');
                    }
                    res.render('auction-details', {
                        result: {
                            auction: auction,
                            isAuthenticated: req.isAuthenticated(),
                            img: imageUrl,
                            user: user
                        },
                    });
                })
        },
        getCreate(req, res){
            const user = req.user;
            let imageUrl;

            if (user) {
                imageUrl = '/static/profileimages/' + user.username + '.jpg';
            }

            if (req.isAuthenticated()) {
                res.render('create-auction', {
                    result: {
                        isAuthenticated: req.isAuthenticated(),
                        img: imageUrl,
                        user: user
                    }
                });
            }
            else {
                res.status(401)
                    .redirect('/unauthorized');
            }
        },
        create(req, res) {
            let body = req.body;
            const user = req.user;

            data.createAuction(body.title, body.item, user.username)
                .then(() => {
                    res.redirect('/auctions');
                });
        }
    }
};