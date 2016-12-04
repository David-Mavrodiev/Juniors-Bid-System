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
        getAll(req, res) {
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
                            }
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
                            }
                        })
                    })
            }
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
                                isAuthenticated: req.isAuthenticated,
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
                    console.log(highestBidderUser);
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
                if (err) {
                    return res.end(JSON.stringify(err));
                } else if (!req.file) {
                    auctionController(data).getCreate(req, res, 'You must select an image file!');
                } else {

                    let dateCreated = moment();
                    let dateEnd = moment(dateCreated);

                    dateEnd.add(+req.body.end, 'hours');


                    data.createAuction(req.body.title, req.body.item, req.user.username, dateCreated, dateEnd, req.body.minPrice)
                        .then((auction) => {
                            console.log('creating auction 2');
                            fs.writeFileSync('./public/auctionimages/' + auction._id + '.jpg', new Buffer(req.file.buffer));
                            console.log('Writed');
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
                        res.redirect("/auctions");
                    }
                });
        },
        createComment(req, res) {
            let body = req.body;
            let id = req.params.id;
            let text = body.text;
            let user = req.user.username;

            data.addCommentToAuction(id, text, user)
                .then(auction => {
                    if (auction) {
                        res.status(204);
                        res.send(user);
                    } else {
                        res.status(404);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
};

module.exports = auctionController;