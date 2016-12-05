/*globals module Promise*/
'use strict';
const helper = require('../utils/helper');

module.exports = function(models) {
    let Auction = models.Auction;

    return {
        getAllAuctions: function() {
            return new Promise((resolve, reject) => {
                Auction.paginate({}, { page: 1, limit: 50 }, (err, auctions) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(auctions.docs);
                })
            });
        },
        getNewestAuctions: function(count) {
            return new Promise((resolve, reject) => {
                Auction.find({})
                    .sort('-date')
                    .limit(count)
                    .exec(function(err, auctions) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(auctions);
                        }
                    });
            })
        },
        searchAllAuctions: function(value) {
            return new Promise((resolve, reject) => {
                Auction.find({ 'name': { "$regex": `${value}` } }, (err, auctions) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(auctions);
                })
            });
        },
        getAuctionsPage: function(page) {
            return new Promise((resolve, reject) => {
                Auction.paginate({}, { page: page, limit: 10 }, function(err, result) {
                    // result.docs
                    // result.total
                    // result.limit - 10
                    // result.page - 3
                    // result.pages

                    if (err) {
                        return reject(err);
                    }

                    return resolve(result.docs);
                })
            });
        },
        getAuctionById: function(id) {
            return new Promise((resolve, reject) => {
                Auction.findOne({ _id: id }, (err, auction) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(auction);
                });
            });
        },
        createAuction: function(name, item, creator, dateCreated, endDate, minPrice) {
            let comments = [];
            let auction = new Auction({ name, item, creator, dateCreated, endDate, comments, minPrice });

            return new Promise((resolve, reject) => {
                auction.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(auction);
                })
            });
        },
        addBidderToAuction: function(auctionId, username, amount) {
            return new Promise((resolve, reject) => {
                Auction.findOneAndUpdate({
                    _id: auctionId
                }, {
                    $push: {
                        bidders: {
                            username: username,
                            amount: amount
                        }
                    }
                }, (err, auction) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(auction);
                });
            });
        },
        updateBidderOffer: function(auctionId, bidderUsername, newOffer) {
            return new Promise((resolve, reject) => {
                Auction.findOneAndUpdate({
                    _id: auctionId,
                    'bidders.username': bidderUsername
                }, {
                    $set: {
                        'bidders.$.amount': newOffer
                    }
                }, (err, auction) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(auction);
                });
            });
        },
        removeAuctionById: function(id) {
            return new Promise((resolve, reject) => {
                Auction.find({ _id: id }).remove().exec();
                resolve();
            })
        },
        addCommentToAuction: function(id, text, user) {
            return new Promise((resolve, reject) => {
                Auction.findOneAndUpdate({
                    _id: id
                }, {
                    $push: {
                        comments: {
                            comment: text,
                            user: user
                        }
                    }
                }, (err, auction) => {
                    if (err) {
                        reject(err);
                    }

                    return resolve(auction);
                });
            })
        }
    }
};