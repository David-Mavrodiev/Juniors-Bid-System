/*globals module require*/
'use strict';
const helper = require('../utils/helper');
const userUtils = require('./users-utils');

module.exports = function (data) {
    const usersController = require('./users-controller')(data);
    return {
        getAll(req, res) {
            let username, imageUrl;
            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';
            }

            data.getAllAuctions()
                .then(auctions => {
                    res.render('auctions-list', {
                        result: {
                            auctions: auctions,
                            isAuthenticated: req.isAuthenticated(),
                            imageUrl: imageUrl,
                            user: req.user
                        }
                    })
                })
        },
        searchAll(req, res) {
            let username, imageUrl;
            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';
            }

            data.searchAllAuctions(req.params.search)
                .then(auctions => {
                    res.render('auctions-list', {
                        result: {
                            auctions: auctions,
                            isAuthenticated: req.isAuthenticated(),
                            imageUrl: imageUrl,
                            user: req.user
                        }
                    })
                })
        },
        getPage(req, res) {
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
            let username, imageUrl;
            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';
            }

            data.getAuctionById(req.params.id)
                .then(auction => {
                    if (auction === null || auction === undefined) {
                        return res.status(404)
                            .redirect('/error');
                    }

                    let highestBidder, maxAmount = 0;
                    for (let bidder of auction.bidders) {
                        if (bidder.amount > maxAmount) {
                            maxAmount = bidder.amount;
                            highestBidder = bidder.username;
                        }
                    }

                    res.render('auction-details', {
                        result: {
                            auction: auction,
                            isAuthenticated: req.isAuthenticated(),
                            imageUrl: imageUrl,
                            user: req.user,
                            highestBidder: highestBidder
                        },
                    });
                })
        },
        getCreate(req, res) {
            let username, imageUrl;
            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';
            }

            if (req.isAuthenticated()) {
                res.render('create-auction', {
                    result: {
                        isAuthenticated: req.isAuthenticated(),
                        imageUrl: imageUrl,
                        user: req.user
                    }
                });
            } else {
                usersController.getRegister(req, res, 'You must log in to publish new auction!');
            }
        },
        create(req, res) {
            let body = req.body;
            const user = req.user;

            data.createAuction(body.title, body.item, user.username)
                .then(() => {
                    res.redirect('/auctions');
                });
        },
        handleOffer(req, res) {
            const url = req.get('referer');
            const auctionId = url.substr(url.lastIndexOf('/') + 1);
            data.getAuctionById(auctionId)
                .then((auction) => {
                    if (auction.bidders.map(x => x.username).includes(req.user.username)) {
                        data.updateBidderOffer(auction._id, req.user.username, req.body.amount)
                            .then((editedAuction) => {
                                userUtils.updateUserOffer(req.user.username, editedAuction._id, req.body.amount);
                                res.redirect(url);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        data.addBidderToAuction(auction._id, req.user.username, req.body.amount)
                            .then((editedAuction) => {
                                userUtils.addUserOffer(req.user.username, {
                                    auctionId: editedAuction._id,
                                    auctionTitle: editedAuction.name,
                                    amount: req.body.amount
                                });
                                res.redirect(url);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                });
        }
    }
};