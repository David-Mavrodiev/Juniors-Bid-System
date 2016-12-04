/*globals module require*/
'use strict';
const helper = require('../utils/helper');
const constants = require('../utils/constants');
const multer = require('multer');
const upload = multer().single('auctionPhoto');
const fs = require('fs');
const moment = require('moment');

function auctionController(data) {
    const usersController = require('./users-controller')(data);
    return {
        getAll(req, res, errorMessage) {
            let username, imageUrl;
            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';
            }
            if (req.isAuthenticated() && req.user.IsAdmin) {
                data.getAllAuctions()
                    .then(auctions => {
                        //console.log(auctions)
                        res.render('admins-auctions-list', {
                            result: {
                                auctions: auctions,
                                isAuthenticated: req.isAuthenticated(),
                                imageUrl: imageUrl,
                                user: req.user
                            },
                            error: helper.getErrorMessage(errorMessage)
                        })
                    })

            } else {
                data.getAllAuctions()
                    .then(auctions => {
                        res.render('auctions-list', {
                            result: {
                                auctions: auctions,
                                isAuthenticated: req.isAuthenticated(),
                                imageUrl: imageUrl,
                                user: req.user
                            },
                            error: helper.getErrorMessage(errorMessage)
                        })
                    })
            }
        },
        getAuctionsGallery(req, res) {
            let username, imageUrl;
            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';
            }
            data.getAllAuctions()
                .then(auctions => {
                    res.render("gallery", {
                        result: {
                            auctions: auctions,
                            isAuthenticated: req.isAuthenticated(),
                            imageUrl: imageUrl,
                            user: req.user
                        }
                    });
                });
        },
        getMyAuctions(req, res) {
            let username, imageUrl;
            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';
            }
            if (req.isAuthenticated()) {
                data.getAllAuctions()
                    .then(auctions => {
                        let myAuctions = [];
                        for (let i = 0; i < auctions.length; i++) {
                            if (auctions[i].creator == req.user.username) {
                                myAuctions.push(auctions[i]);
                            }
                        }
                        res.render("my-auctions", {
                            result: {
                                auctions: myAuctions,
                                isAuthenticated: req.isAuthenticated(),
                                imageUrl: imageUrl,
                                user: req.user
                            }
                        });
                    });
            }
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

                    let highestBidder, maxAmount = 0,
                        highestBidderUser = null;
                    for (let bidder of auction.bidders) {
                        if (bidder.amount > maxAmount) {
                            maxAmount = bidder.amount;
                            highestBidder = bidder.username;
                            highestBidderUser = bidder;
                        }
                    }
                    if (req.isAuthenticated() && req.user.IsAdmin) {
                        res.render('admins-auction', {
                            result: {
                                auction: auction,
                                highestBidder: highestBidderUser,
                                isAuthenticated: req.isAuthenticated(),
                                user: req.user,
                                imageUrl: imageUrl
                            },
                        });
                    } else {
                        res.render('auction-details', {
                            result: {
                                auction: auction,
                                isAuthenticated: req.isAuthenticated(),
                                imageUrl: imageUrl,
                                user: req.user,
                                highestBidder: highestBidder
                            }
                        });
                    }
                })
        },
        getCreate(req, res, errorMessage) {
            let username, imageUrl;

            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';

                res.render('create-auction', {
                    result: {
                        isAuthenticated: req.isAuthenticated(),
                        imageUrl: imageUrl,
                        user: req.user
                    },
                    error: helper.getErrorMessage(errorMessage)
                });
            } else {
                usersController.getLogin(req, res, 'You must log in to publish new auction!');
            }
        },
        create(req, res) {
            let body = req.body;
            const user = req.user;

            upload(req, res, function(err) {
                let hours = +req.body.end;
                let minPrice = +req.body.minPrice;
                if (err) {
                    return res.end(JSON.stringify(err));
                } else if (!req.file) {
                    auctionController(data).getCreate(req, res, 'You must select an image file!');
                } else if (!req.body.title || req.body.title.length < 3 || req.body.title.length > 25) {
                    auctionController(data).getCreate(req, res, 'Title must be between 3 and 25 characters!');
                } else if (!req.body.item || req.body.item.length < 3 || req.body.item.length > 25) {
                    auctionController(data).getCreate(req, res, 'Item must be between 3 and 25 characters!');
                } else if (typeof hours !== 'number' || isNaN(hours)) {
                    auctionController(data).getCreate(req, res, 'Invalid auction duration');
                } else if (hours < 1 || hours > 24) {
                    auctionController(data).getCreate(req, res, 'Auction Duration must be between 1 and 24 hours');
                } else if (typeof minPrice !== 'number' || isNaN(minPrice)) {
                    auctionController(data).getCreate(req, res, 'Invalid minimum price');
                } else if (minPrice < 1 || minPrice > 10000) {
                    auctionController(data).getCreate(req, res, 'Minimum price must be between 1 and 10000.');
                } else {
                    let dateCreated = moment();
                    let dateEnd = moment(dateCreated);

                    dateEnd.add(hours, 'hours');


                    data.createAuction(req.body.title, req.body.item, req.user.username, dateCreated, dateEnd, req.body.minPrice)
                        .then((auction) => {
                            fs.writeFileSync('./public/auctionimages/' + auction._id + '.jpg', new Buffer(req.file.buffer));
                            res.redirect('/auctions');
                        });
                }
            });
        },
        handleOffer(req, res) {
            const url = req.get('referer');
            const auctionId = url.substr(url.lastIndexOf('/') + 1);
            data.getAuctionById(auctionId)
                .then((auction) => {
                    const amount = helper.transformMoney(req.body.amount);
                    if (amount > helper.transformMoney(auction.minPrice)) {
                        if (auction.bidders.map(x => x.username).includes(req.user.username)) {
                            data.updateBidderOffer(auction._id, req.user.username, amount)
                                .then((editedAuction) => {
                                    data.updateUserOffer(req.user.username, editedAuction._id, amount);
                                    res.redirect(url);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            data.addBidderToAuction(auction._id, req.user.username, amount)
                                .then((editedAuction) => {
                                    data.addOffer(req.user.username, {
                                        auctionId: editedAuction._id,
                                        auctionTitle: editedAuction.name,
                                        amount: amount
                                    });
                                    res.redirect(url);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    } else {
                        auctionController(data).getAll(req, res, 'Invalid Bet: Minimum bet must be: ' + helper.transformMoney(auction.minPrice));
                    }
                });
        },
        createComment(req, res) {
            let body = req.body;
            let id = req.params.id;
            let text = helper.preventMessageInjectionAttack(body.text);
            let user = req.user.username;
            if (!text || text.length < 3 || text.length > 100) {
                auctionController(data).getAll(req, res, 'Message text must be between 3 and 100 characters');
            }
            data.addCommentToAuction(id, text, user)
                .then(auction => {
                    if (auction) {
                        res.status(204);
                        res.send({});
                        //res.redirect(req.url)
                    } else {
                        res.status(404);
                    }
                })
                .catch((err) => {
                    auctionController(data).getAll(req, res, 'Message text must be between 3 and 100 characters');
                })
        }
    }
};

module.exports = auctionController;