/*globals module Promise*/
'use strict';

module.exports = function (models) {
    let Auction = models.Auction;

    return {
        getAllAuctions : function(){
            return new Promise((resolve, reject) => {
                Auction.find((err, auctions) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(auctions);
                })
            });
        },
        getAuctionById : function(id){
            return new Promise((resolve, reject) => {
                Auction.findOne({_id: id}, (err, auction) => {
                    if (err) {
                        reject(err);
                    }

                    return resolve(auction);
                })
            });
        },
        createAuction: function(name, item, bidders){
            let auction = new Auction({name, item, bidders});
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