/*globals module require*/
'use strict';

module.exports = function (data) {
    return {
        getAll(req, res){
            data.getAllAuctions()
                .then(auctions => {
                    res.render('auctions-list', {
                        result: auctions
                    })
                })
        },
        getById(req, res){
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