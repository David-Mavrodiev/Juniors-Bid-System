/* globals require describe it beforeEach */
'use strict';

const chai = require('chai');
const sinonModule = require('sinon');
let expect = chai.expect;

describe('Auction data tests', () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class Auction {
        constructor(props) {
            this.name = props.name;
            this.item = props.item;
            this.creator = props.creator;
            this.dateCreated = props.dateCreated;
            this.endDate = props.endDate;
            this.minPrice = props.minPrice;
        }

        get name() {
            return this._name;
        }

        set name(user) {
            this._name = user;
        }

        get item() {
            return this._item;
        }

        set item(user) {
            this._item = user;
        }

        get creator() {
            return this._creator;
        }

        set creator(msgs) {
            this._creator = msgs;
        }

        get dateCreated() {
            return this._dateCreated;
        }

        set dateCreated(msgs) {
            this._dateCreated = msgs;
        }

        get endDate() {
            return this._endDate;
        }

        set endDate(msgs) {
            this._endDate = msgs;
        }

        get minPrice() {
            return this._minPrice;
        }

        set minPrice(msgs) {
            this._minPrice = msgs;
        }

        static findOne(data) {}

        save() {}

        markModified() {}

        sort() {}

        limit() {}

        exec() {}

        static find() {}

        static paginate() {}

        static findOneAndUpdate() {}
    }

    let data = require('../data/auctions-data')({ Auction: Auction });

    let auctions = [
        new Auction({
            name: 'Bike',
            item: 'Bike',
            creator: 'Ivan',
            dateCreated: 23,
            endDate: 43,
            minPrice: 10
        }),
        new Auction({
            name: 'Car',
            item: 'Car',
            creator: 'Dragan',
            dateCreated: 213,
            endDate: 4443,
            minPrice: 1320
        })
    ];

    describe('createAuction tests', () => {
        beforeEach(() => {
            sinon.stub(Auction.prototype, 'save', (callback) => {
                callback();
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to save auction', (done) => {

            data.createAuction(auctions[0].name, auctions[0].item, auctions[0].creator, auctions[0].dateCreated, auctions[0].endDate, auctions[0].minPrice)
                .then((auction) => {
                    expect(auction).to.eql(auctions[0]);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('getAllAuctions tests', () => {
        beforeEach(() => {
            sinon.stub(Auction, 'paginate', (param1, param2, callback) => {
                callback(null, {
                    docs: auctions
                });
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to save auction', (done) => {
            data.getAllAuctions()
                .then((allAuctions) => {
                    expect(allAuctions).to.eql(auctions);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('getNewestAuctions tests', () => {
        beforeEach(() => {
            sinon.stub(Auction, 'find', (obj) => {
                return auctions[0];
            });

            sinon.stub(Auction.prototype, 'sort', (obj) => {
                return auctions[0];
            });

            sinon.stub(Auction.prototype, 'limit', (obj) => {
                return auctions[0];
            });

            sinon.stub(Auction.prototype, 'exec', (callback) => {
                callback(null, auctions);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to save auction', (done) => {
            data.getNewestAuctions(5)
                .then((allAuctions) => {
                    expect(allAuctions).to.eql(auctions);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('searchAllAuctions tests', () => {
        beforeEach(() => {
            sinon.stub(Auction, 'find', (param1, callback) => {
                callback(null, auctions);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to searchAllAuctions correctly', (done) => {
            data.searchAllAuctions(5)
                .then((allAuctions) => {
                    expect(allAuctions).to.eql(auctions);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('getAuctionsPage tests', () => {
        beforeEach(() => {
            sinon.stub(Auction, 'paginate', (param1, param2, callback) => {
                callback(null, {
                    docs: auctions
                });
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to getAuctionsPage auctions', (done) => {
            data.getAuctionsPage(1)
                .then((allAuctions) => {
                    expect(allAuctions).to.eql(auctions);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('getAuctionById tests', () => {
        beforeEach(() => {
            sinon.stub(Auction, 'findOne', (param1, callback) => {
                callback(null, auctions[0]);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to getAuctionById auctions', (done) => {
            data.getAuctionById(1)
                .then((auction) => {
                    expect(auction).to.eql(auctions[0]);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('addBidderToAuction tests', () => {
        beforeEach(() => {
            sinon.stub(Auction, 'findOneAndUpdate', (param1, param2, callback) => {
                callback(null, auctions[0]);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to addBidderToAuction auctions', (done) => {
            data.addBidderToAuction(1, 'Ivan', 200)
                .then((auction) => {
                    expect(auction).to.eql(auctions[0]);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('updateBidderOffer tests', () => {
        beforeEach(() => {
            sinon.stub(Auction, 'findOneAndUpdate', (param1, param2, callback) => {
                callback(null, auctions[0]);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to updateBidderOffer auctions', (done) => {
            data.updateBidderOffer(1, 'Ivan', 200)
                .then((auction) => {
                    expect(auction).to.eql(auctions[0]);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('addCommentToAuction tests', () => {
        beforeEach(() => {
            sinon.stub(Auction, 'findOneAndUpdate', (param1, param2, callback) => {
                callback(null, auctions[0]);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to updateBidderOffer auctions', (done) => {
            data.updateBidderOffer(1, 'Hi', 'Ivan')
                .then((auction) => {
                    expect(auction).to.eql(auctions[0]);
                    done();
                })
                .catch((err) => {});
        });
    });
});