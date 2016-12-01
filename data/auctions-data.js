/*globals module Promise*/
'use strict';

module.exports = function (models) {
    let Auction = models.Auction;

    return {
        getAllAuctions: function () {
            return new Promise((resolve, reject) => {
                Auction.paginate({},{page: 1, limit:10},(err, auctions) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(auctions.docs);
                })
            });
        },
        searchAllAuctions: function (value) {
            return new Promise((resolve, reject) => {
                Auction.find({'name': {"$regex": `${value}`}}, (err, auctions) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(auctions);
                })
            });
        },
        getAuctionsPage: function (page) {
            return new Promise((resolve, reject) => {
                    Auction.paginate({}, {page: page, limit: 10}, function (err, result) {
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
                }
            );
        },
        getAuctionById: function (id) {
            return new Promise((resolve, reject) => {
                Auction.findOne({_id: id}, (err, auction) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(auction);
                });
            });
        },
        createAuction: function (name, item, creator) {
            let auction = new Auction({name, item, creator});
            return new Promise((resolve, reject) => {
                auction.save(err => {
                    if (err) {
                        reject(err);
                    }

                    return resolve(auction);
                })
            });
        }
    }
};